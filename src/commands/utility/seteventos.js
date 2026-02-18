const { ChannelType, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { updateGuildConfig } = require("../../services/guildConfigService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("seteventos")
    .setDescription("Configura el canal para eventos automáticos")
    .addChannelOption(option =>
      option
        .setName("canal")
        .setDescription("Canal objetivo")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const channel = interaction.options.getChannel("canal", true);
    await updateGuildConfig(interaction.guildId, { eventChannelId: channel.id });
    await interaction.reply(`✅ Canal de eventos automáticos: ${channel}.`);
  }
};