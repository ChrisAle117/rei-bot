const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Muestra el avatar de un usuario")
    .addUserOption(option =>
      option.setName("usuario").setDescription("Usuario objetivo").setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario") || interaction.user;
    const avatarUrl = user.displayAvatarURL({ size: 1024, extension: "png" });

    await interaction.reply(`🖼️ Avatar de **${user.tag}**: ${avatarUrl}`);
  }
};