<template>
  <div class="panel card">
    <h2>Patient Information</h2>
    <div class="form-group">
      <label>Patient Name:</label>
      <input type="text" v-model="patient.name" placeholder="John Doe" />
    </div>
    <div class="form-group">
      <label>Patient ID:</label>
      <input type="text" v-model="patient.id" placeholder="PT-10293" />
    </div>
    <div class="form-group">
      <label>Age:</label>
      <input type="number" v-model="patient.age" placeholder="45" />
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const emit = defineEmits(['update-patient']);

const patient = reactive({
  name: '',
  id: '',
  age: null
});

watch(patient, (newVal) => {
  emit('update-patient', { ...newVal });
}, { deep: true });
</script>

<style scoped>
.card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
.form-group { margin-bottom: 15px; display: flex; flex-direction: column; }
input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-top: 5px; }
</style>