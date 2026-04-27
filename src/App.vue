<template>
  <div class="app-container">
    <header class="app-header">
      <h1>ECG Monitoring System</h1>
      <button v-if="user" @click="handleLogout" class="logout-btn">Logout ({{ user.email }})</button>
    </header>

    <AuthPanel v-if="!user" />

    <div v-else class="dashboard">
      <div class="column">
        <PatientInfoPanel @update-patient="handlePatientUpdate" />
        <HistoricalDataViewer :history="recordsHistory" />
      </div>

      <div class="column">
        <LiveEcgDisplay @upload-record="handleNewRecord" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

import AuthPanel from './components/AuthPanel.vue';
import PatientInfoPanel from './components/PatientInfoPanel.vue';
import LiveEcgDisplay from './components/LiveEcgDisplay.vue';
import HistoricalDataViewer from './components/HistoricalDataViewer.vue';

const user = ref(null);
const currentPatient = ref({});
const recordsHistory = ref([]);

// 1. Authentication Listener
onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    if (currentUser) {
      setupRealtimeListener();
    }
  });
});

const handleLogout = async () => {
  await signOut(auth);
  recordsHistory.value = []; // Clear data on logout
};

const handlePatientUpdate = (patientData) => {
  currentPatient.value = patientData;
};

// 2. Write to Firestore
const handleNewRecord = async (bpmValue) => {
  if (!user.value) return;
  
  const newRecord = {
    patientId: currentPatient.value.id || 'Unknown',
    patientName: currentPatient.value.name || 'Unknown',
    bpm: bpmValue,
    timestamp: new Date().toISOString(),
    uploadedBy: user.value.email
  };

  try {
    // Adds a document to the "ecg_records" collection in Firestore
    await addDoc(collection(db, "ecg_records"), newRecord);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// 3. Read from Firestore (Real-time listener)
const setupRealtimeListener = () => {
  const q = query(collection(db, "ecg_records"), orderBy("timestamp", "desc"));
  
  // onSnapshot fires immediately, and then again every time data changes in the database
  onSnapshot(q, (snapshot) => {
    const fetchedRecords = [];
    snapshot.forEach((doc) => {
      fetchedRecords.push({ id: doc.id, ...doc.data() });
    });
    recordsHistory.value = fetchedRecords;
  });
};
</script>

<style>
/* Existing styles */
body { margin: 0; background-color: #f0f2f5; font-family: Arial, sans-serif; }
.app-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.app-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
.logout-btn { background: #e74c3c; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
.dashboard { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 800px) { .dashboard { grid-template-columns: 1fr; } }
</style>