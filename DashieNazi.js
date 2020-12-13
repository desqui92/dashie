const Discord = require("discord.js");
const client = new Discord.Client();
const configu = require("./config.json");
const request = require("request");
const fs = require("fs");
var config = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));
const servers = {};
//const bot_controller = process.env.BOT_CONTROLLER;
const prefix = config.prefix;
var guilds = {};
var queue = [];
var isPlaying = false;
var dispatcher = null;
var voiceChannel = null;
var skipReq = 0;
var skippers = [];
var SWFReader = require('swf-reader');
const EventEmitter = require("events");
class MyEmitter extends EventEmitter{}
EventEmitter.defaultMaxListeners = 100000000000;
var emitter = new MyEmitter();
//emitter.setMaxListeners(40);
client.login(process.env.BOT_TOKEN);

//lel

bot.on('message', msg => { // Message function
   if (msg.author.bot) return; // Ignore all bots
   if (msg.content.startsWith(settings.prefix)) return; // It always has to starts with the prefix which is '!'

   if (msg.content.startsWith(settings.prefix + "pingg")) { // When a player does '!ping'
     msg.reply("Pong!") // The bot will say @Author, Pong!
   }
});
