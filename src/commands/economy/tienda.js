const { SlashCommandBuilder } = require("discord.js");
const { listShop } = require("../../services/economyService");

module.exports = {
  data: new SlashCommandBuilder().setName("tienda").setDescription("Muestra la tienda del servidor"),

  async execute(interaction) {
    const items = await listShop(interaction.guildId);
    if (!items.length) {
      await interaction.reply("La tienda está vacía.");
      return;
    }

    const body = items
      .map(item => `• **${item.itemId}** | ${item.name} | ${item.price} monedas | stock: ${item.stock === -1 ? "∞" : item.stock}`)
      .join("\n");

    await interaction.reply(`🛒 **Tienda**\n${body}`);
  }
};