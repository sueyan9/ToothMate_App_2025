const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Tooth = mongoose.model("Tooth");
const User = mongoose.model("User");

// 获取用户的所有牙齿
router.get("/getAllTeeth/:userNhi", async (req, res) => {
    try {
        const user = await User.findOne({ nhi: req.params.userNhi });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const teeth = await Tooth.find({ userId: user._id });
        res.json(teeth);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch teeth", detail: err.message });
    }
});

// 创建牙齿记录
router.post("/createTooth", async (req, res) => {
    try {
        const { userNhi, toothNumber, extracted } = req.body;

        const user = await User.findOne({ nhi: userNhi });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const tooth = new Tooth({
            nhi: userNhi,
            userId: user._id,
            toothNumber,
            extracted: extracted || false
        });

        await tooth.save();
        res.status(201).json(tooth);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Failed to create tooth", detail: err.message });
    }
});

module.exports = router;