const { Schema, model } = require("mongoose");

const inventoryItemSchema = new Schema(
  {
    itemId: { type: String, required: true },
    quantity: { type: Number, default: 0, min: 0 }
  },
  { _id: false }
);

const economyProfileSchema = new Schema(
  {
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    balance: { type: Number, default: 0, min: 0 },
    inventory: { type: [inventoryItemSchema], default: [] },
    lastDailyAt: { type: Date, default: null },
    lastWorkAt: { type: Date, default: null }
  },
  { timestamps: true }
);

economyProfileSchema.index({ guildId: 1, userId: 1 }, { unique: true });

module.exports = model("EconomyProfile", economyProfileSchema);