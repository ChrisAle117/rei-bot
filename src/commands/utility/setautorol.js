const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { updateGuildConfig } = require("../../services/guildConfigService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setautorol")
    .setDescription("Configura el rol automático al entrar")
    .addRoleOption(option =>
      option.setName("rol").setDescription("Rol a asignar automáticamente").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const role = interaction.options.getRole("rol", true);
    await updateGuildConfig(interaction.guildId, { autoRoleId: role.id });
    await interaction.reply(`✅ Rol automático configurado: ${role}.`);
  }
};