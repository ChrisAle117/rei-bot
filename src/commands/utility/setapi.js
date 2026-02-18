const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { updateGuildConfig } = require("../../services/guildConfigService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setapi")
    .setDescription("Configura URL de API externa")
    .addStringOption(option =>
      option.setName("url").setDescription("URL completa de la API").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const url = interaction.options.getString("url", true);
    await updateGuildConfig(interaction.guildId, { externalApiUrl: url });
    await interaction.reply("✅ API externa configurada.");
  }
};