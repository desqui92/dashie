const Discord = require("discord.js");
const client = new Discord.Client();
const configu = require("./config.json");
/*const request = require("request");
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
const EventEmitter = require("events");
class MyEmitter extends EventEmitter{}
EventEmitter.defaultMaxListeners = 100000000000;
var emitter = new MyEmitter();
//emitter.setMaxListeners(40);
*/
const userID = "559117077298806804";

client.on('message', msg => {
   if(message.sender === userID){
   if ((msg.content === "!peping")){
     msg.reply("Pong!");
     }
   }
});

client.login(process.env.BOT_TOKEN);
