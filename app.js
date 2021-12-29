require("dotenv").config();
const request = require("request");
const express = require("express");
let bodyParser = require("body-parser");

const PORT = process.env.PORT;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

let AUTH_CODE;
let ACCESS_TOKEN;

const app = express();
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.redirect(
    `https://zoom.us/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`
  );
});

app.get("/authorize", function (req, res) {
  res.send("Success!");
  let authCode = res.socket.parser.incoming.originalUrl;
  AUTH_CODE = authCode.substring(authCode.indexOf("=") + 1);
  console.log(AUTH_CODE);
  console.log("\n Requesting Access Token ...\n");
  setTimeout(requestAccessToken, 1000);
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}/`);
});

const requestAccessToken = () => {
  let options = {
    method: "POST",
    url: "https://zoom.us/oauth/token",
    qs: {
      grant_type: "authorization_code",
      code: AUTH_CODE,
      redirect_uri: REDIRECT_URI,
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
    },
  };

  request(options, function (err, response, body) {
    if (err) throw new Error(err);
    const accessInfo = JSON.parse(body);
    ACCESS_TOKEN = accessInfo.access_token;
    //console.log(body)
    console.log(`ACCESS TOKEN:\n${ACCESS_TOKEN}\n`);
    console.log("Testing API Calls ...\n");
    setTimeout(usersMe, 2500);
    setTimeout(sendChat, 5000);
    setTimeout(createMeeting, 5000);
  });
};

//This API call gets info regarding the current user (ie; the user who signed in with their credentials)
const usersMe = () => {
  let options = {
    method: "GET",
    url: `https://api.zoom.us/v2/users/me`,
    headers: {
      authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  };

  request(options, function (err, response, body) {
    if (err) throw new Error(err);

    console.log(`\n ${body}`);
  });
};

// This API call sends a message to a contact of the current user
const sendChat = () => {
  request(
    {
      url: "https://api.zoom.us/v2/chat/users/me/messages",
      method: "POST",
      json: true,
      body: {
        message: "Hello from VS Code",
        to_contact: "email@email.com",
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    },
    (error, httpResponse, body) => {
      if (error) {
        console.log("Error sending chat.", error);
      } else {
        console.log(body);
      }
    }
  );
};

const createMeeting = () => {
  let requestBody = {
    topic: "Test Zoom API",
    type: 2,
    start_time: "2022-01-01T00:00:00.000Z",
    duration: 10,
    schedule_for: "email@email.com",
    timezone: "UTC",
    password: "password",
    agenda: "Happy New Years!",
    settings: {
      host_video: true,
      participant_video: false,
      cn_meeting: false,
      in_meeting: false,
      join_before_host: true,
      jbh_time: 5,
      mute_upon_entry: true,
      watermark: true,
      use_pmi: false,
      approval_type: 2,
      audio: "both",
      auto_recording: "none",
      enforce_login: false,
      enforce_login_domains: "",
      alternative_hosts: "",
      global_dial_in_countries: [],
      registrants_email_notification: true,
    },
  };

  request(
    {
      url: "https://api.zoom.us/v2/users/me/meetings",
      method: "POST",
      json: true,
      body: requestBody,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    },
    (error, httpResponse, body) => {
      if (error) {
        console.log("Error sending chat.", error);
      } else {
        console.log(body);
      }
    }
  );
};
