require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

/* ===== CARGA DE COMANDOS ===== */
const commandsPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(f => f.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(path.join(folderPath, file));
    client.commands.set(command.data.name, command);
  }
}

/* ===== EVENT HANDLER ===== */
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

async function bootstrap() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Falta MONGO_URI o MONGODB_URI en el archivo .env");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB conectado.");

  await client.login(process.env.TOKEN);
}

bootstrap().catch(error => {
  console.error("Error al iniciar el bot:", error);
  process.exit(1);
});
