<script setup>
const { $getConn } = useNuxtApp();

const props = defineProps({
  ukey: { Type: Object },
});
const emit = defineEmits(["onDelete", "onSelect"]);
const onSelect = (ukey) => {
  console.log("select " + ukey.ukey);
  if (typeof ukey != "undefined" && ukey.conn != undefined) {
    console.log("Send to " + ukey.conn.peer);
    ukey.conn.send({ msg: "SELECT" });
  }
  emit("onSelect", ukey);
};
const onDelete = (t) => {
  emit("onDelete", t);
};


</script>


<template>
  <i-card style="width: 200px" @click="onSelect(ukey)">
    <i-button
      size="sm"
      style="padding: 0px"
      class="_float:right"
      @click="onDelete(ukey)"
      ><i-icon
        name="ink-times"
        class="_color:info"
        size="sm"
        style="margin: 0px"
    /></i-button>
    <h4 class="card-title">{{ ukey.ukey }}</h4>
    <small> info :{{ ukey.info }} <br/> conn :{{ ukey.connStatus }} {{ ukey.connInfo}}<br /><br/> media :{{ ukey.mediaStatus }} {{ ukey.mediaInfo}} </small>
  </i-card>
</template>