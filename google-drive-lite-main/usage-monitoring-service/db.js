const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://tammy:pass1234@cluster0.cd9uv7i.mongodb.net/gdrive_lite?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a mongoose model for your image
const BandwidthUsage = mongoose.model('bandwidth_usage', { userId: String, requestSize: Number, date: Date });

module.exports = { BandwidthUsage };