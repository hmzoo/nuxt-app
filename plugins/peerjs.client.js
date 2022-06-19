import Peer from 'peerjs'

//const peer = new Peer(null, { debug: 3 })

let peer = null
let conns = {}
let medias = {}
let ssid =""


const interf ={
  onPeerOpen : (id) => console.log("ONPEEROPEN",id),
  onPeerConn : (conn) => console.log("ONPEERCONN",conn.peer),
  onPeerCall : (media) => console.log("ONPEERCALL",media.peer),
  onPeerClose : () => console.log("ONPEERCLOSE"),
  onPeerDisconnected : () => console.log("ONPEERDISCONNECTED"),
  onPeerError : (err) => console.log("ONPEERERR",err.toString()),
  onConnOpen : (conn) => console.log("ONCONNPEN", conn.peer),
  onConnData : (conn,data) => console.log("ONCONNDATA", conn.peer, data),
  onConnClose : (conn) => console.log("ONCONNCLOSE", conn.peer),
  onConnError : (conn,err) => console.log("ONCONNERR",conn.peer,err.toString()),
  onMediaStream : (media,stream) => console.log("ONMEDIASTREAM", media.peer),
  onMediaClose : (media) => console.log("ONMEDIACLOSE", media.peer),
  onMediaError : (stream,err) => console.log("ONMEDIAERR",stream.peer,err.toString()),
  onStreamInactive :(id) => console.log("ONSTREAMINACTIVE", id),
  onStreamActive :(id) => console.log("ONSTREAMACTIVE", id),
}

const cleanPeer=()=>{
  console.log("PLUGIN PEERJS CLEAN")
  Object.keys(conns).forEach(key => {
    if(conns[key].open){  
      conns[key].close()
    }
  })
  conns = {}
  Object.keys(medias).forEach(key => {
    if(medias[key].open){  
      medias[key].close()
    }
  })
  medias = {}
  if(peer !=null){
    peer.destroy()
  }
  
}


const heartBeat= ()=>{
  Object.keys(conns).forEach(key => {
    if(conns[key].open){ 
      let sr="gotyou"
      if(medias[key]== undefined){sr="callme"} 
      conns[key].send({hb:"cool",sr:sr,ssid:ssid});
    }
  })
}

const initConn = (conn) =>{
  console.log("PLUGIN PEERJS INITCONNECT",conn.peer)
  interf.onPeerConn(conn)
  conn.on("open", function () {
     setConn(conn.peer,conn)
     interf.onConnOpen(conn)
  });
  conn.on("data", function (data) {
    setConn(conn.peer,conn)
    interf.onConnData(conn,data)
  });
  conn.on("close", function () {
    delConn(conn.peer)
    interf.onConnClose(conn)
    closeMedia(conn.peer)
  });
  conn.on("error", function (err) {
    interf.onConnError(conn,err)
    conn.close()
    delConn(conn.peer)
  });
}

const initMedia = (media) =>{
  console.log("PLUGIN PEERJS INITMEDIA",media.peer)
  setMedia(media.peer,media)
  interf.onPeerCall(media)
  media.on("stream", function (stream) {
    stream.onactive= ()=>{
      interf.onStreamActive(media.peer)
    }
    stream.oninactive= ()=>{
      interf.onStreamInactive(media.peer)
    }
    interf.onMediaStream(media,stream)
  });
  media.on("close", function () {
    interf.onMediaClose(media)
    delMedia(media.peer)
  });
  media.on("error", function (err) {
    interf.onMediaError(media,err)
    media.close();
    delMedia(media.peer)
  });
}

const initPeer= ()=>{
  peer = new Peer()
  peer.on("open", interf.onPeerOpen);
  peer.on("connection", initConn);
  peer.on("call", (initMedia));
  peer.on("close", interf.onPeerClose);
  peer.on("disconnected", interf.onPeerDisconnected);
  peer.on("error", interf.onPeerError);
}

const connectPeer= (id)=> initConn(peer.connect(id));

const dataPeer =(id,data) =>{
  var conn = getConn(id)
  if( conn != null){
    console.log("CONN OK",id,data)
    conn.send(data);
  }
}

const callPeer= (id,stream)=> {
 
  if(stream != null){
  peer.call(id,stream);
  console.log("PLUGIN PEERJS CALLPEER",id,stream)
  }
  
}

const closeMedia=(id)=>{
  var media = getMedia(id)
  if( media != null){
    media.close();
    delMedia(id)
  }

}

const closeAllMedias=()=>{
  Object.keys(medias).forEach(key => {
    if(medias[key].open){  
      medias[key].close()
    }
  })
  medias=[]
}



const setConn = (id, conn) => {
  conns[id]=conn
}

const delConn = (id) => {
delete conns[id]
}

const getConn = (id) => {
  if (conns[id] != undefined){
    return conns[id]
  } 
  return null
}

const setMedia = (id, media) => {
  medias[id]=media
}

const delMedia = (id) => {
  delete medias[id]
  }

const getMedia = (id) => {
  if (medias[id] != undefined){
    return medias[id]
  } 
  return null
}

const setssid =(id)=>{
  ssid=id
}




export default defineNuxtPlugin(() => {
  return {
    provide: {
      interfacePeer : interf,
      cleanPeer: cleanPeer,
      initPeer: initPeer,
      connectPeer: connectPeer,
      dataPeer: dataPeer,
      callPeer: callPeer,
      getConn : getConn,
      getMedia : getMedia,
      closeMedia : closeMedia,
      heartBeat:heartBeat,
      setssid :setssid
    }
  }
})