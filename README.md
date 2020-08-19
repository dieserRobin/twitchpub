# Twitch Pub

With this package, you can subscribe to Twitch Topics like Channel Points.

# Installation Info

`npm install twitchpub`

# Topics

```
channel-bits
channel-points
channel-subscriptions
channel-bits-badge
chat-moderatoractions,whispers
```

# Getting started

```

const TwitchPubSub = require("twitchpub");

const PubSub = new TwitchPubSub({
oauth: "OAUTH TOKEN",
subscriptions: [
{
topic:
"TOPIC (channel-bits,channel-points,channel-subscriptions,channel-bits-badge,chat-moderatoractions,whispers)",
channel: "CHANNEL ID",
},
],
});

PubSub.on("connected", () => {
console.log("PubSub connected");
PubSub.subscribe('channel-subscriptions', 'CHANNEL ID');
});

PubSub.on("error", (error) => console.log(error));

PubSub.on("message", (msg) => {
console.log(msg);
});

```

## Constructor

oauth: OAuth Token (with needed Scopes),
subscriptions: { topic: TOPIC, channel: channelID }

## Events

#### connected

Called when connected to PubSub.

#### error

Called when a error occurs.

#### message

Called when PubSub sends a message.

#### Functions

#### subscribe

#### Parameters:

- Topic
- Channel

# License

This Project is licensed under the MIT License, read more in the [License](LICENSE) file.

This Package was built by [Robin Klein](https://robin.software).
