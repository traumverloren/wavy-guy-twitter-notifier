# Wavy Tube Guy Tweet Likes Notifier

Whenever I get a like on a tweet of mine that is < 7 days old, I get treated to a notification from wavy tube guy. It's a delight. 

Watch in real-time on [twitch](https://twitch.tv/stephaniecodes) to see your like trigger wavy guy! 

----

## How it works:

![wavy-guy-huzzah](https://user-images.githubusercontent.com/9959680/138496337-ffde8cdf-fbd3-4d50-8150-1eb3c2a0361a.png)

I have a raspberry pi 4 running a small node.js app. I use `pm2` to run this on the pi: `node index.js`. This file (`index.js`) creates a small local express server to run the MQTT Broker and sends a request to the twitter API every 3 seconds to grab my most recent 100 tweets from the past 7 days (This is due to limitations of the [twitter API](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/search/api-reference/get-search-tweets) & want data I can retrieve... I can't retrieve my total like count as a user directly).

This MQTT broker allows clients to subscribe to topics. In this case, the arduino is subscribed to receive messages about tweet likes. When the app retrieves and calculates the tweet count and determines it has increased, the app then publishes a message to subscribed clients. 

## Components:
- [Blowup wavy guy toy](https://www.amazon.de/dp/0762462876) (from amazon)
- [9V 2A 2.1mm barrel jack DC adapter](https://www.amazon.de/dp/B07NSMYZXS) (from amazon)
- MQTT Broker:
  - Raspberry Pi 4
  - Twitter Developer Account (for the necessary API tokens)
- MQTT Client:
  - [Adafruit Feather Huzzah](https://www.adafruit.com/product/2821)
  - [Adafruit Feather Non-Latching Relay](https://www.adafruit.com/product/2895)


## 
