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
var bottoken = "Nzg3NzU3NjY4MjQwMDY0NTMy.X9Zmfw.-ZrGREBlsEJMF6VJ_i01x8410GI";
const EventEmitter = require("events");
class MyEmitter extends EventEmitter{}
EventEmitter.defaultMaxListeners = 100000000000;
var emitter = new MyEmitter();
//emitter.setMaxListeners(40);
client.login("Nzg3NzU3NjY4MjQwMDY0NTMy.X9Zmfw.-ZrGREBlsEJMF6VJ_i01x8410GI");
//client.login(process.env.BOT_TOKEN);

//lel
//FONDO
body.onload = fondo;
function fondo(){
  let hola = document.getElementsByClassName("chatContent-a9vAAp")[0];
  hola.style.backgroundColor = "rgba(20,20,20)";
}


