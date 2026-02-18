const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { sendLog } = require("../../services/logService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Borra mensajes del canal")
    .addIntegerOption(option =>
      option
        .setName("cantidad")
        .setDescription("Cantidad entre 1 y 100")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageMessages)) {
      await interaction.reply({ content: "No tienes permisos para usar este comando.", ephemeral: true });
      return;
    }

    const amount = interaction.options.getInteger("cantidad", true);
    const deleted = await interaction.channel.bulkDelete(amount, true);

    await interaction.reply({
      content: `🧹 Se eliminaron ${deleted.size} mensajes.`,
      ephemeral: true
    });

    await sendLog(interaction.client, interaction.guildId, {
      title: "Moderación: Clear",
      description: `Limpieza de mensajes ejecutada en #${interaction.channel.name}`,
      fields: [{ name: "Cantidad", value: String(deleted.size), inline: true }]
    });
  }
};