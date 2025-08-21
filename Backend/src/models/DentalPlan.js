const mongoose = require("mongoose");

const dentalPlanSchema = new mongoose.Schema({
    userNhi: { type: String, required: true },
    planName: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    planType: { type: String }, // e.g. "root-canal", "filling", "cleaning"
    steps: [
        {
            name: { type: String, required: true }, // step name
            description: { type: String },
            status: { type: String, enum: ["planned", "in-progress", "completed"], default: "planned" },
        },
    ],
});
module.exports = mongoose.model("DentalPlan", dentalPlanSchema);
