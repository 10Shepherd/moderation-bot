const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.MessageUpdate,
  async execute(oldMessage, newMessage) {
    if (
      !oldMessage.guild ||
      oldMessage.author.bot ||
      oldMessage.content === newMessage.content
    )
      return;

    const logChannel = oldMessage.guild.channels.cache.get(
      process.env.LOG_CHANNEL_ID
    );
    if (!logChannel) return console.error("⚠️ Log channel not found!");

    const embed = new EmbedBuilder()
      .setTitle("✏️ Message Edited")
      .setColor(0xffff00)
      .addFields(
        {
          name: "👤 Author",
          value: `${oldMessage.author.tag} (<@${oldMessage.author.id}>)`,
          inline: false,
        },
        {
          name: "📍 Channel",
          value: `<#${oldMessage.channel.id}>`,
          inline: false,
        },
        {
          name: "📜 Old Message",
          value: oldMessage.content || "No text content",
          inline: false,
        },
        {
          name: "🆕 New Message",
          value: newMessage.content || "No text content",
          inline: false,
        }
      )
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  },
};