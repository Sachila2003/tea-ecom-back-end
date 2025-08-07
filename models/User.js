const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        role: {
            type: String, 
            enum: ['admin', 'seller', 'customer'],
            default: 'customer'
        },
        status: {
            type: String, 
            enum: ['active', 'inactive'],
            default: 'active',
        },
        profilePic: {
            type: String,
            default: 'uploads/default-avatar.png'
        }
    },
    { timestamps: true }
);

// --- Password Hashing Middleware ---
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// --- Password Comparison Method ---
userSchema.methods.compare = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model("User", userSchema);