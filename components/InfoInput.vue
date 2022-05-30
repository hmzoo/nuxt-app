
<script setup>
const props = defineProps({
  info: { Type: String }
});
const emit = defineEmits(["onSubmit"]);

const infoinput = ref("");

const onSubmit = () => {
  emit("onSubmit", infoinput.value);
  infoinput.value = "";
};
</script>


<template>
  <i-form @submit="onSubmit" size="md">
    <i-form-group inline>
      <i-form-label>INFO</i-form-label>
      <i-input name="infoinput" v-model="infoinput" placeholder="Type info ..." />
      <i-button type="submit" color="primary" class="_margin-left:1">
        Send
      </i-button>
    </i-form-group>
    <i-form-group>
      <i-form-label>{{ info || "..." }}</i-form-label>
    </i-form-group>
  </i-form>
</template>