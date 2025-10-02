const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema({
    nhi: {
        type: String,
        index: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    toothNumber: {
        type: Number,
        required: true,
    },
    treatmentType: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    notes: {
        type: String,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model("Treatment", treatmentSchema);