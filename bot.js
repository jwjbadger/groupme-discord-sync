const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const config = require("./config.json");
const axios = require('axios');
const fs = require('fs');
const exec = require('child_process').exec;

function update_claudia() {
    if (fs.existsSync('./claudia.json')) {
        exec('claudia update', (error, stdout, stderr) => {
            console.log('CLAUDIA STDOUT: ' + stdout);
            console.log('CLAUDIA STDERR: ' + stderr);
            if (error !== null)
                console.error('CLAUDIA ERROR: ' + error);
        });
    } else {
        console.error("CLAUDIA HAS NOT BEEN CONFIGURED")
    }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

    update_claudia();
});

client.on(Events.MessageCreate, function(message) {
    if (message.author.bot || message.content.startsWith(']')) return;

    if (message.content.startsWith(config.PREFIX)) {
        let args = message.content.substring(1).split(" ");

        switch (args[0]) {
            case 'help':
                message.reply({embeds: [new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Help Menu')
                .setAuthor({ name: 'jwjbadger', iconURL: 'https://avatars.githubusercontent.com/u/37556770?v=4', url: 'https://github.com/jwjbadger' })
                .setDescription('Commands to allow you to configure the syncing of GroupMe and Discord messages and announcements.')
                .addFields(
                    { name: 'Commands', value: '- `help`: This command!\n- `update-claudia`: Update the GroupMe portion of the bot hosted on AWS\n- `add-announcements [#channel]`: Add a channel to the list of channels to announce\n- `rem-announcements [#channel]`: Remove a channel from the list of channels to announce\n- `get-announcements`: Get the list of channels to announce\n- `add-individual [#channel]`: Add a channel to the list of channels to send to those who need it\n- `rem-individual [#channel]`: Remove a channel from the list of channels to send to those who need it\n- `get-individual` Get the list of channels to send to those who need it' },
                )
                .setTimestamp()
                .setFooter({ text: 'Please send any requests for projects to jwjbadger on Discord', iconURL: 'https://cdn.discordapp.com/avatars/810923173137874944/617e52cae8dab4996a80500875fbb2e9.webp?size=512' })]});
                return;
            case 'update-claudia':
                update_claudia();
                message.reply("updating claudia...");
                break;
            case 'add-announcements':
                if (args.length < 2)
                    return message.reply(config.PREFIX + "add-announcements requires one argument, but " + (args.length - 1) + " provided.");

                message.guild.channels.fetch()
                    .then((channels) => {
                        if (channels.map(c => c.id).indexOf(args[1].replaceAll(/<#|>/g, '')) < 0)
                            return message.reply("INVALID CHANNEL; be sure your first argument is a link to the desired channel like so <#" + message.channelId + ">");

                        config.ANNOUNCEMENTS_CHANNELS.push(args[1].replaceAll(/<#|>/g, ''));
                        config.ANNOUNCEMENTS_CHANNELS = [...new Set(config.ANNOUNCEMENTS_CHANNELS)];
                        fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
                        message.reply("SUCCESS\ncurrent announcements list: <#" + config.ANNOUNCEMENTS_CHANNELS.join('>, <#') + ">");
                    }).catch((e) => {
                        console.error(e);
                    });
                break; 
            case 'rem-announcements':
                if (args.length < 2)
                    return message.reply(config.PREFIX + "add-announcements requires one argument, but " + (args.length - 1) + " provided.");
                
                message.guild.channels.fetch()
                    .then((channels) => {
                        if (channels.map(c => c.id).indexOf(args[1].replaceAll(/<#|>/g, '')) < 0)
                            return message.reply("INVALID CHANNEL; be sure your first argument is a link to the desired channel like so <#" + message.channelId + ">");

                        config.ANNOUNCEMENTS_CHANNELS = config.ANNOUNCEMENTS_CHANNELS.filter(e => e != args[1].replaceAll(/<#|>/g, ''));
                        fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
                        message.reply("SUCCESS\ncurrent announcements list: <#" + config.ANNOUNCEMENTS_CHANNELS.join('>, <#') + ">");
                    }).catch(e => {
                        console.error(e);
                    });
                break;
            case 'get-announcements':
                return message.reply("<#" + config.ANNOUNCEMENTS_CHANNELS.join('>, <#') + ">");
            case 'add-individual':
                if (args.length < 2)
                    return message.reply(config.PREFIX + "add-announcements requires one argument, but " + (args.length - 1) + " provided.");

                    message.guild.channels.fetch()
                        .then((channels) => {
                            let channelIndex = channels.map(c => c.id).indexOf(args[1].replaceAll(/<#|>/g, ''));
                            if (channelIndex < 0)
                                return message.reply("INVALID CHANNEL; be sure your first argument is a link to the desired channel like so <#" + message.channelId + ">");

                            let channel = channel[channelIndex];

                            if (config.CHANNELS.map(e => e.id).indexOf(channel.id) >= 0)
                                return message.reply("CHANNEL ALREADY IN USE");

                            channel.createWebhook({
                                name: 'INDIVIDUAL-' + channel.name,
                                avatar: 'https://i.imgur.com/AfFp7pu.png',
                            })
                                .then(webhook => {
                                    config.CHANNELS.push({'id': webhook.id, 'token': webhook.token, 'name': webhook.channel.name, 'url': webhook.url});

                                    fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
                                    message.reply(`SUCCESS: Created webhook ${webhook.name}\ncurrent individual channels available: ` + config.CHANNELS.map(e => e.name).join(', '));
                                }).catch(console.error);
                        }).catch(e => console.error(e));
                break;
            case 'rem-individual':
                if (args.length < 2)
                    return message.reply(config.PREFIX + "add-announcements requires one argument, but " + (args.length - 1) + " provided.");

                    message.guild.channels.fetch()
                        .then((channels) => {
                            let channelIndex = channels.map(c => c.id).indexOf(args[1].replaceAll(/<#|>/g, ''));
                            if (channelIndex < 0)
                                return message.reply("INVALID CHANNEL; be sure your first argument is a link to the desired channel like so <#" + message.channelId + ">");

                            let ref_channel = channel[channelIndex];
                            let stored_hook = config.CHANNELS.find(e => e.name == ref_channel.name);
                        
                            client.fetchWebhook(stored_hook.id, stored_hook.token)
                                .then(webhook => webhook.delete())
                                .catch(console.error);
                            config.CHANNELS = config.CHANNELS.filter(e => e != stored_hook);
            
                            fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
                            message.reply(`SUCCESS\ncurrent individual channels available: ` + config.CHANNELS.map(e => e.name).join(', '));
                        }).catch(e => console.error(e));
                break;
            case 'get-individual':
                return message.reply("current individual channels available: " + config.CHANNELS.map(e => e.name).join(', '));
            default:
                return message.reply("UNKNOWN COMMAND | use `" + config.PREFIX + "help` to find all commands");
        }

        update_claudia();

        return;
    }

    if (config.ANNOUNCEMENTS_CHANNELS.indexOf(message.channelId) != -1) {
        axios.post("https://api.groupme.com/v3/bots/post", {
            "bot_id": config.ANNOUNCEMENTS_GROUPME_BOT_ID,
            "text": "(ANNOUNCEMENT | " + message.member.displayName + ")" + ": " + message.content
        })
            .then((response) => { console.log(response.data) })
            .then((error) => { console.log(error) });
        
        return;
    }

    if (config.CHANNELS.map(channel => channel.name).indexOf(message.channel.name) >= 0) {
        axios.post("https://api.groupme.com/v3/bots/post", {
            "bot_id": config.ALL_GROUPME_BOT_ID,
            "text": "(" + message.member.displayName + " | " + message.channel.name + ")" + ": " + message.content
        })
            .then((response) => { console.log(response.data) })
            .then((error) => { console.log(error) });
    }
});

client.login(config.BOT_TOKEN);