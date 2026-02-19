const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Muestra información del servidor"),

  async execute(interaction) {
    const guild = interaction.guild;
    await guild.fetch();

    const createdAt = Math.floor(guild.createdTimestamp / 1000);
    const textChannels = guild.channels.cache.filter(channel => channel.isTextBased()).size;
    const voiceChannels = guild.channels.cache.filter(channel => channel.isVoiceBased()).size;

    await interaction.reply(
      `🏠 **${guild.name}**\n` +
      `ID: ${guild.id}\n` +
      `Miembros: ${guild.memberCount}\n` +
      `Canales texto: ${textChannels}\n` +
      `Canales voz: ${voiceChannels}\n` +
      `Creado: <t:${createdAt}:R>`
    );
  }
};