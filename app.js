const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo");
const bycrpt = require("bcryptjs");
const path = require("path");

require("dotenv").config();

const PORT = process.env.PORT;
const DB_STRING = process.env.DB_STRING;

const app = express();

// Set View
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(PORT);
