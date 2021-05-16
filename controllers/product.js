const Product = require("../models/Product");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
var fs = require("fs");
// const shoeImg = require("../img/shoes.jpeg");
exports.getAllProduct = async (req, res) => {
  try {
    const categories = await Product.find({}).sort("-createdAt");
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, categories, price, description, url } = req.body;
    let id = uuidv4();
    let product = await Product.findOne({ ProductId: id });
    while (product) {
      let id = uuidv4();
      product = await Product.findOne({ ProductId: id });
    }
    let smallImg = "",
      largeImg = "",
      mediumImg = "";
    await sharp("img/shoes.jpeg")
      .resize(200, 200)
      .toBuffer()
      .then((data) => {
        let buff = new Buffer(data);
        let base64data = buff.toString("base64");
        smallImg = base64data;
      })
      .catch((err) => {
        console.log("error", err);
      });
    await sharp("img/shoes.jpeg")
      .resize(400, 400)
      .toBuffer()
      .then((data) => {
        let buff = new Buffer(data);
        let base64data = buff.toString("base64");
        largeImg = base64data;
      })
      .catch((err) => {
        console.log("error", err);
      });
    await sharp("img/shoes.jpeg")
      .resize(280, 360)
      .toBuffer()
      .then((data) => {
        let buff = new Buffer(data);
        let base64data = buff.toString("base64");
        mediumImg = base64data;
      })
      .catch((err) => {
        console.log("error", err);
      });
    let newProduct = new Product({
      ProductId: id,
      ProductName: name,
      Categories: categories,
      price,
      description,
      url: [{ smallImg, mediumImg, largeImg }],
    });
    await newProduct.save();
    res.status(200).send("Product Added");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getProductSpecificCategory = async (req, res) => {
  try {
    const { catid } = req.params;
    const products = await Product.find({ Categories: catid });
    if (!products) {
      return res
        .status(404)
        .send("The Product with the provided ID does not exist.");
    }

    res.status(200).json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const products = await Product.findOneAndDelete({
      ProductId: req.params.id,
    });
    if (!products)
      return res
        .status(404)
        .send("The Product with the provided ID does not exist.");
    return res.status(200).send(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
