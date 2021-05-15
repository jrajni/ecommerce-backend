const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
  CategoryId: {
    type: String,
    required: true,
    unique: true,
  },

  CategoryName: {
    type: String,
    required: true,
  },
  Timestamp: { type: Date, default: Date.now },
});
module.exports = Category = mongoose.model("Category", CategorySchema);
