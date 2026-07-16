const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const socketio = require("socket.io");
const cors = require("cors");
const path = require("path");

app.use(express.static(__dirname));

const key = fs.readFileSync(path.join(__dirname, "../cert.key"));
const cert = fs.readFileSync(path.join(__dirname, "../cert.crt"));
// const key = fs.readFileSync("cert.key");
// const cert = fs.readFileSync("cert.crt");

const expressServer = https.createServer({ key, cert }, app);

const io = socketio(expressServer, {
  cors: {
    origin: ["https://localhost"],
    methods: ["GET", "POST"],
  },
});

expressServer.listen(9090, () => {
  console.log("Server listening to port 9090");
});

const connectedSockets = [
  //username , socketID
];

const offers = [
  // offererUsername
  // offer
  // offererIceCandidates
  // answererUsername
  // answer
  // answererIceCandidates
];

io.on("connection", (socket) => {
  const userName = socket.handshake.auth.userName;
  const password = socket.handshake.auth.password;

  if (password !== "x") {
    socket.disconnect(true);
    return;
  }

  connectedSockets.push({
    socketId: socket.id,
    userName,
  });

  socket.on("newOffer", (newOffer) => {
    offers.push({
      offererUserName: userName,
      offer: newOffer,
      offererIceCandidates: [],
      answererUserName: null,
      answer: null,
      answererIceCandidates: [],
    });

    socket.broadcast.emit("newOfferAwaiting", offers.slice(-1));
  });
});
