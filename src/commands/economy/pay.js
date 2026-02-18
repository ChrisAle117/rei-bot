const { SlashCommandBuilder } = require("discord.js");
const { pay } = require("../../services/economyService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Envía monedas a otro usuario")
    .addUserOption(option =>
      option.setName("usuario").setDescription("Destino").setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("cantidad").setDescription("Cantidad a enviar").setRequired(true).setMinValue(1)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario", true);
    const amount = interaction.options.getInteger("cantidad", true);

    if (user.bot || user.id === interaction.user.id) {
      await interaction.reply({ content: "Destino inválido.", ephemeral: true });
      return;
    }

    const result = await pay(interaction.guildId, interaction.user.id, user.id, amount);
    if (!result.ok) {
      await interaction.reply({ content: `❌ ${result.error}`, ephemeral: true });
      return;
    }

    await interaction.reply(`💸 Transferiste **${amount}** monedas a ${user}.`);
  }
};