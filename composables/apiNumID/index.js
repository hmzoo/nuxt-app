import { v4 as uuidv4 } from 'uuid';



   export const getLocalStorageNumID = () => {

    if (localStorage!=undefined && localStorage.getItem('NUM-ID') != null) {
        return JSON.parse(localStorage.getItem('NUM-ID'))
    }else{
        return  {ukey:"000000",uid:"xxxxxxx"}
    }

   }

   export const getApiNumID = () => {


   }