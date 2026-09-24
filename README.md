# Svap-bot

A Discord bot built with [discord.js](https://discord.js.org) v14 (Node.js 22.9+).

## Setup

1. Create an application at the [Discord Developer Portal](https://discord.com/developers/applications), add a **Bot**, and copy its token.
2. Invite it to your server: **OAuth2 → URL Generator**, tick `bot` and `applications.commands`, pick permissions, open the URL.
3. Configure and install:

   ```sh
   cp .env.example .env   # fill in DISCORD_TOKEN, CLIENT_ID and (optionally) DEV_GUILD_ID
   npm install
   npm run deploy         # register slash commands with Discord
   npm start              # or: npm run dev  (restarts on file changes)
   ```

Set `DEV_GUILD_ID` while developing so commands update instantly in that server. Leave it empty to deploy globally.

## Docker

```sh
docker compose up -d --build
```

Run `npm run deploy` once (locally) whenever you add or change a command's options.

## Project layout

```
src/
  index.js              # creates the client, loads commands + events, logs in
  deploy-commands.js    # registers slash commands with Discord
  config.js             # env vars
  loader.js             # imports every file in commands/ and events/
  commands/             # one slash command per file
  events/               # one Discord event handler per file
```

Files starting with `_` are skipped by the loader.

### Adding a command

Create `src/commands/hello.js`:

```js
import { SlashCommandBuilder } from 'discord.js';

export default {
  cooldown: 3, // seconds, optional
  data: new SlashCommandBuilder().setName('hello').setDescription('Say hello.'),
  async execute(interaction) {
    await interaction.reply(`Hello, ${interaction.user}!`);
  },
};
```

Then run `npm run deploy` and restart the bot.

### Adding an event handler

Create a file in `src/events/` exporting `{ name, once?, execute }`, where `name` is an [`Events`](https://discord.js.org/docs/packages/discord.js/main/Events:Enum) value. If the event needs extra gateway intents, add them in `src/index.js`.
