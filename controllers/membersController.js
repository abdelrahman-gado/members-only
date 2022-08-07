const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Message = require("../models/message");
const user = require("../models/user");

exports.sign_up_get = (req, res, next) => {
  res.render("sign-up", {
    isAuth: req.isAuthenticated(),
    errors: undefined,
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
      console.log(req.body.password);
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
  res.render("log-in", { isAuth: req.isAuthenticated(), errs: undefined });
};

exports.log_in_post = [
  body("email", "Email must be specified correctly")
    .isEmail()
    .normalizeEmail()
    .escape(),

  body("password", "Password must be specified correctly").escape(),

  passport.authenticate("local", {
    failureRedirect: "log-in",
    failureMessage: "Incorrect username and passowrd",
  }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("log-in", {
        isAuth: req.isAuthenticated(),
        errs: errors.array(),
      });
      return;
    } else {
      res.redirect("/");
    }
  },
];

exports.log_out_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/");
};

exports.clubhouse_get = (req, res, next) => {
  res.render("clubhouse-form", {
    isAuth: req.isAuthenticated(),
    errs: undefined,
  });
};

exports.clubhouse_post = [
  body("password", "password must be specified correctly").escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("clubhouse-form", {
        isAuth: req.isAuthenticated(),
        errs: errors.array(),
      });
      return;
    } else {
      if (req.body.password === "clubhouse" && req.isAuthenticated()) {
        User.findByIdAndUpdate(
          req.user._id,
          { membership: "clubhoused" },
          (err) => {
            if (err) {
              return next(err);
            }
          }
        );

        res.redirect("/");
      } else {
        res.render("clubhouse-form", {
          isAuth: req.isAuthenticated(),
          errs: [new Error("Incorrct Password")],
        });
        return;
      }
    }
  },
];

exports.admin_get = (req, res, next) => {
  res.render("admin-form", { isAuth: req.isAuthenticated() });
};

exports.admin_post = (req, res, next) => {
  res.send("Not Implemented YET");
};

exports.add_message_get = (req, res, next) => {
  res.render("add-message", { isAuth: req.isAuthenticated(), errs: undefined });
};

exports.add_message_post = [
  body("title")
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "title must be greater than 1 character and not exceed 100 characters"
    )
    .escape(),

  body("text", "message content must be specified")
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("add-message", {
        isAuth: req.isAuthenticated(),
        errs: errors.array(),
      });
      return;
    } else {
      const newMessage = new Message({
        title: req.body.title,
        timestamp: new Date(),
        content: req.body.text,
        user: req.user._id,
      });

      newMessage.save((err) => {
        if (err) {
          return next(err);
        }
      });

      res.redirect("/");
    }
  },
];

exports.about_get = (req, res, next) => {
  res.render("about.ejs", { isAuth: req.isAuthenticated() });
};

exports.delete_message_get = (req, res, next) => {
  res.send("Not Implemented YET");
};
