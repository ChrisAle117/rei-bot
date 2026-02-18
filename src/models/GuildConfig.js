const { Schema, model } = require("mongoose");

const guildConfigSchema = new Schema(
  {
    guildId: { type: String, required: true, unique: true },
    logChannelId: { type: String, default: null },
    autoRoleId: { type: String, default: null },
    ticketCategoryId: { type: String, default: null },
    eventChannelId: { type: String, default: null },
    spamThreshold: { type: Number, default: 6 },
    spamWindowMs: { type: Number, default: 10000 },
    spamTimeoutMs: { type: Number, default: 300000 },
    externalApiUrl: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = model("GuildConfig", guildConfigSchema);