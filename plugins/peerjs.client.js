import Peer from 'peerjs'

//const peer = new Peer(null, { debug: 3 })

let peer = new Peer()
let conns = []
let medias = []

const interf ={
  onPeerOpen : (id) => console.log("ONPEEROPEN",id),
  onPeerConn : (id) => console.log("ONPEERCONN",id),
  onPeerCall : (id) => console.log("ONPEERCALL",id),
  onPeerClose : () => console.log("ONPEERCLOSE"),
  onPeerDisconnected : () => console.log("ONPEERDISCONNECTED"),
  onPeerError : (err) => console.log("ONPEERERR",err.toString()),
  onConnOpen : (id) => console.log("ONCONNPEN", id),
  onConnData : (id,data) => console.log("ONCONNDATA", id, data),
  onConnClose : (id) => console.log("ONCONNCLOSE", id),
  onConnError : (id,err) => console.log("ONCONNERR",id,err.toString()),
  onMediaStream : (id,stream) => console.log("ONMEDIASTREAM", id, stream),
  onMediaClose : (id) => console.log("ONMEDIACLOSE", id),
  onMediaError : (id,err) => console.log("ONMEDIAERR",id,err.toString()),
}


const heartBeat= ()=>{

  conns.forEach((c)=>{
   
    if(c.conn.open){
      
    c.conn.send({hb:"ok"});
    }
  })

}




const initConn = (conn) =>{
  interf.onPeerConn(conn.peer)
  conn.on("open", function () {
     addConn(conn.peer,conn)
     interf.onConnOpen(conn.peer)
  });
  conn.on("data", function (data) {
    interf.onConnData(conn.peer,data)
  });
  conn.on("close", function () {
    delConn(conn.peer,conn)
    interf.onConnClose(conn.peer)
  });
  conn.on("error", function (err) {
    interf.onConnError(conn.peer,err)
  });
}

const initMedia = (media) =>{
  interf.onPeerCall(media.peer)
  media.on("open", function () {
     addMedia(media.peer,media)
     interf.onConnOpen(media.peer)
  });
  media.on("data", function (data) {
    interf.onMediaData(media.peer,data)
  });
}

const initPeer= ()=>{
  peer.destroy();
  conns = []
  medias = []
  console.log("INIT PEER")
  peer = new Peer()
  
  peer.on("open", interf.onPeerOpen);
  peer.on("connection", initConn);
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




const addConn = (id, conn) => {
  conns.push({ id: id, conn: conn })
}

const delConn = (id) => {
  const cconns =conns
  conns=[]
  for (let i = 0; i < cconns.length; i = i + 1) {
    if (cconns[i].id != id) {
      conns.push({ id: id, conn: cconns[i] })
    }
  }

}

const getConn = (id) => {
  for (let i = 0; i < conns.length; i = i + 1) {
    if (conns[i].id == id) {
      return conns[i].conn
    }
    
  }
  return null
}

const addmedia = (id, media) => {
  medias.push({ id: id, media: media })
}

const getMedia = (id) => {
  for (let i = 0; i < medias.length; i = i + 1) {
    if (medias[i].id == id) {
      return medias[i].media
    }
    return null
  }
}




export default defineNuxtPlugin(() => {
  return {
    provide: {
      interfacePeer : interf,
      initPeer: initPeer,
      connectPeer: connectPeer,
      dataPeer: dataPeer,
      getConn : getConn,
      heartBeat:heartBeat
    }
  }
})