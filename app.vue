<script setup>
const { $initPeer ,$interfacePeer,$getConn,$connectPeer} = useNuxtApp();
useHead({
  titleTemplate: "My App - %s",

  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  charset: "utf-8",
  meta: [{ name: "description", content: "My amazing site." }],
  bodyAttrs: {
    class: "test",
  },
});



const startApp =()=>{
  getApiUKey();
  if (typeof $interfacePeer !== "undefined") {
  $interfacePeer.onPeerOpen = (id) => {setInfoUKey(id);}
  $interfacePeer.onConnData =  (id,data) => {addPeerMessage(id,data);setConnectedFollowUkey(getFollowFromInfo(id).ukey,true)}
  $interfacePeer.onConnOpen = (id) =>{setConnectedFollowUkey(getFollowFromInfo(id).ukey,true)}
  $interfacePeer.onConnClose = (id) =>{setConnectedFollowUkey(getFollowFromInfo(id).ukey,false);setTimeout(updateApp,1000);}
  $interfacePeer.onConnError= (id,err) =>{setConnectedFollowUkey(getFollowFromInfo(id).ukey,false)}
  usePeersMessages().value=[];
  $initPeer()
  setTimeout(updateApp,1000);
  }

}

const updateApp= ()=>{
  getAllDataUkey();
  setTimeout(checkConns,1000);
}

const resetApp= ()=>{
  resetUKey()
  startApp()
}

const checkConns = () => {
  useFollowsUKey().value.forEach((f) => {
    if ($getConn(f.info) == null) {
      $connectPeer(f.info);
    }
  });
};


onMounted(() => {
startApp();
var updateinterval = setInterval(updateApp, 20000);

})
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
          <i-column xs="3"> <UKeyID showReset="true" @onReset="resetApp"/> </i-column>
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