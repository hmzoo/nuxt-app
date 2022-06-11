import Peer from 'peerjs'

const peer = new Peer(null, { debug: 3 })

export default defineNuxtPlugin(() => {
  return {
    provide: {
      hello: () => 'world',
      peer : peer
    }
  }
})