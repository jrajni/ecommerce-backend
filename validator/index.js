const { check, validationResult } = require("express-validator");

exports.userSignupValidator = (req, res, next) => {
  // req.check("firstname", "firstname is required").notEmpty();
  // req.check("lastname", "lastname is required").notEmpty();
  req
    .check("email", "Email must be between 3 to 32 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
      min: 4,
      max: 32,
    });

  req.check("password", "Password is required").notEmpty();

  req
    .check("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number");
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};

exports.SigninValidator = (req, res, next) => {
  req.check("email", "Please include a valid Email").notEmpty();
  req.check("password", "Password is required").notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};

exports.UserPasswordValidator = (req, res, next) => {
  req.check("password", "Password is Required").not().isEmpty(),
    req.check("newpassword", "Newpassword is Required").not().isEmpty();

  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
