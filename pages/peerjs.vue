<script setup>
const { $peer } = useNuxtApp();

const cxninput = ref("");

/*
onMounted(() => {
    cxninput.value = "OKETO"
  peer = $getPeer();

  peer.on('open', function(id) {
	console.log('My peer ID is: ' + id);
  });

  var conn = peer.connect("another-peers-id");
  // on open will be launch when you successfully connect to PeerServer
  conn.on("open", function () {
    // here you have conn.id
    conn.send("hi!");
  });

  peer.on("connection", function (conn) {
    conn.on("data", function (data) {
      // Will print 'hi!'
      console.log(data);
    });
  });




});
*/
const onSubmit = () => {
  console.log("ok submit", cxninput.value);
  if (typeof $peer !== "undefined") {
    console.log("PEER READY");
    var conn = $peer.connect(cxninput.value);
    // on open will be launch when you successfully connect to PeerServer
    conn.on("open", function () {
      console.log("conn.id",conn.id)
      conn.send("hi!");
    });
  }
};
</script>

<template>
  <i-container>
    <i-row> <i-column>peerjs </i-column> </i-row>
    <i-row>
      <i-column>
        <i-form @submit="onSubmit" size="md">
          <i-form-group inline>
            <i-form-label>CXN</i-form-label>
            <i-input
              name="cxninput"
              v-model="cxninput"
              placeholder="Type info ..."
            />
            <i-button type="submit" color="primary" class="_margin-left:1">
              Connect
            </i-button>
          </i-form-group>
        </i-form></i-column
      >
    </i-row>
  </i-container>
</template>