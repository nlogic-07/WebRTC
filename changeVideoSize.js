const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
console.log(supportedConstraints);

const changeVideoSize = () => {
  //   stream.getTracks().forEach((track) => {
  //     const capabilities = track.getCapabilities();
  //     console.log(capabilities);
  //   });

  stream.getVideoTracks().forEach((track) => {
    const height = document.querySelector("#vid-height").value;
    const width = document.querySelector("#vid-width").value;

    const capabilities = track.getCapabilities();

    //Its a video track
    //can get its capabilities from .getCapabilites
    //or we can apply new constraints with .applyConstraints
    const vConstraints = {
      height: {
        exact:
          height < capabilities.height.max ? height : capabilities.height.max,
      },
      width: {
        exact: width < capabilities.width.max ? width : capabilities.width.max,
      },
      //   frameRate: 100,
      //   aspectRatio:10
    };
    track.applyConstraints(vConstraints);
  });
};
