const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Tooth = mongoose.model("Tooth");
const User = mongoose.model("User");

// get all the teeth for one user
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

// create tooth record
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
// get the PartialErupted info of one tooth
router.get("/getPartialErupted/:userNhi", async (req, res) => {
    try {
        const user = await User.findOne({ nhi: req.params.userNhi });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const partialTeeth = await Tooth.find({
            userId: user._id,
            partial_erupted: true
        }).sort({ toothNumber: 1 });

        res.json(partialTeeth);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch partial erupted teeth", detail: err.message });
    }
});
//get the tooth info of user and toothNumber
router.get("/getTooth/:userNhi/:toothNumber", async (req, res) => {
    try {
        const { userNhi, toothNumber } = req.params;

        const user = await User.findOne({ nhi: userNhi });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const tooth = await Tooth.findOne({
            userId: user._id,
            toothNumber: parseInt(toothNumber)
        });

        if (!tooth) {
            return res.status(404).json({ error: "Tooth not found" });
        }

        res.json(tooth);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch tooth", detail: err.message });
    }
});

///get all teeth by user id

router.get("/getAllTeethByUserId/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        console.log('=== NEW API DEBUG ===');
        console.log('Received userId:', userId);
        console.log('userId type:', typeof userId);

        // 先找到用户获取 NHI
        const user = await User.findById(userId);
        console.log('User lookup result:', user ? 'FOUND' : 'NOT FOUND');

        if (!user) {
            console.log('User not found, returning 404');
            return res.status(404).json({ error: "User not found" });
        }

        console.log('User found - _id:', user._id);
        console.log('User found - nhi:', user.nhi);

        // 使用 NHI 查询牙齿数据
        console.log('Querying teeth with nhi:', user.nhi);
        const teeth = await Tooth.find({ nhi: user.nhi }).sort({ toothNumber: 1 });

        console.log('Teeth query result:', teeth.length, 'teeth found');
        if (teeth.length > 0) {
            console.log('First tooth sample:', {
                _id: teeth[0]._id,
                nhi: teeth[0].nhi,
                toothNumber: teeth[0].toothNumber,
                userId: teeth[0].userId
            });
        }

        console.log('=== END DEBUG ===');

        res.json(teeth);
    } catch (err) {
        console.error('Error in getAllTeethByUserId:', err);
        res.status(500).json({ error: "Failed to fetch teeth", detail: err.message });
    }
});
// 添加这个测试 API
router.get("/testTeethByNhi/:nhi", async (req, res) => {
    try {
        const { nhi } = req.params;

        console.log('Testing teeth query with nhi:', nhi);

        const teeth = await Tooth.find({ nhi: nhi }).sort({ toothNumber: 1 });

        console.log('Found teeth:', teeth.length);

        res.json({
            nhi: nhi,
            teethCount: teeth.length,
            teeth: teeth
        });
    } catch (err) {
        console.error('Test error:', err);
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;