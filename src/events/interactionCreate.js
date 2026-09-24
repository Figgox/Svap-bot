import { Collection, Events, MessageFlags } from 'discord.js';

const DEFAULT_COOLDOWN_SECONDS = 3;
const cooldowns = new Collection();

function checkCooldown(command, userId) {
  const now = Date.now();
  const timestamps = cooldowns.ensure(command.data.name, () => new Collection());
  const cooldownMs = (command.cooldown ?? DEFAULT_COOLDOWN_SECONDS) * 1000;
  const expiresAt = (timestamps.get(userId) ?? 0) + cooldownMs;

  if (now < expiresAt) return expiresAt;
  timestamps.set(userId, now);
  setTimeout(() => timestamps.delete(userId), cooldownMs);
  return null;
}

export default {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.warn(`Unknown command: /${interaction.commandName}`);
      return;
    }

    const expiresAt = checkCooldown(command, interaction.user.id);
    if (expiresAt) {
      await interaction.reply({
        content: `Slow down! You can use \`/${command.data.name}\` again <t:${Math.ceil(expiresAt / 1000)}:R>.`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error running /${interaction.commandName}:`, error);
      const reply = { content: 'Something went wrong running that command.', flags: MessageFlags.Ephemeral };
      if (interaction.replied || interaction.deferred) await interaction.followUp(reply);
      else await interaction.reply(reply);
    }
  },
};
