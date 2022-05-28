
<script setup>

const ukeyinfo = useUKeyInfo()


// const number = useState('number',()=>{return ""})
const info = ref('')



const onSubmit = ()=>{ 
  setUKeyInfo(info.value)
  }


</script>


<template>
    
      <i-form  @submit="onSubmit" size="md" >

        <i-form-group inline >
          <i-form-label>INFO</i-form-label>
          <i-input name="info" v-model="info" placeholder="Type info ..." />       
          <i-button type="submit" color='primary' class="_margin-left:1"  > Send </i-button>
        </i-form-group>
        <i-form-group  >
          <i-form-label>{{ ukeyinfo }}</i-form-label>
        </i-form-group>
      </i-form>
    
 
</template>