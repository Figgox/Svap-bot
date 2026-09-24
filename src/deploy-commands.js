import { REST, Routes } from 'discord.js';
import { token, clientId, devGuildId, requireEnv } from './config.js';
import { loadModules, commandsDir } from './loader.js';

requireEnv('DISCORD_TOKEN', token);
requireEnv('CLIENT_ID', clientId);

const body = (await loadModules(commandsDir)).map((command) => command.data.toJSON());
const rest = new REST().setToken(token);

const route = devGuildId
  ? Routes.applicationGuildCommands(clientId, devGuildId)
  : Routes.applicationCommands(clientId);

const data = await rest.put(route, { body });
console.log(`Deployed ${data.length} commands ${devGuildId ? `to guild ${devGuildId}` : 'globally'}.`);
