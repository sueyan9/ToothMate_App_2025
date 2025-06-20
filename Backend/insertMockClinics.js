require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
if (!uri) {
    console.error('❌ Invalid or missing MONGO_URI in .env file');
    process.exit(1);
}

const dbName = 'toothmate';

const clinics = [
    {
        name: 'Happy Smile Dental',
        code: 'HAPPY123',
        address: '123 Smile St, Auckland',
        phone: '09 123 4567'
    },
    {
        name: 'KidCare Dental',
        code: 'KIDS456',
        address: '456 Child Ave, Wellington',
        phone: '04 987 6543'
    },
    {
        name: 'ToothMate Central',
        code: 'TM789',
        address: '789 Main Road, Christchurch',
        phone: '03 111 2222'
    }
];

async function insertClinics() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('clinics');

        const result = await collection.insertMany(clinics);
        console.log(`✅ ${result.insertedCount} clinics inserted successfully.`);
    } catch (err) {
        console.error('❌ Failed to insert clinics:', err);
    } finally {
        await client.close();
    }
}

insertClinics();