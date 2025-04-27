const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a member from the server.")
    .addUserOption((option) =>
      option.setName("target").setDescription("User to ban").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for ban")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getMember("target");
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const executor = interaction.member;
    const bot = interaction.guild.members.me;

    // ✅ Check if the bot has permission to ban
    if (!bot.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: "🚫 I don't have permission to ban members!",
        flags: 64,
      });
    }

    // ✅ Prevent banning users with higher or equal role
    if (!target || !target.bannable) {
      return interaction.reply({
        content:
          "🚫 I can't ban this user! They might have a higher role than me.",
        flags: 64,
      });
    }

    if (target.roles.highest.position >= executor.roles.highest.position) {
      return interaction.reply({
        content: "🚫 You can't ban someone with a higher or equal role!",
        flags: 64,
      });
    }

    // ✅ Ban the user
    await target.ban({ reason });
    await interaction.reply({
      content: `✅ **${target.user.tag}** has been banned.\n📝 **Reason:** ${reason}`,
    });
  },
};