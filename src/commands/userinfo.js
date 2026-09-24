import { EmbedBuilder, InteractionContextType, SlashCommandBuilder, time } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Show info about a user.')
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) => option.setName('user').setDescription('Defaults to you')),
  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    const embed = new EmbedBuilder()
      .setTitle(user.tag)
      .setThumbnail(user.displayAvatarURL())
      .setColor(member?.displayColor || null)
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Created', value: time(user.createdAt, 'R'), inline: true },
      );
    if (member?.joinedAt) embed.addFields({ name: 'Joined', value: time(member.joinedAt, 'R'), inline: true });

    await interaction.reply({ embeds: [embed] });
  },
};
