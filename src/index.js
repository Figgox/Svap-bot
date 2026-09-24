import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { token, requireEnv } from './config.js';
import { loadModules, commandsDir, eventsDir } from './loader.js';

requireEnv('DISCORD_TOKEN', token);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    // Add more as needed. Privileged intents must also be enabled in the Developer Portal:
    // GatewayIntentBits.GuildMessages,
    // GatewayIntentBits.MessageContent,
    // GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();
for (const command of await loadModules(commandsDir)) {
  client.commands.set(command.data.name, command);
}

for (const event of await loadModules(eventsDir)) {
  const handler = (...args) => event.execute(...args);
  if (event.once) client.once(event.name, handler);
  else client.on(event.name, handler);
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    await client.destroy();
    process.exit(0);
  });
}

await client.login(token);
