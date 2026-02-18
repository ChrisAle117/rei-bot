const { SlashCommandBuilder } = require("discord.js");
const { getOrCreateProfile } = require("../../services/economyService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Muestra tu balance de monedas")
    .addUserOption(option =>
      option.setName("usuario").setDescription("Usuario a consultar").setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario") || interaction.user;
    const profile = await getOrCreateProfile(interaction.guildId, user.id);

    await interaction.reply(`💰 ${user.username} tiene **${profile.balance}** monedas.`);
  }
};