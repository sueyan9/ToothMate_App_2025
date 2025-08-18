const mongoose = require("mongoose");

const dentalPlanSchema = new mongoose.Schema({
    userNhi: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    title: { type: String }, // e.g., "Initial Treatment Plan"
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
});

module.exports = mongoose.model("DentalPlan", dentalPlanSchema);
