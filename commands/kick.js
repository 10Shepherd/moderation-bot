const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { logAction } = require("../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks a user from the server")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for kicking")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const member = interaction.guild.members.cache.get(target.id);
    const executor = interaction.member;
    const bot = interaction.guild.members.me;

    if (!member) {
      return interaction.reply({
        content: "❌ User not found!",
        flags: 64,
      });
    }

    // ✅ Ensure the bot has permission to kick
    if (!bot.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({
        content: "🚫 I don't have permission to kick members!",
        flags: 64,
      });
    }

    // ✅ Prevent users from kicking members with higher or equal roles
    if (member.roles.highest.position >= executor.roles.highest.position) {
      return interaction.reply({
        content: "🚫 You can't kick someone with a higher or equal role!",
        flags: 64,
      });
    }

    // ✅ Ensure the bot can kick the user
    if (member.roles.highest.position >= bot.roles.highest.position) {
      return interaction.reply({
        content: "🚫 I can't kick this user! Their role is above mine.",
        flags: 64,
      });
    }

    try {
      await member.kick(reason);
      await interaction.reply({
        content: `✅ **${target.tag}** has been kicked.\n📝 **Reason:** ${reason}`,
      });

      // ✅ Log the action
      await logAction(
        interaction.client,
        "Kick",
        target,
        interaction.user,
        reason
      );
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ Failed to kick user.",
        flags: 64,
      });
    }
  },
};