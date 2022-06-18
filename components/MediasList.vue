<script setup>

const streams = usePeersStreams();
const emit = defineEmits(["onSelect"]);

const select= (ukey)=>{
    emit("onSelect", ukey);
}

</script>


<template>
    
<div>
    <div style="margin: 3px"
      v-for="(item, index) in streams"
      :key="'stream_' + index">
        <MediaVideo :stream="item.stream" />
    </div>

</div>


</template>