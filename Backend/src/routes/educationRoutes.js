const express = require("express");
const mongoose = require("mongoose");
const Education = mongoose.model("Education");

const router = express.Router();

// Add this middleware to log ALL requests to this router
router.use((req, res, next) => {
    console.log(`[EDUCATION ROUTER] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    console.log('Request params:', req.params);
    console.log('Request path:', req.path);
    next();
});

router.put("/education/test", (req, res) => {
  console.log("TEST PUT ROUTE HIT!");
  res.json({ message: "Education router is working!" });
});

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

// IMPORTANT: Toggle favourite route MUST come BEFORE the generic /:id route

router.put("/updateFavourite/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log("=== FAVOURITE ROUTE HIT ===");
        console.log("ID received:", id);
        console.log("Request URL:", req.originalUrl);
        console.log("Request method:", req.method);
        
        // Check if ID is a valid MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("Invalid ObjectId format");
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        
        console.log("MongoDB ObjectId validation passed");
        
        // Try to find the education item
        console.log("Searching for education item...");
        const education = await Education.findById(id);
        console.log("MongoDB query completed");
        console.log("Found education:", education ? "YES" : "NO");
        
        if (!education) {
            console.log("Education not found. Let's check what exists...");
            
            // Check if any education items exist at all
            const count = await Education.countDocuments();
            console.log("Total education documents in DB:", count);
            
            // Get a few sample documents to compare IDs
            const samples = await Education.find({}).limit(3).select('_id topic');
            console.log("Sample documents:", samples.map(doc => ({ id: doc._id.toString(), topic: doc.topic })));
            
            // Try to find with the exact string ID
            const educationByString = await Education.findOne({ _id: new mongoose.Types.ObjectId(id) });
            console.log("Found by ObjectId constructor:", educationByString ? "YES" : "NO");
            
            return res.status(404).json({ 
                error: 'Education content not found',
                debugInfo: {
                    searchedId: id,
                    totalDocuments: count,
                    sampleIds: samples.map(s => s._id.toString())
                }
            });
        }

        console.log("Current favourite status:", education.favourite);
        console.log("About to toggle favourite...");
        
        education.favourite = !education.favourite;
        const updatedEducation = await education.save();
        
        console.log("Successfully updated favourite to:", updatedEducation.favourite);
        res.json(updatedEducation);
        
    } catch (err) {
        console.error("=== FAVOURITE ROUTE ERROR ===");
        console.error("Error type:", err.constructor.name);
        console.error("Error message:", err.message);
        console.error("Full error:", err);
        
        // Check if it's a mongoose/mongodb connection issue
        if (err.name === 'MongooseError' || err.name === 'MongoError') {
            console.error("Database connection issue detected");
            return res.status(500).json({ error: 'Database connection error: ' + err.message });
        }
        
        res.status(500).json({ 
            error: 'Server error: ' + err.message,
            errorType: err.constructor.name
        });
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