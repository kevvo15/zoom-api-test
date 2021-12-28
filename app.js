require('dotenv').config();
const request = require('request');
const express = require('express');
let bodyParser = require('body-parser')

const PORT = process.env.PORT;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const app = express();
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.redirect(`https://zoom.us/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`)
})

app.get('/authorize', function(req, res) {
    res.send("Success!")
    console.log(res.socket.parser.incoming.originalUrl)
    // Request Access Token Here with new auth code after parsing from the res.socket.parser.incoming.originalUrl
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}/`)
})
