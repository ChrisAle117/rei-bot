const { getGuildConfig } = require("./guildConfigService");

async function fetchExternalData(guildId) {
  const config = await getGuildConfig(guildId);
  const url = config.externalApiUrl || process.env.EXTERNAL_API_URL;
  if (!url) {
    return { ok: false, error: "No hay URL externa configurada" };
  }

  const response = await fetch(url);
  if (!response.ok) {
    return { ok: false, error: `Error HTTP ${response.status}` };
  }

  const data = await response.json();
  return { ok: true, data };
}

module.exports = { fetchExternalData };