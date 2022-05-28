import { srvMsg,validUKey,getListUKey } from './ukey';


const apiGetListUkey = (ukey) => {

      return getListUKey(ukey)
            .then((resp) => {
             return { data: resp, srvmsg:srvMsg(ukey,"GETLIST SUCCESS")}
            })
            .catch(err => { return { data: [], srvmsg:srvMsg(ukey,"GETLIST FAILED !",err) } })

            
      
}

export default defineEventHandler((event) => {
    
    const query = useQuery(event);
    return validUKey(query.ukey,query.uid).then( (valid) => {
          if(valid){
            return apiGetListUkey(query.ukey)
          }
          else{
            return { data: [], srvmsg:srvMsg(query.ukey,"GETLIST FAILED !","BAD REQUEST") };
          }
    } );
  
    return apiGetListUkey(query.ukey,query.uid)
    
})