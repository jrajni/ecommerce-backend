const Category = require("../models/Category");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort("-createdAt");
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let id = uuidv4();
    let category = await Category.findOne({ CategoryId: id });
    while (category) {
      let id = uuidv4();
      category = await Category.findOne({ CategoryId: id });
    }
    let newCategory = new Category({
      CategoryId: id,
      CategoryName: name,
    });
    await newCategory.save();
    res.status(200).send("Category Added");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getSpecificCategory = async (req, res) => {
  try {
    const categories = await Category.findOne({
      CategoryId: req.params.id,
    });
    if (!categories) {
      return res
        .status(404)
        .send("The categories with the provided ID does not exist.");
    }
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categories = await Category.findOneAndDelete({
      CategoryId: req.params.id,
    });
    if (!categories)
      return res
        .status(404)
        .send("The Categories with the provided ID does not exist.");
    return res.status(200).send(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
