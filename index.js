//Imports

import {Client, IntentsBitField, ActivityType, REST, Routes, EmbedBuilder, ApplicationCommandOptionType} from "discord.js"
import { GoogleGenerativeAI } from "@google/generative-ai";
import ms from 'ms';

//Bot Variables

const BotToken = "BotToken";
const BotID = "BotID";
const GoogleAIKey = new GoogleGenerativeAI("GoogleAIKey");

//Bot Intents

const BOT = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

//Bot Statup

BOT.on("ready", (Online) => {
    console.log(`Bot logged in as ${BOT.user.tag}.`);
    BOT.user.setActivity({
        name: "for /help",
        type: ActivityType.Watching,
    })
});

//Registration Of Commands

const CmdReg = [
    {
        name:"info",
        description: "Provides you with the information about FIIEJEE bot.",
    },
    {
        name:"help",
        description: "Provides you with a list of all the commands FIITJEE bot can perform.",
    },
    {
        name:"invite",
        description: "Provides you with the invite link for the server.",
    },
    {
        name:"report",
        description: "Provides you with a means to report a user or something related to the server.",
    },
    {
        name: "ask-ai",
        description: "Provides you with the option to ask any questions to AI, this system is based upon Google Gemini.",
        options: [
            {
                name: "question",
                description: 'Type the question here.',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
];

//Command Registration Load

const Rest = new REST({version: "10"}).setToken(BotToken)

try {
  console.log('Started refreshing application (/) commands.');
    
  await Rest.put(Routes.applicationCommands(BotID), { body: CmdReg });
  
  console.log('Successfully reloaded application (/) commands.');

} catch (error) {
  console.error(error);
}

//On Member Join Message

BOT.on("guildMemberAdd", (JoinMsg) => {
    JoinMsg.send(`
Welcome to FIITJEE 2023-2025 (Dilsukhnagar) Discord server! Please go to <#1122542858428223599> and type "/nick (Your Full Name)" to update your nickname.

Remember to replace "Your Full Name" with your actual full name, without the brackets. This will update your nickname on the server.

If you need any assistance, feel free to ask in the respective channels. Enjoy your time here and best of luck with your studies!
`)
});

//Slash Commands

BOT.on("interactionCreate", (Interaction) => {
    if (!Interaction.isChatInputCommand()) return;

//info

    if (Interaction.commandName === "info") {

        const Embed = new EmbedBuilder()
        .setColor(0xFFF759)
        .setTitle("Information About FIITJEE Bot")
        .setDescription("Provides you with the information about FIIEJEE bot.")
        .addFields(
            { name:"Bot Developer", value: "Debdatta Mandal | debdattamandal.in"},
        )
        .addFields(
            { name:"Bot Open Source Repository", value:"https://github.com/debdattamandalin/FIITJEE-Discord-Bot"},
        )
        .addFields(
            { name:"Bot Latency", value: `${Date.now() - Interaction.createdTimestamp}ms`},
        )
        .addFields(
            { name:"Bot Uptime", value: `${ms(BOT.uptime)}`},
        );
        Interaction.reply({embeds: [Embed]});
    }

//help

    if (Interaction.commandName === "help") {
        const Embed = new EmbedBuilder()
        .setColor(0xFFF759)
        .setTitle("FIITJEE Bot Server Commands")
        .setDescription("Provides you with a list of all the commands FIITJEE bot can perform.")
        .addFields(
            { name:"/info", value: "Provides you with the information about FIIEJEE bot."},
        )
        .addFields(
            { name:"/help", value: "Provides you with the list of all the commands FIITJEE bot can perform."},
        )
        .addFields(
            { name:"/invite", value: "Provides you with the invite link for the server."},
        )
        .addFields(
            { name:"/report", value: "Provides you with a means to report a user or something related to the server."},
        )
        .addFields(
            { name:"/ask-ai", value: "Provides you with the option to ask any questions to AI, this system is based upon Google Gemini."},
        );
        Interaction.reply({embeds: [Embed]});
    }

//invite

    if (Interaction.commandName === "invite") {
        const Embed = new EmbedBuilder()
        .setColor(0xFFF759)
        .setTitle("FIITJEE Server Invite Link")
        .setDescription("https://discord.gg/2KfGsTXxFJ");
        Interaction.reply({embeds: [Embed]});
    }

//invite

    if (Interaction.commandName === "report") {
        Interaction.reply("Coming Soon.")
    }

//ask-ai

    if (Interaction.commandName === 'ask-ai') {
        async function run() {
            await Interaction.deferReply();
            const GoogleAIModel = GoogleAIKey.getGenerativeModel({ model: "gemini-pro"});
            const Question = Interaction.options.get("question").value;
            const Result = await GoogleAIModel.generateContent(Question);
            const Response = await Result.response;
            const ResponseText = Response.text();
            const Embed = new EmbedBuilder()
            .setColor(0xFFF759)
            .setTitle(`Question: ${Question}`)
            .setDescription(ResponseText)
            Interaction.editReply({embeds: [Embed]});
        }
        run();
    }
})

//Bot Login

BOT.login(BotToken)
