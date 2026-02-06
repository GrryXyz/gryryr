const { Schema, model } = require("mongo");

module.exports = model("LogChannel", new Schema({
  guildId: { type: String, unique: true },
  channelId: String
}));
