import { SlashCommandBuilder } from 'discord.js';

export default {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Repeat a message back.')
    .addStringOption((option) =>
      option.setName('message').setDescription('What should I say?').setRequired(true).setMaxLength(2000),
    ),
  async execute(interaction) {
    await interaction.reply({
      content: interaction.options.getString('message', true),
      allowedMentions: { parse: [] },
    });
  },
};
