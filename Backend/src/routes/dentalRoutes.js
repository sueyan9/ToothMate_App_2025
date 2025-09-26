const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Treatment = mongoose.model("Treatment");

const router = express.Router();

// Get user by ID
router.get("/user/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Error fetching user' });
    }
});

// Get NHI by user ID
router.get("/getNhi/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('nhi').lean();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ nhi: user.nhi });
    } catch (err) {
        console.error('Error fetching NHI:', err);
        res.status(500).json({ error: 'Error fetching NHI' });
    }
});

// Get all treatments by NHI
router.get("/treatments/:nhi", async (req, res) => {
    try {
        const { nhi } = req.params;
        const treatments = await Treatment.find({ patientId: nhi })
            .sort({ date: -1 })
            .lean();
        
        res.json(treatments);
    } catch (err) {
        console.error('Error fetching treatments:', err);
        res.status(500).json({ error: 'Error fetching treatments' });
    }
});

// Get treatments for specific tooth
router.get("/treatments/:nhi/tooth/:toothNumber", async (req, res) => {
    try {
        const { nhi, toothNumber } = req.params;
        const treatments = await Treatment.find({ 
            patientId: nhi, 
            toothNumber: parseInt(toothNumber) 
        })
        .sort({ date: -1 })
        .lean();
        
        res.json(treatments);
    } catch (err) {
        console.error('Error fetching tooth treatments:', err);
        res.status(500).json({ error: 'Error fetching tooth treatments' });
    }
});

// Get formatted tooth data (matches your component structure)
router.get("/getToothData/:nhi", async (req, res) => {
    try {
        const { nhi } = req.params;
        const treatments = await Treatment.find({ patientId: nhi })
            .sort({ date: -1 })
            .lean();
        
        // Initialize teeth data structure
        const teethData = { teeth: {} };
        
        // Initialize all 32 teeth
        for (let i = 1; i <= 32; i++) {
            teethData.teeth[i] = {
                name: getToothName(i),
                treatments: [],
                futuretreatments: []
            };
        }
        
        // Populate with actual treatments
        treatments.forEach(treatment => {
            if (treatment.toothNumber >= 1 && treatment.toothNumber <= 32) {
                const formattedTreatment = {
                    date: new Date(treatment.date).toISOString().split('T')[0],
                    type: treatment.treatmentType,
                    notes: treatment.notes
                };
                
                if (treatment.completed) {
                    teethData.teeth[treatment.toothNumber].treatments.push(formattedTreatment);
                } else {
                    teethData.teeth[treatment.toothNumber].futuretreatments.push(formattedTreatment);
                }
            }
        });
        
        res.json(teethData);
    } catch (err) {
        console.error('Error fetching tooth data:', err);
        res.status(500).json({ error: 'Error fetching tooth data' });
    }
});

// Add new treatment
router.post("/treatment", async (req, res) => {
    try {
        const treatmentData = req.body;
        const treatment = new Treatment(treatmentData);
        const savedTreatment = await treatment.save();
        res.json(savedTreatment);
    } catch (err) {
        console.error('Error creating treatment:', err);
        res.status(422).json({ error: "Could not create treatment" });
    }
});

// Update treatment
router.put("/treatment/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const updatedTreatment = await Treatment.findByIdAndUpdate(
            id, 
            updates, 
            { new: true, runValidators: true }
        );
        
        if (!updatedTreatment) {
            return res.status(404).json({ error: 'Treatment not found' });
        }
        
        res.json(updatedTreatment);
    } catch (err) {
        console.error('Error updating treatment:', err);
        res.status(400).json({ error: 'Could not update treatment' });
    }
});

// Delete treatment
router.delete("/treatment/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTreatment = await Treatment.findByIdAndDelete(id);
        
        if (!deletedTreatment) {
            return res.status(404).json({ error: 'Treatment not found' });
        }
        
        res.json({ message: 'Treatment deleted successfully' });
    } catch (err) {
        console.error('Error deleting treatment:', err);
        res.status(400).json({ error: 'Could not delete treatment' });
    }
});

// Helper function to get tooth names
function getToothName(toothNumber) {
    const toothNames = {
        1: "Upper Right Third Molar", 2: "Upper Right Second Molar", 3: "Upper Right First Molar",
        4: "Upper Right Second Premolar", 5: "Upper Right First Premolar", 6: "Upper Right Canine",
        7: "Upper Right Lateral Incisor", 8: "Upper Right Central Incisor", 9: "Upper Left Central Incisor",
        10: "Upper Left Lateral Incisor", 11: "Upper Left Canine", 12: "Upper Left First Premolar",
        13: "Upper Left Second Premolar", 14: "Upper Left First Molar", 15: "Upper Left Second Molar",
        16: "Upper Left Third Molar", 17: "Lower Left Third Molar", 18: "Lower Left Second Molar",
        19: "Lower Left First Molar", 20: "Lower Left Second Premolar", 21: "Lower Left First Premolar",
        22: "Lower Left Canine", 23: "Lower Left Lateral Incisor", 24: "Lower Left Central Incisor",
        25: "Lower Right Central Incisor", 26: "Lower Right Lateral Incisor", 27: "Lower Right Canine",
        28: "Lower Right First Premolar", 29: "Lower Right Second Premolar", 30: "Lower Right First Molar",
        31: "Lower Right Second Molar", 32: "Lower Right Third Molar"
    };
    return toothNames[toothNumber] || `Tooth ${toothNumber}`;
}

module.exports = router;