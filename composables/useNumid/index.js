import { v4 as uuidv4 } from 'uuid';

export const useNumID = () => {
    const numid = useState('numid',() => {return  {ukey:"000000",uid:"xxxxxx" }})
    //const delay = 86400000;
    const delay = 30000;

    onMounted(()=>{
        console.log("mounted",localStorage.getItem('NUMID'))

       const locstor = JSON.parse(localStorage.getItem('NUMID'))
       console.log(locstor,locstor.value,locstor.date,Date.now()-locstor.date)

        if(locstor && locstor.date && locstor.ukey && locstor.uid  && Date.now() - locstor.date < delay ){
            useState('numid').value = locstor
        }else{
           resetNumID()
        }
    })

    return numid
   }

export const resetNumID = () => {
    
    if(localStorage != null ){
         const ran = "" + (100000 + Math.floor(Math.random() * 900000))
         const uid = uuidv4()
         console.log("RESET NUMID -> ",ran)
         localStorage.setItem('NUMID', JSON.stringify({ ukey:ran,uid:uid,date : Date.now()}) )
         useState('numid').value = { ukey:ran,uid:uid,date : Date.now()}
    }

}

export const useNumIDs = () => useState('numids', () => {return  []})

export const addNumIDs = (numid) => {

    if( indexNumIDs(numid.num) < 0){
      useState('numids').value.push(numid)
    }else{
        delNumIDs(numid)
    }
}

export const delNumIDs = (num) => {

    const index = indexNumIDs(num)
    if( index >-1){
        useState('numids').value.splice(index,1)      
    }
}

export const indexNumIDs =(num) =>{
    const numids = useState('numids').value
    for (var i = 0; i < numids.length; i++) {
 
        if(numids[i].num == num){
            return i
        }
    }
    return -1
}