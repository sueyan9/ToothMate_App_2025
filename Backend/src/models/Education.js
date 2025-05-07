const mongoose = require("mongoose")

const educationSchema = mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    age_range: {
        type: Number,  //an integer between 1 and 3. 1 === 0-10 ; 2 === 11-17 ; 3 === 18 and above
        required: true
    }
});

mongoose.model('Education', educationSchema);