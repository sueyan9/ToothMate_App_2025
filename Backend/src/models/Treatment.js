const mongoose = require("mongoose");

const treatmentSchema = mongoose.Schema({
    toothId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tooth",
        required: true,
    },
    userNhi: {
        type: String,       //  User NHI
        required: true,
    },
    dentalPlan: { type: mongoose.Schema.Types.ObjectId, ref: "DentalPlan", required: true },
    stepName: { type: String },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
    },
    doctor: {
        type: String,
        required: true,
    },
    treatmentDate: {
        type: Date,
        required: true,
    },
    treatmentType: {
        type: String,
        required: true,
    },
    treatmentDetails: {
        type: String,
    },
    status: {
        type: String,
        enum: ["planned", "in-progress", "completed"], // can add on
        default: "planned",
    },
});

mongoose.model("Treatment", treatmentSchema);