const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo");
const bycrpt = require("bcryptjs");
const path = require("path");
const membersRouter = require("./routes/membersRouter");
const User = require("./models/user");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const PORT = process.env.PORT;
const DB_STRING = process.env.DB_STRING;
const SECRET = process.env.SECRET;

const app = express();

// Set View
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// DB connection
mongoose.connect(DB_STRING, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const connection = mongoose.connection;
connection.on("error", console.log.bind(console, "mongo connection error"));

// Session Store
const sessionStore = MongoStore.create({
  mongoUrl: DB_STRING,
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // two weeks
    },
  })
);

passport.use(
  new LocalStrategy(
    { username: "email", password: "password" },
    (email, password, cb) => {
      User.find({ email: email }, (err, user) => {
        if (err) {
          return cb(err);
        }

        if (!user) {
          return cb(null, false, { message: "Incorrect username" });
        }

        bcrypt.compare(password, user.password, (err, res) => {
          if (err) {
            return cb(err);
          }

          if (res) {
            return cb(null, user);
          } else {
            return cb(null, false, { message: "Incorrect password" });
          }
        });
      });
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res, next) => {
  res.render("index", { isAuth: req.isAuthenticated() });
});

app.use(membersRouter);

app.listen(PORT);
