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

router.get("/Appointment", (req, res) => {
  Appointment.find()
    .then((appointment) => res.json(appointment))
    .catch((err) => res.status(404).json({ error: "No appointments found" }));
});

router.post("/addAppointment", upload.single("file"), async (req, res) => {
  const { date, dentalData, notes } = req.body;
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

router.get("/Appointment/:nhi", (req, res) => {
  const nhi = req.params.nhi;

  Appointment.find({ nhi: nhi })
    .then((appointment) => res.json(appointment))
    .catch((err) => res.status(404).json({ error: "No appointments found" }));
});

module.exports = router;
