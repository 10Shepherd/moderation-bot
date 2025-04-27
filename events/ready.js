const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}`);

    // List of presences to rotate
    const activities = [
      { name: "over the server", type: ActivityType.Watching },
      { name: "for rule breakers", type: ActivityType.Watching },
      { name: "your messages", type: ActivityType.Watching },
      { name: "moderation logs", type: ActivityType.Watching },
    ];

    let i = 0;
    setInterval(() => {
      client.user.setPresence({
        status: "online",
        activities: [activities[i]],
      });

      i = (i + 1) % activities.length; // Loops back to the first activity
    }, 15000); // Change presence every 15 seconds
  },
};