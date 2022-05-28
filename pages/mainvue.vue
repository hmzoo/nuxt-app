<script setup>
const ukeylist = useListUKey();
const addukey= (d) => {
  addItemListUkey(d);
};
const delukey= (d) => {
  console.log("DEL",d)
  //delUKeyList(d);
};
</script>

<template>
  <i-container>
    <i-row>
      <i-column xs="12"
        ><div class="_display:flex _flex-direction:row">
          <Number style="margin:3px"  v-for="(item, index) in ukeylist"
          :key="'ukey' + index" :title=item.ukey :infos=item.info @onDelete="delukey"/>
        </div>
      </i-column>
    </i-row>
    <i-row center>
      <i-column xs="6" style="height:200px">
        <InputNumber infos="..." @onSubmit="addukey" />
      </i-column>
    </i-row>
      
    <i-row center>
      <i-column xs="6">
        <InputInfo />
      </i-column>
    </i-row>
  </i-container>
</template>