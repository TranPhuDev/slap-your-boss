<script setup lang="ts">
import CharacterPreview from './CharacterPreview.vue'
import type { FaceAsset, GameResult } from '../types/game'

const props = defineProps<{
  result: GameResult
  face: FaceAsset | null
}>()

const emit = defineEmits<{
  'slapAgain': []
  'newBoss': []
}>()
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
    </div>
  </section>
</template>
