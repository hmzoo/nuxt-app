<script setup>
const props = defineProps({
  stream: { Type: Object },
  muted:{Type : String }
});
const streamStatus =(stream)=>{
  if(stream != null){
    return stream.active
  }
  return "NULL"
}

const testStream=(stream)=>{
  console.log("streamtest",stream)
}
onMounted(() => {



})
</script>
<template>
<div>
        <video @click="testStream(stream)"
          ref="selfStreamVideo"
          width="300"
          height="300"
          autoplay="autoplay"
          :muted="muted"
          :srcObject="stream"
        ></video>
        {{ streamStatus(stream) }}
        </div>
</template>