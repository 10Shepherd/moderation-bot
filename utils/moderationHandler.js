const { logAction } = require("./logger");
const { containsBadWords } = require("./badWordsFilter");
const { containsBadLinks } = require("./badLinksFilter");

const userWarnings = new Map();
const WARNING_LIMIT = 2;
const TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes
const BAN_THRESHOLD = 5;

async function handleModeration(message) {
  if (message.author.bot || !message.member) return;

  const bot = message.guild.members.me;
  const member = message.member;

  // ✅ Ignore users with roles higher than the bot
  if (member.roles.highest.position >= bot.roles.highest.position) {
    console.log(`🚫 Ignoring ${member.user.tag} (higher role than bot)`);
    return;
  }

  if (!message.content || message.content.trim() === "") return;

  if (containsBadWords(message) || containsBadLinks(message)) {
    await message.delete();
    await message.channel.send(`⚠️ **${message.author.tag}, inappropriate content detected!**`);

    const userId = message.author.id;
    userWarnings.set(userId, (userWarnings.get(userId) || 0) + 1);

    if (userWarnings.get(userId) >= WARNING_LIMIT) {
      await applyTimeout(message);
    } else {
      await logAction(
        message.client,
        "Warning (Inappropriate Content)",
        message.author,
        null,
        "Used prohibited words or links"
      );
    }
  }
}

async function applyTimeout(message) {
  const { author, member, guild } = message;
  const bot = guild.members.me;

  // ✅ Prevent timing out users with a higher role than the bot
  if (member.roles.highest.position >= bot.roles.highest.position) {
    console.log(`🚫 Cannot timeout ${member.user.tag} (higher role than bot)`);
    return;
  }

  if (userWarnings.get(author.id) >= BAN_THRESHOLD) {
    try {
      await member.ban({ reason: "Repeated violations" });
      await message.channel.send(`🚨 **${author.tag} has been banned for repeated violations!**`);
      await logAction(
        message.client,
        "Ban (Inappropriate Content)",
        author,
        null,
        "Exceeded warning limit"
      );
    } catch (error) {
      console.error(`❌ Failed to ban ${author.tag}:`, error);
    }
  } else {
    try {
      await member.timeout(TIMEOUT_DURATION, "Repeated violations");
      await message.channel.send(`⏳ **${author.tag} has been timed out for 10 minutes!**`);
      await logAction(
        message.client,
        "Timeout (Inappropriate Content)",
        author,
        null,
        "Timed out for violations"
      );
    } catch (error) {
      console.error(`❌ Failed to timeout ${author.tag}:`, error);
    }
  }
}

// ✅ Export the function
module.exports = { handleModeration };