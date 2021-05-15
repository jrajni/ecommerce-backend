const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { SigninValidator } = require("../validator/index");
const { UserSignin, isAuthenticate } = require("../controllers/auth");

// @route GET api/auth
// @desc Test route
// access private
// 1
router.get("/", auth, isAuthenticate);

// @route POST api/auth/user
// @desc Authenticate user & get Token/login
// access Public
// 3
router.post("/user", SigninValidator, UserSignin);

module.exports = router;
