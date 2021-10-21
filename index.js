require('dotenv').config();
const express = require('express');
const app = express();
const aedes = require('aedes')();
const mqtt = require('net').createServer(aedes.handle);
const httpServer = require('http').createServer(app);
const ws = require('websocket-stream');
const mqttPort = 1883;
const appPort = 8080;

const Twitter = require('twitter-lite');

mqtt.listen(mqttPort, function () {
  console.log('mqtt server listening on port', mqttPort);
});

ws.createServer(
  {
    server: httpServer,
  },
  aedes.handle
);

httpServer.listen(appPort, function () {
  console.log('server listening on port', appPort);
});

aedes.on('clientError', function (client, err) {
  console.log('client error', client.id, err.message, err.stack);
});

aedes.on('publish', function (packet, client) {
  console.log(packet);
  if (client) {
    console.log('message from client', client.id);
  }
});

aedes.on('subscribe', function (subscriptions, client) {
  if (client) {
    console.log('subscribe from client', subscriptions, client.id);
  }
});

aedes.on('client', function (client) {
  console.log('new client', client.id);
});

app.get('/', (req, res) => {
  res.send('server is working!');
});

const twitterClient = new Twitter({
  bearer_token: process.env.BEARER_TOKEN,
});

let previousFavoriteCount = 0;
let newFavoriteCount = 0;

const getRecentTweets = async () => {
  let response;
  try {
    response = await twitterClient.get('search/tweets', {
      q: 'from:stephaniecodes',
      result_type: 'recent',
      count: 100,
    });
  } catch (err) {
    console.log(err);
  }

  return response.statuses;
};

const getLikeCount = async () => {
  const tweets = await getRecentTweets();

  newFavoriteCount = tweets.reduce((acc, curr) => acc + curr.favorite_count, 0);

  console.log('previousFavoriteCount: ', previousFavoriteCount);
  console.log('newFavoriteCount: ', newFavoriteCount);

  if (previousFavoriteCount !== 0 && previousFavoriteCount < newFavoriteCount) {
    aedes.publish({ topic: 'wavy-gravy', payload: 'new like'});
  }

  previousFavoriteCount = newFavoriteCount;
};

// start everything
getLikeCount();
setInterval(() => getLikeCount(), 3000);
