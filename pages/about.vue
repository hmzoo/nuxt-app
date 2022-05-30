<script setup>

const followslist = useFollowsUKey();
const addukey = (d) => {
  addFollowUkey(d);
};
const delukey = (d) => {
  delFollowUKey(d);
  //delUKeyList(d);
};
</script>



<template>

 <i-container>
    <i-row>
      <i-column xs="12">
        <div class="_display:flex _flex-direction:row _height:50%">
          <FollowCard
            style="margin: 3px"
            v-for="(item, index) in followslist"
            :key="'ukey' + index"
            :ukey="item.ukey"
            :info="item.info"
            @onDelete="delukey"
          />
        </div>
      </i-column>
    </i-row>
    <i-row center>
      <i-column xs="6" style="height: 100px">
        <FollowInput @onSubmit="addukey" />
      </i-column>
    </i-row>

    <i-row center>
      <i-column xs="6">
       
        <InfoInput />
      </i-column>
    </i-row>
  </i-container>

</template>