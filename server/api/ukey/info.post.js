import { checkUKey, setInfoUKey } from './ukey';

const apiSetInfoUKey = (ukey, uid, info) => {
    return checkUKey(ukey, uid).then(data => {
        if (data.uid != null) {
            return setInfoUKey(ukey, info)
                .then((resp) => {
                    return resp
                })
                .catch(err => { return { ukey: ukey, info: info, set: "FAILED", msg: "SERVER ERROR" } });
        } else {
            return { ukey: ukey, info: info, set: "FAILED", msg: "BAD REQUEST" }
        }
    })

}


export default defineEventHandler((event) => {

    return useBody(event).then((data) => {
        console.log("RESULT :", data);
        data.info = data.info || ""
        return apiSetInfoUKey(data.ukey, data.uid, data.info)
    })

})