const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const LogChannel = require("../models/LogChannel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setlog")
    .setDescription("Set channel audit log")
    .addChannelOption(o =>
      o.setName("channel").setDescription("Channel log").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    await LogChannel.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { channelId: channel.id },
      { upsert: true }
    );
    interaction.reply({ content: `Audit log set to ${channel}`, ephemeral: true });
  }
};
