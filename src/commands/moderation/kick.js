const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { sendLog } = require("../../services/logService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulsa a un usuario")
    .addUserOption(option =>
      option.setName("usuario").setDescription("Usuario a expulsar").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("razon").setDescription("Razón del kick").setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.KickMembers)) {
      await interaction.reply({ content: "No tienes permisos para usar este comando.", ephemeral: true });
      return;
    }

    const user = interaction.options.getUser("usuario", true);
    const reason = interaction.options.getString("razon") || "Sin razón";
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      await interaction.reply({ content: "No encontré a ese usuario en el servidor.", ephemeral: true });
      return;
    }

    if (!member.kickable) {
      await interaction.reply({ content: "No puedo expulsar a ese usuario.", ephemeral: true });
      return;
    }

    await member.kick(reason);
    await interaction.reply(`👢 ${user.tag} fue expulsado. Razón: ${reason}`);

    await sendLog(interaction.client, interaction.guildId, {
      title: "Moderación: Kick",
      description: `${user.tag} fue expulsado`,
      fields: [{ name: "Razón", value: reason }]
    });
  }
};