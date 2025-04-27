const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    const logChannel = member.guild.channels.cache.get(
      process.env.LOG_CHANNEL_ID
    );
    if (!logChannel) return console.error("⚠️ Log channel not found!");

    const embed = new EmbedBuilder()
      .setTitle("❌ Member Left")
      .setColor(0xff0000)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "👤 User",
          value: `${member.user.tag} (<@${member.id}>)`,
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