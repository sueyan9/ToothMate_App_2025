require('dotenv').config();
require("./models/User");
require("./models/Education");
require("./models/Clinic");
require("./models/Appointment");
require("./models/ImgModel");
require("./models/PdfModel");
require("./models/Tooth");
require("./models/Treatment");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const educationRoutes = require("./routes/educationRoutes");
const clinicRoutes = require("./routes/clinicRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const toothRoutes = require("./routes/toothRoutes");
const treatmentRoutes = require("./routes/treatmentRoutes");
const requireAuth = require("./middlewares/requireAuth");

const app = express();
// no case_sensitive
app.set('case sensitive routing', false);
// mid-parts
app.use(express.json());

// CORS deploy
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// routes
app.use(authRoutes);
app.use(educationRoutes);
app.use(clinicRoutes);
app.use(appointmentRoutes);
app.use(toothRoutes);
app.use(treatmentRoutes);
listRoutes(app);
// check link health
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    // use the new writeConcern form
    writeConcern: {
        w: 'majority',
        wtimeout: 5000
    },
    // setting pool connect
    maxPoolSize: 10,
    minPoolSize: 1
})
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// monitor connection condition
mongoose.connection.on("connected", () => {
    console.log("Connected to mongo instance");
});

mongoose.connection.on("error", (err) => {
    console.error("Error connecting to mongo", err);
});

// root router
app.get("/", requireAuth, (req, res) => {
    res.send(`Your email: ${req.user.email}`);
});

// start server -  suit Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;