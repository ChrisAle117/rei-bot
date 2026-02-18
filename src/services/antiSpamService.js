const { getGuildConfig } = require("./guildConfigService");
const { sendLog } = require("./logService");

const messageCache = new Map();

async function checkAntiSpam(message) {
  if (!message.guild || !message.member || message.member.user.bot) return;

  const config = await getGuildConfig(message.guild.id);
  const key = `${message.guild.id}:${message.author.id}`;
  const now = Date.now();

  const history = messageCache.get(key) || [];
  const filtered = history.filter(timestamp => now - timestamp <= config.spamWindowMs);
  filtered.push(now);
  messageCache.set(key, filtered);

  if (filtered.length < config.spamThreshold) return;

  messageCache.set(key, []);

  const timeoutMs = config.spamTimeoutMs;
  if (timeoutMs > 0 && message.member.moderatable) {
    await message.member.timeout(timeoutMs, "Anti-spam automático").catch(() => null);
  }

  await message.channel.send(
    `⚠️ ${message.author}, has sido detectado por spam y se aplicó una sanción automática.`
  ).catch(() => null);

  await sendLog(message.client, message.guild.id, {
    title: "Anti-spam",
    description: "Sanción automática aplicada",
    fields: [
      { name: "Usuario", value: `${message.author.tag} (${message.author.id})` },
      { name: "Mensajes", value: String(config.spamThreshold), inline: true },
      { name: "Ventana", value: `${Math.floor(config.spamWindowMs / 1000)}s`, inline: true },
      { name: "Timeout", value: `${Math.floor(timeoutMs / 1000)}s`, inline: true }
    ]
  });
}

module.exports = { checkAntiSpam };