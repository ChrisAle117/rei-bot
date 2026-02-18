module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "Error inesperado.",
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: "Error inesperado.",
          ephemeral: true
        });
      }
    }
  }
};
