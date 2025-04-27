const { Events, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isButton()) return;

    if (interaction.customId === "verify_user") {
      const roleId = process.env.VERIFIED_ROLE_ID; // Role ID for verified members
      const member = interaction.member;

      if (!roleId) {
        return interaction.reply({
          content: "❌ Verification role ID is missing!",
          flags: 64,
        });
      }

      if (member.roles.cache.has(roleId)) {
        return interaction.reply({
          content: "✅ You are already verified!",
          flags: 64,
        });
      }

      try {
        await member.roles.add(roleId);
        await interaction.reply({
          content: "✅ You have been verified!",
          flags: 64,
        });

        // Logging verification
        const logChannel = interaction.guild.channels.cache.get(
          process.env.LOG_CHANNEL_ID
        );
        if (logChannel) {
          const logEmbed = new EmbedBuilder()
            .setTitle("✅ User Verified")
            .setColor(0x2ecc71)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
              {
                name: "👤 User",
                value: `${member.user.tag} (<@${member.id}>)`,
                inline: false,
              },
              {
                name: "📆 Joined Server",
                value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
                inline: false,
              }
            )
            .setTimestamp();

          await logChannel.send({ embeds: [logEmbed] });
        }
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "❌ Failed to verify. Please contact an admin.",
          flags: 64,
        });
      }
    }
  },
};