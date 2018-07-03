# tweet-local-ip

A small node.js application that tweets the devices local IP address. This is really
handy for IoT devices like the Raspberry Pi. It allows you to connect the device
to a LAN with internet access and retrieve the devices Local IP without needing
to connect it to a monitor.

This program also creates a 'dummy' Express application. This is so that
[PM2](http://pm2.keymetrics.io/) can load the app at startup. If the app exists,
PM2 will keep trying to
reload it. An Express app doesn't exit, so it solves that problem.

This app is based on
[this post](https://community.risingstack.com/node-js-twitter-bot-tutorial/)
by Rising Stack.
