const express = require("express");
const mongoose = require("mongoose");

const Tooth = mongoose.model("Tooth");
const Treatment = mongoose.model("Treatment");
const Appointment = mongoose.model("Appointment");

const router = express.Router();

/**
 * find all teeth of one user
 * GET /api/tooth/:userNhi
 */
router.get("/:userNhi", async (req, res) => {
    try {
        const teeth = await Tooth.find({ userNhi: req.params.userNhi });
        res.json(teeth);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch teeth" , detail: err.message });
    }
});

/**
 * reading treatments of one tooth
 * GET /api/tooth/:userNhi/:toothId
 */
router.get("/:userNhi/:toothId", async (req, res) => {
    try {
        const tooth = await Tooth.findOne({
            _id: req.params.toothId,
            userNhi: req.params.userNhi,
        });

        if (!tooth) {
            return res.status(404).json({ error: "Tooth not found" });
        }

        // search treatments related this tooth
        const treatments = await Treatment.find({ toothId: tooth._id })
            .populate("appointmentId")
            .populate("dentalPlan");

        res.json({ ...tooth.toObject(), treatments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch tooth info" });
    }
});

/**
 * create teeth
 * POST /api/tooth
 * body: { userNhi, name, code, location, type }
 */
router.post("/", async (req, res) => {
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
 * update teeth
 * PUT /api/tooth/:id
 */
router.put("/:id", async (req, res) => {
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
 * delete teeth
 * DELETE /api/tooth/:id
 */
router.delete("/:id", async (req, res) => {
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
