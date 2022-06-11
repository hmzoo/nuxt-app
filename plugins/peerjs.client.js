import Peer from 'peerjs'

//const peer = new Peer(null, { debug: 3 })

const peer = new Peer()
const conns =[]

const addConn = (id,conn) => {
  conns.push({id:id,conn:conn})
 }

 const getConn = (id) => {
  for (let i=0;i<conns.length;i=i+1){
    if(conns[i].id==id){
      return conns[i].conn
    }
    return null
  }
 }

export default defineNuxtPlugin(() => {
  return {
    provide: {
      peer : peer,
      addConn : addConn,
      getConn : getConn
    }
  }
})