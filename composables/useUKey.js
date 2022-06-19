


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
        for(let i=0;i<data.follows.length;i=i+1){
            let v = getFollow(data.follows[i].ukey);
           
            data.follows[i].selected = ( v !=null && v.selected!=undefined && v.selected )
            data.follows[i].connected = ( v !=null && v.connected!=undefined && v.connected)
            if(v.conn!=undefined){
                data.follows[i].conn=v.conn
            }
            if(v.connStatus!=undefined){
                data.follows[i].connStatus=v.connStatus
            }else{
                data.follows[i].connStatus=false
            }
            if(v.connInfo!=undefined ){
                data.follows[i].connInfo=v.connInfo
            }else{
                data.follows[i].connInfo=""
            }
            if(v.mediaStatus!=undefined){
                data.follows[i].mediaStatus=v.mediaStatus
            }else{
                data.follows[i].mediaStatus=false
            }
            if(v.mediaInfo!=undefined ){
                data.follows[i].mediaInfo=v.mediaInfo
            }else{
                data.follows[i].mediaInfo=""
            }
        }
           
        useFollowsUKey().value=data.follows
    }
    if (data.followers!== undefined ){
        useFollowersUKey().value=data.followers
    }
    return data
}

// GET REQ

export const resetUKey = () => {
    deleteIDUKey()
    const ukey = useUKey()
    ukey.value = {ukey: "000000",uid: "xxx-xxx-xxx"}
    setLocalUKey();
    
}


export const getApiUKey = () => {
    logit("UKEY","GETAPIUKEY")
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
    logit("UKEY","ADDFOLLOW "+lookat)
    console.log("add ",lookat)
    reqItemListUKey({cmd:"ADD",lookat:lookat})
}

export const delFollowUKey = (lookat) => {
    reqItemListUKey({cmd:"DEL",lookat:lookat})
}
export const setInfoUKey = (info) => {
    logit("UKEY","SETINFO "+info)
    reqItemListUKey({cmd:"SETINFO",info:info})
}

export const deleteIDUKey = () => {
    reqItemListUKey({cmd:"DELETEID"})
}

export const selectFollowUkey = (lookat,b) => {
    const follows = useFollowsUKey().value
    for(let i=0;i<follows.length;i=i+1){
        if( follows[i].ukey == lookat){
            
            follows[i].selected =b
        }
    }
    useFollowsUKey().value =follows
}

export const checkFollowers =()=>
{
    logit("UKEY","CHECKFOLLOWERS")
    useFollowersUKey().value.forEach((f)=>{
        if(indexFollowUKey(f)<0){
            addFollowUkey(f);
        }
    })
}

export const setConnectedFollowUkey = (lookat,b) => {
    const follows = useFollowsUKey().value
    for(let i=0;i<follows.length;i=i+1){
        if( follows[i].ukey == lookat){
            follows[i].connected =b
        }
    }
    useFollowsUKey().value =follows
}

export const setConnFollow = (conn,conninfo) => {
    const follows = useFollowsUKey().value
    for(let i=0;i<follows.length;i=i+1){
        if( follows[i].info == conn.peer){
            follows[i].connStatus =conn.open
            follows[i].connInfo =conninfo
        }
    }
    useFollowsUKey().value =follows
}

export const setMediaFollow = (media,mediaInfo) => {
    const follows = useFollowsUKey().value
    for(let i=0;i<follows.length;i=i+1){
        if( follows[i].info == media.peer){
            follows[i].mediaStatus =media.open
            follows[i].mediaInfo =mediaInfo
        }
    }
    useFollowsUKey().value =follows
}

//LIST UTILS
export const indexFollowUKey = (ukey) => {
    const list = useFollowsUKey().value
 //   console.log(list)
    for (var i = 0; i < list.length; i++) {
        if (list[i].ukey == ukey) {
            return i
        }
    }
    return -1
}

export const getFollow = (ukey) => {
    const list = useFollowsUKey().value
    for (var i = 0; i < list.length; i++) {
        if (list[i].ukey == ukey) {
            return list[i]
        }
    }
    return {}
}

export const getFollowFromInfo = (info) => {
    const list = useFollowsUKey().value
    for (var i = 0; i < list.length; i++) {
        if (list[i].info == info) {
            return list[i]
        }
    }
    return {ukey:'UNKNOWN',info:info}
}





