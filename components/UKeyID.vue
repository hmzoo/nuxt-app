<script setup>
const ukey = useUKey();
</script>


<template>
  <i-container>
    <i-row>
      <i-column xs="6"><span class="bigintitule" >YOUR NUMBER :</span> </i-column>
      <i-column xs="6">
        <span class="ukeynum _font-family:monospace">{{ ukey.ukey }}</span></i-column
      >
    </i-row>
  </i-container>
</template>

<style scoped lang="scss">
//@import "@inkline/inkline/css/variables";
//@import "@inkline/inkline/css/mixins";
.ukeynum {
  color:steelblue;
  font-size: 32px;
  font-weight: bold;
}



.smallbtn {
  background-color: #72f7b5;
  padding: 2px;
  font-size: 10px;
}
</style>