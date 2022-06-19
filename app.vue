<script setup>
const { $initPeer, $cleanPeer,$interfacePeer, $getConn, $getMedia,$connectPeer ,$heartBeat,$callPeer,$closeMedia} = useNuxtApp();
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

const callPeer=(id)=>{
  if(uss.value!=null){
     logit("PEER","CALLPEER STREAM "+id)
      $callPeer(id,uss.value)
      }
}

const connectPeer=(id)=>{
     logit("PEER","CONNECTPEER "+id)
     $connectPeer(id)
}

const closeMedia=(id)=>{
  logit("PEER","CLOSEMEDIA "+id)
  delPeerStream(id)
  $closeMedia(id)
}

const startApp = () => {
  logit("APP","STARTING")
  getApiUKey();
  if (typeof $interfacePeer !== "undefined") {
    $interfacePeer.onPeerOpen = (id) => {
      logit("PEER","ONPEEROPEN "+id)
      peerStatus("PEER READY "+id)
      setInfoUKey(id);
    };


    $interfacePeer.onPeerConn = (conn) => {
      logit("PEER","ONPEERCONN "+conn.peer)
      updateApp();
      setConnFollow(conn,"CONNECTION");
      
    };
    
    $interfacePeer.onConnData = (conn, data) => {
      setConnFollow(conn,"");
      console.log("DATA",data)
      if(data.msg !=undefined){
        logit("PEER","ONCONNDATA "+conn.peer+" "+data.msg)
         addPeerMessage(conn.peer, data.msg);
         setConnFollow(conn,"MSG");
      }
       if(data.sr !=undefined && data.sr=="callme"){
         callPeer(conn.peer)
       }
      if(data.ssid !=undefined){
         if(!checkssid(conn.peer,data.ssid)){
           closeMedia(conn.peer)
         }
       }
      
      
    };
    $interfacePeer.onConnOpen = (conn) => {
      logit("PEER","ONCONNOPEN "+conn.peer)
      setConnFollow(conn,"OPEN");
   
    };
    $interfacePeer.onConnClose = (conn) => {
      logit("PEER","ONCONNCLOSE "+conn.peer)
      setConnectedFollowUkey(getFollowFromInfo(conn.peer).ukey, false);
      setConnFollow(conn,"CLOSE");
      closeMedia(conn.peer)
    };
    $interfacePeer.onConnError = (conn, err) => {
      logit("PEER","ONCONNERROR "+conn.peer+ " "+err.toString())
      Console.log("Peer connection err", id, err.toString(), getFollowFromInfo(id));
      setConnFollow(conn,"ERROR");
      closeMedia(conn.peer)
    };

   $interfacePeer.onPeerCall = (media) => {
      logit("PEER","ONPEERCALL "+media.peer)
      setMediaFollow(media,"CALL");
      if(selfStreamIsOn()){
        logit("PEER","ANSWER WITH STREAM "+media.peer)
        media.answer(getSelfStream()) 
      }else{
        logit("PEER","ANSWER NO STREAM "+media.peer)
        media.answer() 
      }
      //media.answer(uss.value)
    };


    $interfacePeer.onMediaStream = (media, stream) => {
      logit("PEER","ONMEDIASTREAM "+media.peer)
      console.log("ONSTREAM",stream)
      setMediaFollow(media,"STREAM");
      setPeerStream(media.peer,stream)
    };
    $interfacePeer.onMediaClose = (media) => {
      logit("PEER","ONMEDIACLOSE "+media.peer)
      setMediaFollow(media,"CLOSE");
      closeMedia(media.peer)
      //setConnectedFollowUkey(getFollowFromInfo(id).ukey, false);
    };
    $interfacePeer.onMediaError = (media, err) => {
      logit("PEER","ONMEDIAERROR "+media.peer+ " "+err.toString())
       setMediaFollow(media,"ERROR");
       closeMedia(media.peer)
    };
    $interfacePeer.onStreamInactive = (id) => {
      logit("PEER","ONSTREAMINACTIVE "+id)
    };
    $interfacePeer.onStreamActive = (id) => {
      logit("PEER","ONSTREAMACTIVE "+id)
    };

    usePeersMessages().value = [];
    usePeersStreams().value =[];
 
    setTimeout($initPeer, 300);
    setTimeout(updateApp, 1000);
  }
};

const updateApp = () => {
  logit("APP","UPDATING")
  getAllDataUkey();
  setTimeout(checkFollowers, 1000);
  setTimeout(checkConns, 2000);
};

const resetApp = () => {
  logit("APP","RESETING")
  $cleanPeer();
  resetUKey();
  startApp();
};

const checkConns = () => {
  logit("APP","CHECKCONNS")
  useFollowsUKey().value.forEach((f) => {
    if ($getConn(f.info) == null && f.info != "DOWN") {
      connectPeer(f.info);
    }
  });
};

const addFollow = (d) => {
  console.log("rrr",d)
  addFollowUkey(d);
  setTimeout(updateApp, 1000);
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