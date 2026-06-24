const videoEl = document.querySelector("#my-video");

let stream = null; //Init stream var to use stream anywhere
const constraints = {
  audio: true,
  video: true,
};

const getMicAndCamera = async (e) => {
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log(stream);
    changeButtons([
      "green",
      "blue",
      "blue",
      "grey",
      "grey",
      "grey",
      "grey",
      "grey",
    ]);
  } catch (err) {
    console.log("User denied access to constraints");
    console.log(err);
  }
};

const showMyFeed = (e) => {
  console.log("showMyFeed is working");
  videoEl.srcObject = stream; //Setting our mediastream(stream) to our <video/>
  const tracks = stream.getTracks();
  console.log(tracks);
  changeButtons([
    "green",
    "green",
    "blue",
    "blue",
    "blue",
    "grey",
    "grey",
    "blue",
  ]);
};

const stopMyFeed = (e) => {
  const tracks = stream.getTracks();
  tracks.forEach((track) => {
    // console.log(track);
    track.stop(); //disassociates the track with the source
  });
  changeButtons([
    "blue",
    "grey",
    "grey",
    "grey",
    "grey",
    "grey",
    "grey",
    "grey",
  ]);
};

document
  .querySelector("#share")
  .addEventListener("click", (e) => getMicAndCamera(e));

document.querySelector("#show-video").addEventListener("click", (e) => {
  showMyFeed(e);
});

document.querySelector("#stop-video").addEventListener("click", (e) => {
  stopMyFeed(e);
});
