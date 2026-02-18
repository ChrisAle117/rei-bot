const { Schema, model } = require("mongoose");

const gameStatSchema = new Schema(
  {
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    game: { type: String, required: true },
    matches: { type: Number, default: 0, min: 0 },
    wins: { type: Number, default: 0, min: 0 },
    losses: { type: Number, default: 0, min: 0 },
    score: { type: Number, default: 0 }
  },
  { timestamps: true }
);

gameStatSchema.index({ guildId: 1, userId: 1, game: 1 }, { unique: true });

module.exports = model("GameStat", gameStatSchema);