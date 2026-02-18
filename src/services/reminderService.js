const Reminder = require("../models/Reminder");

const scheduled = new Map();

async function sendReminder(client, reminder) {
  const channel = await client.channels.fetch(reminder.channelId).catch(() => null);
  if (!channel || !channel.isTextBased()) return;

  await channel.send(`⏰ <@${reminder.userId}> recordatorio: ${reminder.message}`);
  reminder.sent = true;
  await reminder.save();
}

function scheduleReminder(client, reminder) {
  const delay = Math.max(0, reminder.remindAt.getTime() - Date.now());
  const timeout = setTimeout(async () => {
    await sendReminder(client, reminder).catch(() => null);
    scheduled.delete(reminder.id);
  }, delay);

  scheduled.set(reminder.id, timeout);
}

async function createReminder(client, { guildId, channelId, userId, message, remindAt }) {
  const reminder = await Reminder.create({ guildId, channelId, userId, message, remindAt });
  scheduleReminder(client, reminder);
  return reminder;
}

async function bootstrapReminders(client) {
  const pending = await Reminder.find({ sent: false });
  for (const reminder of pending) {
    scheduleReminder(client, reminder);
  }
}

module.exports = {
  bootstrapReminders,
  createReminder
};