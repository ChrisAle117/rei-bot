const { SlashCommandBuilder } = require("discord.js");
const { DAILY_COOLDOWN_MS, claimDaily } = require("../../services/economyService");

function formatRemaining(ms) {
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return `${hours}h ${minutes}m`;
}

module.exports = {
  data: new SlashCommandBuilder().setName("daily").setDescription("Reclama recompensa diaria"),

  async execute(interaction) {
    const result = await claimDaily(interaction.guildId, interaction.user.id);

    if (!result.ok) {
      await interaction.reply(`⏳ Ya reclamaste hoy. Te faltan ${formatRemaining(result.remaining)}.`);
      return;
    }

    await interaction.reply(`🎁 Reclamaste **${result.amount}** monedas. Cooldown: ${Math.floor(DAILY_COOLDOWN_MS / 3600000)}h.`);
  }
};