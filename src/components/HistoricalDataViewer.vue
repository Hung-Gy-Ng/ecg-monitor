<template>
  <div class="panel card">
    <div class="header-row">
      <h2>Historical Data Viewer</h2>
      <button @click="exportToCSV" class="export-btn" v-if="history.length > 0">
        Export to CSV
      </button>
    </div>
    
    <div class="table-container">
      <table v-if="history.length > 0">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Patient ID</th>
            <th>BPM</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in history" :key="index">
            <td>{{ new Date(record.timestamp).toLocaleString() }}</td>
            <td>{{ record.patientId || 'N/A' }}</td>
            <td><strong>{{ record.bpm }}</strong></td>
            <td class="status-synced">✓ Synced to Firestore</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty-state">No historical data recorded yet.</p>
    </div>
  </div>
</template>

<script setup>
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const props = defineProps({
  history: {
    type: Array,
    required: true
  }
});

const exportToCSV = async () => {
  try {
    // 1. Format data as CSV string
    let csvContent = "Date,PatientID,BPM\n";
    props.history.forEach(record => {
      csvContent += `${record.timestamp},${record.patientId},${record.bpm}\n`;
    });

    // 2. Save to Native Device Storage using Capacitor
    const result = await Filesystem.writeFile({
      path: `ecg_export_${Date.now()}.csv`,
      data: csvContent,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });

    alert(`Success! File saved to Documents: ${result.uri}`);
  } catch (e) {
    console.error("Error exporting file:", e);
    alert("Could not export file. (Are you running on a native device?)");
  }
};
</script>

<style scoped>
.card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.header-row { display: flex; justify-content: space-between; align-items: center; }
.export-btn { background: #2ecc71; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;}
table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
th { background-color: #f8f9fa; }
.status-synced { color: #27ae60; font-size: 0.9em; font-weight: bold; }
.empty-state { color: #7f8c8d; font-style: italic; }
</style>