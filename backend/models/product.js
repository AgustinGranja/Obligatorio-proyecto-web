
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String },
    isAvailable: { type: Boolean, default: true },
    prepTime: { type: Number, required: true }, // in minutes
    tags: [String],
  });
  
  module.exports = mongoose.model('Product', productSchema);
  