const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema({
    userId: {                    //  patientId？
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true,
    },
    userNhi: {               // for old API
    type: String,
        index: true,
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
    },
}, { timestamps: true });

mongoose.model("Treatment", treatmentSchema);