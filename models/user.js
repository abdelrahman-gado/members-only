const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: { type: String, required: true, maxLength: 100 },
  lastname: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, maxLength: 100 },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  membership: { type: Boolean, required: true },
});

userSchema.virtual("fullname").get(function () {
  return this.firstname + " " + this.lastname;
});

module.exports = mongoose.model("User", userSchema);
