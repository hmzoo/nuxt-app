<script setup>
const { $connectPeer, $dataPeer, $getConn } = useNuxtApp();
const cxninput = ref("");
const msginput = ref("");
const selectedinfo = ref("");

const infoukey = useInfoUKey();
const selectedfollow = useSelectedFollow();
const follows = useFollowsUKey();

const selectFollow = (f) => {
  selectFollowUkey(f.ukey, !f.selected);
  checkConns();
};

const checkConns = () => {
  follows.value.forEach((f) => {
    if ($getConn(f.info) == null) {
      $connectPeer(f.info);
    }
  });
};

const onSubmitMsg = () => {
  checkConns();
  console.log("submitMsg");
  if (typeof $dataPeer !== "undefined") {
    useFollowsUKey().value.forEach((f) => {
      if (f.selected) {
        $dataPeer(f.info, {msg:msginput.value});
      }
    });
  }
};

const onSubmitCxn = () => {
  console.log("ok submit", cxninput.value);
  if (typeof $connectPeer !== "undefined") {
    $connectPeer(cxninput.value);
  }
};
</script>

<template>
  <i-container>

    <i-row>
      <i-column xs="4"><FollowsList @onSelect="selectFollow" /></i-column>
      <i-column xs="4"><PMsgList /></i-column>
      <i-column xs="4"></i-column>
    </i-row>
    <i-row>
      <i-column xs="4"
        ></i-column
      >
<i-column xs="4">
        <i-form @submit="onSubmitMsg" size="md">
          <i-form-group inline>
            <i-form-label>MSG</i-form-label>
            <i-input
              name="msginput"
              v-model="msginput"
              placeholder="Type Msg ..."
            />
            <i-button type="submit" color="primary" class="_margin-left:1">
              Send
            </i-button>
          </i-form-group>
        </i-form>
      </i-column>
            <i-column xs="4">
       </i-column
      >
    </i-row>
  </i-container>
</template>