const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const tz = require('dayjs/plugin/timezone');
dayjs.extend(utc); dayjs.extend(tz);

const NZ_TZ = 'Pacific/Auckland';
const Appointment = mongoose.model('Appointment');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const router = express.Router();

/* ---------- Buffer 兼容工具 ---------- */
function toNodeBuffer(bufLike) {
  if (!bufLike) return null;
  if (Buffer.isBuffer(bufLike)) return bufLike;
  if (bufLike?.type === 'Buffer' && Array.isArray(bufLike?.data)) return Buffer.from(bufLike.data);
  if (ArrayBuffer.isView(bufLike)) return Buffer.from(bufLike);
  if (bufLike?.buffer instanceof ArrayBuffer) return Buffer.from(bufLike.buffer);
  try { return Buffer.from(bufLike); } catch { return null; }
}

/* ===================== Core ===================== */
// GET /Appointment 列表
router.get('/Appointments', async (_req, res) => {
  try {
    const items = await Appointment.find().sort({ startAt: -1 }).limit(200);
    res.json(items);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /Appointment/:nhi  按 NHI 查询
router.get('/Appointments/:nhi', async (req, res) => {
  try {
    const { nhi } = req.params;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = parseInt(req.query.skip, 10) || 0;
    const filter = { nhi: String(nhi || '').toUpperCase() };
    console.log('[GET by NHI] filter =', filter, 'skip=', skip, 'limit=', limit);

    const [items, total] = await Promise.all([
      Appointment.find(filter).sort({ startAt: 1, date: 1 }).skip(skip).limit(limit).lean(),
      Appointment.countDocuments(filter),
    ]);
    res.json({ items, total, skip, limit });
  } catch (e) {
    console.error('GET /Appointments/nhi/:nhi failed:', e);
    res.status(500).json({ error: e.message });
  }
});

// POST /Appointment 创建预约
router.post('/Appointments', async (req, res) => {
  try {
    const {
      nhi, userId, dentist = {}, clinic, purpose, notes,
      status = 'scheduled', startLocal, endLocal, timezone = NZ_TZ, treatments = [],
    } = req.body;

    if (!nhi || !purpose || !startLocal || !endLocal) {
      return res.status(400).json({ error: 'nhi, purpose, startLocal, endLocal are required' });
    }

    const startAt = dayjs(startLocal).tz(timezone).toDate();
    const endAt = dayjs(endLocal).tz(timezone).toDate();
    if (!(startAt < endAt)) return res.status(400).json({ error: 'endAt must be after startAt' });

    const doc = await Appointment.create({
      nhi: String(nhi).toUpperCase(),
      userId,
      dentist: dentist?.name ? { name: dentist.name } : undefined,
      clinic,
      purpose, notes, status, treatments, startAt, endAt, timezone,
    });
    res.status(201).json(doc);
  } catch (e) { res.status(422).json({ error: e.message }); }
});

/* ===================== Assets ===================== */
// 上传图片
router.post('/Appointments/:id/images', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    // 2) 允许的图片类型白名单
    const mime = (req.file.mimetype || '').toLowerCase();
    const ALLOW = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);
    if (!ALLOW.has(mime)) {
      return res.status(415).json({ error: `Unsupported image type: ${mime}` });
    }
    // 3) 取预约
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    // 4) 计算 sha256 做去重（同一个预约里不重复存同一文件）
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
    const duplicated = appt.images?.some(img => img.hash === hash);

    if (!duplicated) {
      appt.images.push({
      hash,
      uploadedAt: new Date(), // 记录上传时间（Schema 里有默认值也可以显式再写）
      img: { data: req.file.buffer, contentType: mime || 'image/jpeg' },
      meta: {
        filename: req.file.originalname,
        size: req.file.size,
        // 如果需要，还可以扩展 width/height（前端传或服务端探测）
      },
    });
      await appt.save();
    }
    // 5) 统一响应（包含一些前端可能用到的信息）
    return res.json({
      ok: true,
      duplicated,
      count: appt.images.length,
      item: {
        hash,
        contentType: mime || 'image/jpeg',
        uploadedAt: new Date(), // 这里也可返回 appt.images[末尾].uploadedAt
        filename: req.file.originalname,
        size: req.file.size,
        // 前端想立即显示的话，也可以附带 dataUrl（注意可能比较大）
        // dataUrl: `data:${mime};base64,${req.file.buffer.toString('base64')}`,
      },
    });
  } catch (e) {
    next(e);
  }
});

// 上传 PDF
router.post('/Appointments/:id/pdfs', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    if (!/pdf$/i.test(req.file.mimetype || '')) return res.status(415).json({ error: 'Not a PDF' });
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    appt.pdfs.push({ pdf: { data: req.file.buffer, contentType: req.file.mimetype } });
    await appt.save();
    res.json({ ok: true, count: appt.pdfs.length });
  } catch (e) { next(e); }
});

// 列出图片（Base64）
router.get('/Appointments/:id/images', async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    const images = (appt.images || []).map(x => {
      const buf = toNodeBuffer(x?.img?.data ?? x?.data);
      const ct = x?.img?.contentType ?? x?.contentType ?? 'image/jpeg';
      return buf ? { contentType: ct, base64: buf.toString('base64') } : null;
    }).filter(Boolean);

    res.json({ images });
  } catch (e) {
    res.status(500).json({ error: 'fetch images failed' });
  }
});
// 列出某用户的所有 X-ray 图片（按时间）
router.get('/users/:userId/images', async (req, res) => {
  try {
    const { userId } = req.params;

    // 只取必要字段，减少内存
    const appts = await Appointment.find({ userId })
        .select('_id startAt createdAt images')
        .lean();

    const host = `${req.protocol}://${req.get('host')}`;
    const items = [];

    for (const appt of appts) {
      const imgs = Array.isArray(appt.images) ? appt.images : [];
      imgs.forEach((x, idx) => {
        const buf = toNodeBuffer(x?.img?.data ?? x?.data);
        const ct  = x?.img?.contentType ?? x?.contentType ?? 'image/jpeg';
        if (!buf) return;

        const uploadedAt = x?.uploadedAt || appt.startAt || appt.createdAt;
        items.push({
          appointmentId: String(appt._id),
          index: idx, // 供 raw 原图用
          contentType: ct,
          // 前端想直接显示就给 dataUrl；想省流量可以只给 rawUrl
          dataUrl: `data:${ct};base64,${buf.toString('base64')}`,
          rawUrl: `${host}/Appointments/${appt._id}/images/${idx}/raw`,
          uploadedAt: uploadedAt ? new Date(uploadedAt).toISOString() : null,
          appointmentStartAt: appt.startAt ? new Date(appt.startAt).toISOString() : null,
        });
      });
    }

    // 按时间倒序（优先 uploadedAt，其次 appointmentStartAt）
    items.sort((a, b) => {
      const ta = new Date(a.uploadedAt || a.appointmentStartAt || 0).getTime();
      const tb = new Date(b.uploadedAt || b.appointmentStartAt || 0).getTime();
      return tb - ta;
    });

    res.json({ items, count: items.length });
  } catch (e) {
    console.error('GET /users/:userId/images failed:', e);
    res.status(500).json({ error: 'list user images failed' });
  }
});

// 获取单张图片原图
router.get('/Appointments/:id/images/:idx/raw', async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).end();
    const rec = appt.images?.[Number(req.params.idx)];
    if (!rec) return res.status(404).end();
    const buf = toNodeBuffer(rec?.img?.data ?? rec?.data);
    const ct = rec?.img?.contentType || rec?.contentType || 'image/jpeg';
    if (!buf) return res.status(404).end();
    res.set('Content-Type', ct);
    res.set('Content-Length', String(buf.length));
    res.send(buf);
  } catch (e) { res.status(500).end(); }
});

// 获取 PDF 数量
router.get('/Appointments/:id/pdfs', async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id).lean();
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ count: (appt.pdfs || []).length });
  } catch (e) { res.status(500).json({ error: 'fetch pdfs failed' }); }
});

// 获取 PDF 原文件
router.get('/Appointments/:id/pdfs/:idx/raw', async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).end();
    const rec = appt.pdfs?.[Number(req.params.idx)];
    if (!rec) return res.status(404).end();
    const buf = toNodeBuffer(rec?.pdf?.data ?? rec?.data);
    const ct = rec?.pdf?.contentType ?? rec?.contentType ?? 'application/pdf';
    if (!buf) return res.status(404).end();
    res.set('Content-Type', ct);
    res.set('Content-Length', String(buf.length));
    res.set('Content-Disposition', `inline; filename="document-${Number(req.params.idx) + 1}.pdf"`);
    res.send(buf);
  } catch (e) { res.status(500).end(); }
});

// 综合资产
router.get('/Appointments/:id/assets', async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    const imagesBase64 = (appt.images || []).map(x => {
      const buf = toNodeBuffer(x?.img?.data ?? x?.data);
      const ct = x?.img?.contentType ?? x?.contentType ?? 'image/jpeg';
      return buf ? `data:${ct};base64,${buf.toString('base64')}` : null;
    }).filter(Boolean);

    const host = `${req.protocol}://${req.get('host')}`;
    const pdfUrls = (appt.pdfs || []).map((_, i) => `${host}/Appointments/${req.params.id}/pdfs/${i}/raw`);

    res.json({ imagesBase64, pdfUrls });
  } catch (e) {
    res.status(500).json({ error: 'fetch assets failed' });
  }
});

module.exports = router;
