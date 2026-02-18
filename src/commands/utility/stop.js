const { SlashCommandBuilder } = require("discord.js");
const { stopMusic } = require("../../services/musicService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Detiene la música y limpia cola"),

  async execute(interaction) {
    stopMusic(interaction.guildId);
    await interaction.reply("⏹️ Música detenida y cola limpiada.");
  }
};