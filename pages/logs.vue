<script setup>
const logs = useLogs()

</script>

<template>
<i-container>
  <i-row>
    <i-column xs="12">
      <i-table condensed striped >
    <thead>
        <tr>
 
            <th>Date</th>
            <th>Cat</th>
            <th>Log</th>
        </tr>
    </thead>
    <tbody>
        <tr condensed v-for="(item, index) in logs" :key="'log_' + index">
           
            <td>{{ item.date }}</td>
            <td>{{ item.cat}}</td>
            <td>{{ item.text}}</td>
        </tr>
      
    </tbody>
</i-table>


    </i-column>
  </i-row>
</i-container>
</template>