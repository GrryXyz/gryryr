require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const mongo = require("./database/mongo");
const { ActivityType } = require("discord.js");

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


client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const activities = [
    { name: "WELCOME TO", type: ActivityType.Watching },
    { name: "NEXUSGY", type: ActivityType.Watching },
    { name: "SERVER/COMMUNITY", type: ActivityType.Playing }
  ];

  let index = 0;

  setInterval(() => {
    client.user.setActivity(activities[index]);
    index = (index + 1) % activities.length;
  }, 15000); // ganti tiap 15 detik
});


client.login(process.env.TOKEN);
