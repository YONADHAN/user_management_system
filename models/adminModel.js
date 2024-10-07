const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const adminSchema = new mongoose.Schema({
    adminName: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique:true},
    password: {type: String,required: true,}
});


adminSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


adminSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};



module.exports = mongoose.model('Admin', adminSchema);