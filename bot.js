var Discord2 = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const client = new Discord.Client();
const prefix = "sh";
const fetch = require('node-fetch');
const superagent = require("superagent");
const { cli } = require('winston/lib/winston/config');
const queue = new Map();
var thing = new Map();
var started = new Map();
var seconds = 0;
var musicon = true;
var tokenn = ("");
var slapsy = ["./tenorslap.gif","./tenorslap2.gif","./tenorslap3.gif","./tenorslap4.gif","./tenorslap5.gif","./tenorslap6.gif"];
var hugsy = ["./tenorhug.gif","./tenorhug2.gif","./tenorhug3.gif","./tenorhug4.gif","./tenorhug5.gif","./tenorhug6.gif"];
var patsy = ["./tenorpat.gif","./tenorpat2.gif","./tenorpat3.gif","./tenorpat4.gif","./tenorpat5.gif","./tenorpat6.gif"];
var kissy = ["./tenorkiss.gif","./tenorkiss2.gif","./tenorkiss3.gif","./tenorkiss4.gif","./tenorkiss5.gif","./tenorkiss6.gif"];
var kicks = ["./tenorkick.gif","./tenorkick2.gif","./tenorkick3.gif","./tenorkick4.gif","./tenorkick5.gif","./tenorkick6.gif"];
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord2.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('ready', () => {
    // Set bot status to: "Playing with JavaScript"

    // Alternatively, you can set the activity to any of the following:
    // PLAYING, STREAMING, LISTENING, WATCHING
    // For example:
    // client.user.setActivity("TV", {type: "WATCHING"})
})
client.once('ready', () => {
    client.user.setActivity("sh help | " + client.guilds.cache.size + " servers", {type: "PLAYING"});
     console.log("yep we are in" + Math.round(client.ws.ping) + " ms");
     setInterval(() => {
seconds += 1;
       },1000);
       setInterval(() => {
        client.user.setActivity("sh help | " + client.guilds.cache.size + " servers", {type: "PLAYING"});
               },300000);
})
client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith('sh')) return;
  
    const serverQueue = queue.get(message.guild.id);
    if (message.content.startsWith(`sh play`) && musicon) {
      execute(message, serverQueue);
      return;
    } else if (message.content.startsWith(`sh skip`) && musicon) {
      skip(message, serverQueue);
      return;
    } else if (message.content.startsWith(`sh queue`) && musicon){
      queuee(message,serverQueue);
      return;
    }
     else if (message.content.startsWith(`sh leave`) && musicon){
     leave(message, serverQueue);
    return;
  }
  });
  
  async function execute(message, serverQueue) {
    const args = message.content.split(" ");
  
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to play music!"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    }
  
    const songInfo = await ytdl.getInfo(args[2]).catch(error => {
        console.error('Failed to find song(not a url):', error);
      });

    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url
    }
  
    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };
      
  
      queue.set(message.guild.id, queueContruct);
  
      queueContruct.songs.push(song);
  
      try {
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        play(message.guild, queueContruct.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);
      const queuembed = new Discord.MessageEmbed()
            .setColor('#FFDF00')
            .setAuthor('Song added')
            .setTitle('Queue + ' + song.title);
      return message.channel.send(queuembed);
      //return message.channel.send(`${song.title} has been added to the queue!`);
    }
  }
  
  function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    if (!serverQueue)
      return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
  }

  function queuee(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to check the queue!"
      );
      else{
        const queuembede = new Discord.MessageEmbed()
            .setColor('#FFDF00')
            .setAuthor('Songs in the queue')
            .setTitle(serverQueue.songs);
    message.channel.send(queuembede).catch(error => {
      console.error('Failed to send queue:', error);
    });
      }
  }

  function leave(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }

  function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
  
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    const playembed = new Discord.MessageEmbed()
            .setColor('#FFDF00')
            .setTitle('Start playing: ' + song.title);
    serverQueue.textChannel.send(playembed);
    //serverQueue.textChannel.send(`Start playing: **${song.title}**`);
  }
client.on("message", async (message) => {
    if(message.content == "sh dog"){
        fetch("https://dog.ceo/api/breeds/image/random")
        .then(res => res.json()).then(body => {
        if(!body) {
            const errembed = new Discord.MessageEmbed()
            .setColor('#FFDF00')
            .setTitle('Error')
            .setDescription("Something broke. Try again.");
            message.channel.send(errembed);
        }
        else{
            const catembed = new Discord.MessageEmbed()
            .setColor('#FFDF00')
            .setTitle('Woof!')
            .setImage(body.message);
            message.channel.send(catembed);
        }
    })
    }
    if(message.content == "sh cat"){
            fetch("https://some-random-api.ml/img/cat")
            .then(res => res.json()).then(body => {
            if(!body) {
                const errembed = new Discord.MessageEmbed()
                .setColor('#FFDF00')
                .setTitle('Error')
                .setDescription("Something broke. Try again.");
                message.channel.send(errembed);
            }
            else{
                const catembed = new Discord.MessageEmbed()
                .setColor('#FFDF00')
                .setTitle('Meow!')
                .setImage(body.link);
                message.channel.send(catembed);
            }
        })
    }
    if(message.content == "sh meme"){
        fetch("https://some-random-api.ml/meme")
        .then(res => res.json()).then(body => {
        if(!body) {
            const errembed = new Discord.MessageEmbed()
            .setColor('#FFDF00')
            .setTitle('Error')
            .setDescription("Something broke. Try again.");
            message.channel.send(errembed);
        }
        else{
            const catembed = new Discord.MessageEmbed()
            .setColor('#FFDF00')
            .setTitle(body.caption)
            .setImage(body.image);
            message.channel.send(catembed);
        }
    })
}
    if(message.content == "sh fox"){
        fetch("https://some-random-api.ml/img/fox")
        .then(res => res.json()).then(body => {
        if(!body) {
            const errembed = new Discord.MessageEmbed()
            .setColor('#FFDF00')
            .setTitle('Error')
            .setDescription("Something broke. Try again.");
            message.channel.send(errembed);
        }
        else{
            const catembed = new Discord.MessageEmbed()
            .setColor('#FFDF00')
            .setImage(body.link);
            message.channel.send(catembed);
        }
    })
}
})
client.on("message", (message) => {
if(message.content == "sh help"){ // Check if content of message is "!ping"
const helpembed = new Discord.MessageEmbed()
    .setColor('#FFDF00')
    .setTitle(':gear:  Help')
.setDescription('Commands I can do')
.addFields(
    { name: ':grey_question: Help',value: 'help'},
    { name: ':bookmark: Info',value:'ping invite support serverstats uptime bot'},
    {name: ':tools: Moderation',value:'kick ban clean warn'},
    {name: ':smile: Fun',value:'slap ouch hug pat kiss neko cat dog fox meme'},
    {name: ':notes: Music (need a youtube link)',value:'play skip leave queue'},
    {name:':video_game:  Games',value:'*Coming Soon*'},
    {name:':potable_water: Utility',value:'say avatar'},
)
.setFooter('Created by Pouek_#5280')
message.channel.send(helpembed);
if (message.content.startsWith(`sh play`) && !musicon) {
  message.channel.send("Music is not available now :( Try again later")
      }
};
if(message.content == "sh ping"){
    const pingembed = new Discord.MessageEmbed()
    .setColor('#FFDF00')
    .setTitle(':ping_pong: Pong!')
    .setDescription(Math.round(client.ws.ping) + ' ms');
	message.channel.send(pingembed);
};
if(message.content == "sh bot"){
    const botembed = new Discord.MessageEmbed()
    .setColor('#FFDF00')
    .setTitle('Shell')
    .setAuthor('Bot by Pouek_#5280','https://cdn.discordapp.com/avatars/504891362081112065/7318bd939a1dfd918be76c28acf76f79.webp')
    .setDescription('Information')
    .addFields(
        { name: 'Discord.js version',value: '12.16.1'},
        { name: 'Ping',value: Math.round(client.ws.ping) + ' ms'},
        {name: 'Uptime',value:seconds+' seconds'},
        {name: 'Develop time version 1.0',value:'14 hours'},
        {name: 'Bot version',value:'v1.4'},
    )
	message.channel.send(botembed);
};
if(message.content == "sh uptime"){
    const uptimeembed = new Discord.MessageEmbed()
    .setColor('#FFDF00')
    .setTitle(':green_circle:  Uptime')
    .setDescription(seconds + ' seconds');
	message.channel.send(uptimeembed);
};
if(message.content == "sh neko"){
    fetch('https://weebs4life.ga/api/neko')
    .then(res => res.json())
    .then(json => {
        let imageUrl = json.url
    const nekoembed = new Discord.MessageEmbed()
    .setColor('#FFDF00')
    .setTitle('Neko for you!')
    .setDescription('Grabbed from weebs4life.ga api')
    .setImage(imageUrl);
    message.channel.send(nekoembed);
    })
}
if(message.content.startsWith("sh hug")){
    let hug = message.content.split(' ').slice(2).join(' ');
    if(hug){
        var hugfinal = hugsy[Math.floor(Math.random()*hugsy.length)];
        message.reply(' Hugs ' + hug + ' how cute!');
        message.channel.send({files: [hugfinal]})
    }
    else{
        const errorembed = new Discord.MessageEmbed()
        .setColor('#FFDF00')
        .setTitle('Error')
        .setDescription("You didn't mention anyone!");
        message.channel.send(errorembed);
    }
};
if(message.content.startsWith("sh warn") && message.member.hasPermission("KICK_MEMBERS")){
  let warnn = message.content.split(' ').slice(2,3);
  let warnnp = message.content.split(' ').slice(3).join(' ');
  if(warnn){
      message.reply(' warned ' + warnn + ' for ' + warnnp + ' :hammer:');
  }
  else{
      const errorembed = new Discord.MessageEmbed()
      .setColor('#FFDF00')
      .setTitle('Error')
      .setDescription("You didn't mention anyone!");
      message.channel.send(errorembed);
  }
};
if(message.content.startsWith("sh kiss")){
    let kiss = message.content.split(' ').slice(2).join(' ');
    if(kiss){
        var kissfinal = kissy[Math.floor(Math.random()*kissy.length)];
        message.reply(' kiss ' + kiss + ' OwO');
        message.channel.send({files: [kissfinal]})
    }
    else{
        const errorembed = new Discord.MessageEmbed()
        .setColor('#FFDF00')
        .setTitle('Error')
        .setDescription("You didn't mention anyone!");
        message.channel.send(errorembed);
    }
};
if(message.content.startsWith("sh ouch")){
    let kick = message.content.split(' ').slice(2).join(' ');
    if(kick){
        var kickfinal = kicks[Math.floor(Math.random()*kicks.length)];
        message.reply(' kicks ' + kick + ' ouch!');
        message.channel.send({files: [kickfinal]})
    }
    else{
        const errorembed = new Discord.MessageEmbed()
        .setColor('#FFDF00')
        .setTitle('Error')
        .setDescription("You didn't mention anyone!");
        message.channel.send(errorembed);
    }
};
if(message.content.startsWith("sh pat")){
    let pat = message.content.split(' ').slice(2).join(' ');
    if(pat){
        var patfinal = patsy[Math.floor(Math.random()*patsy.length)];
        message.reply(' Pats ' + pat);
        message.channel.send({files: [patfinal]})
    }
    else{
        const errorembed = new Discord.MessageEmbed()
        .setColor('#FFDF00')
        .setTitle('Error')
        .setDescription("You didn't mention anyone!");
        message.channel.send(errorembed);
    }
};
if(message.content.startsWith("sh slap")){
    let slap = message.content.split(' ').slice(2).join(' ');
    if(slap){
        var slapfinal = slapsy[Math.floor(Math.random()*slapsy.length)];
        message.reply(' Slapped ' + slap + ' !');
        message.channel.send({files: [slapfinal]})
    }
    else{
        const errorembed = new Discord.MessageEmbed()
        .setColor('#FFDF00')
        .setTitle('Error')
        .setDescription("You didn't mention anyone!");
        message.channel.send(errorembed);
    }
};
if(message.content.startsWith("sh avatar")){
    if (!message.mentions.users.size) {
    const avatareembed = new Discord.MessageEmbed()
    .setColor('#FFDF00')
    .setTitle(message.author.username + ' Avatar! Click to download!')
    .setURL(message.author.avatarURL())
    .setImage(message.author.avatarURL());
    message.channel.send(avatareembed);
    }
    else{
        let mention = message.mentions.members.first();
        const avatareeembed = new Discord.MessageEmbed()
        .setColor('#FFDF00')
        .setTitle(mention.user.username + ' Avatar! Click to download!')
        .setURL(mention.user.avatarURL())
        .setImage(mention.user.avatarURL());
        message.channel.send(avatareeembed);
    }
};
if(message.content.startsWith("sh say") && !message.author.bot){
    let say = message.content.split(' ').slice(2).join(' ');
    if(say){
        message.channel.bulkDelete(1).catch(err => console.log(err));
        message.channel.send(say);
    }
    else{
        const sayembed = new Discord.MessageEmbed()
        .setColor('#FFDF00')
        .setTitle('Error')
        .setDescription("You didn't say anything!");
        message.channel.send(sayembed);
    }
};
if(message.content == "sh invite"){
    const linkembed = new Discord.MessageEmbed()
    .setColor('#FFDF00')
    .setTitle('Click to Invite!')
    .setURL('https://discord.com/api/oauth2/authorize?client_id=735190772508524654&permissions=8&scope=bot')
    .setAuthor('Invite');
	message.channel.send(linkembed);
};
if(message.content.startsWith("sh clean") && message.member.hasPermission("MANAGE_MESSAGES")){ // Check if content of message is "!ping"
let array = message.content.split(' ').slice(2).join(' ');
if(array < 101){
			message.channel.bulkDelete(array).catch(err => console.log(err));
		message.channel.send('Deleted ' + array + ' messages!');
}
else{
	message.channel.send("Can't delete more than 100!");
}
}
//else{
   // const erreembed = new Discord.MessageEmbed()
   // .setColor('#FFDF00')
   // .setTitle('Error')
    //.setDescription("You don't have permissions to do that!");
  //  message.channel.send(erreembed);  
//}
if(message.content == "sh support"){
    const linkembed = new Discord.MessageEmbed()
    .setColor('#FFDF00')
    .setTitle('Click to Join!')
    .setURL('https://discord.gg/FwRqv3T')
    .setAuthor('Support Server');
	message.channel.send(linkembed);
};
if(message.content == "sh serverstats"){
    var targetguild = message.member.guild;
	var online = message.guild.members.cache.filter(m => m.presence.status === 'online').size
	var idle = message.guild.members.cache.filter(m => m.presence.status === 'idle').size
	var dtd = message.guild.members.cache.filter(m => m.presence.status === 'dnd').size
	var offline = message.guild.members.cache.filter(m => m.presence.status === 'offline').size
    const serverembed = new Discord.MessageEmbed()
    .setColor('#FFDF00')
    .setTitle('Server Stats')
    .addFields(
{name:':ballot_box_with_check:  TOTAL On this server are: ', value: targetguild.memberCount},
{name:':green_circle: ONLINE On this server are: ',value:online},
{name:':crescent_moon: IDLE On this server are: ',value:idle},
{name:':red_circle: DO NOT DISTURB On this server are: ',value:dtd},
{name:':black_circle: OFFLINE On this server are: ',value:offline}
    );
	message.channel.send(serverembed);
};
if(message.content.startsWith("sh kick") && message.member.hasPermission("KICK_MEMBERS")){
    let array = message.content.split(' ').slice(2).join(' ');
    let arraj = message.content.split(' ').slice(3).join(' ');
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member
          .kick(arraj)
          .then(() => {
            message.reply(`Successfully kicked ${user.tag}`);
          })
          .catch(err => {
            const errorembed = new Discord.MessageEmbed()
            .setColor('#FFDF00')
            .setTitle('Error')
            .setDescription("I was unable to kick the member");
            message.channel.send(errorembed);
            console.error(err);
          });
      } else {
        const errorembed = new Discord.MessageEmbed()
        .setColor('#FFDF00')
        .setTitle('Error')
        .setDescription("That user isn't in this guild!");
        message.channel.send(errorembed);
      }
    } else {
        const errorembed = new Discord.MessageEmbed()
        .setColor('#FFDF00')
        .setTitle('Error')
        .setDescription("You didn't mention the user to kick!");
        message.channel.send(errorembed);
    }
  }
if(message.content.startsWith("sh ban") && message.member.hasPermission("BAN_MEMBERS")){
    let array = message.content.split(' ').slice(2).join(' ');
    let arraj = message.content.split(' ').slice(3).join(' ');
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = message.content.split(' ').slice(3).join(' ');
    if(!reason) reason = "No reason provided";
    
    member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
};
});	
client.login(tokenn);