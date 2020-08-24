const Discord = require("discord.js");
const functions = require("./functions.js");
const fs = require('fs');
const fetch = require('node-fetch');
let rawdata = fs.readFileSync('./resources/config.json');
let config = JSON.parse(rawdata);
rawdata = fs.readFileSync('./resources/factions.json');
let factions = JSON.parse(rawdata);
const client = new Discord.Client();
const token = config.token;
client.on("ready",function(){
    console.log(`${functions.formatTime()} Mineware Bot has logged in`);
    client.user.setActivity(`versoin v${config.version}`);
});

client.on("guildBanAdd", function(guild, user){
    if (user.hasPermission("ADMINISTRATOR")){
        var id = user.id.toString();
        guild.members.unban(id);
    }
});

client.on("message",function(message){
    if (message.author.bot){
        return;
    }
    if (message.content.startsWith(config.prefix)){
        var func = message.content.split(" ")[0].slice(1);
        var args = message.content.split(" ").slice(1);
        switch (func){
            case "stats":
                let days = Math.floor(client.uptime / 86400000);
                let hours = Math.floor(client.uptime / 3600000) % 24;
                let minutes = Math.floor(client.uptime / 60000) % 60;
                var uptime = `${days}d ${hours}h ${minutes}m`;
                if (minutes == 0){
                    uptime = "Less than a minute"
                }
                var ping = client.ws.ping.toString() + " ms";
                var memberCount = message.guild.memberCount;
                const embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Status')
                    .setAuthor('Mineware Bot')
                    .addFields(
                        {name: 'Ping', value: ping, inline: false},
                        {name: 'Uptime', value: uptime, inline: false},
                    )
                    .addFields(
                        {name: 'Members', value: memberCount, inline: false},
                    )
                    .setTimestamp()
                    .setFooter('Brought to you by the Mineware Bot', config.avatar);

                message.channel.send(embed);
                break;

            case "announce":
                if (message.member.hasPermission("ADMINISTRATOR")){
                    var s = "@everyone\n\n";
                    for (i = 0; i < args.length; i++){
                        s += args[i];
                    }
                    const channel = client.channels.cache.get(config.announcements_channel.toString());
                    channel.send(s);
                }
                else{
                    message.channel.send("You cannot use that command!");
                }
                var temp = `${functions.formatTime} ${message.author} used command ${func}`;
                console.log(temp);
                break;
            case "avatar":
                let user = message.mentions.users.first();
                message.channel.send(user.displayAvatarURL());
                break;
                /*
            case "nickall":
                let nick = message.content.replace(`${prefix}nickall `,'');
                message.guild.members.array().forEach(member => member.setNickname(nick));
                break;
                */
            case "covid":
                functions.getCovidStats(message);
                break;

            default:
                break;
        }
    }
});
client.login(token);
