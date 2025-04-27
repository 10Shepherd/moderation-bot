const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const logChannel = member.guild.channels.cache.get(
      process.env.LOG_CHANNEL_ID
    );
    if (!logChannel) return console.error("⚠️ Log channel not found!");

    const embed = new EmbedBuilder()
      .setTitle("✅ Member Joined")
      .setColor(0x00ff00)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "👤 User",
          value: `${member.user.tag} (<@${member.id}>)`,
          inline: false,
        },
        {
          name: "📅 Account Created",
          value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
          inline: false,
        },
        {
          name: "📅 Joined Server",
          value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
          inline: false,
        }
      )
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  },
};