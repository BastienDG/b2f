module.exports = function (router) {
    router.post('/', (req, res) => {
        let toNumber = req.body.number
        let prefix = req.body.prefix
        let montant = req.body.montant
        require('dotenv').config();
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_NUMBER
        const client = require('twilio')(accountSid, authToken);

        client.messages
            .create({body: 'Votre compte Chateau Phonique a été rechargé à hauteur de ' + montant + "€", from: fromNumber, to: prefix + toNumber})
            .then(function (message) {
                console.log(message.sid)
                res.send("success")
            })
    });
};