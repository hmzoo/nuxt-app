<script setup>
const { $peer ,$addConn} = useNuxtApp();
useHead({
  titleTemplate: "My App - %s",

  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  charset: "utf-8",
  meta: [{ name: "description", content: "My amazing site." }],
  bodyAttrs: {
    class: "test",
  },
});

const ukey = useUKey();
onMounted(() => {
  getApiUKey();
  setInterval(() => getAllDataUkey(), 20000);

  console.log("APP Mounted ukey:", ukey.value);
  $peer.on("open", function (id) {
    console.log("My peer ID is: " + id);
    setInfoUKey(id);
  });

  $peer.on("connection", function (conn) {
    console.log("Conn", conn)
    $addConn(conn.peer,conn)
    conn.on("data", function (data) {
      console.log("Conn", conn.peer, "Peer data: ", data);
      addPeerMessage(conn.peer,data)
    });
    conn.send("Hello from Receiver")

  });
});
/*
const { data } = await useFetch('/api/ukey',{params: {ukey:numid.value.ukey,uid:numid.value.uid}, pick:['ukey','uid']})
    .then( (resp) => {
     console.log("RESP",resp.data.value.ukey);
     numid.value=resp.data.value
     // user.value = {ukey:resp.data._value.ukey,uid:resp.data._value.uid}
     //user.value = resp.data._value;
      return resp;
    })
*/
</script>


<template>
  <i-layout>
    <i-layout-header>
      <i-container>
        <i-row>
          <i-column xs="7">
            <Nav />
          </i-column>
          <i-column xs="3"> <UKeyID showReset="true" /> </i-column>
          <i-column xs="2"> <SrvMsg /> </i-column>
        </i-row>
      </i-container>
    </i-layout-header>

    <i-layout-content>
      <NuxtPage />
    </i-layout-content>

    <i-layout-footer> Footer </i-layout-footer>
  </i-layout>
</template>



<style lang="scss">
@import "@inkline/inkline/css/variables";
@import "@inkline/inkline/css/mixins";

:root {
  --color--primary--h: 195deg;
  --color--primary--s: 77%;
  --color--primary--l: 39%;
}
</style>