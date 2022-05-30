import {  isFreeUKey, checkParamsAndValidUKey, buildData, addFollow, delFollow ,setInfo} from './ukey';

/*****************************************************************************************

API POST Ajout suppression d'item dans les list


request = {
      ukey:ukey,
      uid:uid,
      lookat:lookat
      cmd:cmd
}


answer = {
      follows :[],
      followers :[],
      srvmsg : {
            msg : msg,
            err : err
      }
}

*******************************************************************************************/


const switchCmd = (req) => {
      console.log("SWITCH", req)
      if (req.cmd == "ADD" && req.lookat != null) {
            return apiAddFollow(req.ukey, req.lookat);
      }
      if (req.cmd == "DEL" && req.lookat != null) {
            return apiDelFollow(req.ukey, req.lookat);
      }
      if (req.cmd == "GET") {
            return buildData(req.ukey, initReply("LIST LOADED", null))
      }
      if (req.cmd == "SETINFO" && req.info !=null) {
            return apiSetInfo(req.ukey,req.info)
      }
      return initReply("LIST FAILED !!", "BAD REQUEST");

}



// ajout d'un item si non present
const apiAddFollow = (ukey, lookat) => {

      return isFreeUKey(lookat).then((free) => {
            if (free) {
                  return buildData(ukey, initReply("NOBODY AT " + lookat, null))
            } else {
                  return addFollow(ukey, lookat).then((done) => {
                        if (done) {
                              return buildData(ukey, initReply(lookat + " ADDED", null))
                        } else {
                              return initReply(lookat + " ADD FAILED", "SERVER ERROR");
                        }
                  });
            }
      }).catch(err => initReply("ADDLIST FAILED !", err.toString()))

}

// supression d'un item
const apiDelFollow= (ukey, lookat) => {
      return delFollow(ukey, lookat).then((done) => {
            if (done) {
                  return buildData(ukey, initReply(lookat + " REMOVED", null))
            } else {
                  return initReply(lookat + " DELETE FAILED", "SERVER ERROR")
            }
      })
}

// Mise à jour des informations
const apiSetInfo = (ukey, info) => {
      return setInfo(ukey, info)
        .then((resp) => {
           return buildData(ukey, initReply("INFO UPDATED", null))
      }).catch(err => initReply("SET INFO FAILED !", err.toString()))
      


}



const initReply=(msg, err)=>{
      const reply = { info:"",follows: [], followers: [], srvmsg: { msg: msg } }
      if (err != null) { reply.srvmsg.err = err }
      return reply
}


export default defineEventHandler((event) => {
      return useBody(event).then((bodyreq) => {
            console.log(bodyreq)
            return checkParamsAndValidUKey(bodyreq.ukey, bodyreq.uid).then((valid) => {
                  if (valid && bodyreq.cmd != null) {
                        return switchCmd(bodyreq);
                  }else {
                        return initReply("CMDLIST FAILED !", "BAD REQUEST");
                  }
            });
      }).catch((err) => initReply("LIST REQUEST FAILED", err.toString()))
})