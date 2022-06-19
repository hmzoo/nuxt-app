<script setup>

const followslist = useFollowsUKey();
const selectedfollow = useSelectedFollow()
const emit = defineEmits(["onSelect"]);

const select= (ukey)=>{
 
    emit("onSelect", ukey);
}

const BuildButton =(ukey)=>{
  let text = ukey.ukey+" "
  if(ukey.connStatus){
    text=text+"connected"
  }else{
    text=text+"disconnected"
  }
  text=text+" "+ukey.connInfo

  if(ukey.mediaStatus){
    text=text+" streaming"
  }else{
    text=text+" no stream"
  }
  text=text+" "+ukey.mediaInfo
  return text
}

</script>


<template>
    
<div>{{ selectedfollow }}
    <div style="margin: 3px"
      v-for="(item, index) in followslist"
      :key="'follow_' + index">
        <i-button :color="item.selected ? 'success' : 'light'" @click="select(item)">{{ BuildButton(item)}}</i-button>
    </div>

</div>


</template>