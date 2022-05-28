
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
//INFO
export const useUKeyInfo = () => {
    return useState('ukeyInfo', () => "...")
}
export const setUKeyInfo = (info) => {
    const ukeyinfo = useUKeyInfo()
    const ukey = useUKey()
    //ukeyinfo.value=info
    const req = { ukey: ukey.value.ukey, uid: ukey.value.uid, info: info }

    return $fetch("/api/ukey/info", { method: 'POST', body: req })
        .then(resp => {
            if (resp.set == "SUCCESS") {
                ukeyinfo.value = resp.info;
            }
            return resp
        }).catch(err => console.log("ERR", err, process))
}

export const getUKeyInfo = (lookat) => {
    const ukeyinfo = useUKeyInfo()
    return $fetch(`/api/ukey/info?ukey=${ukey.value.ukey}&uid=${ukey.value.uid}&lookat=${lookat}&date=${Date.now()}`)
    .then(resp => {
        console.log("LISTINFO", resp)
    })


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

