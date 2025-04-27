const axios = require("axios");
const fs = require("fs");
const path = require("path");

const BAD_LINKS_URL = "https://gist.githubusercontent.com/10Shepherd/c14d9b0bd8e92919b8cac13ead81fa2d/raw/857b1f2a787bcfbe0e5e445398fa3cf2dda335e1/badlinks.txt"; // Replace with actual URL
const BAD_LINKS_FILE = path.join(__dirname, "badlinks.json");
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

let badLinks = [];
let lastUpdated = 0;

async function updateBadLinks() {
  const now = Date.now();
  if (now - lastUpdated < ONE_MONTH_MS) {
    console.log("✅ Bad links list is up to date.");
    return;
  }

  try {
    const response = await axios.get(BAD_LINKS_URL);
    badLinks = response.data.split(/\r?\n/).map((link) => link.trim()).filter((link) => link);
    fs.writeFileSync(BAD_LINKS_FILE, JSON.stringify({ updated: now, links: badLinks }, null, 2));
    lastUpdated = now;
    console.log("✅ Bad links list updated successfully.");
  } catch (error) {
    console.error("❌ Failed to update bad links list:", error);
  }
}

function containsBadLinks(message) {
  const content = message.content.toLowerCase().trim();
  return badLinks.some((link) => content.includes(link));
}

function loadBadLinks() {
  try {
    if (fs.existsSync(BAD_LINKS_FILE)) {
      const data = JSON.parse(fs.readFileSync(BAD_LINKS_FILE, "utf8"));
      if (data.updated && Date.now() - data.updated < ONE_MONTH_MS) {
        badLinks = data.links;
        lastUpdated = data.updated;
        console.log("📥 Loaded bad links list from file.");
      } else {
        console.log("🔄 Local bad links file is outdated, updating...");
        updateBadLinks();
      }
    } else {
      console.log("⚠️ No local bad links file found. Fetching a new list...");
      updateBadLinks();
    }
  } catch (error) {
    console.error("❌ Failed to load bad links list:", error);
  }
}

module.exports = { updateBadLinks, containsBadLinks, loadBadLinks };