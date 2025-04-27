const { EmbedBuilder } = require("discord.js");

async function logAction(client, action, user, moderator, reason) {
  const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);
  if (!logChannel) return console.error("⚠️ Log channel not found!");

  // ✅ Fix: Use `moderator` instead of `executor`
  const moderatorTag = moderator ? moderator.tag : "System / Auto-Mod";

  const logEmbed = new EmbedBuilder()
    .setTitle("🛠 Moderation Action")
    .setColor(0xff0000)
    .addFields(
      { name: "🚨 Action", value: action, inline: true },
      { name: "👤 User", value: `${user.tag} (${user.id})`, inline: true },
      { name: "🛑 Moderator", value: moderatorTag, inline: true },
      {
        name: "📝 Reason",
        value: reason || "No reason provided",
        inline: false,
      }
    )
    .setTimestamp();

  await logChannel.send({ embeds: [logEmbed] });
}

module.exports = { logAction };