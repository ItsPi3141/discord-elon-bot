const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent] });
const config = require("./config.json");

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity("Twitter employees", { type: ActivityType.Watching });
	client.user.setStatus("dnd");
	setInterval(() => {
		console.log(`Logged in as ${client.user.tag}!`);
	}, 20000);
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
client.on("messageCreate", async (message) => {
	if (message.author.bot) return;
	if (message.mentions.users.has(client.user.id)) {
		if (Math.random() <= 0.85) {
			await message.reply(talkback_replies[Math.floor(Math.random() * talkback_replies.length)]);
		}
		return;
	}
	if (message.content.toLowerCase().includes("twitter")) {
		if (Math.random() <= 0.7) {
			if (Math.random() <= 0.7) {
				await message.reply(twitter_replies[Math.floor(Math.random() * twitter_replies.length)]);
				return;
			}
		} else {
			if (Math.random() <= 0.7) {
				await message.reply(replies[Math.floor(Math.random() * replies.length)]);
				return;
			}
		}
	} else {
		if (Math.random() <= 0.1) {
			await message.reply(replies[Math.floor(Math.random() * replies.length)]);
			return;
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
