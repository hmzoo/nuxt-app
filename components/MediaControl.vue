<script setup>
const emit = defineEmits(["onStreamOn", "onStreamOff"]);

const info = ref("info");
const camera_status = ref(false);
const micro_status = ref(false);

const uss = useSelfStream();

const uad = useAudioDevices();
const uvd = useVideoDevices();

const switchCam = () => {
  camera_status.value = !camera_status.value;
  getMedias();
};
const switchMic = () => {
  micro_status.value = !micro_status.value;
  getMedias();
};
const selectMic = (id) => {
  selectAudioDevice(id);
  getMedias();
};
const selectCam = (id) => {
  selectVideoDevice(id);
  getMedias();
};

const getDevices = () => {
  console.log("GETDEVICES", uad.value, uvd.value);
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    let cpt_mic = 1;
    let cpt_cam = 1;
    let ids = [];
    for (const deviceInfo of devices) {
      if (
        deviceInfo.kind == "audioinput" &&
        ids.indexOf(deviceInfo.deviceId) == -1
      ) {
        uad.value.push({
          id: deviceInfo.deviceId,
          label: `Mic ${cpt_mic} (${deviceInfo.label})`,
          selected: cpt_mic == 1,
        });
        cpt_mic = cpt_mic + 1;
        ids.push(deviceInfo.deviceId);
      }
      if (
        deviceInfo.kind == "videoinput" &&
        ids.indexOf(deviceInfo.deviceId) == -1
      ) {
        uvd.value.push({
          id: deviceInfo.deviceId,
          label: `Cam ${cpt_cam} (${deviceInfo.label})`,
          selected: cpt_cam == 1,
        });
        cpt_cam = cpt_cam + 1;
        ids.push(deviceInfo.deviceId);
      }
    }
  });
};

const closeSelfStream = () => {
  if (uss.value != null) {
    uss.value.getTracks().forEach((track) => track.stop());
    uss.value = null;
  }
  emit("onStreamOff");
  info.value = "STREAM CLOSED";
};

const startSelfStream = (stream) => {
  uss.value = stream;
  emit("onStreamOn");
  info.value = "ON AIR";
};

const getMedias = () => {
  closeSelfStream();
  if (!(camera_status.value || micro_status.value)) {
    return;
  }
  info.value = "START STREAM";

  let constrains = {
    video: { deviceId: getVideoDeviceId() },
    audio: { deviceId: getAudioDeviceId() },
  };
  console.log(constrains, camera_status.value, micro_status.value, uss.value);
  console.log("navigator.mediaDevices.", navigator.mediaDevices);

  if (uss.value == null) {
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
        startSelfStream(stream);
        // setTracks()
      })
      .catch((err) => {
        console.log("getMedias error", err.toString());
        info.value = err.toString();
        micro_status.value =false;
        camera_status.value =false;
      });
  } else {
    uss.value.getAudioTracks()[0].enabled = micro_status.value;
    uss.value.getVideoTracks()[0].enabled = camera_status.value;
  }
};

onMounted(() => {
  getDevices();
});
</script>

<template>
  <i-container>
    <div><small>{{ info }}</small></div>
    <div>
      <i-button @click="switchCam" v-if="camera_status">Camera off</i-button>
      <i-button @click="switchCam" v-else>Camera on</i-button>
      <i-button @click="switchMic" v-if="micro_status">Micro off</i-button>
      <i-button @click="switchMic" v-else>micro on</i-button>
    </div>
    <div>
      <div
        style="margin: 3px"
        v-for="(item, index) in uvd"
        :key="'uvd_' + index"
      >
        <i-button size="sm"
          :color="item.selected ? 'success' : 'light'"
          @click="selectCam(item.id)"
          >{{ item.label }}</i-button
        >
      </div>
    </div>
    <div>
      <div
        style="margin: 3px"
        v-for="(item, index) in uad"
        :key="'uvd_' + index"
      >
        <i-button size="sm"
          :color="item.selected ? 'success' : 'light'"
          @click="selectMic(item.id)"
          >{{ item.label }}</i-button
        >
      </div>
    </div>
  </i-container>
</template>