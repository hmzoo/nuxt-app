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

// SETS UTIL
const set_info = (ukey) => ukey + "-info"
const set_follows = (ukey) => ukey + "-follows"
const set_followers = (ukey) => ukey + "-followers"

//UKEY

const findFreeUKey = (n) => {
    if (n > 5) { return "ERROR"; }
    n = n + 1;
    let k = ranUKey();

    return isFreeUKey(k).then(isfree => { if (isfree) { return k; } else { return findFreeUKey(n); } })
}

export const isFreeUKey = (ukey) => {
    const redis = new Redis();
    return redis.hget(ukey,'date').then(rdate => {
        redis.quit();
        return !(rdate != null && Date.now() - rdate < delay);
    })
}

const delUKey = (ukey) => {
    const redis = new Redis();
    return redis.del(ukey)
        .then((r) => redis.del(set_info(ukey)))
        .then((r) => redis.del(set_follows(ukey)))
        .then((r) => redis.del(set_followers(ukey)))
        .then((r) => { redis.quit(); return true })
        .catch((err) => {
            redis.quit();
            return false;
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

    return delUKey(ukey)
        .then(r => redis.hset(ukey, initdata))
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
            throw new Error('Server Full !')
        } else {
            return initUKey(key)
        }
    }).catch(err => { return {} });
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

export const checkParamsAndValidUKey = (ukey, uid) => {
    return new Promise((resolve) => {
        if (ukey == null || uid == null) {
            throw new Error('BAD REQUEST')
        } else {
            resolve(validUKey(ukey, uid))
        }
    });
}


export const validUKey = (ukey, uid) => {
    console.log("VALIDUKEY : ", ukey, uid);
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
    }).catch(err => { redis.quit(); return false });

}

// UKEY index.get.js

// point d'entrée vérification etat clef
// si la clef est presente on renvoie la clef
// sinon une nouvelle clef est renvoyée


//Info 



export const setInfo = (ukey, info) => {
    const redis = new Redis();
    return redis.set(set_info(ukey), info)
        .then((resp) => {
            redis.quit();
            if (resp == "OK") { return { info: info, set: "SUCCESS" } } else { return { info: info, set: "FAILED" } }
        }).catch((err) => {
            redis.quit();
            console.log("setInfo ERR", err.toString())
            return { info: info, set: "FAILED" }
        })

}

export const getInfo = (lookat) => {
    const redis = new Redis();
    return redis.get(set_info(lookat))
        .then((resp) => {
            redis.quit();
            return resp
        }).catch((err) => {
            redis.quit();
            console.log("getInfo ERR", err.toString())
            return ""
        });

}

// Follow List




export const getFollows = (ukey) => {
    const redis = new Redis();
    return redis.smembers(set_follows(ukey)).then(resp => {
        console.log("GETF",resp)
        redis.quit();
        return resp
    }).catch((err) => {
        redis.quit();
        console.log("getFollows ERR:",err.toString())
        return []
    });
}


export const addFollow = (ukey, lookat) => {
    const redis = new Redis();
    return redis.sadd(set_follows(ukey), lookat)
        .then(redis.sadd(set_followers(lookat), ukey))
        .then((resp) => {
            redis.quit();
            return true
        }).catch((err) => {
            redis.quit();
            console.log("addFollow ERR:",err.toString())
            return false
        });

}

export const delFollow = (ukey, lookat) => {
    const redis = new Redis();
    return redis.srem(set_follows(ukey), lookat)
        .then(redis.srem(set_followers(lookat), ukey))
        .then((resp) => {
            redis.quit();
            return true
        }).catch((err) => {
            redis.quit();
            console.log("delFollow ERR:",err.toString())
            return false
        });
}

export const getFollowers = (ukey) => {
    const redis = new Redis();
    return redis.smembers(set_followers(ukey)).then(resp => {
        redis.quit();
        console.log("get resp",resp)
        return resp
    }).catch((err) => {
        redis.quit();
        console.log("getFollowers ERR:",err.toString())
        return [];
    });
}

export const buildFollows = (ukey) => {
    const redis = new Redis();
    
    return getFollows(ukey)
        .then(async (resp) => {
            let data = [];
            const status = await Promise.all(resp.map((itemukey) => {
                return redis.get(set_info(itemukey)).then(iteminfo => {
                    iteminfo=iteminfo || ""
                    data.push({ ukey: itemukey, info: iteminfo })
                    return "OK"
                })
            }))
            redis.quit();
            return data;
        }).catch((err) => {
            redis.quit();
            console.log("buildListUKey ERR:",err.toString())
            return [];
        });

}

export const buildData = (ukey, req) => {
        req.ukey = ukey;
        return buildFollows(ukey)
        .then(respblk => { req.follows = respblk; return req })
        .then(result => getFollowers(ukey))
        .then(respgf => { req.followers = respgf; return req })
        .then(result => getInfo (ukey))
        .then(respgi => { req.info = respgi ; return req })
        .catch((err) => {
             console.log("buildData ERR:",err.toString())
             return req
            })
}


