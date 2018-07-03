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
    if (response) {
      console.log(`Tweet successful`);
    }

    if (err) {
      console.error("Error publishing tweet: ", err);
    }
  }
);
