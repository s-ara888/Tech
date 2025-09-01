const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // URL or path to image
  description: { type: String }
});

module.exports = mongoose.model('Product', productSchema);
