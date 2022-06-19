<script setup>
const bconf = useBrowserConf();

const switchcam =()=>{
    console.log("switchcam")
}
const switchmic =()=>{
    console.log("switchmic")
}
const opensettings =()=>{
    console.log("opensettings")
}
</script>
<template>
 <div>

         <i-button v-if="bconf.camera_status" @click="switchcam"> <img src="/cam_on_24.png" /></i-button>
          <i-button v-else @click="switchcam"> <img src="/cam_off_24.png"  /></i-button>

          <i-button v-if="bconf.micro_status" @click="switchmic"> <img src="/mic_on_24.png" /></i-button>
          <i-button v-else @click="switchmic"> <img src="/mic_off_24.png"  /></i-button>

          <i-button @click="opensettings"> <img src="/settings_24.png"  /></i-button>
</div>
</template>