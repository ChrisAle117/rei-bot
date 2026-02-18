const { SlashCommandBuilder } = require("discord.js");
const GameStat = require("../../models/GameStat");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gamestats")
    .setDescription("Consulta estadísticas de juego")
    .addStringOption(option =>
      option.setName("juego").setDescription("Nombre del juego").setRequired(true)
    )
    .addUserOption(option =>
      option.setName("usuario").setDescription("Usuario a consultar").setRequired(false)
    ),

  async execute(interaction) {
    const game = interaction.options.getString("juego", true).toLowerCase();
    const user = interaction.options.getUser("usuario") || interaction.user;

    const stats = await GameStat.findOne({ guildId: interaction.guildId, userId: user.id, game });
    if (!stats) {
      await interaction.reply(`No hay estadísticas de **${game}** para ${user}.`);
      return;
    }

    await interaction.reply(
      `🎮 ${user.username} en **${game}**\nPartidas: ${stats.matches}\nWins: ${stats.wins}\nLosses: ${stats.losses}\nScore: ${stats.score}`
    );
  }
};