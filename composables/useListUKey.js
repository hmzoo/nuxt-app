//LIST
export const useListUKey = () => {
    return useState('listukey', () => [])
}

export const addItemListUkey = (lookat) => {
    const ukey = useUKey('ukey')

    const req = { ukey: ukey.value.ukey, uid: ukey.value.uid, lookat: lookat, cmd:"ADD" }

    return $fetch("/api/ukey/list", { method: 'POST', body: req })
        .then(resp => {
            console.log("LIST ADD", resp)
            useListUKey().value=resp.data;
            return resp
        }).catch(err => console.log("ERR", err, process))

    return $fetch(`/api/ukey/list?ukey=${ukey.value.ukey}&uid=${ukey.value.uid}&lookat=${lookat}&date=${Date.now()}`)
        .then(resp => {
            console.log("LIST ADD", resp)
        })

    const item = { ukey: ukey, infos: "OK" }

    if (indexUKeyList(item.ukey) < 0) {
        useUKeyList().value.push(item)
    }
}

export const delItemListUKey = (ukey) => {

    const index = indexListUKey(ukey)
    if (index > -1) {
        useListUKey().value.splice(index, 1)
    }
}

export const indexListUKey = (ukey) => {
    const list = useUKeyList().value
    console.log(list)
    for (var i = 0; i < list.length; i++) {
        if (list[i].ukey == ukey) {
            return i
        }
    }
    return -1
}