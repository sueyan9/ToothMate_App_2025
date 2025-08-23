const express = require("express");
const mongoose = require("mongoose");

const Tooth = mongoose.model("Tooth");
const Treatment = mongoose.model("Treatment");
const Appointment = mongoose.model("Appointment");

const router = express.Router();

/**
 * Get all teeth of one user
 * GET /api/tooth/getAllTeeth/:userNhi
 */
router.get("/getAllTeeth/:userNhi", async (req, res) => {
    try {
        const teeth = await Tooth.find({ userNhi: req.params.userNhi });
        res.json(teeth);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch teeth" , detail: err.message });
    }
});

/**
 * Get tooth details with treatments by tooth ID
 * GET /api/tooth/getToothDetails/:userNhi/:toothId
 */
router.get("/getToothDetails/:userNhi/:toothId", async (req, res) => {
    try {
        const tooth = await Tooth.findOne({
            _id: req.params.toothId,
            userNhi: req.params.userNhi,
        });

        if (!tooth) {
            return res.status(404).json({ error: "Tooth not found" });
        }

        const treatments = await Treatment.find({ toothId: tooth._id })
            .populate("appointmentId");

        res.json({ ...tooth.toObject(), treatments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch tooth info" });
    }
});

/**
 * Get tooth details with treatments by tooth number
 * GET /api/tooth/getToothByNumber/:userNhi/:toothNumber
 */
router.get("/getToothByNumber/:userNhi/:toothNumber", async (req, res) => {
    try {
        const tooth = await Tooth.findOne({
            userNhi: req.params.userNhi,
            tooth_number: parseInt(req.params.toothNumber)
        });

        if (!tooth) {
            return res.status(404).json({ error: "Tooth not found" });
        }

        const treatments = await Treatment.find({ toothId: tooth._id })
            .populate("appointmentId");

        res.json({ ...tooth.toObject(), treatments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch tooth info" });
    }
});

/**
 * Create new tooth
 * POST /api/tooth/createTooth
 * body: { userNhi, name, code, location, type, tooth_number }
 */
router.post("/createTooth", async (req, res) => {
    try {
        const tooth = new Tooth(req.body);
        await tooth.save();
        res.status(201).json(tooth);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Failed to create tooth" });
    }
});

/**
 * Update tooth by ID
 * PUT /api/tooth/updateTooth/:id
 */
router.put("/updateTooth/:id", async (req, res) => {
    try {
        const tooth = await Tooth.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!tooth) return res.status(404).json({ error: "Tooth not found" });
        res.json(tooth);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Failed to update tooth" });
    }
});

/**
 * Delete tooth by ID
 * DELETE /api/tooth/deleteTooth/:id
 */
router.delete("/deleteTooth/:id", async (req, res) => {
    try {
        const tooth = await Tooth.findByIdAndDelete(req.params.id);
        if (!tooth) return res.status(404).json({ error: "Tooth not found" });
        res.json({ message: "Tooth deleted" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Failed to delete tooth" });
    }
});

module.exports = router;