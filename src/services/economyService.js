const EconomyProfile = require("../models/EconomyProfile");
const ShopItem = require("../models/ShopItem");

const DAILY_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const WORK_COOLDOWN_MS = 2 * 60 * 60 * 1000;

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getOrCreateProfile(guildId, userId) {
  let profile = await EconomyProfile.findOne({ guildId, userId });
  if (!profile) {
    profile = await EconomyProfile.create({ guildId, userId, balance: 200 });
  }
  return profile;
}

function getCooldownRemaining(lastDate, cooldownMs) {
  if (!lastDate) return 0;
  const remaining = cooldownMs - (Date.now() - lastDate.getTime());
  return Math.max(0, remaining);
}

async function claimDaily(guildId, userId) {
  const profile = await getOrCreateProfile(guildId, userId);
  const remaining = getCooldownRemaining(profile.lastDailyAt, DAILY_COOLDOWN_MS);
  if (remaining > 0) return { ok: false, remaining };

  const amount = randomBetween(150, 300);
  profile.balance += amount;
  profile.lastDailyAt = new Date();
  await profile.save();
  return { ok: true, amount, profile };
}

async function work(guildId, userId) {
  const profile = await getOrCreateProfile(guildId, userId);
  const remaining = getCooldownRemaining(profile.lastWorkAt, WORK_COOLDOWN_MS);
  if (remaining > 0) return { ok: false, remaining };

  const amount = randomBetween(60, 180);
  profile.balance += amount;
  profile.lastWorkAt = new Date();
  await profile.save();
  return { ok: true, amount, profile };
}

async function pay(guildId, fromUserId, toUserId, amount) {
  if (amount <= 0) return { ok: false, error: "Monto inválido" };

  const from = await getOrCreateProfile(guildId, fromUserId);
  const to = await getOrCreateProfile(guildId, toUserId);

  if (from.balance < amount) {
    return { ok: false, error: "Fondos insuficientes" };
  }

  from.balance -= amount;
  to.balance += amount;
  await Promise.all([from.save(), to.save()]);

  return { ok: true, from, to, amount };
}

async function seedShopIfEmpty(guildId) {
  const count = await ShopItem.countDocuments({ guildId });
  if (count > 0) return;

  await ShopItem.insertMany([
    {
      guildId,
      itemId: "pocion_xp",
      name: "Poción XP",
      description: "Aumenta tu motivación en el servidor",
      price: 250,
      stock: -1
    },
    {
      guildId,
      itemId: "rol_elite",
      name: "Rol Elite",
      description: "Canjeable por rol especial",
      price: 900,
      stock: 25
    }
  ]);
}

async function listShop(guildId) {
  await seedShopIfEmpty(guildId);
  return ShopItem.find({ guildId }).sort({ price: 1 });
}

async function buyItem(guildId, userId, itemId, quantity) {
  const amount = Math.max(1, quantity || 1);
  const item = await ShopItem.findOne({ guildId, itemId });
  if (!item) return { ok: false, error: "Ítem no encontrado" };

  if (item.stock !== -1 && item.stock < amount) {
    return { ok: false, error: "Sin stock suficiente" };
  }

  const profile = await getOrCreateProfile(guildId, userId);
  const totalCost = item.price * amount;
  if (profile.balance < totalCost) {
    return { ok: false, error: "No tienes monedas suficientes" };
  }

  profile.balance -= totalCost;

  const found = profile.inventory.find(entry => entry.itemId === item.itemId);
  if (found) found.quantity += amount;
  else profile.inventory.push({ itemId: item.itemId, quantity: amount });

  if (item.stock !== -1) item.stock -= amount;

  await Promise.all([profile.save(), item.save()]);
  return { ok: true, profile, item, quantity: amount, totalCost };
}

async function getBalanceRanking(guildId, limit = 10) {
  return EconomyProfile.find({ guildId }).sort({ balance: -1 }).limit(limit);
}

module.exports = {
  DAILY_COOLDOWN_MS,
  WORK_COOLDOWN_MS,
  buyItem,
  claimDaily,
  getBalanceRanking,
  getOrCreateProfile,
  listShop,
  pay,
  work
};