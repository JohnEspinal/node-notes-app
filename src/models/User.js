const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcryptjs = require('bcryptjs');


const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now}
})

userSchema.methods.encryptPassword = async (password)=>{
    const salt = await bcryptjs.genSalt(10);
    const hash = bcryptjs.hash(password, salt);
    return hash;
}

userSchema.methods.matchPassword = async function(password) {
    return await bcryptjs.compare(password, this.password);
}

module.exports = mongoose.model('user', userSchema);