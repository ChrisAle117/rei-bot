const { getGuildConfig } = require("../services/guildConfigService");
const { sendLog } = require("../services/logService");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const config = await getGuildConfig(member.guild.id);
    if (!config.autoRoleId) return;

    const role = member.guild.roles.cache.get(config.autoRoleId);
    if (!role) return;

    await member.roles.add(role).catch(() => null);

    await sendLog(member.client, member.guild.id, {
      title: "Auto-rol",
      description: "Rol automático asignado a nuevo miembro",
      fields: [
        { name: "Usuario", value: `${member.user.tag}` },
        { name: "Rol", value: `${role.name}` }
      ]
    });
  }
};