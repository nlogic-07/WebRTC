const shareScreen = async () => {
  let options = {
    video: true,
    audio: true,
    surfaceSwiching: "include",
  };
  try {
    mediaStream = await navigator.mediaDevices.getDisplayMedia(options);
  } catch (e) {}
  console.log("share screen!!");
  changeButtons([
    "green",
    "green",
    "blue",
    "blue",
    "green",
    "green",
    "green",
    "green",
  ]);
};
