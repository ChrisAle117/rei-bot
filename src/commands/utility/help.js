const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Muestra los comandos disponibles"),

  async execute(interaction) {
    const commandNames = [...interaction.client.commands.keys()]
      .sort((first, second) => first.localeCompare(second));

    if (!commandNames.length) {
      await interaction.reply("No hay comandos cargados.");
      return;
    }

    const lines = commandNames.map(name => `/${name}`);
    const message = `📘 **Comandos disponibles (${lines.length})**\n${lines.join("\n")}`;

    await interaction.reply({
      content: message.slice(0, 1900),
      ephemeral: true
    });
  }
};