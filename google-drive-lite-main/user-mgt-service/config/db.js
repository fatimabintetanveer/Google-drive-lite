const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://tammy:pass1234@cluster0.cd9uv7i.mongodb.net/gdrive_lite?retryWrites=true&w=majority').catch(error => console.log(error));

const User = mongoose.model('users', new mongoose.Schema({username: String, password: { type: String, select: false }, admin: Boolean, consumed: Number}));

module.exports = User;