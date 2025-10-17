const express = require("express");

const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const { POINT_CONVERSION_HYBRID } = require("constants");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const tz = require('dayjs/plugin/timezone');
dayjs.extend(utc); dayjs.extend(tz);


const Appointment = mongoose.model("Appointment");
const Img = mongoose.model("Img");
const Pdf = mongoose.model("Pdf");
const User = mongoose.model("User");
const Clinic = mongoose.model('Clinic');
const router = express.Router();
const NZ_TZ = 'Pacific/Auckland';
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads/");
  },
});

const upload = multer({ storage: storage });

router.get("/image/:id", (req, res) => {
  const id = req.params.id;
  const imgv = Img.findOne({ _id: id }).then((imgv) =>
    res.send(Buffer.from(imgv.img.data.buffer).toString("base64"))
  );
});

// GET /appointments (admin/debug)
router.get('/Appointments', async (_req, res) => {
  try {
    const items = await Appointment.find().sort({ startAt: -1 }).limit(200);
    res.json(items);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// get the next appointment by NHI
router.get('/Appointments/next', async (req, res) => {
  try {
    const { nhis } = req.query;
    
    if (!nhis) {
      return res.status(400).json({ error: 'nhis query parameter is required' });
    }
    
    // Split comma-separated NHIs and normalize to uppercase
    const nhiArray = nhis.split(',').map(n => String(n).trim().toUpperCase()).filter(Boolean);
    
    if (nhiArray.length === 0) {
      return res.status(400).json({ error: 'at least one valid NHI is required' });
    }
    
    const filter = { 
      nhi: { $in: nhiArray }, // Match any of the provided NHIs
      startAt: { $gte: new Date() } // Only appointments from now onwards
    };
    
    console.log('[GET next appointment for multiple NHIs] filter =', filter);

    const appointment = await Appointment.findOne(filter)
      .sort({ startAt: 1 }) // Sort by earliest first
      .populate('clinic')
      .lean();
    
    res.json(appointment); // Will be null if no upcoming appointments
  } catch (e) {
    console.error('GET /Appointments/next failed:', e);
    res.status(500).json({ error: e.message });
  }
});

// GET /Appointment/:nhi  query by NHI
router.get('/Appointments/:nhi', async (req, res) => {
  try {
    const { nhi } = req.params;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = parseInt(req.query.skip, 10) || 0;
    const filter = { nhi: String(nhi || '').toUpperCase() };
    console.log('[GET by NHI] filter =', filter, 'skip=', skip, 'limit=', limit);

    const [items, total] = await Promise.all([
      Appointment.find(filter).sort({ startAt: 1, date: 1 }).skip(skip).limit(limit).lean(),
      Appointment.countDocuments(filter),
    ]);
    res.json({ items, total, skip, limit });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// router.post("/addAppointment", upload.single("file"), async (req, res) => {
//   const { date, dentalData, notes } = req.body;
//   const caseInsensitiveNhi = req.body.nhi;
//   const nhi = caseInsensitiveNhi.toUpperCase();
//
//   var pdfs = new Pdf();
//   pdfs.pdf.data = fs.readFileSync(req.body.invoice.path);
//   pdfs.pdf.contentType = "application/pdf";
//
//   var images = [];
//   const user = await User.findOne({ nhi: nhi });
//   if (user === null) {
//     return res.status(404).send("NHI does not exist in ToothMate System");
//   }
//
//   let imageArray = req.body.images;
//   try {
//     imageArray.forEach((image) => {
//       var img = new Img();
//       img.img.data = fs.readFileSync(image.path);
//       img.img.contentType = "image/png";
//       images.push(img);
//     });
//   } catch (err) {
//     console.log("Image error: " + err);
//   }
//
//   try {
//     const appointment = new Appointment({
//       nhi,
//       date,
//       dentalData,
//       pdfs,
//       images,
//       notes,
//     });
//     await appointment.save();
//     res.send("Appointment Made");
//   } catch (err) {
//     return res.status(422).send({ err });
//   }
// });
// POST /appointments  create an appointment（do not handleimg/invoice））
/*
body: {
  nhi, userId,
  dentist: { name },
  clinic: { name, location, phone },
  purpose, notes, status,
  startLocal: 'YYYY-MM-DD HH:mm', endLocal: 'YYYY-MM-DD HH:mm' //
}
*/

router.patch('/Appointments/:id/confirm', async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmed } = req.body;

    // Validate appointment ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'invalid appointment id' });
    }

    // Validate confirmed is a boolean
    if (typeof confirmed !== 'boolean') {
      return res.status(400).json({ error: 'confirmed must be a boolean' });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { confirmed },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: 'appointment not found' });
    }

    console.log(`[PATCH /Appointments/:id/confirm] Updated appointment ${id} confirmation to ${confirmed}`);
    res.json(updatedAppointment);
  } catch (e) {
    console.error('PATCH /Appointments/:id/confirm failed:', e);
    res.status(422).json({ error: e.message });
  }
});

router.post('/Appointments', async (req, res) => {
  try {
    console.log('[POST /Appointments] body =', req.body);
    const {
      nhi,
      userId,
      dentist = {},
      clinic:clinicId,
      purpose,
      notes,
      status = 'scheduled',
      startLocal,
      endLocal,
      timezone = NZ_TZ,
      treatments = [],
    } = req.body;
    if (!nhi) return res.status(400).json({ error: 'nhi required' });
    if (!purpose) return res.status(400).json({ error: 'purpose required' });
    if (!startLocal || !endLocal) return res.status(400).json({ error: 'startLocal/endLocal required' });
    if (!clinicId) return res.status(400).json({ error: 'clinic id required' });
    //testing clinic id & change to ObjectId
    if (!mongoose.Types.ObjectId.isValid(clinicId)) {
      return res.status(400).json({ error: 'invalid clinic id' });
    }
    const clinicDoc = await Clinic.findById(clinicId).lean();
    if (!clinicDoc) {
      return res.status(400).json({ error: 'clinic not found' });
    }

    const startAt = dayjs(startLocal).tz(timezone).toDate();
    const endAt = dayjs(endLocal).tz(timezone).toDate();
    if (!(startAt < endAt)) return res.status(400).json({ error: 'endAt must be after startAt' });

    const doc = await Appointment.create({
      nhi: nhi.toUpperCase(),
      userId,
      // dentist: { name: dentist.name },
      // clinic: { name: clinic.name, location: clinic.location, phone: clinic.phone },
      dentist: dentist?.name ? { name: dentist.name } : undefined,
      clinic: clinicId,
      purpose,
      notes,
      status,
      treatments,
      startAt,
      endAt,
      timezone,
    });
    console.log('[POST /Appointments] created _id =', doc._id.toString());
    res.status(201).json(doc);
  } catch (e) {
    res.status(422).json({ error: e.message });
  }
});
//get xray/images
router.get("/getAllImages/:nhi", (req, res) => {
  const nhi = req.params.nhi;
  const images = [];
  Appointment.find({ nhi: nhi })
    .then((appointments) => {
      appointments.forEach((appointment) => {
        appointment.images.forEach((image) => {
          images.push(image);
        });
      });
      res.json(images);
    })
    .catch(() => res.status(404).json({ error: "No images found" }));
});

// GET /appointments/:nhi?when=past|upcoming&limit=20&skip=0
router.get('/Appointments/:nhi', async (req, res) => {
  try {
    const { nhi } = req.params;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = parseInt(req.query.skip, 10) || 0;

    const filter = { nhi: (nhi || '').toUpperCase() };

    const [items, total] = await Promise.all([
      Appointment.find(filter)
          .sort({ startAt: 1, date: 1 }) // showing as asending
          .skip(skip)
          .limit(limit)
          .lean(),
      Appointment.countDocuments(filter),
    ]);

    res.json({ items, total, skip, limit });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
