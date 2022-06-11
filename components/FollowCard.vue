<script setup>
const props = defineProps({
  ukey: { Type: String },
  info: { Type: String },
});
const emit =defineEmits(['onDelete','onSelect'])
const onSelect= (t)=>{ 
  emit('onSelect',t)
  }
const onDelete = (t)=>{ 
  emit('onDelete',t)
  }
</script>


<template>
  <i-card style="width: 200px" @click="onSelect(info)">
    <i-button size="sm" style="padding: 0px" class="_float:right" @click="onDelete(ukey)"
      ><i-icon
        name="ink-times"
        class="_color:info"
        size="sm"
        style="margin: 0px"
    /></i-button>
    <h4 class="card-title">{{ ukey }}</h4>
    <p>{{ info }}</p>
  </i-card>
</template>