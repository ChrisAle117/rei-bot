const { SlashCommandBuilder } = require("discord.js");
const { getLevelProgress, getOrCreateProfile } = require("../../services/levelSystem");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nivel")
    .setDescription("Muestra tu nivel y progreso de XP"),

  async execute(interaction) {
    if (!interaction.guildId) {
      await interaction.reply({
        content: "Este comando solo funciona dentro de servidores.",
        ephemeral: true
      });
      return;
    }

    const profile = await getOrCreateProfile(interaction.guildId, interaction.user.id);
    const progress = getLevelProgress(profile.xp, profile.level);

    await interaction.reply(
      `📊 Nivel **${profile.level}**\n` +
      `XP total: **${profile.xp}**\n` +
      `Progreso actual: **${progress.xpIntoLevel}/${progress.xpForLevel}** (${progress.progressPercent}%)`
    );
  }
};