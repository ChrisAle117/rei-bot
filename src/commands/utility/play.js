const { SlashCommandBuilder } = require("discord.js");
const { enqueueTrack } = require("../../services/musicService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Reproduce música desde YouTube (URL o búsqueda)")
    .addStringOption(option =>
      option.setName("query").setDescription("URL o texto a buscar").setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString("query", true);
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      await interaction.reply({
        content: "Debes entrar a un canal de voz para usar este comando.",
        ephemeral: true
      });
      return;
    }

    await interaction.deferReply();
    const result = await enqueueTrack({
      guild: interaction.guild,
      voiceChannel,
      query
    });

    if (!result.ok) {
      await interaction.editReply(`❌ ${result.error}`);
      return;
    }

    await interaction.editReply(`🎵 Añadido: **${result.track.title}**`);
  }
};