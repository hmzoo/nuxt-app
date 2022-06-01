
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




