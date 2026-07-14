const userName = "JasC-" + Math.floor(Math.random() * 100000);
const password = "x";
document.querySelector("#user-name").innerHTML = userName;

const localVideoEl = document.querySelector("#local-video");
const remoteVideoEl = document.querySelector("#remote-video");

let localStream;
let remoteStream;
let peerConnection;

const socket = io.connect("https://localhost:9090", {
  auth: { username, password },
});

let peerConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ],
};
const call = async (e) => {
  await fetchUserMedia();
  await createPeerConnection();
  try {
    console.log("Creating offer");
    const offer = await peerConnection.createOffer();
    console.log(offer);
  } catch (err) {
    console.log(err);
  }
};

const fetchUserMedia = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      localVideoEl.srcObject = stream;
      localStream = stream;
      resolve();
    } catch (err) {
      console.log(err);
      reject();
    }
  });
};

const createPeerConnection = async (e) => {
  return new Promise(async (resolve, reject) => {
    peerConnection = await new RTCPeerConnection(peerConfiguration);

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.addEventListener("icecandidate", (e) => {
      console.log("Ice candidate ");
      console.log(e);
    });
    resolve();
  });
};

document.querySelector("#call").addEventListener("click", call);
