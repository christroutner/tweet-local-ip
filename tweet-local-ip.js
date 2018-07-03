/*
  Tweets the devices local IP.

  This program also creates a 'dummy' Express application. This is so that
  PM2 can load the app at startup. If the app exists, PM2 will keep trying to
  reload it. An Express app doesn't exit, so it solves that problem.

  This app is based on this post by Rising Stack:
  https://community.risingstack.com/node-js-twitter-bot-tutorial/
*/

"use strict";

const twit = require("twit");

const myLocalIp = require("my-local-ip");
const express = require("express");

// Handle situations where the app is started without a proper config file.
try {
  const config = require("./config.js");
} catch (err) {
  console.log(
    `tweet-local-ip failed to start because the config file could not be found.
    Please rename config-example.js to config.js and fill in the required Twitter
    API values.`
  );
  process.exit(0);
}

const app = express();
const port = 3125;

const Twitter = new twit(config);

const myIp = myLocalIp();

console.log(`Tweeting local IP of ${myIp}`);

Twitter.post(
  "statuses/update",
  {
    status: `My Local IP: ${myIp}`,
  },
  function(err, response) {
    if (err) {
      if (err.code === 187) {
        console.log(
          `Tweet failed because twitter prevented a duplicate tweet. IP address hasn't changed.`
        );
      } else {
        console.error("Error publishing tweet: ", err);
      }
      return;
    }

    if (response) {
      console.log(`Tweet successful`);
    }
  }
);

/* Start up the Express web server */
app.listen(process.env.PORT || port);
console.log("Express started on port " + port);
