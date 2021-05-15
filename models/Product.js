const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  ProductId: {
    type: String,
    required: true,
    unique: true,
  },
  ProductName: {
    type: String,
    required: true,
  },
  Categories: {
    type: [String],
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: [String],
  },
  Timestamp: { type: Date, default: Date.now },
});
module.exports = Product = mongoose.model("Product", ProductSchema);
