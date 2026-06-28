let mediaRecorder;
let recordedBlobs;

const startRecording = (e) => {
  if (!stream) {
    alert("No current feed");
    return;
  }
  console.log("start recording");
  recordedBlobs = [];
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (e) => {
    console.log("Data is available for the media recorder");
    recordedBlobs.push(e.data);
  };
  mediaRecorder.start();

  changeButtons([
    "green",
    "green",
    "blue",
    "blue",
    "green",
    "blue",
    "grey",
    "blue",
  ]);
};

const stopRecording = (e) => {
  if (!mediaRecorder) {
    alert("Please record before stopping");
    return;
  }
  console.log("stop recording");
  mediaRecorder.stop();
  changeButtons([
    "green",
    "green",
    "blue",
    "blue",
    "green",
    "green",
    "blue",
    "blue",
  ]);
};

const playRecording = (e) => {
  console.log("play recording");
  if (!recordedBlobs) {
    alert("No recording saved");
    return;
  }
  const superBuffer = new Blob(recordedBlobs);
  const recorderVideoEl = document.querySelector("#other-video");
  recorderVideoEl.src = window.URL.createObjectURL(superBuffer);
  recorderVideoEl.controls = true;
  recorderVideoEl.play();

  changeButtons([
    "green",
    "green",
    "blue",
    "blue",
    "green",
    "green",
    "green",
    "blue",
  ]);
};
