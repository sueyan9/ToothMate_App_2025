const express = require("express");

const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const { POINT_CONVERSION_HYBRID } = require("constants");

const Appointment = mongoose.model("Appointment");
const Img = mongoose.model("Img");
const Pdf = mongoose.model("Pdf");
const User = mongoose.model("User");

const router = express.Router();
//seting multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//uploader: 1 PDF with several imgs
const upload = multer({ storage: storage });

//=====Routes=====
router.get("/image/:id", (req, res) => {
  const id = req.params.id;
  const imgv = Img.findOne({ _id: id }).then((imgv) =>
    res.send(Buffer.from(imgv.img.data.buffer).toString("base64"))
  );
});
// Get all appointments
router.get("/getAllAppointments", async (req, res) => {
  try {
    const appointments = await Appointment.find()
        .populate("treatments", "treatmentType status treatmentDate doctor")
        .sort({ date: -1 }); // decase showing according date
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});
// Get appointments by user NHI
router.get("/getAppointmentsByUser/:nhi", async (req, res) => {
  try {
    const appointments = await Appointment.find({ nhi: req.params.nhi.toUpperCase() })
        .populate("treatments", "treatmentType status treatmentDate doctor tooth_number")
        .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});
// Get appointment by ID
router.get("/getAppointmentById/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
        .populate("treatments", "treatmentType status treatmentDate doctor tooth_number");

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
});
// add appointment
router.post("/addAppointment", upload.single("file"), async (req, res) => {
  const { date, dentalData, notes,dentalPlan,treatments } = req.body;
  const caseInsensitiveNhi = req.body.nhi;
  const nhi = caseInsensitiveNhi.toUpperCase();

  var pdfs = new Pdf();
  pdfs.pdf.data = fs.readFileSync(req.body.invoice.path);
  pdfs.pdf.contentType = "application/pdf";

  var images = [];
  const user = await User.findOne({ nhi: nhi });
  if (user === null) {
    return res.status(404).send("NHI does not exist in ToothMate System");
  }

  let imageArray = req.body.images;
  try {
    imageArray.forEach((image) => {
      var img = new Img();
      img.img.data = fs.readFileSync(image.path);
      img.img.contentType = "image/png";
      images.push(img);
    });
  } catch (err) {
    console.log("Image error: " + err);
  }

  try {
    const appointment = new Appointment({
      nhi,
      treatments,
      date,
      dentalData,
      pdfs,
      images,
      notes,
    });
    await appointment.save();
    res.status(201).json({ message: "Appointment created successfully", appointment });
  } catch (err) {
    res.status(422).json({ error: "Failed to create appointment", detail: err.message });
  }
});

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


// Update appointment
router.put("/updateAppointment/:id", async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ error: "Failed to update appointment", detail: err.message });
  }
});
// Delete appointment
router.delete("/deleteAppointment/:id", async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!deletedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete appointment", detail: err.message });
  }
});
// Get appointments by date range
router.get("/getAppointmentsByDateRange", async (req, res) => {
  try {
    const { startDate, endDate, nhi } = req.query;

    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (nhi) {
      query.nhi = nhi.toUpperCase();
    }

    const appointments = await Appointment.find(query)
        .populate("treatments", "treatmentType status treatmentDate doctor")
        .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments", detail: err.message });
  }
});
// Get upcoming appointments
router.get("/getUpcomingAppointments/:nhi", async (req, res) => {
  try {
    const nhi = req.params.nhi.toUpperCase();
    const today = new Date();

    const appointments = await Appointment.find({
      nhi,
      date: { $gte: today }
    })
        .populate("treatments", "treatmentType status treatmentDate doctor")
        .sort({ date: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch upcoming appointments" });
  }
});

module.exports = router;
