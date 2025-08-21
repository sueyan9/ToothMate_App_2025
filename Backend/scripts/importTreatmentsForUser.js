require('dotenv').config();
const mongoose = require("mongoose");
require("../src/models/Tooth");
require("../src/models/Treatment");
require("../src/models/DentalPlan");
require("../src/models/Appointment");
require("../src/models/User");

const Tooth = mongoose.model("Tooth");
const Treatment = mongoose.model("Treatment");
const DentalPlan = mongoose.model("DentalPlan");
const Appointment = mongoose.model("Appointment");
const User = mongoose.model("User");

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

async function importDentalPlanPerStep(userNhi) {
    try {
        const teeth = await Tooth.find({ userNhi });
        if (!teeth.length) return console.log("No teeth found for user:", userNhi);

        // 创建 DentalPlan
        const plan = new DentalPlan({
            userNhi,
            planName: "Root Canal Treatment Plan",
            startDate: new Date(),
            endDate: new Date(Date.now() + 180 * 24 * 3600 * 1000), // 6个月
            planType: "root-canal",
            steps: [
                { name: "Diagnosis", description: "Check tooth condition" },
                { name: "Cleaning", description: "Remove infected pulp" },
                { name: "Filling", description: "Fill canal" },
                { name: "Crown", description: "Place protective crown" },
            ],
        });

        await plan.save();
        console.log(`DentalPlan created: ${plan._id}`);

        const treatmentsToInsert = [];
        const appointmentsToInsert = [];

        teeth.forEach(tooth => {
            plan.steps.forEach((step, index) => {
                // 按顺序生成未来 appointment 日期
                const stepDate = new Date();
                stepDate.setDate(stepDate.getDate() + index * 10); // 每步间隔10天，可调整

                // 判断是 past / completed 或 future / planned
                const status = stepDate < new Date() ? "completed" : "planned";

                // 生成 Appointment
                const appointment = new Appointment({
                    nhi: userNhi,
                    dentalPlan: plan._id,
                    date: stepDate,
                    treatments: [], // 先空
                    notes: step.description,
                });

                // 生成 Treatment 并关联 appointment
                const treatment = new Treatment({
                    toothId: tooth._id,
                    userNhi,
                    dentalPlan: plan._id,
                    appointment: appointment._id,
                    stepName: step.name,
                    doctor: "Dr. Smith",
                    treatmentDate: stepDate,
                    treatmentType: plan.planType,
                    treatmentDetails: step.description,
                    status,
                });

                appointment.treatments.push(treatment._id);

                treatmentsToInsert.push(treatment);
                appointmentsToInsert.push(appointment);
            });
        });

        // 批量保存
        await Appointment.insertMany(appointmentsToInsert);
        console.log(`Created ${appointmentsToInsert.length} appointments.`);

        await Treatment.insertMany(treatmentsToInsert);
        console.log(`Created ${treatmentsToInsert.length} treatments.`);

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
}

// 调用
importDentalPlanPerStep("CBD1234");
