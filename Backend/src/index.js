require('dotenv').config();
require("./models/User");
require("./models/Education");
require("./models/Clinic");
require("./models/Appointment");
require("./models/ImgModel");
require("./models/PdfModel");
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const educationRoutes = require("./routes/educationRoutes");
const clinicRoutes = require("./routes/clinicRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const requireAuth = require("./middlewares/requireAuth");
// --- App & middlewares ---
const app = express();


// no case_sensitive
app.set('case sensitive routing', false);
// mid-parts
// body analyse（JSON & urlencoded）
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// logging
app.use((req, res, next) => {
    console.log('[IN]', req.method, req.originalUrl);
    next();
});

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
//list routers
function listRoutes(app){
    const routes = [];
    app._router.stack.forEach(m=>{
        if (m.route) {
            const methods = Object.keys(m.route?.methods || {}).join(',');
            routes.push(`${methods.toUpperCase()} ${m.route?.path}`);
        } else if (m.name === 'router' && m.handle?.stack) {
            m.handle.stack.forEach(s=>{
                const route = s.route;
                if (route) {
                    const methods = Object.keys(route.methods || {}).join(',');
                    routes.push(`${methods.toUpperCase()} ${route.path}`);
                }
            });
        }
    });
    console.log('[ROUTES]', routes);
}
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
    // useNewUrlParser: true,//no longer supported by Mongoose6/7
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    // use the new writeConcern form
    writeConcern: {
        w: 'majority',
        wtimeoutMS: 5000
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