const { sendLog } = require("../services/logService");

module.exports = {
  name: "messageDelete",
  async execute(message) {
    if (!message.guild || !message.author || message.author.bot) return;

    await sendLog(message.client, message.guild.id, {
      title: "Log: Mensaje eliminado",
      description: `Se eliminó un mensaje en #${message.channel?.name || "desconocido"}`,
      fields: [
        { name: "Usuario", value: `${message.author.tag} (${message.author.id})` },
        { name: "Contenido", value: message.content?.slice(0, 1000) || "(sin contenido cacheado)" }
      ]
    });
  }
};