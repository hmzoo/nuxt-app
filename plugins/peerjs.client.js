import Peer from 'peerjs'



export default defineNuxtPlugin(() => {
  return {
    provide: {
      hello: () => 'world',
      getPeer: () => { return new Peer()}
    }
  }
})