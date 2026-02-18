const { SlashCommandBuilder } = require("discord.js");
const { askAi } = require("../../services/aiService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ia")
    .setDescription("Haz una pregunta y recibe respuesta de IA")
    .addStringOption(option =>
      option
        .setName("pregunta")
        .setDescription("Tu pregunta")
        .setRequired(true)
    ),

  async execute(interaction) {
    const question = interaction.options.getString("pregunta", true);
    await interaction.deferReply();

    const result = await askAi(question);
    if (!result.ok) {
      await interaction.editReply(`❌ ${result.error}`);
      return;
    }

    const answer = result.content.slice(0, 1900);
    await interaction.editReply(answer);
  }
};