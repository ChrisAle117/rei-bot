const { SlashCommandBuilder } = require("discord.js");
const { skipTrack } = require("../../services/musicService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Salta la canción actual"),

  async execute(interaction) {
    const result = skipTrack(interaction.guildId);
    if (!result.ok) {
      await interaction.reply({ content: `❌ ${result.error}`, ephemeral: true });
      return;
    }

    await interaction.reply("⏭️ Canción saltada.");
  }
};