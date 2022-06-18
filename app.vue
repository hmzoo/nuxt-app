<script setup>
const { $initPeer, $interfacePeer, $getConn, $connectPeer ,$heartBeat,$callPeer} = useNuxtApp();
useHead({
  titleTemplate: "My App - %s",

  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  charset: "utf-8",
  meta: [{ name: "description", content: "My amazing site." }],
  bodyAttrs: {
    class: "test",
  },
});

const uss = useSelfStream();

const startApp = () => {
  getApiUKey();
  if (typeof $interfacePeer !== "undefined") {
    $interfacePeer.onPeerOpen = (id) => {
      console.log("ONPEEROPEN")
      setInfoUKey(id);
    };
    $interfacePeer.onPeerConn = (conn) => {
      console.log("ONPEERCONN",conn.peer)
      updateApp();
      setConnFollow(conn,"CONNECTION");
      
    };
    
    $interfacePeer.onConnData = (conn, data) => {
      console.log("ONCONNDATA")
      if(data.msg !=undefined){
         addPeerMessage(conn.peer, data.msg);
         setConnFollow(conn,"MSG");
      }else{
       setConnFollow(conn,"");
      }
      
    };
    $interfacePeer.onConnOpen = (conn) => {
      console.log("ONCONNOPEN",conn.peer)
      setConnFollow(conn,"OPEN");
      if(uss.value!=null){
      $callPeer(conn.peer,uss.value)
      }else{
      $callPeer(conn.peer)
      }
    };
    $interfacePeer.onConnClose = (conn) => {
      console.log("ONCONNCLOSE")
      setConnectedFollowUkey(getFollowFromInfo(conn.peer).ukey, false);
      setConnFollow(conn,"CLOSE");
    };
    $interfacePeer.onConnError = (id, err) => {
      console.log("ONCONNERROR")
      Console.log("Peer connection err", id, err.toString(), getFollowFromInfo(id));
      setConnFollow(conn,"ERROR");
    };

   $interfacePeer.onPeerCall = (media) => {
      console.log("ONPEERCALL",media.peer)
      setMediaFollow(media,"CALL");
      media.answer(uss.value)
    };


     $interfacePeer.onMediaStream = (media, stream) => {
      console.log("ONMEDIASTREAM")
      setMediaFollow(media,"STREAM");
      setPeerStream(media.peer,stream)
    };
    $interfacePeer.onMediaClose = (media) => {
      console.log("ONMEDIACLOSE")
      setMediaFollow(media,"CLOSE");
      delPeerStream(media.peer)
      //setConnectedFollowUkey(getFollowFromInfo(id).ukey, false);
    };
    $interfacePeer.onMediaError = (media, err) => {
      console.log("ONMEDIAERROR")
      Console.log("Peer media err", media.peer, err.toString());
       setMediaFollow(media,"ERROR");
    };

    usePeersMessages().value = [];
    $initPeer();
    setTimeout(updateApp, 1000);
  }
};

const updateApp = () => {
  getAllDataUkey();
  setTimeout(checkFollowers, 1000);
  setTimeout(checkConns, 2000);
};

const resetApp = () => {
  resetUKey();
  startApp();
};

const checkConns = () => {
  useFollowsUKey().value.forEach((f) => {
    if ($getConn(f.info) == null && f.info != "DOWN") {
      $connectPeer(f.info);
    }
  });
};

const addFollow = (d) => {
  console.log("rrr",d)
  addFollowUkey(d);
  setTimeout(checkConns, 1000);
};

onMounted(() => {
  startApp();
  var updateinterval = setInterval(updateApp, 20000);
  var hbinterval = setInterval($heartBeat, 3000);
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
        </i-row>
      </i-container>
    </i-layout-header>

    <i-layout-content style="margin:15px">
      <NuxtPage />
    </i-layout-content>

    <i-layout-footer>
      <i-container
        ><i-row >
          <i-column xs="6">
            <FollowInput @onSubmit="addFollow" />
          </i-column>
          <i-column xs="3">
            <UKeyID showReset="true" @onReset="resetApp" />
          </i-column>
          <i-column xs="2"> <SrvMsg /> </i-column
        ></i-row> </i-container
    ></i-layout-footer>
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