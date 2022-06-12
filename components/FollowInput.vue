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
  <i-form @submit="onSubmit" >
    <i-form-group inline>
      <i-form-label>JOIN</i-form-label>
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
</template>