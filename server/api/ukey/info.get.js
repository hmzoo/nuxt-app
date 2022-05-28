import { checkUKey, getInfoUkey } from './ukey';


const apiGetInfoUkey = (ukey, uid, lookat) => {

      return checkUKey(ukey, uid).then(data => {
            if (data.uid != null) {
                  return getInfoUke(lookat).then((resp) => {
                        return { lookat: lookat, info: resp, get: "SUCCESS" }
                  })
                        .catch(err => { return { lookat: lookat, info: info, set: "FAILED", msg: "SERVER ERROR" } })

            } else {
                  return { lookat: lookat, info: info, set: "FAILED", msg: "BAD REQUEST" };
            }
      })
}




export default defineEventHandler((event) => {

      const query = useQuery(event);
      return apiGetInfoUkey(query.ukey, query.uid, query.lookat)


})