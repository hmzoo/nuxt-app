<script setup>
const pmsglist= usePeersMessages();

const buildMsg = (pmsg) => {
  return getFollowFromInfo(pmsg.id).ukey+" : "+pmsg.msg
}
</script>


<template>
  <div
    class=""
    style="
      border: solid;
      border-width: 2px;
      border-color: blueviolet;
      height: 300px;
      margin: 10px;
    "
  >
    <div
      style="margin: 3px"
      v-for="(item, index) in pmsglist"
      :key="'follower_' + index"
    >
      {{ buildMsg(item)}}</div
    >
  </div>
</template>