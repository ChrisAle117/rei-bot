const { getGuildConfig } = require("./guildConfigService");

let intervalId = null;

async function runCycle(client) {
  for (const guild of client.guilds.cache.values()) {
    const config = await getGuildConfig(guild.id);
    const channelId = config.eventChannelId || process.env.EVENT_CHANNEL_ID;
    if (!channelId) continue;

    const channel = await client.channels.fetch(channelId).catch(() => null);
    if (!channel || !channel.isTextBased()) continue;

    await channel.send("🎮 Evento automático: mini-reto activo. Usa /encuesta para votar el próximo desafío.").catch(() => null);
  }
}

function startAutoEvents(client) {
  const hours = Number(process.env.AUTO_EVENT_INTERVAL_HOURS || 24);
  const intervalMs = Math.max(1, hours) * 60 * 60 * 1000;

  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    runCycle(client).catch(error => console.error("Error en eventos automáticos:", error));
  }, intervalMs);
}

module.exports = { startAutoEvents };