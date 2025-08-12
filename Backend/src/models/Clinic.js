const mongoose = require("mongoose");

const clinicSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    bookingURL: {
        type: String
    },
    code:
        { type: String,
            required: true,
            unique: true
        }
});

mongoose.model('Clinic', clinicSchema);