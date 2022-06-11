


//UKEY
export const useUKey = () => {
    return useState('ukey', () => {return {ukey: "000000",uid:"xxx-xxx-xxx"}})
}
//SRVMSG
export const useSrvMsg = () => {
    return useState('srvmsg', () => {return {msg:'',err :''}})
}
//INFO
export const useInfoUKey = () => {
    return useState('infoukey', () => "...")
}
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

export const useSelectedFollow = () => {
    return useState('selectedfollow', () => "")
}




//localStorage
const setLocalUKey = () => {

    if (localStorage != undefined) {
        const ukey = useUKey()
        localStorage.setItem('UKEY', JSON.stringify(ukey.value))
    }
}

const getLocalUKey = () => {

    if (localStorage != undefined && localStorage.getItem('UKEY') != null) {
        const ukey = useUKey()
        ukey.value = JSON.parse(localStorage.getItem('UKEY'))
    }
}

//States

const updateStates=(data)=> {
  //  console.log(data)
    if(!data){return}
    if (data.srvmsg!== undefined){
    useSrvMsg().value = data.srvmsg
    }
    if (data.uid!== undefined && data.ukey!== undefined ){
        useUKey().value={ukey:data.ukey, uid:data.uid}
    }
    if(data.info !== undefined){
        useInfoUKey().value=data.info || ""
       // console.log(useInfoUKey().value)
    }
    if (data.follows !== undefined ){
        useFollowsUKey().value=data.follows
    }
    if (data.followers!== undefined ){
        useFollowersUKey().value=data.followers
    }
    return data
}

// GET REQ

export const resetUKey = () => {
    const ukey = useUKey()
    ukey.value = {ukey: "000000",uid: "xxx-xxx-xxx"}
    setLocalUKey();
    getApiUKey();
}


export const getApiUKey = () => {
    const ukey = useUKey()
    getLocalUKey();
    const date = Date.now()
    return $fetch(`/api/ukey?ukey=${ukey.value.ukey}&uid=${ukey.value.uid}&date=${date}`)
        .then(resp => {
          //  console.log("RESP",resp)
            updateStates(resp);
            setLocalUKey();
            return resp;
        }).catch(err =>{useSrvMsg().value = { msg:"SERVER DOWN",err:err.toString()}})

}

//POST REQ 

const reqItemListUKey = (req)=> {
    const ukey = useUKey('ukey');
    req.ukey=ukey.value.ukey;
    req.uid=ukey.value.uid;

    return $fetch("/api/ukey", { method: 'POST', body: req })
        .then(resp => {
         //   console.log("reqlist",req,resp,resp.srvmsg.err )
            updateStates(resp)

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

export const renewIDUKey = () => {
    reqItemListUKey({cmd:"RENEWID"})
}


//LIST UTILS
export const indexListUKey = (ukey) => {
    const list = useUKeyList().value
 //   console.log(list)
    for (var i = 0; i < list.length; i++) {
        if (list[i].ukey == ukey) {
            return i
        }
    }
    return -1
}





