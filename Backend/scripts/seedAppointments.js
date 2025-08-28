// scripts/seedAppointments.js
// 用于插入若干条演示预约数据（NZ 时区），适配你的 Appointment schema
require('dotenv').config();
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const tz = require('dayjs/plugin/timezone');
dayjs.extend(utc); dayjs.extend(tz);

const NZ_TZ = 'Pacific/Auckland';

// 引入模型（确保路径正确或模型已在全局注册）
require('../src/models/Appointment'); // 如果你的模型文件在别处，请改为正确相对路径
const Appointment = mongoose.model('Appointment');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://toothmate:PCPwhpXPkRbJwMSk@toothmate.quw6mp3.mongodb.net/toothmate?retryWrites=true&w=majority&appName=toothmate';

function nz(dateTime) {
    // 传入 'YYYY-MM-DD HH:mm'（NZ 本地时间），返回 UTC Date
    return dayjs.tz(dateTime, 'YYYY-MM-DD HH:mm', NZ_TZ).toDate();
}

async function main() {
    await mongoose.connect(MONGO_URI);

    const nhi = 'CBD1234';

    // 清理该 NHI 的旧数据（可按需注释）
    await Appointment.deleteMany({ nhi });

    const docs = [
        // Past
        {
            nhi,
            dentist: { name: 'Dr. Toothmate' },
            clinic: '67fa2286e8aa598431bff1f1',
            purpose: 'Check-up',
            notes: 'Patient is recovering well.',
            status: 'completed',
            startAt: nz('2025-04-12 10:00'),
            endAt: nz('2025-04-12 10:30'),
            timezone: NZ_TZ,
            treatments: [], // 如需，填入 Treatment _id
        },
        // 关键：8/29 有一条
        {
            nhi,
            dentist: { name: 'Dr. Chen' },
            clinic: '67fa2286e8aa598431bff1f1',
            purpose: 'Root canal',
            notes: 'Remove infected pulp',
            status: 'scheduled',
            startAt: nz('2025-08-29 10:00'),
            endAt: nz('2025-08-29 11:30'),
            timezone: NZ_TZ,
            treatments: [],
        },
        // 9/08
        {
            nhi,
            dentist: { name: 'Dr. Patel' },
            clinic: '67fa2286e8aa598431bff1f1',
            purpose: 'Cleaning',
            notes: 'Fill canal',
            status: 'scheduled',
            startAt: nz('2025-09-08 09:30'),
            endAt: nz('2025-09-08 10:30'),
            timezone: NZ_TZ,
            treatments: [],
        },
        // 9/18
        {
            nhi,
            dentist: { name: 'Dr. Williams' },
            clinic: '67fa2286e8aa598431bff1f1',
            purpose: 'Crown',
            notes: 'Place protective crown',
            status: 'scheduled',
            startAt: nz('2025-12-18 14:00'),
            endAt: nz('2025-12-18 15:00'),
            timezone: NZ_TZ,
            treatments: [],
        },
    ];

    await Appointment.insertMany(docs);

    console.log(`Seeded ${docs.length} appointments for NHI ${nhi}`);
    await mongoose.disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});