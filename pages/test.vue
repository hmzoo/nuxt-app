<script setup>
const counter = useState('counter', () => Math.round(Math.random() * 1000))
const value = useState('statevalue');
</script>

<template>
  <div>
    Counter: {{ counter }}
    <button @click="counter++">
      +
    </button>
    <button @click="counter--">
      -
    </button>


    <div>myvalue= {{ value }}</div>
  </div>
</template>