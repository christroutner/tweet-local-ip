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

const express = require("express");

// Handle situations where the app is started without a proper config file.
let config;
try {
  config = require("./config.js");
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
let tweetStr;

/* Start up the Express web server */
app.listen(process.env.PORT || port);
console.log("Express started on port " + port);

publishTweet();

/* ---- Start Private Functions ---- */
// Generates the string to be published to Twitter, containing an IP address
// and time stamp.
function generateString() {
  const myLocalIp = require("my-local-ip");
  const myIp = myLocalIp();
  console.log(`myIp: ${myIp}`);

  if (myIp === undefined) throw new Error("Local IP could not be determined.");

  const now = new Date();

  console.log(`Tweeting local IP of ${myIp} at ${now.toLocaleString()}`);

  return `My Local IP: ${myIp} at ${now.toLocaleString()}`;
}

// Publishing the tweet to Twitter.
function publishTweet() {
  try {
    tweetStr = generateString();

    Twitter.post(
      "statuses/update",
      {
        status: tweetStr,
      },
      function(err, response) {
        if (err) {
          if (err.code === 187) {
            console.log(
              `Tweet failed because twitter prevented a duplicate tweet. IP address hasn't changed.`
            );
          } else {
            console.error("Error publishing tweet: ", err);
            republishTweet();
          }
          return;
        }

        if (response) {
          console.log(`Tweet successful`);
        }
      }
    );
  } catch (err) {
    console.log(`Error publishing tweet: `, err);
    republishTweet();
  }
}

// Waits to retry republishing the tweet.
function republishTweet() {
  const tenMinutes = 1000 * 60 * 10;

  setTimeout(function() {
    publishTweet();
  }, tenMinutes);
}

/* ---- End Private Functions ---- */
