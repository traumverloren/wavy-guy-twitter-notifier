require('dotenv').config()
const express = require("express");
const app = express();
const path = require("path");
const aedes = require("aedes")();
const mqtt = require("net").createServer(aedes.handle);
const httpServer = require("http").createServer(app);
const ws = require("websocket-stream");
const mqttPort = 1883;
const appPort = 8080;

const client = require('twitter-api-client');

const twitterClient = new client.TwitterClient({
  apiKey: process.env.CONSUMER_KEY,
  apiSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessTokenSecret: process.env.ACCESS_SECRET,
});

mqtt.listen(mqttPort, function() {
  console.log("mqtt server listening on port", mqttPort);
});

ws.createServer(
  {
    server: httpServer
  },
  aedes.handle
);

httpServer.listen(appPort, function() {
  console.log("server listening on port", appPort);
});

aedes.on("clientError", function(client, err) {
  console.log("client error", client.id, err.message, err.stack);
});

aedes.on("publish", function(packet, client) {
  if (client) {
    console.log("message from client", client.id);
  }
});

aedes.on("subscribe", function(subscriptions, client) {
  if (client) {
    console.log("subscribe from client", subscriptions, client.id);
  }
});

aedes.on("client", function(client) {
  console.log("new client", client.id);
});

app.get("/", (req, res) => {
  res.send('server is working!');
});

let previousFavoriteCount = 0;
let newFavoriteCount = 0;

const getRecentTweets = async () => {
  let response;
  try {
    response = await twitterClient.tweets.search({
      q: 'from:stephaniecodes',
      result_type: 'recent',
    });
  } catch (err) {
    console.log(err);
  }

  return response.statuses;
};

const getLikeCount = async () => {
  const tweets = await getRecentTweets();

  // console.log(recentTweets);
  console.log('newFavoriteCount: ', newFavoriteCount);

  const tweet = tweets.find(x => x.id === 1450787932785291300);
  console.log('tweet favorite count test: ', tweet.favorite_count);

  newFavoriteCount = tweets.reduce((acc, curr) => acc + curr.favorite_count, 0);

  console.log('previousFavoriteCount: ', previousFavoriteCount);
  console.log('newFavoriteCount: ', newFavoriteCount);

  if (previousFavoriteCount !== 0 && previousFavoriteCount < newFavoriteCount) {
    console.log('🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳');
  }

  previousFavoriteCount = newFavoriteCount;
};

// start everything
getLikeCount();
setInterval(() => getLikeCount(), 6000);

