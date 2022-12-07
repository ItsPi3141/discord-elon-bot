const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const config = require("./config.json");
const commands = [
	{
		name: "ping",
		description: "Ping me again and I'll fire you"
	},
	{
		name: "info",
		description: "Who am I?"
	},
	{
		name: "chat",
		description: "Talk to me (I'm an AI)",
		options: [
			{
				name: "message",
				description: "Enter a message",
				type: 3, // STRING
				required: true
			}
		]
	}
];

const rest = new REST({ version: "9" }).setToken(config.token);

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");

		await rest.put(Routes.applicationCommands(config.id), {
			body: commands
		});

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();
