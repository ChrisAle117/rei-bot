const { SlashCommandBuilder } = require("discord.js");
const { getBalanceRanking } = require("../../services/economyService");
const UserLevel = require("../../models/UserLevel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ranking")
    .setDescription("Muestra rankings del servidor")
    .addStringOption(option =>
      option
        .setName("tipo")
        .setDescription("Tipo de ranking")
        .setRequired(true)
        .addChoices(
          { name: "Economía", value: "economia" },
          { name: "Niveles", value: "niveles" }
        )
    ),

  async execute(interaction) {
    const type = interaction.options.getString("tipo", true);

    if (type === "economia") {
      const ranking = await getBalanceRanking(interaction.guildId, 10);
      const lines = await Promise.all(
        ranking.map(async (profile, index) => {
          const user = await interaction.client.users.fetch(profile.userId).catch(() => null);
          return `${index + 1}. ${user ? user.username : profile.userId} — ${profile.balance} monedas`;
        })
      );

      await interaction.reply(`🏦 **Ranking Economía**\n${lines.join("\n") || "Sin datos"}`);
      return;
    }

    const ranking = await UserLevel.find({ guildId: interaction.guildId }).sort({ level: -1, xp: -1 }).limit(10);
    const lines = await Promise.all(
      ranking.map(async (profile, index) => {
        const user = await interaction.client.users.fetch(profile.userId).catch(() => null);
        return `${index + 1}. ${user ? user.username : profile.userId} — nivel ${profile.level} (${profile.xp} XP)`;
      })
    );

    await interaction.reply(`📈 **Ranking Niveles**\n${lines.join("\n") || "Sin datos"}`);
  }
};