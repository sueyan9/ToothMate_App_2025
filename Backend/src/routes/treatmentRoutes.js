const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Treatment = mongoose.model("Treatment");

// Create a new treatment
router.post("/createTreatment", async (req, res) => {
    try {
        const newTreatment = new Treatment(req.body);
        const savedTreatment = await newTreatment.save();
        res.status(201).json(savedTreatment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all treatments
router.get("/getAllTreatments", async (req, res) => {
    try {
        const treatments = await Treatment.find();
        res.json(treatments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get treatments by userNhi (legacy)
router.get("/getTreatmentsByUserNhi/:userNhi", async (req, res) => {
    try {
        const treatments = await Treatment.find({ userNhi: req.params.userNhi });
        res.json(treatments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get treatments by userId (new) — return { historical, future }
router.get("/getTreatmentsByUser/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const treatments = await Treatment.find({ userId });
        const now = new Date();

        const historical = [];
        const future = [];

        treatments.forEach(t => {
            if (t.completed || new Date(t.date) < now) {
                historical.push(t);
            } else {
                future.push(t);
            }
        });

        res.json({ historical, future });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get treatments by tooth number (userId version)
router.get("/getTreatmentsByToothNumber/:userId/:toothNumber", async (req, res) => {
    try {
        const { userId, toothNumber } = req.params;
        const treatments = await Treatment.find({
            userId,
            tooth_number: parseInt(toothNumber),
        });

        if (!treatments.length) {
            return res.status(404).json({ message: "No treatments found for this tooth" });
        }

        res.json(treatments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get treatment by ID
router.get("/getTreatmentById/:id", async (req, res) => {
    try {
        const treatment = await Treatment.findById(req.params.id);

        if (!treatment) {
            return res.status(404).json({ message: "Treatment not found" });
        }

        res.json(treatment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update treatment
router.put("/updateTreatment/:id", async (req, res) => {
    try {
        const updatedTreatment = await Treatment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedTreatment) {
            return res.status(404).json({ message: "Treatment not found" });
        }

        res.json(updatedTreatment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete treatment
router.delete("/deleteTreatment/:id", async (req, res) => {
    try {
        const deletedTreatment = await Treatment.findByIdAndDelete(req.params.id);

        if (!deletedTreatment) {
            return res.status(404).json({ message: "Treatment not found" });
        }

        res.json({ message: "Treatment deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Get all available treatment types for a user
router.get("/getAllTreatmentTypes/:userNhi", async (req, res) => {
    try {
        const { userNhi } = req.params;
        const treatmentTypes = await Treatment.distinct("treatmentType", { userNhi });

        if (!treatmentTypes.length) {
            return res.status(404).json({ message: "No treatment types found for this user" });
        }

        res.json(treatmentTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
