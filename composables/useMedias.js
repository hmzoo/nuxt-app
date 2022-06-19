


export const useSelfStream = () => {
    return useState('selfstream', () => null)
}


export const useBrowserConf=() => {
    return useState('browserconf', () => {
        return{
        micro_status : false,
        camera_status : true,
        stream_status : false,
        stream_id : "",
        stream_info : ""
        }

    })
}

export const setSelfStreamTracks=()=>{
    if(selfStreamIsOn()){
        useSelfStream().value.getAudioTracks()[0].enabled = bConfMicIsOn()
        useSelfStream().value.getVideoTracks()[0].enabled = bConfCamIsOn()
    }
}

export const getSelfStream= ()=>{
    return useSelfStream().value
}
export const selfStreamIsOn= ()=>{
    return useSelfStream().value != null
}

export const bConfInfoGet=()=>{
    return useBrowserConf().value.stream_info
}

export const bConfInfo=(text)=>{
    useBrowserConf().value.stream_info=text
}

export const bConfCamSwitch =()=>{
    useBrowserConf().value.camera_status = !bConfCamIsOn()
    setSelfStreamTracks()
}
export const bConfCamIsOn =()=>{
    return useBrowserConf().value.camera_status 
}
export const bConfMicSwitch =()=>{
    useBrowserConf().value.micro_status = !bConfMicIsOn()
    setSelfStreamTracks()
}
export const bConfMicIsOn =()=>{
    return useBrowserConf().value.micro_status 
}
export const bConfCanStream =()=>{
    return useBrowserConf().value.micro_status || useBrowserConf().value.camera_status
}
export const bConfStreamStart =(stream)=>{
    useSelfStream().value=stream
    setSelfStreamTracks()
    useBrowserConf().value.stream_status =stream.active
    useBrowserConf().value.stream_id = stream.id
    useBrowserConf().value.stream_info = "START STREAM"
}
export const bConfStreamStop=(text)=>{
    if (useSelfStream().value!= null) {
        console.log("remove stream")
        useSelfStream().value.getTracks().forEach((track) => track.stop());
        useSelfStream().value=null
      }
    
    useBrowserConf().value={
        micro_status : false,
        camera_status : false,
        stream_status : false,
        stream_id : "",
        stream_info : text
        }
}
// Devices


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

export const getConstrains = ()=>{
    let constrains={video:false,audio:false}
   if(getVideoDeviceId()!=null){constrains.video={deviceId:getVideoDeviceId()}}
   if(getAudioDeviceId()!=null){constrains.audio={deviceId:getAudioDeviceId()}}
   return constrains
}

export const buildDevices=(devices)=>{

    let cpt_mic = 1;
    let cpt_cam = 1;
    let ids = [];
    let uad =[];
    let uvd =[]
    for (const deviceInfo of devices) {
      if (
        deviceInfo.kind == "audioinput" &&
        ids.indexOf(deviceInfo.deviceId) == -1
      ) {
        uad.push({
          id: deviceInfo.deviceId,
          label: `Mic ${cpt_mic} (${deviceInfo.label})`,
          selected: cpt_mic == 1,
        });
        cpt_mic = cpt_mic + 1;
        ids.push(deviceInfo.deviceId);
      }
      if (
        deviceInfo.kind == "videoinput" &&
        ids.indexOf(deviceInfo.deviceId) == -1
      ) {
        uvd.push({
          id: deviceInfo.deviceId,
          label: `Cam ${cpt_cam} (${deviceInfo.label})`,
          selected: cpt_cam == 1,
        });
        cpt_cam = cpt_cam + 1;
        ids.push(deviceInfo.deviceId);
      }
    }
    useAudioDevices().value = uad;
    useVideoDevices().value = uvd;

}