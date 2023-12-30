// db.js
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/gdrive_lite', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a mongoose model for your image
const Image = mongoose.model('images', { data: Buffer, userId: String, size: Number });

module.exports = { Image };