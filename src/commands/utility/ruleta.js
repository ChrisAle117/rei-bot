const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ruleta")
    .setDescription("Elige una opción al azar")
    .addStringOption(option =>
      option
        .setName("opciones")
        .setDescription("Opciones separadas por coma")
        .setRequired(true)
    ),

  async execute(interaction) {
    const raw = interaction.options.getString("opciones", true);
    const options = raw
      .split(",")
      .map(value => value.trim())
      .filter(Boolean);

    if (options.length < 2) {
      await interaction.reply({
        content: "Debes enviar al menos 2 opciones separadas por coma.",
        ephemeral: true
      });
      return;
    }

    const winner = options[Math.floor(Math.random() * options.length)];
    await interaction.reply(`🎡 Resultado: **${winner}**`);
  }
};