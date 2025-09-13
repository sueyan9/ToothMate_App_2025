// routes/appointmentAssets.js
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const Appointment = mongoose.model('Appointment'); // 你已通过 mongoose.model 注册过
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

const router = express.Router();

// 上传一张图片到 Appointment.images
// form-data: file=<binary>
router.post('/appointments/:id/images', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file' });
        const appt = await Appointment.findById(req.params.id);
        if (!appt) return res.status(404).json({ error: 'Appointment not found' });

        appt.images.push({
            img: { data: req.file.buffer, contentType: req.file.mimetype || 'image/jpeg' },
        });

        await appt.save();
        res.json({ ok: true, count: appt.images.length });
    } catch (e) { next(e); }
});

// 上传一个 PDF 到 Appointment.pdfs
// form-data: file=<binary>
router.post('/appointments/:id/pdfs', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file' });
        if (!/pdf$/i.test(req.file.mimetype)) return res.status(415).json({ error: 'Not a PDF' });

        const appt = await Appointment.findById(req.params.id);
        if (!appt) return res.status(404).json({ error: 'Appointment not found' });

        appt.pdfs.push({
            pdf: { data: req.file.buffer, contentType: req.file.mimetype },
        });

        await appt.save();
        res.json({ ok: true, count: appt.pdfs.length });
    } catch (e) { next(e); }
});

module.exports = router;
