const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { logAction } = require("../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nickname")
    .setDescription("Change a user's nickname")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user whose nickname you want to change")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("nickname")
        .setDescription("The new nickname")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

  async execute(interaction) {
    const target = interaction.options.getMember("target");
    const newNickname = interaction.options.getString("nickname");
    const executor = interaction.member; // The person running the command

    // Check if the target exists
    if (!target) {
      return interaction.reply({ content: "User not found!", flags: 64 });
    }

    // **Role Hierarchy Check**
    if (target.roles.highest.position >= executor.roles.highest.position) {
      return interaction.reply({
        content:
          "❌ You cannot change the nickname of someone with an equal or higher role!",
        flags: 64,
      });
    }

    // **Bot's Role Check**
    if (
      target.roles.highest.position >=
      interaction.guild.members.me.roles.highest.position
    ) {
      return interaction.reply({
        content:
          "❌ I cannot change the nickname of someone with a higher role than me!",
        flags: 64,
      });
    }

    try {
      await target.setNickname(newNickname);
      await interaction.reply({
        content: `✅ **${target.user.tag}'s nickname has been changed to:** \`${newNickname}\``,
      });

      // **Logging the action**
      await logAction(
        interaction.client,
        "Nickname Change",
        target.user,
        interaction.user,
        `New nickname: ${newNickname}`
      );
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          "❌ Failed to change nickname. Make sure I have the correct permissions!",
        flags: 64,
      });
    }
  },
};