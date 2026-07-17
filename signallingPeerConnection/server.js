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
    origin: ["https://localhost", "https://192.168.1.9"],
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

  if (offers.length) {
    socket.emit("availableOffers", offers);
  }

  socket.on("newOffer", (newOffer) => {
    offers.push({
      offererUserName: userName,
      offer: newOffer,
      offererIceCandidates: [],
      answererUserName: null,
      answer: null,
      answererIceCandidates: [],
    });

    socket.broadcast.emit("newOfferAwaiting", offers.slice(-1)); //send the newly added offer to other connected sockets
  });

  socket.on("newAnswer", (offerObj, ackFunction) => {
    const socketToAnswer = connectedSockets.find(
      (s) => s.userName === offerObj.offererUserName,
    );
    if (!socketToAnswer) {
      console.log("No matching socket!!");
      return;
    }

    const socketIdToAnswer = socketToAnswer.socketId;

    const offerToUpdate = offers.find(
      (o) => o.offererUserName === offerObj.offererUserName,
    );

    if (!offerToUpdate) {
      console.log("No offer to Update");
      return;
    }

    ackFunction(offerToUpdate.offererIceCandidates);
    offerToUpdate.answer = offerObj.answer;
    offerToUpdate.answererUserName = userName;

    socket.to(socketIdToAnswer).emit("answerResponse", offerToUpdate);
  });

  socket.on("sendIceCandidateToSignalingServer", (iceCandidateObj) => {
    const { didIOffer, iceUserName, iceCandidate } = iceCandidateObj;
    if (didIOffer) {
      const offerInOffers = offers.find(
        (o) => o.offererUserName === iceUserName,
      );
      if (offerInOffers) {
        offerInOffers.offererIceCandidates.push(iceCandidate);
        if (offerInOffers.answererUserName) {
          //pass it through to the other socket
          const socketToSendTo = connectedSockets.find(
            (s) => s.userName === offerInOffers.answererUserName,
          );
          if (socketToSendTo) {
            socket
              .to(socketToSendTo.socketId)
              .emit("receivedIceCandidateFromServer", iceCandidate);
          } else {
            console.log("Ice candidate recieved but could not find answere");
          }
        }
      }
    } else {
      const offerInOffers = offers.find(
        (o) => o.answererUserName === iceUserName,
      );

      if (offerInOffers) {
        offerInOffers.answererIceCandidates.push(iceCandidate);
      }
      const socketToSendTo = connectedSockets.find(
        (s) => s.userName === offerInOffers.offererUserName,
      );
      if (socketToSendTo) {
        socket
          .to(socketToSendTo.socketId)
          .emit("receivedIceCandidateFromServer", iceCandidate);
      } else {
        console.log("Ice candidate recieved but could not find offerer");
      }
    }
  });
});
