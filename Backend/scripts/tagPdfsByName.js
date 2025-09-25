// scripts/tagPdfsByName.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// 如果要用 __dirname，需要自己构造
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://toothmate:PCPwhpXPkRbJwMSk@toothmate.quw6mp3.mongodb.net/toothmate?retryWrites=true&w=majority&appName=toothmate';


// 引入模型（要改成 import）
import '../src/models/Appointment.js';
let PdfModelLoaded = false;
try {
    await import('../src/models/Pdf.js');
    PdfModelLoaded = true;
} catch (e) {
    console.log('Pdf model not found, skip standalone Pdfs');
}

// 然后脚本里继续用 mongoose.model('Appointment') / mongoose.model('Pdf')
const Appointment = mongoose.model('Appointment');
const Pdf = PdfModelLoaded ? mongoose.model('Pdf') : null;

// 下面保持原有逻辑...

const appts = await Appointment.find({ pdfs: { $exists: true, $ne: [] } })
    .select({ _id: 1, pdfs: 1 })
    .limit(2)
    .lean();

console.dir(appts, { depth: null });
const sample = await Appointment.find({ pdfs: { $exists: true, $ne: [] } })
    .select({ _id: 1, pdfs: 1 })
    .limit(2)
    .lean();

console.dir(sample, { depth: null });
process.exit(0); // 只看输出，不继续执行

// ====== 分类规则 ======
function inferCategory(name = '') {
    const s = String(name).trim().toLowerCase();
    if (!s) return 'other';
    if (s.includes('acc') || s.includes('/acc/')) return 'acc';
    if (s.includes('invoice')) return 'invoice';
    if (s.includes('referral')) return 'referral';
    if (s.includes('report')) return 'report';
    return 'other';
}

async function updateStandalonePdfs() {
    if (!Pdf) {
        return {
            scanned: 0,
            changed: 0,
            clsCount: { acc: 0, invoice: 0, referral: 0, report: 0, other: 0 },
            skipped: true,
        };
    }

    const query = {
        $or: [{ category: { $exists: false } }, { category: 'other' }],
    };

    let q = Pdf.find(query).select({ _id: 1, name: 1, category: 1 }).lean();
    if (limit && Number.isFinite(limit)) q = q.limit(limit);

    const cursor = q.cursor();

    let scanned = 0,
        changed = 0;
    const clsCount = { acc: 0, invoice: 0, referral: 0, report: 0, other: 0 };

    for await (const doc of cursor) {
        scanned++;
        const nextCat = inferCategory(doc.name);
        clsCount[nextCat]++;
        if (nextCat !== (doc.category || 'other')) {
            changed++;
            if (!isDryRun) {
                await Pdf.updateOne({ _id: doc._id }, { $set: { category: nextCat } });
            }
        }
    }

    return { scanned, changed, clsCount, skipped: false };
}

async function debugPeekEmbeddedPdfs(sample = 5) {
    const appts = await Appointment.find({
        pdfs: { $exists: true, $ne: [] }
    })
        .select({ _id: 1, 'pdfs._id': 1, 'pdfs': 1 })
        .limit(sample)
        .lean();

    console.log('=== DEBUG: sample of Appointment.pdfs ===');
    for (const a of appts) {
        console.log('Appointment:', a._id);
        for (const p of a.pdfs) {
            // 打印出你真正有的字段
            console.log({
                _id: p._id,
                name: p.name,
                category: p.category,
                contentType: p?.pdf?.contentType,
                // 常见历史字段名（如果你之前存过）
                filename: p.filename,
                originalName: p.originalName,
                fileName: p.fileName,
                url: p.url,
                path: p.path,
                // 还有什么字段就加什么
            });
        }
    }
}

async function main() {
    console.log(`Connecting to MongoDB: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);

    console.log(`[1/2] 独立 Pdf 集合 ${Pdf ? '' : '(未加载/跳过)'} ${isDryRun ? '(dry-run)' : ''}`);
    const standalone = await updateStandalonePdfs();
    if (!standalone.skipped) {
        console.log(
            `Standalone Pdfs => 扫描: ${standalone.scanned}, 修改: ${standalone.changed}`
        );
        console.log('分类命中:', standalone.clsCount);
    } else {
        console.log('已跳过独立 Pdf 集合（未注册 Pdf 模型）');
    }

    console.log(`[2/2] Appointment.pdfs（嵌入） ${isDryRun ? '(dry-run)' : ''}`);
    const embedded = await updateEmbeddedPdfs();
    console.log(
        `Appointments => 扫描文档: ${embedded.scannedAppts}, 更新子文档数: ${embedded.changed}, 触达子文档总数: ${embedded.touchedPdfs}`
    );
    console.log('分类命中:', embedded.clsCount);
    await debugPeekEmbeddedPdfs(3);
    return; // 先不真正修改，看看结构


    await mongoose.disconnect();
    console.log('完成 ✅');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
