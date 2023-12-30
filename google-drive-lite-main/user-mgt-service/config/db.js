const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/gdrive_lite', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch(error => console.log(error));

const User = mongoose.model('users', new mongoose.Schema({username: String, password: { type: String, select: false }, admin: Boolean, consumed: Number}));

module.exports = User;
