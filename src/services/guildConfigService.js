const GuildConfig = require("../models/GuildConfig");

async function getGuildConfig(guildId) {
  let config = await GuildConfig.findOne({ guildId });
  if (!config) {
    config = await GuildConfig.create({ guildId });
  }
  return config;
}

async function updateGuildConfig(guildId, updates) {
  const config = await getGuildConfig(guildId);
  Object.assign(config, updates);
  await config.save();
  return config;
}

module.exports = {
  getGuildConfig,
  updateGuildConfig
};