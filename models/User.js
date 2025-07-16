const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const UserSchema = new mongoose.Schema({
    name: {type:String, require:true},
    email: {type:String, require:true},
    password: {type:String, require:true},
    role: {type:String, enum: ['admin', 'seller', 'customer'], default:'customer'},
    status: {type:String, enum: ['active', 'inactive'], default:'active'},
    createdAt: {type:Date, default:Date.now}
});
UserSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
UserSchema.methods.compare = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model("User", UserSchema);

