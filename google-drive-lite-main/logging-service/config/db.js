const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/gdrive_lite', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const Logs = mongoose.model('logs', new mongoose.Schema({time: Date, size: Number, service: String, message: String}));

module.exports = Logs;