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
});

PubSub.on("error", (error) => console.log(error));

PubSub.on("message", (msg) => {
  console.log(msg);
});
