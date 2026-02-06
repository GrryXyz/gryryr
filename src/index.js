require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const mongo = require("./database/mongo");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates
  ]
});

mongo();

client.commands = new Map();
for (const file of fs.readdirSync("./src/commands")) {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
}

for (const file of fs.readdirSync("./src/events")) {
  const event = require(`./events/${file}`);
  client.on(event.name, (...args) => event.execute(...args));
}

client.on("interactionCreate", async i => {
  if (!i.isChatInputCommand()) return;
  client.commands.get(i.commandName)?.execute(i);
});

client.login(process.env.TOKEN);
