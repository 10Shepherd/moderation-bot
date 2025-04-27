const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verification")
    .setDescription("Sends the verification message with a button."),
  async execute(interaction) {
    const verifyEmbed = new EmbedBuilder()
      .setTitle("✅ Verification Required")
      .setDescription("Click the **Verify** button below to access the server!")
      .setColor(0x2ecc71)
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setTimestamp();

    const verifyButton = new ButtonBuilder()
      .setCustomId("verify_user")
      .setLabel("✅ Verify")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(verifyButton);

    await interaction.reply({ embeds: [verifyEmbed], components: [row] });
  },
};