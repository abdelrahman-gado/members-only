const mongoose = require("mongoose");
const { format } = require("date-fns");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  timestamp: { type: Date, required: true },
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

messageSchema.virtual("id").get(function () {
  return this._id;
});

messageSchema.virtual("formattedTimestamp").get(function () {
  return format(this.timestamp, "dd/MM/yyyy -- hh:mm aaa");
});

module.exports = mongoose.model("Message", messageSchema);