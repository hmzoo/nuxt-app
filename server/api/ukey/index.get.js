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


export default defineEventHandler((event) => {

    const query = useQuery(event);
    console.log("API UKEY REQUEST", query.ukey, query.uid);
    return checkParamsAndValidUKey(query.ukey, query.uid).then( (valid) => {
        console.log("API UKEY VALID : ", valid);
        if(valid){
            return {ukey:query.ukey,uid:query.uid,msg:"> Welcome back " + query.ukey + " !",srvmsg: srvMsg(query.ukey, "USING SAME ID")};
        }else{
            return newUKey().then( data => {
                return {ukey:data.ukey,uid:data.uid,msg:"> Welcome " + data.ukey + " !",srvmsg: srvMsg(data.ukey, "USING NEW ID")};
            });
        }
      }).catch((err) =>{return {ukey:"",uid:"",msg:"SERVER ERROR !!",srvmsg: srvMsg(query.ukey, "ID REQUEST FAILED",err.toString())}; })
    });
