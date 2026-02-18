const UserLevel = require("../models/UserLevel");

const XP_MIN = 10;
const XP_MAX = 25;
const XP_COOLDOWN_MS = 60 * 1000;

function getRandomXp() {
  return Math.floor(Math.random() * (XP_MAX - XP_MIN + 1)) + XP_MIN;
}

function getTotalXpForLevel(level) {
  return 5 * level * level + 50 * level + 100;
}

function getLevelFromXp(xp) {
  let level = 0;
  let required = getTotalXpForLevel(level);

  while (xp >= required) {
    level += 1;
    required = getTotalXpForLevel(level);
  }

  return level;
}

function getLevelProgress(xp, level) {
  const currentLevelStart = level === 0 ? 0 : getTotalXpForLevel(level - 1);
  const nextLevelTarget = getTotalXpForLevel(level);
  const xpIntoLevel = Math.max(0, xp - currentLevelStart);
  const xpForLevel = Math.max(1, nextLevelTarget - currentLevelStart);
  const progressPercent = Math.min(100, Math.floor((xpIntoLevel / xpForLevel) * 100));

  return {
    xpIntoLevel,
    xpForLevel,
    progressPercent
  };
}

async function getOrCreateProfile(guildId, userId) {
  let profile = await UserLevel.findOne({ guildId, userId });

  if (!profile) {
    profile = await UserLevel.create({ guildId, userId });
  }

  return profile;
}

async function addXpFromMessage(guildId, userId) {
  const profile = await getOrCreateProfile(guildId, userId);
  const now = Date.now();

  if (profile.lastXpAt && now - profile.lastXpAt.getTime() < XP_COOLDOWN_MS) {
    return { awarded: false, profile, leveledUp: false };
  }

  profile.lastXpAt = new Date(now);
  profile.xp += getRandomXp();

  const oldLevel = profile.level;
  const newLevel = getLevelFromXp(profile.xp);
  profile.level = newLevel;

  await profile.save();

  return {
    awarded: true,
    profile,
    leveledUp: newLevel > oldLevel
  };
}

module.exports = {
  XP_COOLDOWN_MS,
  addXpFromMessage,
  getLevelFromXp,
  getLevelProgress,
  getOrCreateProfile,
  getTotalXpForLevel
};