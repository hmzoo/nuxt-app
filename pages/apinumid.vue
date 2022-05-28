<script setup>
const localnumid = ref("");

console.log("localnumid apinumid");
//localStorageNumID(localnumid)

  useFetch("https://api.nuxtjs.dev/mountains", {
  //  params: { ukey: localnumid.value.ukey, uid: localnumid.value.uid },
   // pick: ["ukey", "uid"],
  }).then((resp) => {
    console.log("RESP",resp,resp.data.value);
    return resp;
  }).catch ((err)=>{console.log("ERR",err)});
  
onMounted(() => {
  localnumid.value = getLocalStorageNumID();
 // console.log(config)
  
  useFetch("https://api.nuxtjs.dev/mountains", {
  //  params: { ukey: localnumid.value.ukey, uid: localnumid.value.uid },
   // pick: ["ukey", "uid"],
  }).then((resp) => {
    console.log("RESP",resp,resp.data.value);
    return resp;
  }).catch ((err)=>{console.log("ERR",err)});
  

});
</script>


<template>
  <i-container>
    <i-row>
      <i-column xs="12">
        <h3>fetch test</h3>
      </i-column>
    </i-row>
    Localnumid : {{ localnumid }}
    <i-row>
      <i-column xs="12"> </i-column>
    </i-row>
  </i-container>
</template>