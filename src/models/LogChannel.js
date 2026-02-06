const { Schema, model } = require("mongoose");

module.exports = model("LogChannel", new Schema({
  guildId: { type: String, unique: true },
  channelId: String
}));
