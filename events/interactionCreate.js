const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    try {
      // Handle Chat Input Commands
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        await command.execute(interaction);
      }

      // Handle Button Interactions
      else if (interaction.isButton()) {
        const buttonHandler = client.buttons.get(interaction.customId);
        if (!buttonHandler) return;

        await buttonHandler.execute(interaction);
      }

      // Handle Modal Submissions
      else if (interaction.isModalSubmit()) {
        const modalHandler = client.modals.get(interaction.customId);
        if (!modalHandler) return;

        await modalHandler.execute(interaction);
      }

      // Handle Select Menus
      else if (interaction.isStringSelectMenu()) {
        const menuHandler = client.menus.get(interaction.customId);
        if (!menuHandler) return;

        await menuHandler.execute(interaction);
      }
    } catch (error) {
      console.error("Interaction Error:", error);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error executing this interaction!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error executing this interaction!",
          ephemeral: true,
        });
      }
    }
  },
};