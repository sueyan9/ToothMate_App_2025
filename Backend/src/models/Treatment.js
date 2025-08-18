const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema({
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
        enum: ["planned", "in-progress", "done"], // can add on
        default: "planned",
    },
});

mongoose.model("Treatment", treatmentSchema);