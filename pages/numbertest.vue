<script setup>
const nums =ref([])
const numbers = useState('numbers')
const test = (v) => {
  console.log(v);
};
const newNumber = (d) => {
  nums.value.push(d.value)
  numbers.value.push(d.value)
};
</script>

<template>
  <i-container>
    <i-row center >
      <i-column xs="6">
        <InputNumber infos="hello " @onSubmit="newNumber" />
      </i-column>
    </i-row>
    <i-row>
      <i-column>
       {{ nums }} {{ numbers }}
      </i-column>
    </i-row>
  </i-container>
</template>