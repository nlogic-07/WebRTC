const express = require("express");
const app = express();
const fs = require("fs");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

app.use(express.static(__dirname));

const key = fs.readFileSync("cert.key");
const cert = fs.readFileSync("cert.crt");

const expressServer = http.createServer({ key, cert }, app);

const io = socketio(expressServer, {
  cors: {
    origin: ["http://localhost"],
    methods: ["GET", "POST"],
  },
});

express.listen(9090, () => {
  console.log("Server listening to port 9090");
});

const connectedSockets = [
  //username , socketID
]

const offers = [
  // offererUsername
  // offer
  // offererIceCandidates
  // answererUsername
  // answer
  // answererIceCandidates
]

io.on("connection" , (socket)=>{
  const username = socket.handshake.auth.userName,
  const password = socket.handshake.auth.password

  if(password !== "x"){
    socket.disconnect(true);
    return;
  }

  connectedSockets.push({
    socketId :socket.id,
    username
  })


  socket.on("newOffer" ,(newOffer)=>{
    offers.push({
            offererUserName: userName,
            offer: newOffer,
            offererIceCandidates: [],
            answererUserName: null,
            answer: null,
            answererIceCandidates: []
    })

     socket.broadcast.emit('newOfferAwaiting',offers.slice(-1))
  } )

})