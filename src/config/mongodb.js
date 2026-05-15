import {mongoose} from 'mongoose';

export async function connectDB() {
    const uri = process.env.MONGO_DB_URI || 'mongodb://localhost:27017/myapp';
    try {
        await mongoose.connect(uri, { dbName: 'jsd12-express-app' });
        console.log("Connected to MongoDB successfully ✅");
    } catch (err) {
        console.error("Error connecting to MongoDB: ", err);
        // process.exit(1); // Exit the process with an error code
        throw err;
    }
};