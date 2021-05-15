const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  UserId: {
    type: String,
    required: true,
    unique: true,
  },
  yourName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
  },
  cart: {
    type: [
      {
        productId: String,
        count: Number,
        Timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  wishlist: {
    type: [
      {
        productId: String,
        count: Number,
        Timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  Timestamp: { type: Date, default: Date.now },
});
module.exports = User = mongoose.model("User", UserSchema);
