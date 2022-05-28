import { srvMsg, isFreeUKey,validUKey, getListUKey, addListUKey, delListUKey, buildListUkey } from './ukey';

/*****************************************************************************************

API POST Ajout suppression d'item dans les list


request = {
      ukey:ukey,
      uid:uid,
      lookat:lookat
}


answer = {
      data :[],
      srvmsg : {
            ukey : ukey,
            msg : msg,
            err : err
      }
}

*******************************************************************************************/


const switchCmd = (req) => {
      console.log("SWITCH",req)
      if (req.cmd == "ADD" && req.lookat != null) {
            console.log("SWITCH ADD")
            return apiAddListUkey(req.ukey, req.lookat);
      }
      if (req.cmd == "DEL" && req.lookat != null) {
            return apiDelListUkey(req.ukey, req.lookat);
      }
      return { data: [], srvmsg: srvMsg(eq.ukey, "CMDLIST FAILED !!", "BAD REQUEST") };

}

//ajout de la liste complet à la requete
const fillData = (ukey, req) => {
      return buildListUkey(ukey)
            .then((resp) => {
                  console.log("getlistukey",resp)
                  req.data = resp;
                  return req
            })
            .catch(err => { return { data: [], srvmsg: srvMsg(ukey, "GETLIST FAILED !", err.toString()) } })

}

// ajout d'un item si non present
const apiAddListUkey = (ukey, lookat) => {

      return isFreeUKey(lookat).then((free) => {
            if (free) {
                  return { data: [], srvmsg: srvMsg(ukey, "NOBODY AT " + lookat, null) }
            } else {
                  return addListUKey(ukey, lookat).then((done) => {
                        if (done) {
                              return { data: [], srvmsg: srvMsg(ukey, lookat + " ADDED", null) }
                        } else {
                              return { data: [], srvmsg: srvMsg(ukey, lookat + " ADD FAILED", "SERVER ERROR") }
                        }
                  });
            }
      }).catch(err => { return { data: [], srvmsg: srvMsg(ukey, "ADDLIST FAILED !", err.toString()) } })

}

// supression d'un item
const apiDelListUkey = (ukey, lookat) => {
      return delListUKey(ukey, lookat).then((done) => {
            if (done) {
                  return { data: [], srvmsg: srvMsg(ukey, lookat + " DELETED", null) }
            } else {
                  return { data: [], srvmsg: srvMsg(ukey, lookat + " DELETE FAILED", "SERVER ERROR") }
            }
      })
}


export default defineEventHandler((event) => {

      return useBody(event).then((bodyreq) => {
            return validUKey(bodyreq.ukey, bodyreq.uid).then((valid) => {
                  console.log("verif ",valid,bodyreq)
                  if (valid && bodyreq.cmd != null) {
                        return switchCmd(bodyreq)
                               .then(resp => {return fillData(bodyreq.ukey, resp)})
                  }
                  else {
                        return { data: [], srvmsg: srvMsg(bodyreq.ukey, "CMDLIST FAILED !", "BAD REQUEST") };
                  }
            })
                  ;
      })




})