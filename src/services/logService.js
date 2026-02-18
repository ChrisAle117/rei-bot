const { EmbedBuilder } = require("discord.js");
const { getGuildConfig } = require("./guildConfigService");

async function sendLog(client, guildId, payload) {
  try {
    const config = await getGuildConfig(guildId);
    const fallbackLogId = process.env.LOG_CHANNEL_ID || null;
    const logChannelId = config.logChannelId || fallbackLogId;
    if (!logChannelId) return;

    const channel = await client.channels.fetch(logChannelId).catch(() => null);
    if (!channel || !channel.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTimestamp()
      .setTitle(payload.title || "Log")
      .setDescription(payload.description || "Sin detalles");

    if (payload.fields?.length) {
      embed.addFields(payload.fields);
    }

    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error("Error enviando log:", error);
  }
}

module.exports = { sendLog };