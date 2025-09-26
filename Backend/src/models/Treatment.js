const mongoose = require("mongoose");

const treatmentSchema = mongoose.Schema({
    patientId: {
        type: String,
        required: true
    },
    toothNumber: {
        type: Number,
        required: true
    },
    treatmentType: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    notes: {
        type: String,
    },
    completed: {
        type: Boolean,
        required: true
    }
},
{ timestamps: true }
);

mongoose.model('Treatment', treatmentSchema);