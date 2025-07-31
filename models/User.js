const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: {
            type: String, enum: ['admin', 'seller', 'customer'],
            default: 'customer'
        },
        status: {
            type: String, enum: ['active', 'inactive'],
            default: 'active',
        },
        createdAt: { type: Date, default: Date.now },
    }
);

userSchema.pre('save',async function(next){
    this.password = await bcrypt.hash(this.password,10);
    next();
});

userSchema.methods.compare = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

module.exports = mongoose.model("User", userSchema);