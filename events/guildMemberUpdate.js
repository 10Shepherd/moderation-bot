const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
  name: Events.GuildMemberUpdate,
  async execute(oldMember, newMember) {
    const logChannel = newMember.guild.channels.cache.get(
      process.env.LOG_CHANNEL_ID
    );
    if (!logChannel) return console.error("⚠️ Log channel not found!");

    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;

    const addedRoles = newRoles.filter((role) => !oldRoles.has(role.id));
    const removedRoles = oldRoles.filter((role) => !newRoles.has(role.id));

    // Fetch the audit log to determine who made the change
    const fetchedLogs = await newMember.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberRoleUpdate,
    });
    const roleLog = fetchedLogs.entries.first();
    const executor = roleLog ? roleLog.executor : null;

    // **Role Added**
    if (addedRoles.size > 0) {
      const embed = new EmbedBuilder()
        .setTitle("➕ Role Added")
        .setColor(0x3498db)
        .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          {
            name: "👤 User",
            value: `${newMember.user.tag} (<@${newMember.id}>)`,
            inline: false,
          },
          {
            name: "📌 Role Added",
            value: `${addedRoles.map((role) => `**${role.name}**`).join(", ")}`,
            inline: false,
          },
          {
            name: "🔧 Added By",
            value: executor ? `${executor.tag} (<@${executor.id}>)` : "Unknown",
            inline: false,
          }
        )
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    }

    // **Role Removed**
    if (removedRoles.size > 0) {
      const embed = new EmbedBuilder()
        .setTitle("➖ Role Removed")
        .setColor(0xe74c3c)
        .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          {
            name: "👤 User",
            value: `${newMember.user.tag} (<@${newMember.id}>)`,
            inline: false,
          },
          {
            name: "📌 Role Removed",
            value: `${removedRoles
              .map((role) => `**${role.name}**`)
              .join(", ")}`,
            inline: false,
          },
          {
            name: "🔧 Removed By",
            value: executor ? `${executor.tag} (<@${executor.id}>)` : "Unknown",
            inline: false,
          }
        )
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    }
  },
};