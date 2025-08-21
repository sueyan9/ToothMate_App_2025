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
//find all appointment
router.get("/Appointment", async(req, res) => {
  try {
    const appointments = await Appointment.find()
        .populate("dentalPlan")
        .populate("treatments");
    res.json(appointments);
  } catch (err) {
    res.status(404).json({ error: "No appointments found" });
  }
});

//find appointmnet of one user
router.get("/Appointment/:nhi", async (req, res) => {
  try {
    const appointments = await Appointment.find({ nhi: req.params.nhi })
        .populate("dentalPlan")
        .populate("treatments");
    res.json(appointments);
  } catch (err) {
    res.status(404).json({ error: "No appointments found" });
  }
});
//add appointment
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
      dentalPlan,
      treatments,
      date,
      dentalData,
      pdfs,
      images,
      notes,
    });
    await appointment.save();
    res.send("Appointment Made");
  } catch (err) {
    return res.status(422).send({ err });
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


module.exports = router;
