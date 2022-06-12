// 


export const usePeers = () => {
    
    return useState('peers', () => {return []})
}

export const usePeersMessages = () => {
    return useState('peersmessages', () => {return []})
}

export const addPeerMessage = (id,msg) => {
    usePeersMessages().value.push({id:id,msg:msg})
}

