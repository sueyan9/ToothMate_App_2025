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
router.get('/Appointment', async (_req, res) => {
  try {
    const items = await Appointment.find().sort({ startAt: -1 }).limit(200);
    res.json(items);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /Appointment/:nhi  按 NHI 查询
router.get('/Appointment/:nhi', async (req, res) => {
  try {
    const { nhi } = req.params;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = parseInt(req.query.skip, 10) || 0;
    const filter = { nhi: String(nhi || '').toUpperCase() };

    const [items, total] = await Promise.all([
      Appointment.find(filter).sort({ startAt: 1, date: 1 }).skip(skip).limit(limit).lean(),
      Appointment.countDocuments(filter),
    ]);
    res.json({ items, total, skip, limit });
  } catch (e) {
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
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    appt.images.push({ img: { data: req.file.buffer, contentType: req.file.mimetype || 'image/jpeg' } });
    await appt.save();
    res.json({ ok: true, count: appt.images.length });
  } catch (e) { next(e); }
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
    const pdfUrls = (appt.pdfs || []).map((_, i) => `${host}/Appointment/${req.params.id}/pdfs/${i}/raw`);

    res.json({ imagesBase64, pdfUrls });
  } catch (e) {
    res.status(500).json({ error: 'fetch assets failed' });
  }
});

module.exports = router;
