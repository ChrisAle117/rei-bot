const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Muestra información de un usuario")
    .addUserOption(option =>
      option.setName("usuario").setDescription("Usuario a consultar").setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    const createdAt = Math.floor(user.createdTimestamp / 1000);
    const joinedAt = member?.joinedTimestamp ? Math.floor(member.joinedTimestamp / 1000) : null;

    await interaction.reply(
      `👤 **${user.tag}**\n` +
      `ID: ${user.id}\n` +
      `Cuenta creada: <t:${createdAt}:R>\n` +
      `${joinedAt ? `Entró al servidor: <t:${joinedAt}:R>\n` : ""}` +
      `Bot: ${user.bot ? "Sí" : "No"}`
    );
  }
};