const { ChannelType, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { updateGuildConfig } = require("../../services/guildConfigService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setticketcat")
    .setDescription("Configura la categoría de tickets")
    .addChannelOption(option =>
      option
        .setName("categoria")
        .setDescription("Categoría de Discord")
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const category = interaction.options.getChannel("categoria", true);
    await updateGuildConfig(interaction.guildId, { ticketCategoryId: category.id });
    await interaction.reply(`✅ Categoría de tickets configurada: ${category.name}.`);
  }
};