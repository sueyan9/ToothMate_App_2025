const mongoose = require("mongoose");

const toothSchema = new mongoose.Schema({
    userNhi: {
        type: String,   // user NHI
        required: true,
    },
    name: {
        type: String,   // e.g. "Upper Left First Molar"
        required: true,
    },
    code: {
        type: String,   // e.g. UL4, LL1
        required: true,
    },
    location: {
        type: String,   // e.g. "upper-left", "lower-right"
        required: true,
    },
    type: {
        type: String,   // e.g. "premolar", "canine", "molar", "incisor"
        required: true,
    },
    extracted: {
        type: Boolean,
        default: false,
    },
    deciduous: {
        type: Boolean,
        default: false,
    },
});

mongoose.model("Tooth", toothSchema);