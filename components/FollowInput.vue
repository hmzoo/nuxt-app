<script setup>
const emit = defineEmits(["onSubmit"]);
const number = ref("");

const validNum = (n) => {
  return /^\d{1}$/.test(n);
};
const buttonColor = (n) => {
  return validNum(n) ? "primary" : "light";
};

const onSubmit = () => {
  emit("onSubmit", number.value);
  number.value = "";
};
</script>


<template>

  <i-container>
    <i-row>
    <i-column xs="3"><span class="bigintitule" >JOIN:</span></i-column>
    <i-column xs="9">
<i-form @submit="onSubmit" >
     <i-form-group inline>
      <i-input
      size="sm"
        name="num"
        v-model="number"
        placeholder="000000"
        class="_font-weight:bold _font-size:xl _font-family:monospace"
      />
      <i-button
        size="sm"
        type="submit"
        :color="buttonColor(number)"
        class="_margin-left:1"
        :disabled="!validNum(number)"
      >
        CALL 
      </i-button>
    </i-form-group>
    </i-form>
    </i-column>

 
      </i-row>
  </i-container>
 
</template>