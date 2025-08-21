const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Treatment = mongoose.model("Treatment");

// create a new treatment
router.post("/", async (req, res) => {
    try {
        const newTreatment = new Treatment(req.body);
        const savedTreatment = await newTreatment.save();
        res.status(201).json(savedTreatment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// get all treatments
router.get("/", async (req, res) => {
    try {
        const treatments = await Treatment.find()
            .populate("userId", "nhi name")
            .populate("appointmentId", "date doctor")
        res.json(treatments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /all-teeth
router.get('/all-teeth', async (req, res) => {
    try {

        const allTreatments = await Treatment.find({}).sort({ treatmentDate: 1 }); // 按时间升序

        const teethData = {};

        allTreatments.forEach(t => {
            if (!teethData[t.toothId]) {
                teethData[t.toothId] = [];
                teethData[t.toothId].push(t.treatmentType);
            }
        });

        res.json(teethData);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


// find a treatment according ID
router.get("/:id", async (req, res) => {
    try {
        const treatment = await Treatment.findById(req.params.id)
            .populate("userId", "nhi name")
            .populate("appointmentId", "date doctor");
        if (!treatment) return res.status(404).json({ message: "Treatment not found" });
        res.json(treatment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// update treatment
router.put("/:id", async (req, res) => {
    try {
        const updatedTreatment = await Treatment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true,runValidators: true  }
        );
        if (!updatedTreatment) return res.status(404).json({ message: "Treatment not found" });
        res.json(updatedTreatment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// delete treatment
router.delete("/:id", async (req, res) => {
    try {
        const deletedTreatment = await Treatment.findByIdAndDelete(req.params.id);
        if (!deletedTreatment) return res.status(404).json({ message: "Treatment not found" });
        res.json({ message: "Treatment deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// get treatments by toothId
router.get("/tooth/:toothId", async (req, res) => {
    try {
        const toothId = req.params.toothId;
        const treatments = await Treatment.find({ toothId })
            .populate("appointmentId", "date doctor");

        if (!treatments.length) return res.status(404).json({ message: "No treatments found for this tooth" });

        res.json(treatments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
