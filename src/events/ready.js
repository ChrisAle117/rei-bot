module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`REI-01 operativo como ${client.user.tag}`);
  }
};
