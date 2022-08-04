const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  timestamp: { type: Date, required: true },
  content: { type: String, required: true },
  User: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

messageSchema.virtual("id").get(function () {
  return "/message/delete/" + this._id;
});

module.exports = mongoose.model("Message", messageSchema);