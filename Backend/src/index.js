require('dotenv').config();
require("./models/User");
require("./models/Education");
require("./models/Clinic");
require("./models/Appointment");
require("./models/ImgModel");
require("./models/PdfModel");
const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');

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
function listRoutes(app){
    const routes = [];
    app._router.stack.forEach(m=>{
        if (m.route) {
            const path = m.route?.path;
            const methods = Object.keys(m.route?.methods || {}).join(',');
            routes.push(`${methods.toUpperCase()} ${path}`);
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
// --- upload files ---
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const Appointment = mongoose.model('Appointment');
// ===== 上传到某次预约：图片 =====
// form-data: file=<binary>
app.post('/api/appointments/:id/images',
    // 如需权限控制可加：requireAuth,
    upload.single('file'),
    async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ error: 'No file' });

            const appt = await Appointment.findById(req.params.id);
            if (!appt) return res.status(404).json({ error: 'Appointment not found' });

            appt.images.push({
                img: { data: req.file.buffer, contentType: req.file.mimetype || 'image/jpeg' }
            });

            await appt.save();
            res.json({ ok: true, count: appt.images.length });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'upload image failed' });
        }
    }
);

// ===== 上传到某次预约：PDF =====
// form-data: file=<binary>
app.post('/api/appointments/:id/pdfs',
    // requireAuth,
    upload.single('file'),
    async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ error: 'No file' });
            if (!/pdf$/i.test(req.file.mimetype)) {
                return res.status(415).json({ error: 'Not a PDF' });
            }

            const appt = await Appointment.findById(req.params.id);
            if (!appt) return res.status(404).json({ error: 'Appointment not found' });

            appt.pdfs.push({
                pdf: { data: req.file.buffer, contentType: req.file.mimetype }
            });

            await appt.save();
            res.json({ ok: true, count: appt.pdfs.length });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'upload pdf failed' });
        }
    }
);

// ===== 列出图片（返回 base64，方便 RN 当前实现） =====
app.get('/api/appointments/:id/images', /* requireAuth, */ async (req, res) => {
    try {
        const appt = await Appointment.findById(req.params.id).lean();
        if (!appt) return res.status(404).json({ error: 'Appointment not found' });

        const images = (appt.images || [])
            .map(x => ({
                contentType: x.img?.contentType || 'image/jpeg',
                base64: x.img?.data ? Buffer.from(x.img.data).toString('base64') : null
            }))
            .filter(i => i.base64);

        res.json({ images });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'fetch images failed' });
    }
});

// ===== 直接按 index 输出原图（二进制流） =====
app.get('/api/appointments/:id/images/:idx/raw', /* requireAuth, */ async (req, res) => {
    try {
        const appt = await Appointment.findById(req.params.id);
        if (!appt) return res.status(404).end();

        const idx = Number(req.params.idx);
        const rec = appt.images?.[idx];
        if (!rec) return res.status(404).end();

        res.set('Content-Type', rec.img.contentType || 'image/jpeg');
        res.send(rec.img.data);
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

// =====（可选）列出 PDF 数量 =====
app.get('/api/appointments/:id/pdfs', /* requireAuth, */ async (req, res) => {
    try {
        const appt = await Appointment.findById(req.params.id).lean();
        if (!appt) return res.status(404).json({ error: 'Appointment not found' });

        res.json({ count: (appt.pdfs || []).length });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'fetch pdfs failed' });
    }
});

// ===== 按 index 输出 PDF（二进制流） =====
app.get('/api/appointments/:id/pdfs/:idx/raw', /* requireAuth, */ async (req, res) => {
    try {
        const appt = await Appointment.findById(req.params.id);
        if (!appt) return res.status(404).end();

        const idx = Number(req.params.idx);
        const rec = appt.pdfs?.[idx];
        if (!rec) return res.status(404).end();

        res.set('Content-Type', rec.pdf.contentType || 'application/pdf');
        res.send(rec.pdf.data);
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});
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