const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.sign_up_get = (req, res, next) => {
  res.render("sign-up", {
    isAuth: req.isAuthenticated(),
    errors: undefined
  });
};

exports.sign_up_post = [
  // Validate and sanitize fields.
  body("firstname", "First name must be specified correctly")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("lastname", "Last name must be specified correctly")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("email", "Email must be specified correctly")
    .isEmail()
    .normalizeEmail()
    .escape()
    .custom((value) => {
      return User.find({ email: value }).then((users) => {
        if (users.length > 0) {
          return Promise.reject("Email already in use");
        }
      });
    }),

  body("password")
    .isStrongPassword({ minLength: 6, minUppercase: 1, minSymbols: 1 })
    .withMessage(
      "Password must be at least 6 characters and contains at least one uppercase letter and one symbol"
    )
    .escape(),

  body("confirmPassword")
    .custom((value, { req, loc, path }) => {
      console.log(value);
      console.log(req.body.password)
      if (value !== req.body.password) {
        throw new Error("Password doesn't match");
      } else {
        return value;
      }
    })
    .escape(),

  // Process request after validation and sanitization.
  function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with errors shown.
      res.render("sign-up", {
        isAuth: req.isAuthenticated(),
        errs: errors.array(),
      });
      return;
    } else {
      // Data from the form is valid, save new user.
      bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          return next(err);
        }

        bcrypt.hash(req.body.password, salt, function (err, hash) {
          if (err) {
            return next(err);
          }

          const newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hash,
            salt: salt,
            membership: "normal",
          });

          newUser.save((err) => {
            if (err) {
              return next(err);
            }
          });

          res.redirect("/");
        });
      });
    }
  },
];

exports.log_in_get = (req, res, next) => {
  res.render("log-in");
};

exports.log_in_post = (req, res, next) => {
  res.send("Not Implemented YET");
};

exports.log_out_get = (req, res, next) => {
  res.send("Not Implemented YET");
};

exports.clubhouse_get = (req, res, next) => {
  res.render("clubhouse-form");
};

exports.clubhouse_post = (req, res, next) => {
  res.send("Not Implemented YET");
};

exports.admin_get = (req, res, next) => {
  res.render("admin-form");
};

exports.admin_post = (req, res, next) => {
  res.send("Not Implemented YET");
};

exports.add_message_get = (req, res, next) => {
  res.render("add-message");
};

exports.add_message_post = (req, res, next) => {
  res.send("Not Implemneted YET");
};

exports.about_get = (req, res, next) => {
  res.render("about.ejs");
};

exports.delete_message_get = (req, res, next) => {
  res.send("Not Implemented YET");
};
