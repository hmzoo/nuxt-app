<script setup>
const srvmsg = useSrvMsg();
const msg = srvmsg.value.msg || "---";
const err = srvmsg.value.err || "";
</script>


<template>
  <div>
    <small>
      <span>{{ srvmsg.msg }}</span
      ><br />
      <span style="color: crimson">{{ srvmsg.err }}</span>
    </small>
  </div>
</template>