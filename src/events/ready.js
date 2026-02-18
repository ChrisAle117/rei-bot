module.exports = {
  name: "clientReady",
  once: true,
  execute(client) {
    console.log(`REI-01 operativo como ${client.user.tag}`);
  }
};
