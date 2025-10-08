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

/* ---------- Buffer compatibility helpers  ---------- */
function toNodeBuffer(bufLike) {
  if (!bufLike) return null;
  if (Buffer.isBuffer(bufLike)) return bufLike;
  if (bufLike?.type === 'Buffer' && Array.isArray(bufLike?.data)) return Buffer.from(bufLike.data);
  if (ArrayBuffer.isView(bufLike)) return Buffer.from(bufLike);
  if (bufLike?.buffer instanceof ArrayBuffer) return Buffer.from(bufLike.buffer);
  try { return Buffer.from(bufLike); } catch { return null; }
}

/* ===================== Core ===================== */
// GET /Appointment list
router.get('/Appointments', async (_req, res) => {
  try {
    const items = await Appointment.find().sort({ startAt: -1 }).limit(200);
    res.json(items);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// get the next appointment by NHI
router.get('/Appointments/next', async (req, res) => {
  try {
    const { nhis } = req.query;
    
    if (!nhis) {
      return res.status(400).json({ error: 'nhis query parameter is required' });
    }
    
    // Split comma-separated NHIs and normalize to uppercase
    const nhiArray = nhis.split(',').map(n => String(n).trim().toUpperCase()).filter(Boolean);
    
    if (nhiArray.length === 0) {
      return res.status(400).json({ error: 'at least one valid NHI is required' });
    }
    
    const filter = { 
      nhi: { $in: nhiArray }, // Match any of the provided NHIs
      startAt: { $gte: new Date() } // Only appointments from now onwards
    };
    
    console.log('[GET next appointment for multiple NHIs] filter =', filter);

    const appointment = await Appointment.findOne(filter)
      .sort({ startAt: 1 }) // Sort by earliest first
      .populate('clinic')
      .lean();
    
    res.json(appointment); // Will be null if no upcoming appointments
  } catch (e) {
    console.error('GET /Appointments/next failed:', e);
    res.status(500).json({ error: e.message });
  }
});

// GET /Appointment/:nhi  query by NHI
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

// POST /Appointment create an appointment
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
// Upload an image
router.post('/Appointments/:id/images', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    // 2) Allowed image MIME types allowlist
    const mime = (req.file.mimetype || '').toLowerCase();
    const ALLOW = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);
    if (!ALLOW.has(mime)) {
      return res.status(415).json({ error: `Unsupported image type: ${mime}` });
    }
    // 3) Load appointment
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    // 4) Compute sha256 to dedupe (do not store the same file twice within one appointment)
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
    const duplicated = appt.images?.some(img => img.hash === hash);

    if (!duplicated) {
      appt.images.push({
      hash,
      uploadedAt: new Date(), // record upload time
      img: { data: req.file.buffer, contentType: mime || 'image/jpeg' },
      meta: {
        filename: req.file.originalname,
        size: req.file.size,

      },
    });
      await appt.save();
    }
    // 5) Unified response (include a few fields the client may use)
    return res.json({
      ok: true,
      duplicated,
      count: appt.images.length,
      item: {
        hash,
        contentType: mime || 'image/jpeg',
        uploadedAt: new Date(),
        filename: req.file.originalname,
        size: req.file.size,
        // If the client wants to preview immediately, you could attach a dataUrl (may be large):
        // dataUrl: `data:${mime};base64,${req.file.buffer.toString('base64')}`,
      },
    });
  } catch (e) {
    next(e);
  }
});

// upload PDF ( invoice / acc )
router.post('/Appointments/:id/pdfs', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    if (!/pdf$/i.test(req.file.mimetype || '')) return res.status(415).json({ error: 'Not a PDF' });

    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    // get the category from body.category ，default " invoice"
    const category = (req.body.category || 'invoice').toLowerCase();
    if (!['invoice', 'acc', 'referral', 'report', 'other'].includes(category)) {
      return res.status(400).json({ error: 'invalid category' });
    }
    const name = (req.body.name && String(req.body.name).trim()) || req.file.originalname;

    let when = null;
    if (req.body.when) {
      const d = new Date(req.body.when);
      if (!isNaN(d.getTime())) when = d;
    }
    if (!when) when = appt.startAt || new Date();

    appt.pdfs.push({
      pdf: { data: req.file.buffer, contentType: req.file.mimetype },
      name,
      category,
      when,
    });

    await appt.save();

    res.json({
      ok: true,
      count: appt.pdfs.length,
      added: { name, category, when: when.toISOString() }
    });
  } catch (e) {
    next(e);
  }
});


// List images（Base64）
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
// List all X-ray images of a user (sorted by time)
router.get('/users/:userId/images', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch only necessary fields to save memory
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
          index: idx, // used by the raw link
          contentType: ct,
          // If the client wants to render directly, provide dataUrl; to save bandwidth provide only rawUrl.
          dataUrl: `data:${ct};base64,${buf.toString('base64')}`,
          rawUrl: `${host}/Appointments/${appt._id}/images/${idx}/raw`,
          uploadedAt: uploadedAt ? new Date(uploadedAt).toISOString() : null,
          appointmentStartAt: appt.startAt ? new Date(appt.startAt).toISOString() : null,
        });
      });
    }

    // Sort by time descending (prefer uploadedAt, then appointmentStartAt)
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

// Get one raw image
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

//get  PDF count
router.get('/Appointments/:id/pdfs', async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id).lean();
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ count: (appt.pdfs || []).length });
  } catch (e) { res.status(500).json({ error: 'fetch pdfs failed' }); }
});

// get raw PDF
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

// Aggregated assets for one appointment
router.get('/Appointments/:id/assets', async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    const host = `${req.protocol}://${req.get('host')}`;

    const imagesBase64 = (appt.images || []).map(x => {
      const buf = toNodeBuffer(x?.img?.data ?? x?.data);
      const ct = x?.img?.contentType ?? x?.contentType ?? 'image/jpeg';
      return buf ? `data:${ct};base64,${buf.toString('base64')}` : null;
    }).filter(Boolean);

//previous URL
    const pdfUrls = (appt.pdfs || []).map((_, i) =>
        `${host}/Appointments/${req.params.id}/pdfs/${i}/raw`
    );

    const pdfItems = (appt.pdfs || []).map((p, i) => {
      const rawWhen = p?.when || p?.createdAt || appt?.startAt || appt?.createdAt;
      const when = rawWhen ? new Date(rawWhen).toISOString() : undefined;
      return {
        url: `${host}/Appointments/${req.params.id}/pdfs/${i}/raw`,
        name: p?.name || `document-${i + 1}.pdf`,
        when,
        category: p?.category || null,
      };
    });

    res.json({
      imagesBase64,
      pdfUrls,
      pdfItems,
    });
  } catch (e) {
    console.error('fetch assets failed:', e);
    res.status(500).json({ error: 'fetch assets failed' });
  }
});

module.exports = router;
