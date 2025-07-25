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

// check whether the invite code is valide
router.get("/checkClinicCode/:code", async (req, res) => {
  const clinicCode = req.params.code?.trim();

  try {
    const clinic = await Clinic.findOne({ code: clinicCode });

    if (!clinic) {
      return res.status(404).json({
        valid: false,
        message: "Invalid clinic code",
      });
    }

    return res.status(200).json({
      valid: true,
      id: clinic._id,
      name: clinic.name,
      phone: clinic.phone,
      email: clinic.email,
    });
  } catch (err) {
    console.error("Error checking clinic code:", err);
    return res.status(500).json({
      valid: false,
      message: "Server error",
    });
  }
});


module.exports = router;
