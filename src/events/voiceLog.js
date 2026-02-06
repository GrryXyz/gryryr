const { AuditLogEvent, EmbedBuilder } = require("discord.js");
const LogChannel = require("../models/LogChannel");

module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState) {
    const guild = newState.guild;
    const data = await LogChannel.findOne({ guildId: guild.id });
    if (!data) return;

    const logCh = guild.channels.cache.get(data.channelId);
    if (!logCh) return;

    if (oldState.channelId && !newState.channelId) {
      const logs = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberDisconnect });
      const log = logs.entries.first();
      if (!log || log.target.id !== oldState.id) return;

      logCh.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Member Disconnected")
            .addFields(
              { name: "User", value: oldState.member.user.tag },
              { name: "By", value: log.executor.tag }
            )
            .setTimestamp()
        ]
      });
    }
  }
};
