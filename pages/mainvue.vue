<script setup>
const followslist = useFollowsUKey();
const infoukey = useInfoUKey ();

const setInfo = (t) => {
  setInfoUKey(t);
};
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
      <i-column xs="8">
        <div class="_display:flex _flex-direction:row " style="border:solid;border-width:2px;border-color: blueviolet;height:300px;margin:10px">
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
       <i-column xs="4"><FollowersList/></i-column>
    </i-row>
    <i-row center>
      <i-column xs="6" style="height: 100px">
        <FollowInput @onSubmit="addukey" />
      </i-column>
    </i-row>

    <i-row center>
      <i-column xs="6">
       {{ followslist}}
        <InfoInput @onSubmit="setInfo" :info="infoukey"  />
      </i-column>
    </i-row>
  </i-container>
</template>