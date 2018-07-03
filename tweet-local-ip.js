/*
*/

"use strict";

const twit = require("twit");
var config = require("./config.js");
const myLocalIp = require("my-local-ip");

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
      console.error("Error publishing tweet: ", err);
      return;
    }

    if (response) {
      console.log(`Tweet successful`);
    }
  }
);

// Create a timeout that lasts 10 minutes. This is just a dummy structure
// so that this app doesn't exist right away. It gives the user a chance to
// configure it in PM2.
const myTimeout = setTimeout(function() {
  console.log(`Timeout is complete.`);
}, 1000 * 60 * 10);
