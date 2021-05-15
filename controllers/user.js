const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const dotenv = require("dotenv");
const jwtSecret = dotenv.config().parsed.jwtSecret;
const auth = require("../middleware/auth");
const saltRounds = 10;
const { v4: uuidv4 } = require("uuid");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.registerUser = async (req, res) => {
  const { yourName, email, password, contact, address, cart } = req.body;
  try {
    let emailExist = await User.findOne({ email });
    if (emailExist) return res.status(400).send("The Email Already exist.");

    let id = uuidv4();
    let user = await User.findOne({ UserId: id });
    while (user) {
      let id = uuidv4();
      user = await User.findOne({ UserId: id });
    }
    user = new User({
      UserId: id,
      yourName,
      email,
      password,
      contact,
      address,
      cart,
    });
    // encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = {
      user: {
        id: user.id,
      },
    };
    // return jsonwebtoken

    jwt.sign(
      payload,
      jwtSecret,
      // config.get('jwtSecret'),/
      { expiresIn: "24h" },
      async (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.changeUserPassword = async (req, res) => {
  try {
    let user = await User.findOne({ UserId: req.params.id });
    if (!user)
      return res.status(400).send({
        errors: [{ msg: "No user found with these credentials" }],
      });
    bcrypt.compare(req.body.password, user.password, function (err, result) {
      if (result === true) {
        bcrypt.hash(req.body.newpassword, saltRounds, async function (
          err,
          hash
        ) {
          var newvalues = { $set: { password: hash } };
          let updatedUser = await user.updateOne(newvalues, function (
            err,
            res
          ) {
            if (err) throw err;
          });
          res.json({ user });
        });
      } else {
        res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.addProductToCart = async (req, res) => {
  try {
    const { user_id, productId } = req.params;
    let dataClient = await User.findOneAndUpdate(
      { UserId: user_id },
      [
        {
          $set: {
            cart: {
              $concatArrays: [
                {
                  $filter: {
                    input: "$cart",
                    cond: {
                      $not: [{ $in: ["$$this.productId", [productId]] }],
                    },
                  },
                },
                {
                  $map: {
                    input: [productId],
                    in: {
                      $cond: [
                        { $in: ["$$this", "$cart.productId"] },
                        {
                          productId: "$$this",
                          count: {
                            $sum: [
                              {
                                $arrayElemAt: [
                                  "$cart.count",
                                  {
                                    $indexOfArray: [
                                      "$cart.productId",
                                      "$$this",
                                    ],
                                  },
                                ],
                              },
                              1,
                            ],
                          },
                        },
                        { productId: "$$this", count: 1 },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
      { upsert: true }
    );
    res.status(200).send("Cart Updated");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.removeProductFromCart = async (req, res) => {
  try {
    const { user_id, productId } = req.params;
    let dataClient = await User.findOneAndUpdate(
      { UserId: user_id },
      [
        {
          $set: {
            cart: {
              $concatArrays: [
                {
                  $filter: {
                    input: "$cart",
                    cond: {
                      $not: [{ $in: ["$$this.productId", [productId]] }],
                    },
                  },
                },
                {
                  $map: {
                    input: [productId],
                    in: {
                      $cond: [
                        { $in: ["$$this", "$cart.productId"] },
                        {
                          productId: "$$this",
                          count: {
                            $sum: [
                              {
                                $arrayElemAt: [
                                  "$cart.count",
                                  {
                                    $indexOfArray: [
                                      "$cart.productId",
                                      "$$this",
                                    ],
                                  },
                                ],
                              },
                              -1,
                            ],
                          },
                        },
                        { productId: "$$this", count: 1 },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
      { upsert: true }
    );
    res.status(200).send("Cart Updated");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
exports.fetchCartItems = async (req, res) => {
  try {
    const { user_id } = req.params;
    let dataClient = await User.aggregate([
      { $match: { UserId: user_id } },
      { $unwind: "$cart" },
      {
        $lookup: {
          from: "products",
          localField: "cart.productId",
          foreignField: "ProductId",
          as: "Product",
        },
      },
      {
        $project: {
          Product_Id: "$Product.ProductId",
          Product_Name: "$Product.ProductName",
          Count: "$cart.count",
          price: "$Product.price",
        },
      },
    ]);
    res.status(200).send(dataClient);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.checkout = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { address } = req.body;
    let result = await User.findOneAndUpdate(
      { UserId: user_id },
      { $set: { address: address } },
      { returnOriginal: false }
    );
    res.status(200).send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
