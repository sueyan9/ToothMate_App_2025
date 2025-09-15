
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

// 读取当前预约的所有资源：把图片转成 dataURL，给 PDF 返回可访问的 URL
router.get('/appointments/:id/assets', async (req, res, next) => {
    try {
        const appt = await Appointment.findById(req.params.id).lean();
        if (!appt) return res.status(404).json({ error: 'Appointment not found' });

        const imagesBase64 = (appt.images || [])
            .map(it => it?.img?.data && `data:${it.img.contentType || 'image/jpeg'};base64,${Buffer.from(it.img.data).toString('base64')}`)
            .filter(Boolean);

        const pdfUrls = (appt.pdfs || [])
            .map((_, idx) => `${req.protocol}://${req.get('host')}/api/appointments/${req.params.id}/pdfs/${idx}`);

        res.json({ imagesBase64, pdfUrls });
    } catch (e) { next(e); }
});
// 列出图片（Base64）
app.get('/api/appointments/:id/images', async (req, res) => {
    try {
        const appt = await Appointment.findById(req.params.id); // 去掉 .lean()
        if (!appt) return res.status(404).json({ error: 'Appointment not found' });

        const images = (appt.images || [])
            .map(x => {
                const bufLike = x?.img?.data ?? x?.data;
                const ct = x?.img?.contentType ?? x?.contentType ?? 'image/jpeg';
                if (!bufLike) return null;

                // 兼容 {type:'Buffer', data:[...]} / Uint8Array / Buffer
                let buf;
                if (Buffer.isBuffer(bufLike)) {
                    buf = bufLike;
                } else if (bufLike?.type === 'Buffer' && Array.isArray(bufLike?.data)) {
                    buf = Buffer.from(bufLike.data);
                } else if (ArrayBuffer.isView(bufLike)) {
                    buf = Buffer.from(bufLike);
                } else if (bufLike?.buffer instanceof ArrayBuffer) {
                    buf = Buffer.from(bufLike.buffer);
                } else {
                    // 尝试兜底
                    try { buf = Buffer.from(bufLike); } catch { return null; }
                }return {
                    contentType: ct,
                    base64: buf.toString('base64'),
                };
            })
            .filter(Boolean);

        res.json({ images });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'fetch images failed' });
    }
});



// 按索引返回单个 PDF（二进制流，供 WebBrowser 打开）
router.get('/appointments/:id/pdfs/:index', async (req, res, next) => {
    try {
        const appt = await Appointment.findById(req.params.id);
        if (!appt) return res.status(404).json({ error: 'Appointment not found' });

        const i = Number(req.params.index);
        if (!Number.isInteger(i) || i < 0 || i >= (appt.pdfs?.length || 0))
            return res.status(404).json({ error: 'PDF not found' });

        const { data, contentType } = appt.pdfs[i].pdf || {};
        if (!data) return res.status(404).json({ error: 'PDF data missing' });

        res.setHeader('Content-Type', contentType || 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="document-${i + 1}.pdf"`);
        res.send(data);
    } catch (e) { next(e); }
});
// （可选）列出 PDF（Base64）
app.get('/api/appointments/:id/pdfs/base64', async (req, res) => {
    try {
        const appt = await Appointment.findById(req.params.id);
        if (!appt) return res.status(404).json({ error: 'Appointment not found' });

        const pdfs = (appt.pdfs || [])
            .map(x => {
                const buf = x?.pdf?.data;
                return (Buffer.isBuffer(buf))
                    ? {
                        contentType: x.pdf.contentType || 'application/pdf',
                        base64: buf.toString('base64')
                    }
                    : null;
            })
            .filter(Boolean);

        res.json({ pdfs });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'fetch pdfs failed' });
    }
});

// 图片原图
router.get('/api/appointments/:id/images/:idx/raw', async (req, res) => {
    try {
        const appt = await Appointment.findById(req.params.id);
        if (!appt) return res.status(404).end();

        const idx = Number(req.params.idx);
        const rec = appt.images?.[idx];
        if (!rec) return res.status(404).end();

        res.set('Content-Type', rec.img.contentType || 'image/jpeg');
        res.set('Content-Length', rec.img.data?.length || 0);
        res.send(rec.img.data);
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

router.get('/api/appointments/:id/pdfs/:idx/raw', async (req, res) => {
    try {
        const appt = await Appointment.findById(req.params.id);
        if (!appt) return res.status(404).end();

        const idx = Number(req.params.idx);
        const rec = appt.pdfs?.[idx];
        if (!rec) return res.status(404).end();

        const bufLike = rec?.pdf?.data ?? rec?.data;
        const ct = rec?.pdf?.contentType ?? rec?.contentType ?? 'application/pdf';
        if (!bufLike) return res.status(404).end();

        let buf;
        if (Buffer.isBuffer(bufLike)) {
            buf = bufLike;
        } else if (bufLike?.type === 'Buffer' && Array.isArray(bufLike?.data)) {
            buf = Buffer.from(bufLike.data);
        } else if (ArrayBuffer.isView(bufLike)) {
            buf = Buffer.from(bufLike);
        } else if (bufLike?.buffer instanceof ArrayBuffer) {
            buf = Buffer.from(bufLike.buffer);
        } else {
            try { buf = Buffer.from(bufLike); } catch { return res.status(500).end(); }
        }

        res.set('Content-Type', ct);
        res.set('Content-Length', buf.length.toString());
        res.send(buf);
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});



module.exports = router;
