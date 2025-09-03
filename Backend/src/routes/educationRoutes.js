const express = require("express");
const mongoose = require("mongoose");
const Education = mongoose.model("Education");

const router = express.Router();


// Get all education content with optional filters
router.get("/education", async (req, res) => {
    try {
        const { category, recommended, favourite, search } = req.query;
        let filter = {};

        if (category) filter.category = category;
        if (recommended === 'true') filter.recommended = { $ne: null };
        if (favourite === 'true') filter.favourite = true;
        if (search) {
            filter.topic = { $regex: search, $options: 'i' };
        }

        const education = await Education.find(filter);
        res.json(education);
    } catch (err) {
        res.status(404).json({ error: 'No topics found' });
    }
});

// Add new education content
router.post("/education", async (req, res) => {
    try {
        const educationData = req.body;
        const education = new Education(educationData);
        const savedEducation = await education.save();
        res.json(savedEducation);
    } catch (err) {
        return res.status(422).json({ error: "Could not create education content" });
    }
});

// Generic update route - MUST come AFTER specific routes
router.put("/education/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        console.log("=== GENERIC UPDATE ROUTE HIT ===");
        console.log("ID:", id, "Updates:", updates);
        
        const updatedEducation = await Education.findByIdAndUpdate(
            id, 
            updates, 
            { new: true, runValidators: true }
        );
        
        if (!updatedEducation) {
            return res.status(404).json({ error: 'Education content not found' });
        }
        
        res.json(updatedEducation);
    } catch (err) {
        res.status(400).json({ error: 'Could not update education content' });
    }
});

// Delete education content
router.delete("/education/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEducation = await Education.findByIdAndDelete(id);
        
        if (!deletedEducation) {
            return res.status(404).json({ error: 'Education content not found' });
        }
        
        res.json({ message: 'Education content deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Could not delete education content' });
    }
});

module.exports = router;