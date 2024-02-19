import {Client, IntentsBitField, ActivityType, REST, Routes, EmbedBuilder, ApplicationCommandOptionType, SlashCommandBuilder, GatewayIntentBits} from "discord.js"
import { GoogleGenerativeAI } from "@google/generative-ai";

//Bot Variables
const BotToken = "MTIwODY3NDc1NjQyNjIwMzEzNg.GLcknL.gfN1-r2BIn7RQ32iDxIW2Q2N0ODlX_OrhQrdTw";
const BotID = "1208674756426203136";
const GoogleAIKey = new GoogleGenerativeAI("AIzaSyBDeB1AWAo_Poq6j_7Kn-PlwKI_i8adMmg");

const BOT = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        GatewayIntentBits.Guilds
    ],
});

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
        name:"help",
        description: "List of all the commands FIITJEE bot can perform.",
    },
    {
        name: "ask-ai",
        description: "Let's you ask any questions to AI, this system is based upon Google Gemini.",
        options: [
            {
                name: "prompt",
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



BOT.on("interactionCreate", (Interaction) => {
    if (!Interaction.isChatInputCommand()) return;

    if (Interaction.commandName === "help") {
        const Embed = new EmbedBuilder()
        .setColor(0xFFF759)
        .setTitle("FIITJEE Bot Server Commands")
        .setDescription("List of all the commands FIITJEE bot can perform.")
        .addFields(
            { name:"/info", value: "Provides you with the information about FIIEJEE bot."},
        )
        .addFields(
            { name:"/help", value: "Provides you with the list of all the commands FIITJEE bot can perform."},
        )
        .addFields(
            { name:"/server-help", value: "Information about the utility of a specific channel."},
        )
        .addFields(
            { name:"/invite", value: "Provides you with the invite link for the server."},
        )
        .addFields(
            { name:"/report", value: "If you wish to report a user or something related to the server"},
        )
        .addFields(
            { name:"/ask-ai", value: "Let's you ask any questions to AI, this system is based upon Google Gemini."},
        );
        Interaction.reply({embeds: [Embed]});
    }

    if (Interaction.commandName === 'ask-ai') {
        async function run() {
            const model = GoogleAIKey.getGenerativeModel({ model: "gemini-pro"});
            const prompt = Interaction.options.get("prompt").value;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log(text);
            Interaction.reply(text);
        }
        run();
    }
})

BOT.login(BotToken)