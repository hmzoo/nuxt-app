<script setup>
const followerslist = useFollowersUKey();
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
    <span
      style="display:block,margin: 3px"
      v-for="(item, index) in followerslist"
      :key="'follower_' + index"
    >
      {{ item }}</span
    >
  </div>
</template>