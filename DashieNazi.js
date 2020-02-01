const Discord = require("discord.js");
const Canvas = require("canvas");
const ffmpeg = require('ffmpeg')
const opusscript = require('opusscript');
const snekfetch = require("snekfetch");
const client = new Discord.Client();
const configu = require("./config.json");
const ytdl = require("ytdl-core");
const request = require("request");
const fs = require("fs");
const getYouTubeID= require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");
var config = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));
const servers = {};
const yt_api_key = process.env.KEY;
const bot_controller = process.env.BOT_CONTROLLER;
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


client.on('message', function(message){
  const member = message.member;
  const mess = message.content.toLowerCase();
  const args = message.content.split(' ').slice(1).join(" ");
  if(mess.startsWith(prefix + "play")){
    if(message.member.voiceChannel || member.voiceChannel){
    if(queue.length > 0 || isPlaying){
      getID(args, function(id){
        add_to_queue(id);
        fetchVideoInfo(id, function(err, videoInfo){
          if(err) throw new Error(err);
          message.reply(" Ahora reproduciendo **" + videoInfo.title + "**");
        });
      });
    }else{
      isPlaying = true;
      getID(args, function(id){
        queue.push("placeholder");
        playMusic(id, message);
        fetchVideoInfo(id, function(err, videoInfo){
          if(err) throw new Error(err);
          message.reply(" Ahora reproduciendo **" + videoInfo.title + "**");
        });
      });
    }
  }else{
    message.reply("Tenes que estar en un canal de voz");
  }
  }else if(mess.startsWith(prefix + "saltar")){
    if(skippers.indexOf(message.author.id) === -1 ){
      skippers.push(message.author.id);
      skipReq++;
      if(skipReq >= Math.ceil(voiceChannel.members.size - 1) / 2){
        skip_song(message);
        message.reply(" Salteando ");
      } else{
       message.reply(" Necesitas" + Math.ceil((voiceChannel.members.size -1) / 2) - skipReq)+ "votos mas!";
    }
  } else{
    message.reply("vos ya votaste para saltear!");
  }
}
});

/*var servers = {};
function play(connection, message){
   var server = servers[message.guild.id];
   server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
   server.queue.shift();
   server.dispatcher.on("end", function(){
     if(server.queue[0]) play(connection, message);
     else connection.disconnect();
   });
}*/
/*Ver Participantes de Sorteo*/
client.on('message', message =>{
if(message.content.startsWith("+participantes")){
    let roleName = message.content.split(" ").slice(1).join(" ");

    //Filtering the guild members only keeping those with the role
    //Then mapping the filtered array to their usernames
    let membersWithRole = message.guild.members.filter(member => {
        return member.roles.find(ch => ch.name === '🍀-Participantes-🍀');
    }).map(member => {
        return member.user.username;
    })

    let embed = new Discord.RichEmbed({
        "title": `Usuarios participantes del sorteo:`,
        "description": membersWithRole.join(", "),
        "color": 0xFFFF
    });

    return message.channel.send({embed});
}
});

/*PArticipar de sorteo*/
client.on('message', message =>{
if(message.content.startsWith("+participar")){
    var role = message.guild.roles.find(ch => ch.name ==='🍀-Participantes-🍀');
    message.member.addRole(role.id);
};
});

/*Remover participantes del sorteo
client.on('message', message =>{
if(message.content.startsWith("+removerparticipantes")){
 var role = message.guild.roles.find(ch => ch.name ==='🍀-Participantes-🍀');
  role.delete();
}
});*/


/*SORTEO
client.on("readi", function() {
  var Count;
  for(Count in client.users.array()){
  var User = client.users.array()[Count];
  console.log(User.username);
}
});*/

client.once("ready", () => {
  console.log("I am ready!");
});

function skip_song(message){
  dispatcher.end();
  if(queue.length > 1){
    playMusic(queue[0], message);
  } else{
    skipReq = 0;
    skippers = [];
  }
}

function playMusic(id, message){
  voiceChannel = message.member.voiceChannel;
  voiceChannel.join().then(function (connection){
    stream = ytdl("https://www.youtube.com/watch?v=" + id,{
      filter: 'audioonly'
  });
  slipReq = 0;
  skippers = [];
  dispatcher = connection.playStream(stream);
  dispatcher.on("end", function(){
    skipReq = 0;
    skippers = [];
    queue.shift();
    if(queue.length === 0){
      queue = [];
      isPlaying = false;
    } else {
      playMusic(queue[0], message);
    }
  });
});
}


function getID(str, cb){
  if(isYouTube(str)){
    cb(getYouTubeID(str));
  } else{
    search_video(str, function(id){
      cb(id);
    });
  }
}

function add_to_queue(strID){
  if(isYouTube(strID)){
  queue.push(getYouTubeId(strID));
} else {
  queue.push(strID);
}
}


function search_video(query, callback){
  request ("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_api_key, function(error, response, body){
  var json = JSON.parse(body);
  callback(json.items[0].id.videoId);
});
}



function isYouTube(str){
  return str.toLowerCase().indexOf("youtube.com") > - 1;

}


/*
client.on("message", function(message){
  if (!message.content.startsWith(prefix)) return;
//if(message.member.roles.find((ch => ch.name ==='📜-Moderador-📜'))){
var args = message.content.substring(prefix.lenght).split(" ");
switch (args[0].toLowerCase()){
  case "+reproducir":
      if(!args[1]) {
      message.channel.sendMessage("Porfavor provee un link");
      return;
      }
      if(!message.member.voiceChannel){
        message.channel.sendMessage("Debes estar en un canal de voz");
        return;
      }
      if(!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
      };
      var server = servers[message.guild.id];

      server.queue.push(args[1]);
      if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
        play(connection, message);
      });
      break;
  case "saltear":
      var server = servers[message.guild.id];
      if(server.dispatcher) server.dispatcher.end();
      break;
  case "parar":
      var server = servers[message.guild.id];
      if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
}
//}
});
*/

/*
client.on("message", (message) => {
if(message.member.roles.find((ch => ch.name === '📜-Moderador-📜'))){
if (message.content.startsWith(prefix + "axelenladuchahd")) {
message.channel.send("some text", {
    file: "https://media.discordapp.net/attachments/494349508298276875/494638462092443649/4493001572_5d0fbe4f47_o.jpg"
});
}
}
});
*/

client.on("message", (message) => {
if (message.content.startsWith(prefix + "parar")) {
  var server = servers[message.guild.id];
  if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
}
});
/*
client.on("message", (message) => {
  if (message.content.startsWith("hacemeunhuevofrito")) {
    message.channel.send("Y porque no te haces una teta al hornou!");
  }
});
*/

client.on("message", (message) => {
  var voiceChannel = message.member.voiceChannel;
  if (message.content.startsWith("+sorpresa")) {
    voiceChannel.join().then(connection =>{const dispatcher = connection.playFile('./axelon.wav'); dispatcher.on("end", end => {voiceChannel.leave();});}).catch(err => console.log(err));
}
});


/*
client.on("message", (message) => {
  // If the message is "what is my avatar"
  if (message.content.startsWith("cualesmiavatar")) {
    // Send the user's avatar URL
    message.channel.send(author.avatarURL);
  }
});

*/
client.on('message', message =>{
  if(message.author.bot) return undefined;
  let msg = message.content.toLowerCase();
  let args = message.content.slice(prefix.length).trim().split(' ');
  let command = args.shift().toLowerCase();
  if(command === 'avatar'){
  let user = message.mentions.users.first() || message.author;

  let embed = new Discord.RichEmbed()
  .setAuthor(`${user.username}`)
  .setImage(user.displayAvatarURL)
  message.channel.send(embed)
  }
});



const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');

    // Declare a base size of the font
    let fontSize = 70;

    do {
        // Assign the font to the context and decrement it so it can be measured again
        ctx.font = `${fontSize -= 10}px sans-serif`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (ctx.measureText(text).width > canvas.width - 300);

    // Return the result to use in the actual canvas
    return ctx.font;
};


client.on('guildMemberAdd', async member => {
  const channel = member.guild.channels.find(ch => ch.name === '🌌recepcion🌌');
    if (!channel) return;

    const canvas = Canvas.createCanvas(1200, 472);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('./wallpaper.jpg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    //ctx.strokeStyle = '#74037b';
    //ctx.strokeRect(300, 0, canvas.width, canvas.height);

    // Slightly smaller text placed above the member's display name
    //ctx.font = '28px manicdepress red';
    //ctx.fillStyle = '#ffffff';
    //ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

    // Add an exclamation point here and below
    ctx.font = applyText(28, `${member.displayName}!`);
    ctx.fillStyle = '#ff0000';
    ctx.fillText(`${member.displayName}`, canvas.width/2.5, canvas.height / 1.8);

    ctx.beginPath();
    ctx.arc(320, 140, 65, 0, 2 * Math.PI, true);
    //ctx.rect(20,20,200,200);
    //ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const { body: buffer } = await snekfetch.get(member.user.displayAvatarURL);
    const avatar = await Canvas.loadImage(buffer);
    ctx.drawImage(avatar, 260, 80, 135, 135);

    const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

    channel.send(`Welcome to the server, ${member}!`, attachment);
});


client.on("message", msg => {
    if (msg.content.toLowerCase().startsWith(prefix + "borrarchat")) {
        async function clear() {
            msg.delete();
            const fetched = await msg.channel.fetchMessages({limit: 99});
            msg.channel.bulkDelete(fetched);
        }
        clear();
    }
});
/*
client.on("message", msg => {
    if(msg.guild.roles.find((ch => ch.name === 'Administrador'))){
    if (msg.content.toLowerCase().startsWith(prefix + "borrarchut")) {
        async function clear() {
            msg.delete();
            const fetched = await msg.channel.fetchMessages({limit: 99});
            msg.channel.bulkDelete(fetched);
        }
        clear();
    }
  }
});

*/
    //if(msg.member.permissions.has('ADMINISTRATOR')){

/*client.on("message", message=> {
    if (message.content.toLowerCase().startsWith(prefix + "loop")) {
      var interval = setInterval (function () {
        message.channel.send("Numero1")
      }, 1 * 1000);
    }
});*/


// add message as a parameter to your callback function


/*CODIGO REPETIR FRASE 4 VECES Y PARAR
client.on('message', function(message) {
    // Now, you can use the message variable inside
var i = 0;
    if (message.content === "$loop") {
        var interval = setInterval (function () {
            // use the message's channel (TextChannel) to send a new message
            message.channel.send("123")
            i++
           if(i==4){
              clearInterval(interval);
}
        }, 1 * 1000);
    }
});*/





client.on('message', function(message) {
    // Now, you can use the message variable inside
var i = 0;
  if (message.content === "$sortear") {
  message.channel.send("SORTEANDO GANADOR:");
let membersWithRole = message.guild.members.filter(member => {
        return member.roles.find(ch => ch.name === '🍀-Participantes-🍀');
    }).map(member => {
        return member.user;
    })
var intervalo = setInterval (function(){
  nombresito = membersWithRole[Math.floor(Math.random() * membersWithRole.length)];
  channel = message.guild.channels.find(ch => ch.name === '🎹-composiciones-🎹');


 message.channel.send(nombresito.username);
message.channel.bulkDelete(1);
  i++;
  if(i==4){
     clearInterval(intervalo);
      lol(nombresito, channel).then();
}
}, 1 * 1000);

}
});

async function lol(nombresito, channel){
  const canvas = Canvas.createCanvas(1000, 1000);
  const ctx = canvas.getContext('2d');

  const background = await Canvas.loadImage('./wallpaper.jpg');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(300, 0, canvas.width, canvas.height);

    // Slightly smaller text placed above the member's display name
    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('El ganador es:,', canvas.width / 2.5, canvas.height / 3.5);

    // Add an exclamation point here and below

    ctx.font = applyText(canvas, `${nombresito.displayName}!`);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${nombresito.username}!`, canvas.width / 2.5 - 125, canvas.height / 1.8 + 200);

    ctx.beginPath();
    ctx.rect(300,300,200,200);
    //ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const { body: buffer } = await snekfetch.get(nombresito.displayAvatarURL);
    const avatar = await Canvas.loadImage(buffer);
    ctx.drawImage(avatar, 300, 300, 200, 200);

    const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

    channel.send(`FELICIDADES, ${nombresito.username}!, GANASTE!!!!!!`, attachment);
  }

/*
client.on("message", (message) => {
  let command = message.content.split(" ");
  let comande = command[0];
let args = comande.slice(1);
 if (comande === 'holoe') {
    let miembro = message.guild.member(message.mentions.users.first());
 channel = message.guild.channels.find(ch => ch.name === '🎹-composiciones-🎹');

  message.guild.member(miembro).kick('lul');
message.channel.bulkDelete(1);
  }
});
*/

/*
client.on("message", (message) => {  
var voiceChannel = message.member.voiceChannel;
 var i = 0;  
if (message.content.startsWith("+bug")) {
var intervalo = setInterval (function(){
  i++
    voiceChannel.join();
setTimeout(function(){ 
    voiceChannel.leave();
}, 1000);
  if(i === 100){
     clearInterval(intervalo);
}
}, 1 * 1000);
}
});
*/

/*

client.on('message', function(message) {
    // Now, you can use the message variable inside
var dx= 0;
var i = 0;
var dy= 0;
var izquierda = "false";
var arriba = "false";
  if (message.content === "$jugar") {
  message.channel.send("INICIANDO JUEGO:");
var intervalo = setInterval (function(){
  channel = message.guild.channels.find(ch => ch.name === '🤖-comandos-🤖');
if(izquierda === "true"){
dx -=20;
} else if(izquierda === "false"){
dx +=20;
}
if(arriba === "true"){
dy+=20;
} else if(arriba === "false"){
dy -=20;
}
if(dx === 200){
  izquierda = "true";
}
if(dx === -200){
  izquierda = "false";
}
if(dy === 20){
  arriba = "false";
}
if(dy === -380){
  arriba = "true";
}

 message.channel.bulkDelete(1);
lol(channel, dx, dy).then();
i++;

  if(i === 100){
     clearInterval(intervalo);
}
}, 1 * 1000);
}
});


async function lol(channel, dx, dy){
  const canvas = Canvas.createCanvas(400, 400);
  const ctx = canvas.getContext('2d');
   var x = 0;
   var y = 0;
  var opo = canvas.width/2;
   var apa = canvas.height-20;
    // Slightly smaller text placed above the member's display name

     x = x + dx + opo;
     y = y + dy + apa;

const c = await Canvas.loadImage('./c.jpg');
  ctx.drawImage(c, x, y, c.width, c.height);

const attachment = new Discord.Attachment(canvas.toBuffer('image/png', {quality: 0.5}), 'welcome-image.png');
channel.send(attachment);
}

*/


client.on("message", (message) => {
/* if(message.member.roles.find((ch => ch.name === '⚓️-Creador-⚓️'))){ */
var letraa = client.emojis.find(ch => ch.name === 'a_');
var letrab = client.emojis.find(ch => ch.name === 'b_');
var letrac = client.emojis.find(ch => ch.name === 'c_');
var letrad = client.emojis.find(ch => ch.name === 'd_');
var letrae = client.emojis.find(ch => ch.name === 'e_');
var letraf = client.emojis.find(ch => ch.name === 'f_');
var letrag = client.emojis.find(ch => ch.name === 'g_');
var letrah = client.emojis.find(ch => ch.name === 'h_');
var letrai = client.emojis.find(ch => ch.name === 'i_');
var letraj = client.emojis.find(ch => ch.name === 'j_');
var letrak = client.emojis.find(ch => ch.name === 'k_');
var letral = client.emojis.find(ch => ch.name === 'l_');
var letram = client.emojis.find(ch => ch.name === 'm_');
var letran = client.emojis.find(ch => ch.name === 'n_');
var letrao = client.emojis.find(ch => ch.name === 'o_');
var letrap = client.emojis.find(ch => ch.name === 'p_');
var letraq = client.emojis.find(ch => ch.name === 'q_');
var letrar = client.emojis.find(ch => ch.name === 'r_');
var letrase = client.emojis.find(ch => ch.name === 'ss_');
var letrat = client.emojis.find(ch => ch.name === 't_');
var letrau = client.emojis.find(ch => ch.name === 'u_');
var letrav = client.emojis.find(ch => ch.name === 'v_');
var letraw = client.emojis.find(ch => ch.name === 'w_');
var letrax = client.emojis.find(ch => ch.name === 'x_');
var letray = client.emojis.find(ch => ch.name === 'y_');
var letraz = client.emojis.find(ch => ch.name === 'z_');
var letrero = message.guild.emojis.get("501293872484188170");
  var voiceChannel = message.member.voiceChannel;
  if (message.content.startsWith("°")) {
message.channel.bulkDelete(1);
var i = 0;    
var agarrar = message.content;
   var agarrer = (agarrar.match(/.{1}/g));
   var letras = agarrar.length;
agarrar = agarrar.replace(/°/g, "");
agarrar = agarrar.replace(/a/g, letraa);
agarrar = agarrar.replace(/b/g, letrab);
agarrar = agarrar.replace(/c/g, letrac);
agarrar = agarrar.replace(/d/g, letrad);
agarrar = agarrar.replace(/e/g, letrae);
agarrar = agarrar.replace(/f/g, letraf);
agarrar = agarrar.replace(/g/g, letrag);
agarrar = agarrar.replace(/h/g, letrah);
agarrar = agarrar.replace(/i/g, letrai);
agarrar = agarrar.replace(/j/g, letraj);
agarrar = agarrar.replace(/k/g, letrak);
agarrar = agarrar.replace(/l/g, letral);
agarrar = agarrar.replace(/m/g, letram);
agarrar = agarrar.replace(/n/g, letran);
agarrar = agarrar.replace(/o/g, letrao);
agarrar = agarrar.replace(/p/g, letrap);
agarrar = agarrar.replace(/q/g, letraq);
agarrar = agarrar.replace(/r/g, letrar);
agarrar = agarrar.replace(/s/g, letrase);
agarrar = agarrar.replace(/t/g, letrat);
agarrar = agarrar.replace(/u/g, letrau);
agarrar = agarrar.replace(/v/g, letrav);
agarrar = agarrar.replace(/w/g, letraw);
agarrar = agarrar.replace(/x/g, letrax);
agarrar = agarrar.replace(/y/g, letray);
agarrar = agarrar.replace(/z/g, letraz);
    
agarrar = agarrar.replace(/A/g, letraa);
agarrar = agarrar.replace(/B/g, letrab);
agarrar = agarrar.replace(/C/g, letrac);
agarrar = agarrar.replace(/D/g, letrad);
agarrar = agarrar.replace(/E/g, letrae);
agarrar = agarrar.replace(/F/g, letraf);
agarrar = agarrar.replace(/G/g, letrag);
agarrar = agarrar.replace(/H/g, letrah);
agarrar = agarrar.replace(/I/g, letrai);
agarrar = agarrar.replace(/J/g, letraj);
agarrar = agarrar.replace(/K/g, letrak);
agarrar = agarrar.replace(/L/g, letral);
agarrar = agarrar.replace(/M/g, letram);
agarrar = agarrar.replace(/N/g, letran);
agarrar = agarrar.replace(/O/g, letrao);
agarrar = agarrar.replace(/P/g, letrap);
agarrar = agarrar.replace(/Q/g, letraq);
agarrar = agarrar.replace(/R/g, letrar);
agarrar = agarrar.replace(/S/g, letrase);
agarrar = agarrar.replace(/T/g, letrat);
agarrar = agarrar.replace(/U/g, letrau);
agarrar = agarrar.replace(/V/g, letrav);
agarrar = agarrar.replace(/W/g, letraw);
agarrar = agarrar.replace(/X/g, letrax);
agarrar = agarrar.replace(/Y/g, letray);
agarrar = agarrar.replace(/Z/g, letraz);
var agarreru = agarrar;
    message.channel.send(`${agarreru} .`); 
    }
/*}*/
});
