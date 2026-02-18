const { ChannelType, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { updateGuildConfig } = require("../../services/guildConfigService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setlogs")
    .setDescription("Configura el canal de logs")
    .addChannelOption(option =>
      option
        .setName("canal")
        .setDescription("Canal de logs")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const channel = interaction.options.getChannel("canal", true);
    await updateGuildConfig(interaction.guildId, { logChannelId: channel.id });
    await interaction.reply(`✅ Canal de logs configurado en ${channel}.`);
  }
};