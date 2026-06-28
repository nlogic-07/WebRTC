let mediaRecorder;
let recordedBlobs;

const startRecording = (e) => {
  console.log("start recording");
  recordedBlobs = [];
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (e) => {
    console.log("Data is available for the media recorder");
    recordedBlobs.push(e.data);
  };
  mediaRecorder.start();
};

const stopRecording = (e) => {
  console.log("stop recording");
  mediaRecorder.stop();
};

const playRecording = (e) => {
  console.log("play recording");
  const superBuffer = new Blob(recordedBlobs);
  const recorderVideoEl = document.querySelector("#other-video");
  recorderVideoEl.src = window.URL.createObjectURL(superBuffer);
  recorderVideoEl.controls = true;
  recorderVideoEl.play();
};
