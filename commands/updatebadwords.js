const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { updateBadWords } = require("../utils/badWordsFilter");
const { logAction } = require("../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("updatebadwords")
    .setDescription("Manually update the bad words list from the remote source")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Only admins can run this

  async execute(interaction) {
    await interaction.deferReply({ flags: 64 }); // Indicate processing

    try {
      await updateBadWords();
      await interaction.editReply("✅ Bad words list updated successfully.");

      // Log the update action
      await logAction(
        interaction.client,
        "Bad Words List Update",
        interaction.user,
        null,
        "Updated the bad words list from the remote source"
      );
    } catch (error) {
      console.error("❌ Failed to update bad words list:", error);
      await interaction.editReply("❌ Failed to update bad words list.");

      // Log the failure
      await logAction(
        interaction.client,
        "Failed Bad Words List Update",
        interaction.user,
        null,
        "Attempted to update bad words list but failed"
      );
    }
  },
};