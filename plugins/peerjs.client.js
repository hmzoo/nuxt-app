import Peer from 'peerjs'

//const peer = new Peer(null, { debug: 3 })

let peer = new Peer()
let conns = {}
let medias = {}

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

}


const heartBeat= ()=>{
  Object.keys(conns).forEach(key => {
    if(conns[key].open){  
      conns[key].send({hb:"cool"});
    }
  })
}


const initConn = (conn) =>{
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
  });
  conn.on("error", function (err) {
    interf.onConnError(conn.peer,err)
  });
}

const initMedia = (media) =>{
  console.log("INITMEDIA",media)
  interf.onPeerCall(media)
  media.on("stream", function (stream) {
    //addMedia(media.peer,media)
    interf.onMediaStream(media,stream)
  });
  media.on("close", function (media) {
    delMedia(media.peer)
    interf.onMediaClose(media)
  });
  media.on("error", function (err) {
    interf.onMediaError(media,err)
  });
}

const initPeer= ()=>{
  peer.destroy();
  conns = {}
  medias = []
  console.log("INIT PEER")
  peer = new Peer()
  
  peer.on("open", interf.onPeerOpen);
  peer.on("connection", initConn);
  peer.on("call", initMedia);
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
  console.log("CALLPEER",id,stream) 
  let c= null
  if(stream != null){
  c= peer.call(id,stream);
  }else{
  c=peer.call(id);
  }
  console.log("callPeer",id,stream,c)
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

const addMedia = (id, media) => {
  medias[i]=media
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




export default defineNuxtPlugin(() => {
  return {
    provide: {
      interfacePeer : interf,
      initPeer: initPeer,
      connectPeer: connectPeer,
      dataPeer: dataPeer,
      callPeer: callPeer,
      getConn : getConn,
      heartBeat:heartBeat
    }
  }
})