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
//client.on('ready', () => { client.sendMessage('728763757299367970', 'test'); });
//bot.sendMessage('728763757299367970', 'Hola');

client.on('message', msg => {
   if(msg.author.id === userID){
   if ((msg.content === "namer")){
     msg.guild.member(userID).setNickname('>RodrigoG<');
     }
   }
});/*
client.on('message', msg => {
   if(msg.author.id === userID){
   if ((msg.content === "Si en un bosque hay un arbol, se cae y no hay nadie cerca. Mientras le parten un palo en la cabeza a axel. ¿Hace ruido?")){
     msg.reply("Beep Boop Beep, Depende del diametro del palo y de si la cabeza de axel explota o si se queja");
     }
   }
});
client.on('message', msg => {
   if(msg.author.id === userID){
   if ((msg.content === "Gracias bot")){
     msg.reply("Beep Boop Beep, De nada!");
     }
   }
});*/
/*
client.on('message', msg => {
   if ((msg.content === "!peping")){
     msg.reply("Pong!");
     console.log("Liston");
     }
});
*/
client.login(process.env.BOT_TOKEN);
