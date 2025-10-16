const mongoose = require("mongoose");

const toothSchema = new mongoose.Schema({
    nhi: {
        type: String,   // user NHI
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
},
    toothNumber: {
        type: Number,   // e.g. 33、32
        required: true,
    },
    extracted: {
        type: Boolean,
        default: false,
    },
    partial_erupted: {
        type: Boolean,
        default: false
    },
});


//make  sure the code is unique for every user
toothSchema.index({ userId: 1, toothNumber: 1 }, { unique: true });
toothSchema.index({ nhi: 1, toothNumber: 1 }, { unique: true });
module.exports = mongoose.model("Tooth", toothSchema);
