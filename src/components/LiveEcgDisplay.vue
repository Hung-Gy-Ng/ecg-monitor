<template>
  <div class="panel card">
    <div class="header-row">
      <h2>Live ECG Display</h2>
      <button @click="connectBLESensor" class="ble-btn">
        {{ isBleConnected ? 'BLE Connected' : 'Connect Hardware Sensor' }}
      </button>
    </div>
    
    <div class="monitor-wrapper">
      <canvas ref="ecgCanvas" width="600" height="200" class="ecg-canvas"></canvas>
      <div class="bpm-panel">
        <span class="bpm-number">{{ bpm }}</span>
        <span class="bpm-label">BPM</span>
      </div>
    </div>

    <div class="controls">
      <label>Adjust Heart Rate (Manual Override):</label>
      <input type="range" v-model="bpm" min="40" max="180" :disabled="isBleConnected" />
      <button @click="handleUpload" class="save-btn">Record & Upload</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { BleClient } from '@capacitor-community/bluetooth-le';

const emit = defineEmits(['upload-record']);
const bpm = ref(80);
const ecgCanvas = ref(null);
const isBleConnected = ref(false);
let ctx, xPos = 0, animationId;

const connectBLESensor = async () => {
  try {
    await BleClient.initialize();
    const device = await BleClient.requestDevice({
      services: ['180d'],
      optionalServices: ['180f']
    });
    await BleClient.connect(device.deviceId);
    isBleConnected.value = true;
    alert(`Connected to ${device.name || 'BLE Sensor'} successfully!`);
  } catch (error) {
    console.error('BLE Error:', error);
    alert('Bluetooth connection failed or was canceled.');
  }
};

const drawECG = () => {
  if (!ctx) return;
  ctx.fillStyle = '#001100';
  ctx.fillRect(xPos, 0, 15, 200);
  ctx.beginPath();
  ctx.moveTo(xPos === 0 ? 0 : xPos - 2, getY(xPos - 2));
  const yPos = getY(xPos);
  ctx.lineTo(xPos, yPos);
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 2;
  ctx.stroke();
  xPos += 2;
  if (xPos > ecgCanvas.value.width) xPos = 0;
  animationId = requestAnimationFrame(drawECG);
};

const getY = (currentX) => {
  const pixelsPerBeat = 7200 / bpm.value;
  const positionInBeat = currentX % pixelsPerBeat;
  let y = 100;
  if (positionInBeat > 10 && positionInBeat < 25) y -= 8;
  else if (positionInBeat > 35 && positionInBeat < 45) y += 12;
  else if (positionInBeat >= 45 && positionInBeat < 55) y -= 70;
  else if (positionInBeat >= 55 && positionInBeat < 65) y += 25;
  else if (positionInBeat > 80 && positionInBeat < 110) y -= 15;
  return y;
};

onMounted(() => {
  if (ecgCanvas.value) {
    ctx = ecgCanvas.value.getContext('2d');
    ctx.fillStyle = '#001100';
    ctx.fillRect(0, 0, ecgCanvas.value.width, ecgCanvas.value.height);
    drawECG();
  }
});

const handleUpload = () => {
  emit('upload-record', bpm.value);
};
</script>

<style scoped>
.card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;}
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;}
.ble-btn { background: #3498db; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;}
.monitor-wrapper { display: flex; align-items: center; background: #000; padding: 15px; border-radius: 8px; }
.ecg-canvas { background: #001100; border: 1px solid #004400; border-radius: 5px; width: 100%; max-width: 600px;}
.bpm-panel { display: flex; flex-direction: column; align-items: center; margin-left: 20px; min-width: 80px;}
.bpm-number { font-size: 3rem; font-weight: bold; color: #00ff00; }
.bpm-label { color: #00aa00; }
.controls { display: flex; align-items: center; gap: 15px; margin-top: 15px; }
.save-btn { background: #ff4757; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
</style>