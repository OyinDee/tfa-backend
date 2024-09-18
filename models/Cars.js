const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  year: { type: Number },
  model: { type: String },
  mileage: { type: Number },
  images: [{ type: String }]  
});

module.exports = mongoose.model('Car', CarSchema);
