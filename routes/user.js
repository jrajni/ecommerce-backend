const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  UserPasswordValidator,
  userSignupValidator,
} = require("../validator/index");
const {
  registerUser,
  changeUserPassword,
  addProductToCart,
  fetchCartItems,
  removeProductFromCart,
  checkout,
} = require("../controllers/user");

// @route POST api/user
// @desc Register User
// access Public
// 1
router.post("/", userSignupValidator, registerUser);

// @route GET api/user/:user_id
// @desc Fetch User's Cart Item
// access Public
// 2
router.get("/:user_id", fetchCartItems);

// @route Patch api/user/add/:user_id/:productId
// @desc Add Products to Cart
// access Public
// 3
router.patch("/add/:user_id/:productId", addProductToCart);

// @route Patch api/user/remove/:user_id/:productId
// @desc Remove Products to Cart
// access Public
// 4
router.patch("/remove/:user_id/:productId", removeProductFromCart);

// @route Post api/user/checkout
// @desc Checkout Products
// access Public
// 5
router.post("/checkout/:user_id", checkout);

module.exports = router;
