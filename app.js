require('dotenv').config();
const request = require('request');
const express = require('express');
let bodyParser = require('body-parser')

const PORT = process.env.PORT;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

let AUTH_CODE;

const app = express();
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.redirect(`https://zoom.us/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`)
})

app.get('/authorize', function(req, res) {
    res.send("Success!")
    let authCode = res.socket.parser.incoming.originalUrl;
    AUTH_CODE = authCode.substring(authCode.indexOf('=') + 1);
    console.log(AUTH_CODE)
    console.log("\n Requesting Access Token ...\n")
    setTimeout(requestAccessToken, 5000)
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}/`)
})

const requestAccessToken = () => {
    let options = {
        method: 'POST',
        url: 'https://zoom.us/oauth/token',
        qs: {
            grant_type: 'authorization_code',
            code: AUTH_CODE,
            redirect_uri: REDIRECT_URI,
        },
        headers: {
            Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
        }
    }

    request(options, function(err, response, body) {
        if (err) throw new Error(err);
        const accessInfo = JSON.parse(body)
        console.log(body)
        console.log(`\n${accessInfo.access_token}`)
    })
}