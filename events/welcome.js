const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const welcomeChannel = member.guild.channels.cache.get(
      process.env.WELCOME_CHANNEL_ID
    );
    if (!welcomeChannel) return console.error("⚠️ Welcome channel not found!");

    const embed = new EmbedBuilder()
      .setTitle("🎉 Welcome to Midnight District Roleplay!")
      .setColor(0x00ff00)
      .setThumbnail(member.guild.iconURL({ dynamic: true })) // Server logo instead of user avatar
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
          name: "📥 Joined Server",
          value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
          inline: false,
        }
      )
      .setFooter({ text: "Enjoy your stay!" })
      .setTimestamp();

    await welcomeChannel.send({ embeds: [embed] });
  },
};