const { SlashCommandBuilder } = require("discord.js");
const { getReiResponse } = require("../../personality/rei");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("saludo")
    .setDescription("Rei responde"),

  async execute(interaction) {
    await interaction.reply(getReiResponse("greeting"));
  }
};
