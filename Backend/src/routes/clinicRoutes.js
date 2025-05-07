const express = require("express");
const mongoose = require("mongoose");
const Clinic = mongoose.model("Clinic");

const router = express.Router();

router.get("/Clinics", (req, res) => {
  Clinic.find()
    .then((Clinic) => res.json(Clinic))
    .catch((err) => res.status(404).json({ error: "No clinics found" }));
});

router.get("/getDentalClinic/:id", (req, res) => {
  const id = req.params.id;
  const clinic = Clinic.findOne({ _id: id })
    .then((clinic) => res.json({ clinic: clinic }))
    .catch((err) => res.status(404).json({ error: "No clinic found" }));
});

router.get("/Clinics/:term", (req, res) => {
  const search = req.params.term;
  Clinic.find({ $text: { $search: `${search}` } })
    .then((clinic) => res.json(clinic))
    .catch((err) => res.status(404).json({ error: "No clinics found" }));
});

router.get("/nameClinics", (req, res) => {
  Clinic.find({}, { name: 1 })
    .then((clinic) => res.json(clinic))
    .catch((err) => res.status(404).json({ error: "No clinics found" }));
});

router.post("/addClinic", async (req, res) => {
  const { name, suburb, phone, email, bookingURL } = req.body; //req.body contains the user sign up details
  try {
    const clinic = new Clinic({ name, suburb, phone, email, bookingURL }); //creating instance of user
    await clinic.save(); //saves the user - async operation to save user to DB
  } catch (err) {
    return res.status(422).send(err.message); //422 indicates user sent us invalid data
  }
});

module.exports = router;
