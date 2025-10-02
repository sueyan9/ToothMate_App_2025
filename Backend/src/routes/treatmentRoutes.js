const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Treatment = mongoose.model("Treatment");
const User = mongoose.model("User");

// GET /api/treatments/getTreatmentsByUser?nhi=CBD1234
// 或 /api/treatments/getTreatmentsByUser?userId=682518450700231916c14fea
router.get('/getTreatmentsByUser', async (req, res) => {
    try {
        const { nhi, userId } = req.query;
        let uid = null;

        if (userId && mongoose.isValidObjectId(userId)) {
            uid = userId;
        } else if (nhi) {
            const cleanNhi = String(nhi).trim().replace(/['"]/g, '');
            const user = await User.findOne({ nhi: cleanNhi }, { _id: 1 });
            if (!user) return res.status(404).json({ message: 'User not found by NHI', nhi: cleanNhi });
            uid = user._id;
        } else {
            return res.status(400).json({ message: 'Provide userId or nhi' });
        }

        const treatments = await Treatment.find({ userId: uid });
        const now = new Date();
        const historical = treatments.filter(t => t.completed || new Date(t.date) < now);
        const future = treatments.filter(t => !t.completed && new Date(t.date) >= now);
        return res.json({ historical, future });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e.message });
    }
});
// 获取用户的治疗记录
router.get("/getTreatmentsByUserNhi", async (req, res) => {
    try {
        const { nhi } = req.query;
        console.log('Raw query parameter nhi:', JSON.stringify(nhi));
        console.log('nhi type:', typeof nhi);
        console.log('nhi length:', nhi ? nhi.length : 'null');
        const cleanNhi = nhi.toString().trim().replace(/['"]/g, '');
        console.log('Cleaned nhi:', JSON.stringify(cleanNhi));


        if (!nhi) {
            return res.status(400).json({ message: "nhi parameter is required" });
        }

        // 先查看所有用户
        const allUsers = await User.find({}, { nhi: 1, email: 1, firstname: 1 });
        console.log('All users in database:', allUsers.length);

        const user = await User.findOne({ nhi: cleanNhi });
        console.log('Found user:', user);


        if (!user) {
            return res.status(404).json({
                message: "User not found",
                searchedNhi: nhi,
                availableUsers: allUsers.map(u => ({
                    nhi: u.nhi,
                    email: u.email,
                    firstname: u.firstname
                }))
            });
        }

        const treatments = await Treatment.find({ nhi: cleanNhi });

        // 按时间分类
        const now = new Date();
        const historical = treatments.filter(t => {
            const treatmentDate = new Date(t.date);
            return t.completed || treatmentDate < now;
        });
        const future = treatments.filter(t => {
            const treatmentDate = new Date(t.date);
            return !t.completed && treatmentDate >= now;
        });
        res.json({ historical, future });
    } catch (error) {
        console.error('Error in getTreatmentsByUserNhi:', error);
        res.status(500).json({ message: error.message });
    }
});
// 创建治疗记录
router.post("/createTreatment", async (req, res) => {
    try {
        const { userNhi, toothNumber, treatmentType, date, notes, completed } = req.body;

        const user = await User.findOne({ nhi: userNhi });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newTreatment = new Treatment({
            nhi: userNhi,
            userId: user._id,
            toothNumber,
            treatmentType,
            date,
            notes,
            completed: completed || false
        });

        const savedTreatment = await newTreatment.save();
        res.status(201).json(savedTreatment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;