<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import GameStage from './components/GameStage.vue'
import LandingScreen from './components/LandingScreen.vue'
import ResultScreen from './components/ResultScreen.vue'
import SupportGameButton from './components/SupportGameButton.vue'
import { KOFI_URL } from './config/support'
import { GAME_DURATION_MS } from './game/constants'
import { createAudioEngine } from './game/audio'
import { createInitialRoundState, registerSlap, resetRoundState } from './game/round'
import { createGameResult } from './game/scoring'
import { loadSettings, saveSettings, updateStats } from './game/storage'
import { createRealHeadVisualFixture, shouldUseRealHeadVisualTest } from './game/visualTestFixture'
import type { FaceAsset, GamePhase, GameResult, RoundState, SafeSettings, SlapEvent } from './types/game'

const visualTestMode = shouldUseRealHeadVisualTest()
const visualFace = visualTestMode ? createRealHeadVisualFixture() : null
const phase = ref<GamePhase>(visualTestMode ? 'PLAYING' : 'LANDING')
const bossName = ref(visualTestMode ? 'Visual Fixture Boss' : '')
const face = ref<FaceAsset | null>(visualFace)
const round = ref<RoundState>(visualTestMode ? resetRoundState(performance.now()) : createInitialRoundState())
const result = ref<GameResult | null>(null)
const countdownText = ref('')
const settings = ref<SafeSettings>(visualTestMode ? { soundEnabled: false, vibrationEnabled: false } : loadSettings())
const audio = createAudioEngine()
const countdownTimeouts: number[] = []
let roundEndTimeout = 0

const canPlay = computed(() => bossName.value.trim().length > 0 && face.value !== null)

function clearTimers() {
  for (const id of countdownTimeouts.splice(0)) window.clearTimeout(id)
  if (roundEndTimeout) window.clearTimeout(roundEndTimeout)
  roundEndTimeout = 0
}

function setBossName(value: string) {
  bossName.value = value
}

function setFaceAsset(value: FaceAsset | null) {
  if (face.value && face.value.objectUrl !== value?.objectUrl) {
    URL.revokeObjectURL(face.value.objectUrl)
    URL.revokeObjectURL(face.value.originalImageUrl)
  }
  face.value = value
}

function persistSettings(next: SafeSettings) {
  settings.value = next
  saveSettings(next)
}

async function startCountdown() {
  if (!canPlay.value || !face.value) return
  clearTimers()
  result.value = null
  round.value = resetRoundState(performance.now())
  phase.value = 'COUNTDOWN'
  await audio.resume()
  const steps = ['3', '2', '1', 'SLAP!']
  steps.forEach((label, index) => {
    countdownTimeouts.push(
      window.setTimeout(() => {
        countdownText.value = label
        if (settings.value.soundEnabled) audio.countdown()
      }, index * 700),
    )
  })
  countdownTimeouts.push(window.setTimeout(startRound, steps.length * 700))
}

function startRound() {
  const now = performance.now()
  round.value = resetRoundState(now)
  phase.value = 'PLAYING'
  roundEndTimeout = window.setTimeout(finishRound, GAME_DURATION_MS + 40)
}

function onSlap(event: SlapEvent) {
  if (phase.value !== 'PLAYING') return
  const next = registerSlap(round.value, event)
  round.value = next
  if (settings.value.soundEnabled) {
    if (event.power > 75) audio.heavySlap()
    else audio.slap()
    if ([5, 10, 20, 30, 50].includes(next.combo)) audio.combo()
  }
  if (settings.value.vibrationEnabled) navigator.vibrate?.(event.power > 75 ? 45 : 22)
}

function finishRound() {
  if (phase.value !== 'PLAYING') return
  const final = createGameResult(bossName.value.trim(), round.value, GAME_DURATION_MS)
  result.value = final
  updateStats(final)
  if (settings.value.soundEnabled) audio.finish()
  phase.value = 'RESULT'
  clearTimers()
}

function slapAgain() {
  round.value = createInitialRoundState()
  void startCountdown()
}

function newBoss() {
  clearTimers()
  if (face.value) URL.revokeObjectURL(face.value.objectUrl)
  if (face.value) URL.revokeObjectURL(face.value.originalImageUrl)
  face.value = null
  bossName.value = ''
  round.value = createInitialRoundState()
  result.value = null
  countdownText.value = ''
  phase.value = 'LANDING'
}

onBeforeUnmount(() => {
  clearTimers()
  audio.dispose()
  if (face.value) URL.revokeObjectURL(face.value.objectUrl)
  if (face.value) URL.revokeObjectURL(face.value.originalImageUrl)
})
</script>

<template>
  <main class="app-shell">
    <LandingScreen
      v-if="phase === 'LANDING'"
      :boss-name="bossName"
      :face="face"
      :can-play="canPlay"
      :settings="settings"
      @update:boss-name="setBossName"
      @face-ready="setFaceAsset"
      @settings-change="persistSettings"
      @play="startCountdown"
    />
    <section v-else-if="phase === 'COUNTDOWN'" class="countdown-screen" aria-live="assertive">
      <p class="brand">SLAP YOUR BOSS</p>
      <div class="countdown-text">{{ countdownText }}</div>
    </section>
    <GameStage
      v-else-if="phase === 'PLAYING' && face"
      :boss-name="bossName"
      :face="face"
      :round="round"
      :settings="settings"
      @slap="onSlap"
      @expired="finishRound"
    />
    <ResultScreen
      v-else-if="phase === 'RESULT' && result"
      :result="result"
      :face="face"
      @slap-again="slapAgain"
      @new-boss="newBoss"
    />
    <section v-if="phase === 'LANDING'" class="seo-content" aria-labelledby="about-game-title">
      <h1 id="about-game-title">Slap Your Boss – A Funny 15-Second Browser Game</h1>

      <p>
        Slap Your Boss is a free cartoon browser game where you upload a photo, place it on an office character and swipe for 15 seconds to build combos and create a Slap Report.
      </p>

      <h2 id="how-to-play">How to play</h2>

      <ol>
        <li>Enter a boss name.</li>
        <li>Choose or capture a photo.</li>
        <li>Press Play.</li>
        <li>Swipe for 15 seconds.</li>
        <li>Review your Slap Report and challenge a friend.</li>
      </ol>

      <h2 id="privacy">Private by design</h2>

      <p>Your photo is processed locally on your device and is never uploaded to our servers.</p>

      <h2>Play on mobile or desktop</h2>

      <p>The game works in a modern browser and supports touch, swipe and mouse controls.</p>

      <h2>Frequently asked questions</h2>

      <details>
        <summary>Is Slap Your Boss free?</summary>
        <p>Yes. The game is free to play directly in your browser.</p>
      </details>

      <details>
        <summary>Is my photo uploaded?</summary>
        <p>No. Photo processing happens locally on your device.</p>
      </details>

      <details>
        <summary>Does the game work on mobile?</summary>
        <p>Yes. Supported mobile browsers can capture a photo and play using touch controls.</p>
      </details>
    </section>
    <footer v-if="phase === 'LANDING'" class="site-footer">
      <p>Slap Your Boss - a free cartoon browser game.</p>

      <nav aria-label="Footer navigation">
        <a href="#how-to-play">How to play</a>
        <a href="#privacy">Privacy</a>
        <SupportGameButton :href="KOFI_URL" compact />
      </nav>

      <p>© 2026 Slap Your Boss</p>
    </footer>
  </main>
</template>
