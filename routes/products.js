const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addProduct,
  deleteNews,
  getAllNews,
  getProductSpecificCategory,
} = require("../controllers/product");

// @route    GET api/news
// @desc     Get all news
// @access   Public
// 1
router.get("/:catid", getProductSpecificCategory);

// @route    POST api/news
// @desc     Add new Product
// @access   Public
// 2
router.post("/", addProduct);

module.exports = router;
