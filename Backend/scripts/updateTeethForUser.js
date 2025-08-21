// scripts/updateTeethForUser.js
const mongoose = require("mongoose");
require("../src/models/Tooth");
require('dotenv').config();


const Tooth = mongoose.model("Tooth");

const mongoUri = process.env.MONGO_URI ;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
async function updateTeethForUser(userNhi) {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const teeth = await Tooth.find(); // 假设数据库已有32颗牙齿

        const updatePromises = teeth.map(tooth => {
            return Tooth.findByIdAndUpdate(
                tooth._id,
                {
                    userNhi,
                    extracted: false,   // 初始未拔除
                    deciduous: false,   // 初始非乳牙
                },
                { new: true }
            );
        });

        const updatedTeeth = await Promise.all(updatePromises);
        console.log(`Updated ${updatedTeeth.length} teeth for user ${userNhi}`);

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        mongoose.disconnect();
    }
}

// Example usage
const userNhi = "CBD1234";
updateTeethForUser(userNhi);
