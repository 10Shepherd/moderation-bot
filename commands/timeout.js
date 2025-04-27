const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { logAction } = require("../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Temporarily mutes a user using Discord's timeout feature")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to timeout")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration in minutes")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for timeout")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const duration = interaction.options.getInteger("duration");
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

    // ✅ Ensure the bot has permission to timeout members
    if (!bot.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({
        content: "🚫 I don't have permission to timeout members!",
        flags: 64,
      });
    }

    // ✅ Prevent users from timing out members with higher or equal roles
    if (member.roles.highest.position >= executor.roles.highest.position) {
      return interaction.reply({
        content: "🚫 You can't timeout someone with a higher or equal role!",
        flags: 64,
      });
    }

    // ✅ Ensure the bot can timeout the user
    if (member.roles.highest.position >= bot.roles.highest.position) {
      return interaction.reply({
        content: "🚫 I can't timeout this user! Their role is above mine.",
        flags: 64,
      });
    }

    try {
      await member.timeout(duration * 60 * 1000, reason);
      await interaction.reply({
        content: `✅ **${target.tag}** has been timed out for **${duration} minutes**.\n📝 **Reason:** ${reason}`,
      });

      // ✅ Log the action
      await logAction(
        interaction.client,
        "Timeout",
        target,
        interaction.user,
        `${duration} minutes - ${reason}`
      );
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ Failed to timeout user.",
        flags: 64,
      });
    }
  },
};