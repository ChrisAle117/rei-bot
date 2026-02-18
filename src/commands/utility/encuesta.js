const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("encuesta")
    .setDescription("Crea una encuesta")
    .addStringOption(option =>
      option.setName("pregunta").setDescription("Pregunta de la encuesta").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("opcion1").setDescription("Opción 1").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("opcion2").setDescription("Opción 2").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("opcion3").setDescription("Opción 3").setRequired(false)
    )
    .addStringOption(option =>
      option.setName("opcion4").setDescription("Opción 4").setRequired(false)
    ),

  async execute(interaction) {
    const question = interaction.options.getString("pregunta", true);
    const options = [
      interaction.options.getString("opcion1", true),
      interaction.options.getString("opcion2", true),
      interaction.options.getString("opcion3"),
      interaction.options.getString("opcion4")
    ].filter(Boolean);

    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣"];
    const body = options.map((option, index) => `${emojis[index]} ${option}`).join("\n");

    await interaction.reply(`📊 **${question}**\n${body}`);
    const pollMessage = await interaction.fetchReply();

    for (let index = 0; index < options.length; index += 1) {
      await pollMessage.react(emojis[index]);
    }
  }
};