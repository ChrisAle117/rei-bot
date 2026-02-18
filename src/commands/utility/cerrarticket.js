const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cerrarticket")
    .setDescription("Cierra el ticket actual")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    if (!interaction.channel.name.startsWith("ticket-")) {
      await interaction.reply({ content: "Este comando solo se usa en canales de ticket.", ephemeral: true });
      return;
    }

    await interaction.reply("🔒 Ticket cerrado en 5 segundos.");
    setTimeout(() => {
      interaction.channel.delete("Ticket cerrado").catch(() => null);
    }, 5000);
  }
};