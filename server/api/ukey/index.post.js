import { isFreeUKey, checkParamsAndValidUKey, buildData, addFollow, delFollow, setInfo, delUKey, newUKey, Reply } from './ukey';

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
            return buildData(req.ukey, Reply("", null))
      }
      if (req.cmd == "SETINFO" && req.info != null) {
            return apiSetInfo(req.ukey, req.info)
      }
      if (req.cmd == "DELETEID") {
            return apiDeleteID(req.ukey)
      }
      return Reply("REQUEST FAILED !!", "BAD REQUEST");

}



// ajout d'un item si non present
const apiAddFollow = (ukey, lookat) => {

      return isFreeUKey(lookat).then((free) => {
            if (free) {
                  return buildData(ukey, Reply("NOBODY AT " + lookat, null))
            } else {
                  return addFollow(ukey, lookat).then((done) => {
                        if (done) {
                              return buildData(ukey, Reply(lookat + " ADDED", null))
                        } else {
                              return Reply(lookat + " ADD FAILED", "SERVER ERROR");
                        }
                  });
            }
      }).catch(err => Reply("ADDLIST FAILED !", err.toString()))

}

// supression d'un item
const apiDelFollow = (ukey, lookat) => {
      return delFollow(ukey, lookat).then((done) => {
            if (done) {
                  return buildData(ukey, Reply(lookat + " REMOVED", null))
            } else {
                  return Reply(lookat + " DELETE FAILED", "SERVER ERROR")
            }
      })
}

// Mise à jour des informations
const apiSetInfo = (ukey, info) => {
      return setInfo(ukey, info)
            .then((resp) => {
                  return buildData(ukey, Reply("INFO UPDATED", null))
            }).catch(err => Reply("SET INFO FAILED !", err.toString()))
}

// Renouvellement d ID
const apiDeleteID = (ukey) => {
      return delUKey(ukey)
            .then((done) => {
                  return Reply("ID " + ukey + " DELETED", null)
            }).catch(err => Reply("GET NEW ID FAILED !", err.toString()))

}



export default defineEventHandler((event) => {
      return useBody(event).then((bodyreq) => {
            console.log(bodyreq)
            return checkParamsAndValidUKey(bodyreq.ukey, bodyreq.uid).then((valid) => {
                  if (valid && bodyreq.cmd != null) {
                        return switchCmd(bodyreq);
                  } else {
                        return Reply("CMDLIST FAILED !", "BAD REQUEST");
                  }
            });
      }).catch((err) => Reply("LIST REQUEST FAILED", err.toString()))
})