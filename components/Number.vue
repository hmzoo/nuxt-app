<script setup>
const props = defineProps({
  title: { Type: String },
  infos: { Type: String },
});
const emit =defineEmits(['onDelete'])
const onDelete = (t)=>{ 
  emit('onDelete',t)
  }
</script>


<template>
  <i-card style="width: 200px">
    <i-button size="sm" style="padding: 0px" class="_float:right" @click="onDelete(title)"
      ><i-icon
        name="ink-times"
        class="_color:info"
        size="sm"
        style="margin: 0px"
    /></i-button>
    <h4 class="card-title">{{ title }}</h4>
    <p>{{ infos }}</p>
  </i-card>
</template>