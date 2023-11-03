// @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#examples

export function makeWsContainer(userId) {
  const socket = new WebSocket("ws://localhost:8080");

  // Connection opened
  socket.addEventListener("open", (event) => {
    socket.send("Hello Server! from " + userId);
  });

  // Listen for messages
  socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);
  });

  // TODO: switch to MQTT client over websockets
  // subscribe to topics and also publish messages to topics
  // e.g. subscribe to topic "to/user/1234" // using an identifier for the user
  // e.g. subscribe to topic "to/room/43" // using a group of users
  // e.g. subscribe to topic "to/public"  // to ALL connected users

  // LIKE URLs of a RESTful API
  // e.g. client publishes a message to topic "from/user/1234/chat"
  // e.g. client publishes a message to topic "from/user/1234/location"
  // e.g. client publishes a message to topic "from/user/1234/contact"

  // e.g. server-side; publish to topic "to/user/1234" send a message to user 1234
  // e.g. server-side: a worker can subscribe to topics e.g. "from/user/#" listen to ALL messages from users


  return {
    socket,
    userId,
  };
}
