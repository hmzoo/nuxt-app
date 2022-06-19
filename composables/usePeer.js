// 


export const usePeerStatus = () => {
    return useState('peerstatus', () => {return "PEER NOT READY"})
}

export const peerStatus =(t)=>{
    usePeerStatus().value=(t)
}

export const usePeersMessages = () => {
    return useState('peersmessages', () => {return []})
}

export const usePeersStreams = () => {
    return useState('peersstreams', () => {return []})
}

export const addPeerMessage = (id,msg) => {
    usePeersMessages().value.push({id:id,msg:msg})
}

export const setPeerStream = (id,stream) => {
    if(stream == null){
        delPeerStream(id)
        return
    }
    stream.onactive = ()=> setPeerStream(id,stream)
    
    stream.oninactive = ()=> setPeerStream(id,stream)
    
    const ps=usePeersStreams().value
    for(let i=0;i<ps.length;i=i+1){
        if(ps[i].id==id){
            ps[id]={id:id,stream:stream, active:stream.active}
            return
        }
    }
    usePeersStreams().value.push({id:id,stream:stream})
}

export const delPeerStream = (id) => {
    const ps=usePeersStreams().value
    const nps=[]
    for(let i=0;i<ps.length;i=i+1){
        if(ps[i].id!=id){
            nps.push({id:ps[i].id,stream:ps[i].stream})
        }
        }
        usePeersStreams().value = nps
    }

export const checkssid=(mediaid,streamid)=>{

    const ps=usePeersStreams().value
    for(let i=0;i<ps.length;i=i+1){
        if(ps[i].id==mediaid && ps[i].stream.id==streamid){
            return true
        }
    }
    return false

}



