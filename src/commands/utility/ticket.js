const { ChannelType, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { getGuildConfig } = require("../../services/guildConfigService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Abre un ticket privado de soporte"),

  async execute(interaction) {
    const config = await getGuildConfig(interaction.guildId);
    const channelName = `ticket-${interaction.user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 28);

    const channel = await interaction.guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: config.ticketCategoryId || undefined,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
        },
        {
          id: interaction.client.user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels]
        }
      ]
    });

    await channel.send(`🎫 Ticket creado por <@${interaction.user.id}>.`);
    await interaction.reply({ content: `Ticket creado: ${channel}`, ephemeral: true });
  }
};