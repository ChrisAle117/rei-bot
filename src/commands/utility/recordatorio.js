const { SlashCommandBuilder } = require("discord.js");
const { createReminder } = require("../../services/reminderService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recordatorio")
    .setDescription("Crea un recordatorio")
    .addIntegerOption(option =>
      option.setName("minutos").setDescription("En cuántos minutos").setRequired(true).setMinValue(1)
    )
    .addStringOption(option =>
      option.setName("mensaje").setDescription("Texto del recordatorio").setRequired(true)
    ),

  async execute(interaction) {
    const minutes = interaction.options.getInteger("minutos", true);
    const message = interaction.options.getString("mensaje", true);
    const remindAt = new Date(Date.now() + minutes * 60 * 1000);

    await createReminder(interaction.client, {
      guildId: interaction.guildId,
      channelId: interaction.channelId,
      userId: interaction.user.id,
      message,
      remindAt
    });

    await interaction.reply(`⏰ Listo. Te recordaré esto en ${minutes} minuto(s).`);
  }
};