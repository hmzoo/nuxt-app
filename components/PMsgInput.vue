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
  <i-form @submit="onSubmit" size="lg">
    <i-form-group inline>
      <i-form-label>CALL</i-form-label>
      <i-input
        name="num"
        v-model="number"
        placeholder="000000"
        class="_font-weight:bold _font-size:xl _font-family:monospace"
      />
      <i-button
        type="submit"
        :color="buttonColor(number)"
        class="_margin-left:1"
        :disabled="!validNum(number)"
      >
        Submit
      </i-button>
    </i-form-group>
  </i-form>
</template>