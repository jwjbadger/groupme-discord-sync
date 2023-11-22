var botBuilder = require('claudia-bot-builder'),
    axios = require('axios')
    config = require('./config.json')

module.exports = botBuilder((request) => {
    return new Promise((resolve, reject) => {
        let channelIndex = config.CHANNELS.map(e => e.name).indexOf(request.text.substring(1).split(" ")[0]);
        
        if (channelIndex < 0) {
            axios.post(config.CHANNELS[0].url, {
                "content": "(INVALID CHANNEL; SENT TO DEFUALT)" + request.originalRequest.name + ": " + request.text,
            })
                .then((response) => { console.log(response.data) })
                .then((error) => { console.log(error) });
        }

        axios.post(config.CHANNELS[channelIndex].url, {
            "content": request.originalRequest.name + ": " + request.text.split(" ").slice(1).join(" "),
        })
            .then((response) => { console.log(response.data) })
            .then((error) => { console.log(error) });
    }).catch(() => {
        console.error("INVALID PROMISE");
    });
});