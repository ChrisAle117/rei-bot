const { Schema, model } = require("mongoose");

const shopItemSchema = new Schema(
  {
    guildId: { type: String, required: true, index: true },
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 1 },
    stock: { type: Number, default: -1 }
  },
  { timestamps: true }
);

shopItemSchema.index({ guildId: 1, itemId: 1 }, { unique: true });

module.exports = model("ShopItem", shopItemSchema);