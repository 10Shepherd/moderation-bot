require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Auto-deploy commands before starting the bot
exec("node deploy-commands.js", (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error deploying commands: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`⚠️ Stderr: ${stderr}`);
    return;
  }
  console.log(`✅ Commands deployed:\n${stdout}`);
});

// Load commands dynamically
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// Load events dynamically
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Load bad words list
const { loadBadWords } = require("./utils/badWordsFilter");
loadBadWords(); // Load bad words when bot starts

// Load bad words list
const { loadBadLinks } = require("./utils/badLinksFilter");
loadBadLinks(); // Load bad words when bot starts

// Cooldown tracking
client.cooldowns = new Collection();

client.login(process.env.TOKEN);