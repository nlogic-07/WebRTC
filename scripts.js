let stream = null; //Init stream var to use stream anywhere
const constraints = {
  audio: true,
  video: true,
};

const getMicAndCamera = async (e) => {
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log(stream);
  } catch {
    console.log("User denied access to constraints");
  }
};

document
  .querySelector("#share")
  .addEventListener("click", (e) => getMicAndCamera(e));
