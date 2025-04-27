const axios = require("axios");
const fs = require("fs");
const path = require("path");

const BAD_WORDS_URL =
  "https://gist.githubusercontent.com/10Shepherd/0af35323d9205d67b7e08be5edc73d73/raw/be4bfdaf6b602469a9fa63607ace27dacf2bd183/badwords.txt"; // Replace with the actual URL
const BAD_WORDS_FILE = path.join(__dirname, "badwords.json");
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

let badWords = [];
let lastUpdated = 0;

// Function to fetch and update bad words list
async function updateBadWords() {
  const now = Date.now();

  // Check if it's been at least a month since the last update
  if (now - lastUpdated < ONE_MONTH_MS) {
    console.log("✅ Bad words list is already up to date.");
    return;
  }

  try {
    const response = await axios.get(BAD_WORDS_URL);
    badWords = response.data
      .split(/\r?\n/)
      .map((word) => word.trim())
      .filter((word) => word);

    // Save locally to avoid unnecessary requests
    fs.writeFileSync(
      BAD_WORDS_FILE,
      JSON.stringify({ updated: now, words: badWords }, null, 2)
    );

    lastUpdated = now;
    console.log("✅ Bad words list updated successfully.");
  } catch (error) {
    console.error("❌ Failed to load bad words list:", error);
  }
}

// Function to check if a message contains a bad word
function containsBadWords(message) {
  const content = message.content.toLowerCase().trim();
  return badWords.some((word) => content.includes(word));
}

// Load the bad words list from file at startup
function loadBadWords() {
  try {
    if (fs.existsSync(BAD_WORDS_FILE)) {
      const data = JSON.parse(fs.readFileSync(BAD_WORDS_FILE, "utf8"));
      if (data.updated && Date.now() - data.updated < ONE_MONTH_MS) {
        badWords = data.words;
        lastUpdated = data.updated;
        console.log("📥 Loaded bad words list from file.");
      } else {
        console.log("🔄 Local bad words file is outdated, updating...");
        updateBadWords(); // Fetch a new list if outdated
      }
    } else {
      console.log("⚠️ No local bad words file found. Fetching a new list...");
      updateBadWords();
    }
  } catch (error) {
    console.error("❌ Failed to load local bad words list:", error);
  }
}

module.exports = { updateBadWords, containsBadWords, loadBadWords };