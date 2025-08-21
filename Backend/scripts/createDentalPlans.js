require('dotenv').config();
const mongoose = require('mongoose');

require('../src/models/Treatment');
require('../src/models/Appointment');
require('../src/models/DentalPlan');

const Treatment = mongoose.model('Treatment');
const Appointment = mongoose.model('Appointment');

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

async function generateAppointments(generateFuture = false) {
    try {
        const treatments = await Treatment.find({});
        console.log(`Found ${treatments.length} treatments`);

        for (const t of treatments) {
            // 已经有 appointmentId 就跳过
            if (t.appointmentId) continue;

            // 如果是 planned 且不生成未来 appointment，就跳过
            if (t.status === 'planned' && !generateFuture) continue;

            const appointmentDate = t.treatmentDate || new Date();

            // 创建 Appointment
            const appointment = new Appointment({
                nhi: t.userNhi,
                dentalPlan: t.dentalPlan,
                treatments: [t._id],
                date: appointmentDate,
            });

            await appointment.save();

            // 更新 Treatment 的 appointmentId
            t.appointmentId = appointment._id;
            await t.save();

            console.log(`Created Appointment ${appointment._id} for Treatment ${t._id}`);
        }

        console.log('Appointments generation completed.');
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
}

// 执行：generateFuture = true 时也生成 planned 的 future appointments
generateAppointments(false);
