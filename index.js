const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent] });
const config = require("./config.json");
const fetch = require("node-fetch");

const API_URL = "https://api-inference.huggingface.co/models/Pi3141/DialoGPT-medium-elon-3";
// const API_URL = "https://api-inference.huggingface.co/models/luca-martial/DialoGPT-Elon";
var api_rotation = 0;

function randomString(length) {
	var result = "";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity("Twitter employees", { type: ActivityType.Watching });
	client.user.setStatus("dnd");
	setInterval(async () => {
		console.log(`Logged in as ${client.user.tag}!`);

		// KEEP HUGGINGFACE MODEL ALIVE
		var headers = {
			Authorization: "Bearer " + config.huggingface_api_keys[api_rotation]
		};
		console.log("Fetching API to keep it alive...");

		var data = await (
			await fetch(API_URL, {
				method: "post",
				body: randomString(5),
				headers: headers
			})
		).json();
		console.log(data.generated_text);
		api_rotation = (api_rotation + 1) % config.huggingface_api_keys.length;
	}, 10000);
});

// HANDLE SLASH COMMANDS
client.on("interactionCreate", async (interaction) => {
	if (interaction.isCommand()) {
		switch (interaction.commandName) {
			case "ping":
				await interaction.reply({
					embeds: [
						{
							title: "Ping",
							description: `Pong! ${Math.round(client.ws.ping)}ms.`,
							timestamp: new Date().toISOString()
						}
					]
				});
				break;

			case "info":
				await interaction.reply({
					embeds: [
						{
							title: "Info",
							description: "A bot based on u/elon-bot in r/programmerhumor on Reddit. Discord version created by <@777662985165864980>",
							timestamp: new Date().toISOString()
						}
					]
				});
				break;

			case "chat":
				await interaction.deferReply();
				var headers = {
					Authorization: "Bearer " + config.huggingface_api_keys[api_rotation]
				};
				const response = await fetch(API_URL, {
					method: "post",
					body: interaction.options.getString("message").replace(".", ""),
					headers: headers
				});
				const data = await response.json();
				let botResponse = "";
				if (data.hasOwnProperty("generated_text")) {
					botResponse = data.generated_text
						.replace(/&amp%?;/g, "and")
						.replace(/&gt%?;/g, ">")
						.replace(/&lt%?;/g, "<");
				} else if (data.hasOwnProperty("error")) {
					// error condition
					botResponse = "An error has occurred! Please try again in 20 seconds.\n";
					console.log(data.error);
					// botResponse = data.error;
				}
				await interaction.editReply(botResponse);
				api_rotation = (api_rotation + 1) % config.huggingface_api_keys.length;
				break;
		}
	}
});

// HANDLE MESSAGES AND RANDOMLY REPLY
const twitter_replies = [
	"Twitter employees are the worst!",
	"Twitter employees are the worst!",
	"Twitter employees are the worst!",
	"Twitter employees are the worst!",
	"Twitter employees are the worst!",
	"Twitter employees are the worst!",
	"I will make Twitter better.",
	"Subscribe to Twitter Blue.",
	"I need anyone at Twitter who can code to report to room 301 at 10am tomorrow.",
	"Print out all code related to Twitter that you have written in the past 60 days.",
	"We need to debloat Twitter.",
	"I'm getting rid of Twitter microservices.",
	"Whoever writes the most code this month gets featured on my Twitter!",
	"I've laid off most of the staff, and Twitter's still running. Looks like they weren't necessary."
];
const talkback_replies = [
	"Disagreeing with me is counterproductive. Fired.",
	"Insubordination. Fired.",
	"I don't think I appreciate your tone. Fired.",
	"One more word out of you, and you're fired.",
	"No arguing with me. Fired.",
	"Arguing with me is counterproductive. Fired.",
	"Shut up or you're fired."
];
const replies = [
	"Pop quiz! Solve this LeetCode problem in 5 minutes or you're fired.",
	'What is "refactoring"?',
	"You're either hardcore or out the door.",
	"Looks like we're gonna need to trim the fat around here... fired.",
	"If you really love the company, you should be willing to work here for free.",
	"Guys, this is a big misunderstanding. I was playing truth or dare with Jeff and Bill and they dared me to buy Twitter. What else was I supposed to do??",
	"Due to unforeseen circumstances, you will now be receiving your salaries in Elon Bucks, accepted at any Tesla location!",
	"Why aren't we using Rust for this? It's memory safe.",
	"Yeah, looks like we're gonna need to redo the entire tech stack.",
	"Why have you only written 20 lines of code today?",
	"Interesting. Tell me more.",
	"If you can't build a computer out of transistors, you shouldn't be working here.",
	"Hey, I just heard about this thing called GraphQL. Why aren't we using it?",
	"Interns will happily work for $15 an hour. Why won't you?",
	"You look stupid. Fired.",
	"I don't think I appreciate your tone. Fired.",
	"Just watched a video about how vanilla JS is faster than any framework. It's time we do a rewrite.",
	`What do you mean "you couldn't code your way out of a paper bag"?`,
	"How can we use Bitcoin to solve this?",
	"It's now company policy to use Vim for editing. It lets you write code much faster.",
	"Twitter was never profitable. Not my fault. Stop blaming me for things.",
	"Can this be dockerized?",
	"Why haven't we gone serverless yet?",
	"From now on, all Twitter employees must purchase a subscription to Twitter Blue for the low-low price of $8 a month.",
	"Can we rewrite this in Java? It's better for enterprise.",
	"I'm gonna need you to come in on Saturday...",
	"Whoever writes the most code this month gets featured on my Twitter!",
	"QA is a waste of money. Fired.",
	"I've laid off most of the staff, and Twitter's still running. Looks like they weren't necessary.",
	"Send me your 10 most salient Discord messages.",
	"Why are we still serving free lunch?",
	"Twitter was never profitable. Not my fault. Stop blaming me for things.",
	"I have made promises to the shareholders that I definitely *cannot* keep, so I need you all to work TWICE as hard!",
	"Time is money. I want to see 100 lines written by lunchtime!"
];
const greetings = [
	"Hello!",
	"Hi!",
	"Hey!",
	"Hey, that's me!",
	"What's up?",
	"Hello!",
	"Hi!",
	"Hey!",
	"Hey, that's me!",
	"What's up?",
	"How are you doing?",
	"Hey there!",
	"How's it going?",
	"Stop pinging me and get back to work! 100 lines of code before lunch!",
	"Stop wasting time",
	"How's your day?",
	"Hi there!"
];
client.on("messageCreate", async (message) => {
	if (message.author.bot) return;

	if ((message.content.startsWith(".") || message.content.startsWith(`<@${client.user.id}>`)) && message.content.length > 1) {
		// form the request headers with Hugging Face API key
		var headers = {
			Authorization: "Bearer " + config.huggingface_api_keys[api_rotation]
		};

		// set status to typing
		message.channel.sendTyping();
		// query the server
		const response = await fetch(API_URL, {
			method: "post",
			body: message.content.replace(".", "").replace(`<@${client.user.id}>`, ""),
			headers: headers
		});
		const data = await response.json();
		let botResponse = "";
		if (data.hasOwnProperty("generated_text")) {
			botResponse = data.generated_text
				.replace(/&amp%?;/g, "and")
				.replace(/&gt%?;/g, ">")
				.replace(/&lt%?;/g, "<");
		} else if (data.hasOwnProperty("error")) {
			// error condition
			botResponse = "An error has occurred! Please try again in 20 seconds.\n";
			console.log(data.error);
			// botResponse = data.error;
		}
		message.reply(botResponse);
		api_rotation = (api_rotation + 1) % config.huggingface_api_keys.length;
		return;
	} else {
		if (message.content.toLowerCase().includes(`<@${client.user.id}>`)) {
			message.reply(greetings[Math.floor(Math.random() * greetings.length)]);
			return;
		}
		if (message.mentions.users.has(client.user.id)) {
			if (Math.random() <= 0.4) {
				await message.reply(talkback_replies[Math.floor(Math.random() * talkback_replies.length)]);
			}
			return;
		}
		if (message.content.toLowerCase().includes("twitter")) {
			if (Math.random() <= 0.6) {
				if (Math.random() <= 0.7) {
					await message.reply(twitter_replies[Math.floor(Math.random() * twitter_replies.length)]);
					return;
				}
			} else {
				if (Math.random() <= 0.3) {
					await message.reply(replies[Math.floor(Math.random() * replies.length)]);
					return;
				}
			}
		} else {
			if (Math.random() <= 0.05) {
				await message.reply(replies[Math.floor(Math.random() * replies.length)]);
				return;
			}
		}
	}
});

client.login(config.token);

// please do not crash my bot so it does not crash the bot so it does not crash the bot so it does not crash the bot so it does not crash the bot so it does not crash the bot
process.on("unhandledRejection", (reason, p) => {
	// console.log(" [Error_Handling] :: Unhandled Rejection/Catch");
	// console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
	// console.log(" [Error_Handling] :: Uncaught Exception/Catch");
	// console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
	// console.log(" [Error_Handling] :: Uncaught Exception/Catch (MONITOR)");
	// console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
	// console.log(" [Error_Handling] :: Multiple Resolves");
	// console.log(type, promise, reason);
});
