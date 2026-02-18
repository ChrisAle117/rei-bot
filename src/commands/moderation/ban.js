const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { sendLog } = require("../../services/logService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banea a un usuario")
    .addUserOption(option =>
      option.setName("usuario").setDescription("Usuario a banear").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("razon").setDescription("Razón del ban").setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.BanMembers)) {
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

    if (!member.bannable) {
      await interaction.reply({ content: "No puedo banear a ese usuario.", ephemeral: true });
      return;
    }

    await member.ban({ reason });
    await interaction.reply(`🔨 ${user.tag} fue baneado. Razón: ${reason}`);

    await sendLog(interaction.client, interaction.guildId, {
      title: "Moderación: Ban",
      description: `${user.tag} fue baneado`,
      fields: [{ name: "Razón", value: reason }]
    });
  }
};