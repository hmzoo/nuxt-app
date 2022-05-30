
const emptyUKey = {
    ukey: "000000",
    uid: "xxx-xxx-xxx",
    msg: "No ID !"
}


export const useUKey = () => {
    return useState('ukey', () => emptyUKey)
}

export const getLocalUKey = () => {

    if (localStorage != undefined && localStorage.getItem('UKEY') != null) {
        const ukey = useUKey()
        ukey.value = JSON.parse(localStorage.getItem('UKEY'))
    }
}

export const setLocalUKey = () => {

    if (localStorage != undefined) {
        const ukey = useUKey()
        localStorage.setItem('UKEY', JSON.stringify(ukey.value))
    }
}

export const getApiUKey = () => {
    const ukey = useUKey()
    getLocalUKey();
    const date = Date.now()
    return $fetch(`/api/ukey?ukey=${ukey.value.ukey}&uid=${ukey.value.uid}&date=${date}`)
        .then(resp => {
            ukey.value = resp
            setLocalUKey();
            return resp;
        })

}


export const resetUKey = () => {
    const ukey = useUKey()
    ukey.value = emptyUKey
    setLocalUKey();
    getApiUKey();
}


//LIST
export const useUKeyList = () => {
    return useState('ukeylist', () => [])
}

export const addUKeyList = (lookat) => {
    const ukey = useUKey('ukey')

    return $fetch(`/api/ukey/list?ukey=${ukey.value.ukey}&uid=${ukey.value.uid}&lookat=${lookat}&date=${Date.now()}`)
        .then(resp => {
            console.log("LIST", resp)
        })

    const item = { ukey: ukey, infos: "OK" }

    if (indexUKeyList(item.ukey) < 0) {
        useUKeyList().value.push(item)
    }
}

export const delUKeyList = (ukey) => {

    const index = indexUKeyList(ukey)
    if (index > -1) {
        useUKeyList().value.splice(index, 1)
    }
}

export const indexUKeyList = (ukey) => {
    const list = useUKeyList().value
    console.log(list)
    for (var i = 0; i < list.length; i++) {

        if (list[i].ukey == ukey) {
            return i
        }
    }
    return -1
}

