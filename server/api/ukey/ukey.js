import Redis from "ioredis"
import { v4 as uuidv4 } from 'uuid';





const delay = 600000;
const srvprefix = ">";

const ranUKey = () => { return "" + (Math.floor(Math.random() * 10)); }

//UTIL
export const srvMsg = (ukey, msg, err) => {
    const answer = {
        ukey: ukey,
        msg: msg,
    }
    if (err != null) { answer.err = err; }
    return answer;
}

//UKEY

const findFreeUKey = (n) => {
    if (n > 5) { return "ERROR"; }
    n = n + 1;
    let k = ranUKey();

    return isFreeUKey(k).then(isfree => { if (isfree) { return k; } else { return findFreeUKey(n); } })
}

export const isFreeUKey = (ukey) => {

    const redis = new Redis();
    return redis.hgetall(ukey).then(data => {
        redis.quit();
        return !(data.date != null && Date.now() - data.date < delay);
    })
}


// Initialisation de la clef
const initUKey = (ukey) => {

    const redis = new Redis();

    const initdata = {
        ukey: ukey,
        uid: uuidv4(),
        date: Date.now(),
        cptsecu: 0,
        msg: srvprefix + " Welcome " + ukey + " !"
    }

    return redis.hset(ukey, initdata)
        .then(r => { redis.quit(); return initdata });
}

export const getUKey = (ukey, uid) => {
    const redis = new Redis();
    return redis.hgetall(ukey).then(data => {
        redis.quit();
        if (data.uid != null && data.uid == uid && Date.now() - data.date < delay) {
            return data;
        } else {
            return {}
        }
    });
}

const setUKey = (ukey, data) => {
    const redis = new Redis();
    return redis.hset(ukey, data)
        .then(r => { redis.quit(); return data });
}

// une clef disponible est recherchée
// un message est renvoyé si plus de clef disponible
// sinon la clef est reinitialisé

export const newUKey = () => {
    return findFreeUKey(0).then(key => {
        if (key == "ERROR") {
            console.log("SERVER FULL");
            return { err: "SERVER_FULL", msg: srvprefix + " Server full ! try later ..." };
        } else {
            return initUKey(key)
        }
    });
}

export const checkUKey = (ukey, uid) => {
    console.log("CHECK", ukey, uid)
    return getUKey(ukey, uid).then(data => {
        if (data.uid != null) {
            data.date = Date.now();
            data.cptsecu = data.cptsacu + 1;
            return setUKey(ukey, data)
        } else {
            return {}
        }
    });

}

export const validUKey = (ukey, uid) => {
    if (ukey == null || uid == null) {
        console.log("validukey", ukey, uid)
        return false;
    }
    const redis = new Redis();
    return redis.hgetall(ukey).then(data => {
        if (data.uid != null && data.uid == uid && Date.now() - data.date < delay) {
            data.date = Date.now();
            data.cptsecu = data.cptsecu + 1;
            return redis.hset(ukey, data).then(r => { redis.quit(); return true });
        } else {
            redis.quit();
            return false
        }
    });

}

// UKEY index.get.js

// point d'entrée vérification etat clef
// si la clef est presente on renvoie la clef
// sinon une nouvelle clef est renvoyée


//Info 

export const setInfoUKey = (ukey, info) => {
    const redis = new Redis();
    return redis.set(ukey + "-info", info)
        .then((resp) => {
            redis.quit();
            if (resp == "OK") { return { info: info, set: "SUCCESS" } } else { return { info: info, set: "FAILED" } }
        }).catch((err) => {
            redis.quit();
            return { info: info, set: "FAILED" }
        })

}

export const getInfoUkey = (lookat) => {
    const redis = new Redis();
    return redis.get(lookat + "-info")
        .then((resp) => {
            redis.quit();
            console.log("getInfoUkey", lookat, resp, propcess)
            return resp
        }).catch((err) => {
            redis.quit();
            console.log("getInfoUkey ERR", lookat, resp, propcess)
            return ""
        });

}

// List


export const getListUKey = (ukey) => {
    const lname = ukey + "-list"
    const redis = new Redis();
    return redis.lrange(lname, 0, -1).then(resp => {
        redis.quit();
        console.log("getlistukey", ukey, resp)
        return resp
    }).catch((err) => {
        redis.quit();
        console.log("getlistukey err", err)
        return []
    });
}


export const addListUKey = (ukey, lookat) => {
    const lname = ukey + "-list"
    const redis = new Redis();
    return redis.lrem(lname, 0, lookat).then(resp => {
        console.log("addlist rm", ukey, resp)
        return redis.lpush(lname, lookat)
            .then((resp) => {
                redis.quit();
                console.log("addlist add", ukey, resp)
                return true
            }).catch((err) => {
                redis.quit();
                return false
            });
    }).catch((err) => {
        redis.quit();
        return false
    });
}

export const delListUKey = (ukey, lookat) => {
    const lname = ukey + "-list"
    const redis = new Redis();
    return redis.lrem(lname, 0, lookat)
        .then((resp) => {
            redis.quit();
            return true
        }).catch((err) => {
            redis.quit();
            return false
        });
}

export const  buildListUkey = async (ukey) => {
    const redis = new Redis();
    return getListUKey(ukey)
        .then((resp) => {
            console.log("build",resp)
            let data = []
            for (let i = 0; i < resp.length;i = i + 1 ) {
                let info = await redis.get(lookat + "-info")
                console.log("i",i,info)
                data.push({ ukey: resp[i], info: info })
            }
            redis.quit();
            return data
        })

}