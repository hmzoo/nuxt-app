<script setup>

const camera_status =ref(false)
const micro_status =ref(false)
const videoPlayerSelf= ref(null)

var mediastream = null

const switchCam =()=>{
    camera_status.value=!camera_status.value
    getMedia()

    
}
const switchMic =()=>{
    micro_status.value=!micro_status.value
    getMedia()
}

const setTracks=()=>{
    if(window.selfStream==null){getMedia()}else{
        if(window.selfStream.getAudioTracks()[0]){
            window.selfStream.getAudioTracks()[0].enabled = micro_status.value
        }
       if(window.selfStream.getVideoTracks()[0]){
            window.selfStream.getVideoTracks()[0].enabled = camera_status.value
       }

     
        
        console.log("TRACKS",window.selfStream.getVideoTracks(),window.selfStream.getAudioTracks())
        videoPlayerSelf.value.srcObject=window.selfStream;
        
        //videoPlayerSelf.video,paused=false;
        console.log(videoPlayerSelf)
    }
}


const getMedia =()=>{
    let constrains = {
     video: camera_status.value,
     audio: micro_status.value
     }
    console.log(constrains)
    navigator.mediaDevices.getUserMedia(constrains).then(stream =>{
     window.selfStream = stream;
 
     stream.onremovetrack = function() {
        console.log('Stream ended');
     }
    setTracks()
    
  }).catch(err => console.log(err.toString()));
}


</script>

<template>
<i-container>
    <video autoplay width="320" height="240" ref="videoPlayerSelf"></video>
    <div>
 <i-button @click="switchCam" v-if="camera_status">Camera on</i-button>
 <i-button @click="switchCam" v-else>Camera off</i-button> 
 <i-button @click="switchMic" v-if="micro_status">Micro on</i-button>
 <i-button @click="switchMic" v-else>micro off</i-button> 
 </div>
 
 </i-container>
</template>