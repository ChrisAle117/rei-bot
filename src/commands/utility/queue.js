const { SlashCommandBuilder } = require("discord.js");
const { getQueueSnapshot } = require("../../services/musicService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Muestra la cola de música"),

  async execute(interaction) {
    const snapshot = getQueueSnapshot(interaction.guildId);

    if (!snapshot.current && snapshot.queue.length === 0) {
      await interaction.reply("📭 No hay música en reproducción ni en cola.");
      return;
    }

    const lines = [];

    if (snapshot.current) {
      lines.push(`🎵 Reproduciendo: **${snapshot.current.title}**`);
    }

    if (snapshot.queue.length > 0) {
      const upcoming = snapshot.queue
        .slice(0, 10)
        .map((track, index) => `${index + 1}. ${track.title}`)
        .join("\n");

      lines.push(`\n📜 Próximas:\n${upcoming}`);
    }

    await interaction.reply(lines.join("\n"));
  }
};