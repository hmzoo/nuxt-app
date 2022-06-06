import { checkParamsAndValidUKey,newUKey,buildData,Reply} from './ukey';

/* API GET : recupéré le ukey
requete :
  /api/ukey?ukey=${ukey}&uid=${uid}

reponse :
{ ukey:ukey,
  uid:uid,
  msg:msg
  srvmsg : {
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
        return newUKey().then(resp => {
          let reply = Reply("Welcome "+resp.ukey)
          reply.ukey= resp.ukey
          reply.uid= resp.uid
          return reply
    }).catch(err => Reply("New session failed", err.toString()))

    
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
      }).catch((err) => Reply("Server connexion error", err.toString()))
    });
