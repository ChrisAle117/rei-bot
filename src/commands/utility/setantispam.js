const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { updateGuildConfig } = require("../../services/guildConfigService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setantispam")
    .setDescription("Configura anti-spam automático")
    .addIntegerOption(option =>
      option.setName("mensajes").setDescription("Cantidad de mensajes para activar").setRequired(true).setMinValue(3)
    )
    .addIntegerOption(option =>
      option.setName("ventana_segundos").setDescription("Ventana de tiempo en segundos").setRequired(true).setMinValue(3)
    )
    .addIntegerOption(option =>
      option.setName("timeout_segundos").setDescription("Tiempo de timeout en segundos").setRequired(true).setMinValue(0)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const threshold = interaction.options.getInteger("mensajes", true);
    const windowSeconds = interaction.options.getInteger("ventana_segundos", true);
    const timeoutSeconds = interaction.options.getInteger("timeout_segundos", true);

    await updateGuildConfig(interaction.guildId, {
      spamThreshold: threshold,
      spamWindowMs: windowSeconds * 1000,
      spamTimeoutMs: timeoutSeconds * 1000
    });

    await interaction.reply("✅ Anti-spam actualizado.");
  }
};