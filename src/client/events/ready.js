const { Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {

        console.log(`[✅] » [${client.user.tag}] The bot is now ready and fully operational`);
        client.user.setActivity("Sur Discord", { type: "WATCHING" });
    }
}