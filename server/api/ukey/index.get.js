import { srvMsg,checkParamsAndValidUKey, newUKey } from './ukey';

/* API GET : recupéré le ukey
requete :
  /api/ukey?ukey=${ukey}&uid=${uid}

reponse :
{ ukey:ukey,
  uid:uid,
  msg:msg
  srvmsg : {
            ukey : ukey,
            msg : msg,
            err : err
           }
}

*/  

const apiRestoreSession = (ukey) => {
  return buildData(ukey, Reply("Welcome Back "+ukey, null))
  .catch(err => Reply("Session Restoration failed", err.toString()))
}

const apiNewSession =() => {
  return findFreeUKey(0).then(key => {
    if (key == "ERROR") {
        return Reply("Connection Failed","SERVER FULL!")
    } else {
        return initUKey(key).then(resp => {
          let reply = Reply("Welcome "+resp.ukey)
          reply.ukey= resp.ukey
          reply.uid= resp.uid
          return reply
        }
    }
})
}




export default defineEventHandler((event) => {

    const query = useQuery(event);
    console.log("API UKEY REQUEST", query.ukey, query.uid);
    return checkParamsAndValidUKey(query.ukey, query.uid).then( (valid) => {
        console.log("API UKEY VALID : ", valid);
        if(valid){
            return apiRestoreSession(query.ukey)
        }else{
            return apiNewSession()
        }
      }).catch((err) =>{return {ukey:"",uid:"",msg:"SERVER ERROR !!",srvmsg: srvMsg(query.ukey, "ID REQUEST FAILED",err.toString())}; })
    });
