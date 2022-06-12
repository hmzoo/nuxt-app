<script setup>

const followslist = useFollowsUKey();
const selectedfollow = useSelectedFollow()
const emit = defineEmits(["onSelect"]);

const select= (ukey)=>{
 
    emit("onSelect", ukey);
}

const BuildButton =(ukey)=>{
  let text = ukey.ukey+" "
  if(ukey.connected){
    text=text+"connected"
  }else{
    text=text+"disconnected"
  }
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