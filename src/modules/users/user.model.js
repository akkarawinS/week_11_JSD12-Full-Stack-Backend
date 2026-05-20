import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true ,trim: true, unique: true},
        role:{ type: String, enum: ["user","admin"], default: "user" },
        email:{ type: String, required: true, unique: true ,lowercase: true},
        password:{ type: String, required: true ,minlength: 8, select:false}, 

    },
    {timestamps: true },
);
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return ;

    this.password = await bcrypt.hash(this.password, 10);
});

// userSchema.methods.comparePassword = async function(password) {
//   return bcrypt.compare(password, this.password);
// };

mongoose.model("User", userSchema);


export const User = mongoose.model("User", userSchema);

