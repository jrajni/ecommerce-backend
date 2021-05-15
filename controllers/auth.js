const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const dotenv = require("dotenv");
const jwtSecret = dotenv.config().parsed.jwtSecret;
// const jwtSecret = config.get("jwtSecret");

const { errorHandler } = require("../helpers/dbErrorHandler");

exports.isAuthenticate = async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select("-password");
    if (user) {
      return res.status(200).json(user);
    }
    return res.status(400).json({ errors: [{ msg: "Something went wrong" }] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.UserSignin = async (req, res) => {
  const { email, password } = req.body;
  let today = new Date();
  try {
    let user = await User.findOne({ email });
    // see if user exists
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(payload, jwtSecret, { expiresIn: "24h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
