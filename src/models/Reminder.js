const { Schema, model } = require("mongoose");

const reminderSchema = new Schema(
  {
    guildId: { type: String, default: null },
    channelId: { type: String, required: true },
    userId: { type: String, required: true },
    message: { type: String, required: true },
    remindAt: { type: Date, required: true, index: true },
    sent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = model("Reminder", reminderSchema);