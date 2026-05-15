import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true ,trim: true, unique: true},
        role:{ type: String, enum: ["user","admin"], default: "user" },
        email:{ type: String, required: true, unique: true ,lowercase: true},
        password:{ type: String, required: true ,minlength: 8, select:false}, 

    },
    {timestamps: true },
);

mongoose.model("User", userSchema);

mongoose.connect(process.env.MONGO_DB_URI).then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Error connecting to MongoDB:", err));


export const User = mongoose.model("User", userSchema);