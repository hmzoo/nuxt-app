<script setup>
const props = defineProps({
  showReset: { Type: Boolean, default: false },
});
const ukey = useUKey();
const newid= () => {
  resetUKey();
  //getApiUKey();
  }

</script>


<template>
  <i-container>
    <i-row>
      <i-column xs="4"><small>Your ID :</small>  </i-column>
      <i-column xs="6"> <span class="ukeynum">{{ ukey.ukey }}</span></i-column>
      <i-column xs="2">
       <i-button class="smallbtn" @click="newid" v-if="showReset" >New ID</i-button>
      </i-column>
    </i-row>
    <i-row>
      <i-column xs="10">
        <span class="ukeyinfo">{{ ukey.msg || "" }}</span>
      </i-column>
    </i-row>
  </i-container>
</template>

<style scoped lang="scss">
//@import "@inkline/inkline/css/variables";
//@import "@inkline/inkline/css/mixins";
.ukeynum {
    font-size: 24px;
    font-weight: bold;
    margin-left:10px;
}

.ukeyinfo {
    font-size: 10px;
}

.smallbtn {
  background-color: #72f7b5;
  padding:2px;
  font-size: 10px;
 }
</style>