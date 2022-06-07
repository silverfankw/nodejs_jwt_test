const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {type: String, default: null},
  email: {type: String, default: null, unique: true},
  password: {type: String},
  token: {type: String}
}, {versionKey: false})

module.exports = mongoose.model("user", userSchema);