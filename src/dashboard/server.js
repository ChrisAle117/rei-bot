const express = require("express");
const EconomyProfile = require("../models/EconomyProfile");
const UserLevel = require("../models/UserLevel");
const Reminder = require("../models/Reminder");

let started = false;

function startDashboard() {
  if (started) return;
  started = true;

  const app = express();
  const port = Number(process.env.DASHBOARD_PORT || 3000);

  app.get("/api/summary", async (req, res) => {
    const [usersEconomy, usersLevels, remindersPending] = await Promise.all([
      EconomyProfile.countDocuments(),
      UserLevel.countDocuments(),
      Reminder.countDocuments({ sent: false })
    ]);

    res.json({ usersEconomy, usersLevels, remindersPending, uptime: process.uptime() });
  });

  app.get("/", async (req, res) => {
    res.send(`
      <html>
        <head><title>Rei Bot Dashboard</title></head>
        <body style="font-family: Arial, sans-serif; background: #111; color: #eee; padding: 24px;">
          <h1>Rei Bot Dashboard</h1>
          <p>Panel de administración básico activo.</p>
          <p>Endpoint: <a style="color:#8ab4f8" href="/api/summary">/api/summary</a></p>
        </body>
      </html>
    `);
  });

  app.listen(port, () => {
    console.log(`Dashboard web activo en http://localhost:${port}`);
  });
}

module.exports = { startDashboard };