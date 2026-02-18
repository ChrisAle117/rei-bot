const { SlashCommandBuilder } = require("discord.js");
const { WORK_COOLDOWN_MS, work } = require("../../services/economyService");

function formatRemaining(ms) {
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return `${hours}h ${minutes}m`;
}

module.exports = {
  data: new SlashCommandBuilder().setName("work").setDescription("Trabaja para ganar monedas"),

  async execute(interaction) {
    const result = await work(interaction.guildId, interaction.user.id);

    if (!result.ok) {
      await interaction.reply(`⏳ Aún estás en cooldown. Te faltan ${formatRemaining(result.remaining)}.`);
      return;
    }

    await interaction.reply(`🛠️ Trabajaste y ganaste **${result.amount}** monedas. Cooldown: ${Math.floor(WORK_COOLDOWN_MS / 3600000)}h.`);
  }
};