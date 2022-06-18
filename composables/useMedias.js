


export const useSelfStream = () => {
    return useState('selfStream', () => null)
}

export const useAudioDevices = () => {return useState('audiodevices', () => [])}
export const useVideoDevices = () => {return useState('videodevices', () => [])}

export const selectAudioDevice = (id)=>{
    let uad =useAudioDevices().value
    let nuad =[]
    for (let i=0;i<uad.length;i=i+1){
        nuad.push(uad[i])
        nuad[i].selected=(id == uad[i].id)
    }
    useAudioDevices().value =nuad
}

export const selectVideoDevice = (id)=>{
    let uad =useVideoDevices().value
    let nuad =[]
    for (let i=0;i<uad.length;i=i+1){
        nuad.push(uad[i])
        nuad[i].selected=(id == uad[i].id)
    }
    useVideoDevices().value =nuad
}

export const getVideoDeviceId = ()=>{
    let uad =useVideoDevices().value
    for (let i=0;i<uad.length;i=i+1){
        if(uad[i].selected){return uad[i].id}
    }
    return null
}

export const getAudioDeviceId = ()=>{
    let uad =useAudioDevices().value
    for (let i=0;i<uad.length;i=i+1){
        if(uad[i].selected){return uad[i].id}
    }
    return null
}