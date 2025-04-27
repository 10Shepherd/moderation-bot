const { Events } = require("discord.js");
const { handleModeration } = require("../utils/moderationHandler"); // ✅ Ensure correct import

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    await handleModeration(message);
  },
};