<script setup>
const props = defineProps({
  stream: { Type: Object },
  muted:{Type : String }
});
</script>
<template>
<div>
        <video
          ref="selfStreamVideo"
          width="300"
          height="300"
          autoplay="autoplay"
          :muted="muted"
          :srcObject="stream"
        ></video>
        </div>
</template>