const { SlashCommandBuilder } = require("discord.js");
const { fetchExternalData } = require("../../services/externalApiService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("api")
    .setDescription("Consulta datos de API externa configurada"),

  async execute(interaction) {
    const result = await fetchExternalData(interaction.guildId);
    if (!result.ok) {
      await interaction.reply({ content: `❌ ${result.error}`, ephemeral: true });
      return;
    }

    const preview = JSON.stringify(result.data, null, 2).slice(0, 1800);
    await interaction.reply(`🌐 Respuesta API:\n\n\
${preview}`);
  }
};