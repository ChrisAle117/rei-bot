const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const GameStat = require("../../models/GameStat");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setgamestats")
    .setDescription("Actualiza estadísticas de juego")
    .addUserOption(option =>
      option.setName("usuario").setDescription("Usuario objetivo").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("juego").setDescription("Nombre del juego").setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("partidas").setDescription("Partidas totales").setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("wins").setDescription("Victorias").setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("losses").setDescription("Derrotas").setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("score").setDescription("Puntaje").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario", true);
    const game = interaction.options.getString("juego", true).toLowerCase();
    const matches = interaction.options.getInteger("partidas", true);
    const wins = interaction.options.getInteger("wins", true);
    const losses = interaction.options.getInteger("losses", true);
    const score = interaction.options.getInteger("score", true);

    const stats = await GameStat.findOneAndUpdate(
      { guildId: interaction.guildId, userId: user.id, game },
      { matches, wins, losses, score },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await interaction.reply(
      `✅ Stats guardadas para ${user.username} en ${game}: ${stats.matches} partidas, ${stats.wins}W/${stats.losses}L, score ${stats.score}.`
    );
  }
};