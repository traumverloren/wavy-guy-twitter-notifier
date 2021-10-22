# Wavy Tube Guy Tweet Likes Notifier

Whenever I get a like on a tweet of mine that is < 7 days old, I get treated to a notification from wavy tube guy. It's a delight. ✨

Watch in real-time on [twitch](https://twitch.tv/stephaniecodes) to see your `like` on twitter trigger wavy guy! 




https://user-images.githubusercontent.com/9959680/138499286-12a5aaae-bce1-4797-af4f-a3492ed1db6a.mp4



----

## Components:
- [Blowup wavy guy toy](https://www.amazon.de/dp/0762462876)
- [9V 2A 2.1mm barrel jack DC adapter](https://www.amazon.de/dp/B07NSMYZXS)
- MQTT Broker:
  - Raspberry Pi 4
  - Twitter Developer Account (for the necessary API tokens)
- MQTT Client:
  - [Adafruit Feather Huzzah](https://www.adafruit.com/product/2821)
  - [Adafruit Feather Non-Latching Relay](https://www.adafruit.com/product/2895)

**Note:** I chose the Feather Huzzah & Raspberry Pi 4 for this product since I already had them and reused them from previous art projects. There are many ways to approach a project like this, but this made sense for me with the materials I already had available.


## How it works:

![wavy-guy-huzzah](https://user-images.githubusercontent.com/9959680/138496337-ffde8cdf-fbd3-4d50-8150-1eb3c2a0361a.png)

I have a raspberry pi 4 running a small node.js app. I use `pm2` to run this on the pi: `node index.js`. This file (`index.js`) creates a small local express server to create a MQTT Broker (using [Aedes](https://github.com/moscajs/aedes)) and sends a request to the twitter API using my Bearer token as authentication (so I can poll up to 450 every 15 minutes) every 3 seconds to grab my most recent 100 tweets from the past 7 days. 

This specific criteria is due to limitations of the [twitter API](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/search/api-reference/get-search-tweets) and what data I can retrieve using the API... I can't retrieve my total like count as a user directly) and calculate the total number of likes on them.

The MQTT broker allows clients to subscribe to topics. In this case, the arduino is subscribed to receive messages about tweet likes. When the app retrieves and calculates the tweet count and determines it has increased, the app then publishes a message to subscribed clients. 

When the arduino receives this message, it sends a digital write of `HIGH` for 2 seconds to the non-latching relay. 

This triggers the latch to move to the closed position, therefore connecting the power supply and turning on the wavy guy for 2 seconds.

**Note:** I choose to use MQTT because I know how it works pretty well (I've used it in previous projects) and it works *really well* and was just a great solution since I was re-using the feather huzzah here and keep the board footprint on the wavy guy really small.
