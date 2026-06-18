<script setup lang="ts">
import { ref } from 'vue'
import CharacterPreview from './CharacterPreview.vue'
import { downloadBlob, exportReportPng } from '../services/reportExport'
import type { FaceAsset, GameResult } from '../types/game'

const props = defineProps<{
  result: GameResult
  face: FaceAsset | null
}>()

const emit = defineEmits<{
  'slapAgain': []
  'newBoss': []
}>()

const busy = ref(false)
const message = ref('')

async function saveReport() {
  busy.value = true
  try {
    const blob = await exportReportPng(props.result, props.face)
    downloadBlob(blob, `slap-report-${props.result.bossName.replace(/\W+/g, '-').toLowerCase()}.png`)
    message.value = 'Report PNG downloaded.'
  } finally {
    busy.value = false
  }
}

async function shareReport() {
  busy.value = true
  try {
    const blob = await exportReportPng(props.result, props.face)
    const file = new File([blob], 'slap-report.png', { type: 'image/png' })
    if (navigator.canShare?.({ files: [file] }) && navigator.share) {
      await navigator.share({ title: 'Slap Your Boss', text: `${props.result.rank}: ${props.result.finalScore}`, files: [file] })
      message.value = 'Shared.'
    } else {
      downloadBlob(blob, 'slap-report.png')
      message.value = 'Share not supported. PNG downloaded instead.'
    }
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="result-screen">
    <p class="brand">SLAP REPORT</p>
    <CharacterPreview :face="face" />
    <div class="report-grid">
      <span>Boss</span><strong>{{ result.bossName }}</strong>
      <span>Total Slaps</span><strong>{{ result.totalSlaps }}</strong>
      <span>Max Combo</span><strong>{{ result.maxCombo }}</strong>
      <span>Face Damage</span><strong>{{ result.faceDamage }}%</strong>
      <span>Stress Released</span><strong>{{ result.stressReleased }}%</strong>
      <span>Best Slap</span><strong>{{ result.bestSlap }}</strong>
      <span>Final Score</span><strong>{{ result.finalScore }}</strong>
    </div>
    <h1>{{ result.rank }}</h1>
    <div class="result-actions">
      <button class="primary-button" @click="emit('slapAgain')">SLAP AGAIN</button>
      <button @click="emit('newBoss')">NEW BOSS</button>
      <button :disabled="busy" @click="saveReport">SAVE REPORT</button>
      <button :disabled="busy" @click="shareReport">SHARE</button>
    </div>
    <p v-if="message" class="form-message">{{ message }}</p>
  </section>
</template>
