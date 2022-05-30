//LIST
export const useListUKey = () => {
    return useState('listukey', () => [])
}
export const useFollowsUKey = () => {
    return useState('followsukey', () => [])
}
export const useFollowersUKey = () => {
    return useState('followersukey', () => [])
}
export const useInfoUKey = () => {
    return useState('infoukey', () => "...")
}
export const useSrvMsgUKey = () => {
    return useState('infoukey', () => {})
}


//REQUETES POST

const reqItemListUKey = (req)=> {
    const ukey = useUKey('ukey');
    req.ukey=ukey.value.ukey;
    req.uid=ukey.value.uid;

    return $fetch("/api/ukey", { method: 'POST', body: req })
        .then(resp => {
            console.log("reqlist",req,resp,resp.srvmsg.err )
            if (resp.srvmsg){
                useSrvMsgUKey().value=resp.srvmsg
                if (!resp.srvmsg.err) {
                    
                    updateStates(resp)
                }
            }
            return resp
        }).catch(err => console.log("ERR", err, process))
}

export const getAllDataUkey = () => {
    const req =reqItemListUKey({cmd:"GET"})
}

export const addFollowUkey = (lookat) => {
    reqItemListUKey({cmd:"ADD",lookat:lookat})
}

export const delFollowUKey = (lookat) => {
    reqItemListUKey({cmd:"DEL",lookat:lookat})
}
export const setInfoUKey = (info) => {
    reqItemListUKey({cmd:"SETINFO",info:info})
}

// STATES

const updateStates=(data)=> {
    console.log(data)
    if(!data){return}
    if(data.info !== undefined){
        useInfoUKey().value=data.info || ""
        console.log(useInfoUKey().value)
    }
    if (data.follows !== undefined ){
        useFollowsUKey().value=data.follows
    }
    if (data.followers!== undefined ){
        useFollowersUKey().value=data.followers
    }
    return data
}


//UTILS
export const indexListUKey = (ukey) => {
    const list = useUKeyList().value
    console.log(list)
    for (var i = 0; i < list.length; i++) {
        if (list[i].ukey == ukey) {
            return i
        }
    }
    return -1
}