<script setup>
const { $peer, $addConn,$getConn } = useNuxtApp();
const cxninput = ref("");
const msginput = ref("");

const infoukey = useInfoUKey();
const selectedfollow = useSelectedFollow();

const onSubmitMsg = () => {
  if (typeof $getConn !== "undefined") {
    const conn=$getConn(selectedfollow.value);
    if(conn!=null){
      conn.send(msginput.value);
    }
  }
};

const onSubmitCxn = () => {
  console.log("ok submit", cxninput.value);

  if (typeof $peer !== "undefined") {
    console.log("PEER READY");
    var conn = $peer.connect(cxninput.value);
    conn.on("open", function () {
      console.log("conn", conn);
       $addConn(conn.peer,conn)
      conn.send("Hello from Sender");
    });
    conn.on("data", function (data) {
      console.log("Conn", conn, "Peer data: ", data);
      addPeerMessage(conn.peer,data)
    });
  }
};
</script>

<template>
  <i-container>
    <i-row>
      <i-column>peerjs {{ infoukey }} to {{ selectedfollow }}</i-column>
    </i-row>
    <i-row>
      <i-column><PMsgList /></i-column>
    </i-row>
    <i-row>
      <i-column xs="6">
        <i-form @submit="onSubmitCxn" size="md">
          <i-form-group inline>
            <i-form-label>CXN</i-form-label>
            <i-input
              name="cxninput"
              v-model="cxninput"
              placeholder="Type id ..."
            />
            <i-button type="submit" color="primary" class="_margin-left:1">
              Connect
            </i-button>
          </i-form-group>
        </i-form></i-column
      >
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
      <i-column xs="6"> </i-column>
    </i-row>
  </i-container>
</template>