const { SlashCommandBuilder } = require("discord.js");
const { buyItem } = require("../../services/economyService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("comprar")
    .setDescription("Compra un ítem de la tienda")
    .addStringOption(option =>
      option.setName("item").setDescription("ID del item").setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("cantidad").setDescription("Cantidad").setRequired(false).setMinValue(1)
    ),

  async execute(interaction) {
    const itemId = interaction.options.getString("item", true);
    const quantity = interaction.options.getInteger("cantidad") || 1;

    const result = await buyItem(interaction.guildId, interaction.user.id, itemId, quantity);
    if (!result.ok) {
      await interaction.reply({ content: `❌ ${result.error}`, ephemeral: true });
      return;
    }

    await interaction.reply(
      `✅ Compraste ${result.quantity} x ${result.item.name} por ${result.totalCost} monedas. Balance actual: ${result.profile.balance}.`
    );
  }
};