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
        const treatments = await Treatment.find()
            .populate("toothId", "name code tooth_number")  // 改为 toothId
            .populate("appointmentId", "date doctor");
        res.json(treatments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get treatments by user NHI
router.get("/getTreatmentsByUser/:userNhi", async (req, res) => {
    try {
        const treatments = await Treatment.find({ userNhi: req.params.userNhi })
            .populate("toothId", "name code tooth_number")
            .populate("appointmentId", "date doctor");
        res.json(treatments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get treatments by tooth ID
router.get("/getTreatmentsByTooth/:toothId", async (req, res) => {
    try {
        const toothId = req.params.toothId;
        const treatments = await Treatment.find({ toothId })
            .populate("appointmentId", "date doctor");

        if (!treatments.length) {
            return res.status(404).json({ message: "No treatments found for this tooth" });
        }

        res.json(treatments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get treatments by tooth number and user NHI
router.get("/getTreatmentsByToothNumber/:userNhi/:toothNumber", async (req, res) => {
    try {
        const { userNhi, toothNumber } = req.params;
        const treatments = await Treatment.find({
            userNhi,
            tooth_number: parseInt(toothNumber)
        }).populate("appointmentId", "date doctor");

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
        const treatment = await Treatment.findById(req.params.id)
            .populate("toothId", "name code tooth_number")
            .populate("appointmentId", "date doctor");

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

// Get treatments by status
router.get("/getTreatmentsByStatus/:status", async (req, res) => {
    try {
        const { status } = req.params;
        const treatments = await Treatment.find({ status })
            .populate("toothId", "name code tooth_number")
            .populate("appointmentId", "date doctor");

        res.json(treatments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get future planned treatments
router.get("/getFutureTreatments/:userNhi", async (req, res) => {
    try {
        const treatments = await Treatment.find({
            userNhi: req.params.userNhi,
            status: { $in: ["planned", "in-progress"] }
        }).populate("toothId", "name code tooth_number")
            .populate("appointmentId", "date doctor");

        res.json(treatments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;