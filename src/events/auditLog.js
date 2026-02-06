const { AuditLogEvent, EmbedBuilder } = require("discord.js");
const LogChannel = require("../models/LogChannel");

module.exports = {
  name: "guildAuditLogEntryCreate",
  async execute(entry, guild) {
    if (!guild || !entry.executor || entry.executor.bot) return;
    const data = await LogChannel.findOne({ guildId: guild.id });
    if (!data) return;

    const logCh = guild.channels.cache.get(data.channelId);
    if (!logCh) return;

    const { action, executor, target, reason, changes } = entry;
    let e;

    if (action === AuditLogEvent.MemberKick) {
      e = new EmbedBuilder().setTitle("Member Kicked").addFields(
        { name: "User", value: target.tag },
        { name: "By", value: executor.tag },
        { name: "Reason", value: reason || "-" }
      );
    }

    if (!e) return;
    logCh.send({ embeds: [e.setTimestamp()] });
  }
};
