const botBuilder = require('claudia-bot-builder')
const config = require("./config.json");
const axios = require('axios');

module.exports = botBuilder((request) => {
    if (config.CHANNELS.length < 1) {
        return new Promise((resolve, reject) => {
            axios.post("https://api.groupme.com/v3/bots/post", {
                "bot_id": config.ALL_GROUPME_BOT_ID,
                "text": "INVALID CHANNEL; NO CHANNELS CONFIGURED"
            })
                .then((response) => { console.log(response.data) })
                .then((error) => { console.log(error) });
        }).catch(e => {
            console.error("INVALID PROMISE: " + e)
        });
    }

    return new Promise((resolve, reject) => {
        let channelIndex = config.CHANNELS.map(e => e.name).indexOf(request.text.substring(1).split(" ")[0]);
        
        if (channelIndex < 0) {
            aaxios.post(((config.CHANNELS)[0]).url, {
                "content": "(INVALID CHANNEL; SENT TO DEFUALT)" + request.originalRequest.name + ": " + request.text,
            })
                .then((response) => { console.log(response.data) })
                .then((error) => { console.log(error) });
        } else {
            axios.post(config.CHANNELS[channelIndex].url, {
                "content": request.originalRequest.name + ": " + request.text.split(" ").slice(1).join(" "),
            })
                .then((response) => { console.log(response.data) })
                .then((error) => { console.log(error) });
        }
    }).catch(e => {
        console.error("INVALID PROMISE: " + e);
    });
});