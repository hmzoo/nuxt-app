<script setup>
const emit = defineEmits(["onStreamOn","onStreamOff"]);

const camera_status = ref(false);
const micro_status = ref(false);


const switchCam = () => {
  camera_status.value = !camera_status.value;
  getMedia();
};
const switchMic = () => {
  micro_status.value = !micro_status.value;
  getMedia();
};



const getMedia = () => {
  let constrains = {
    video: true,
    audio: true,
  };
  console.log(
    constrains,
    camera_status.value,
    micro_status.value,
    window.selfStream
  );
  console.log("navigator.mediaDevices.", navigator.mediaDevices);

  if (window.selfStream == undefined) {
    navigator.mediaDevices
      .getUserMedia(constrains)
      .then((stream) => {
        stream.getAudioTracks()[0].enabled = micro_status.value;
        stream.getVideoTracks()[0].enabled = camera_status.value;

        if (!(camera_status.value || micro_status.value)) {
          stream.getTracks().forEach((track) => track.stop());
        }

        stream.onremovetrack = function () {
          console.log("Stream ended");
        };

        window.selfStream = stream;
        emit("onStreamOn");
        // setTracks()
      })
      .catch((err) => console.log(err.toString()));
  } else {
    window.selfStream.getAudioTracks()[0].enabled = micro_status.value;
    window.selfStream.getVideoTracks()[0].enabled = camera_status.value;
    if (!(camera_status.value || micro_status.value)) {
      window.selfStream.getTracks().forEach((track) => track.stop());
      emit("onStreamOff");
      delete window.selfStream;
    }
  }
};
</script>

<template>
  <i-container>
    <div>
      <i-button @click="switchCam" v-if="camera_status">Camera off</i-button>
      <i-button @click="switchCam" v-else>Camera on</i-button>
      <i-button @click="switchMic" v-if="micro_status">Micro off</i-button>
      <i-button @click="switchMic" v-else>micro on</i-button>
    </div>
  </i-container>
</template>