"use strict";

const WebSocket = require("websocket").w3cwebsocket;
const EventEmitter = require("events").EventEmitter;
const assert = require("assert");
let ws;
let self;

const TwitchPubSub = class TwitchPubSub extends EventEmitter {
  constructor({ oauth, subscriptions = [] }) {
    super();

    try {
      assert(oauth);
    } catch (err) {
      throw new Error("Invalid OAuth Token");
    }

    this.oauth = oauth;
    this.subscriptions = subscriptions;

    self = this;

    this._connect();
  }

  async _listen(topic, channel) {
    const nonce = (length) => {
      var text = "";
      var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    };

    if (topic) {
      switch (topic) {
        case "channel-bits":
          topic = "channel-bits-events-v1";
          break;

        case "channel-points":
          topic = "channel-points-channel-v1";
          break;

        case "channel-subscriptions":
          topic = "channel-subscribe-events-v1";
          break;

        case "channel-bits-badge":
          topic = "channel-bits-badge-unlocks";
          break;

        case "chat-moderatoractions":
          topic = "chat_moderator_actions";
          break;

        case "whispers":
          topic = "whispers";
          break;
      }
    }

    var message = {
      type: "LISTEN",
      nonce: nonce(15),
      data: {
        topics: [`${topic}.${channel}`],
        auth_token: self.oauth,
      },
    };

    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
  }

  async subscribe(topic, channel) {
    this._listen(topic, channel);
  }

  async _connect() {
    var heartbeatInterval = 1000 * 60;
    var reconnectInterval = 1000 * 3;
    var heartbeatHandle;

    ws = new WebSocket("wss://pubsub-edge.twitch.tv");

    const heartbeat = () => {
      var message = {
        type: "PING",
        data: {
          auth_token: self.oauth,
        },
      };

      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
    };

    ws.onopen = function (event) {
      heartbeat();

      self.subscriptions.forEach((sub) => {
        var topic = sub.topic;
        var channel = sub.channel;

        self._listen(topic, channel);
      });

      heartbeatHandle = setInterval(heartbeat, heartbeatInterval);
      self.emit("connected");
    };

    ws.onerror = function (error) {
      self.emit("error", error);
    };

    ws.onmessage = function (event) {
      var message = JSON.parse(event.data);

      if (message.type == "RECONNECT") {
        console.log("Reconnecting...");
        setTimeout(self._connect, reconnectInterval);
        return;
      }

      console.log(1);

      if (message.type === "MESSAGE") {
        self.emit("message", message.data);
      }
    };

    ws.onclose = function () {
      self.emit("disconnect");

      clearInterval(heartbeatHandle);
      setTimeout(this._connect, reconnectInterval);
    };
  }
};

module.exports = TwitchPubSub;
