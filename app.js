const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo");
const bycrpt = require("bcryptjs");

require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

app.listen(PORT);
