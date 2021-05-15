const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addCategory,
  deleteNews,
  getAllCategories,
  getSearchedNews,
} = require("../controllers/category");

// @route    GET api/categories
// @desc     Get all categories
// @access   Public
// 1
router.get("/", getAllCategories);

// @route    GET api/news/getSearchedNews
// @desc     Get search news
// @access   Private
// 2

router.post("/", addCategory);

module.exports = router;
