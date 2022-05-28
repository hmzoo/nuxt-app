import { checkUKey, newUKey } from './ukey';



const apiUKey = (ukey, uid) => {
    console.log("CHECKNEW", ukey, uid)
    return checkUKey(ukey, uid).then(data => {
        if (data.uid != null) {
            data.msg = "> Welcome back " + ukey + " !";
            return data;
        } else {
            //console.log("NK",newUKey);
            return newUKey();
        }
    });

}


export default defineEventHandler((event) => {

    const query = useQuery(event);
    console.log("API REQUEST", query.ukey, query.uid);
    return apiUKey(query.ukey, query.uid).then(data => {
        return data;
    });
})