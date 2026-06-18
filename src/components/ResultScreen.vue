<script setup lang="ts">
import CharacterPreview from './CharacterPreview.vue'
import SupportGameButton from './SupportGameButton.vue'
import { KOFI_URL } from '../config/support'
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
    <h2>{{ result.rank }}</h2>
    <div class="result-actions">
      <button class="primary-button" @click="emit('slapAgain')">SLAP AGAIN</button>
      <button @click="emit('newBoss')">NEW BOSS</button>
    </div>
    <SupportGameButton :href="KOFI_URL" />
  </section>
</template>
