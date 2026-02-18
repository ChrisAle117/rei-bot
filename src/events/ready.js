const { startAutoEvents } = require("../services/autoEventService");
const { bootstrapReminders } = require("../services/reminderService");
const { startDashboard } = require("../dashboard/server");

module.exports = {
  name: "clientReady",
  once: true,
  async execute(client) {
    await bootstrapReminders(client);
    startAutoEvents(client);
    startDashboard();
    console.log(`REI-01 operativo como ${client.user.tag}`);
  }
};
