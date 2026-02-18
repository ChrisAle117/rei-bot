const { addXpFromMessage } = require("../services/levelSystem");
const { checkAntiSpam } = require("../services/antiSpamService");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (!message.guild || message.author.bot) return;

    try {
      await checkAntiSpam(message);

      const result = await addXpFromMessage(message.guild.id, message.author.id);

      if (result.leveledUp) {
        await message.channel.send(
          `⬆️ ${message.author}, subiste a nivel **${result.profile.level}**.`
        );
      }
    } catch (error) {
      console.error("Error al procesar XP:", error);
    }
  }
};