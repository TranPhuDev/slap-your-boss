<script setup lang="ts">
import { computed, ref } from 'vue'
import CharacterPreview from './CharacterPreview.vue'
import { formatFaceProcessingError, processFaceFile } from '../services/faceProcessing'
import { normalizeBossName, validateBossName, validateImageFile } from '../utils/validation'
import type { FaceAsset, SafeSettings } from '../types/game'

const props = defineProps<{
  bossName: string
  face: FaceAsset | null
  canPlay: boolean
  settings: SafeSettings
}>()

const emit = defineEmits<{
  'update:bossName': [value: string]
  'faceReady': [face: FaceAsset | null]
  'settingsChange': [settings: SafeSettings]
  play: []
}>()

const fileError = ref('')
const processing = ref(false)
const nameError = computed(() => validateBossName(props.bossName))

function onNameInput(event: Event) {
  const input = event.target as HTMLInputElement
  emit('update:bossName', normalizeBossName(input.value))
}

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  fileError.value = validateImageFile(file) ?? ''
  if (fileError.value) {
    emit('faceReady', null)
    return
  }
  processing.value = true
  try {
    const asset = await processFaceFile(file)
    fileError.value = asset.detectedFaces > 1 ? 'Multiple faces found. The largest face was selected.' : ''
    emit('faceReady', asset)
  } catch (error) {
    fileError.value = formatFaceProcessingError(error)
    emit('faceReady', null)
  } finally {
    processing.value = false
    input.value = ''
  }
}

function updateSound(event: Event) {
  emit('settingsChange', { ...props.settings, soundEnabled: (event.target as HTMLInputElement).checked })
}

function updateVibration(event: Event) {
  emit('settingsChange', { ...props.settings, vibrationEnabled: (event.target as HTMLInputElement).checked })
}
</script>

<template>
  <section class="landing-screen">
    <header class="landing-header">
      <p class="brand">SLAP YOUR BOSS</p>
      <p class="tagline">Did your boss just scold you?</p>
    </header>

    <CharacterPreview :face="face" />

    <form class="landing-controls" @submit.prevent="emit('play')">
      <label class="field">
        <span>Boss name</span>
        <input
          :value="bossName"
          maxlength="30"
          autocomplete="off"
          placeholder="Mr. Deadline"
          @input="onNameInput"
        />
      </label>
      <p v-if="nameError" class="form-message">{{ nameError }}</p>

      <label class="file-button">
        <input accept="image/jpeg,image/png,image/webp" capture="user" type="file" @change="onFileChange" />
        <span>{{ processing ? 'PROCESSING FACE...' : 'CHOOSE OR CAPTURE PHOTO' }}</span>
      </label>
      <p class="privacy">Your photo is processed only on this device and is never uploaded.</p>
      <p v-if="fileError" class="form-message">{{ fileError }}</p>

      <div class="toggles">
        <label><input type="checkbox" :checked="settings.soundEnabled" @change="updateSound" /> Sound</label>
        <label><input type="checkbox" :checked="settings.vibrationEnabled" @change="updateVibration" /> Vibration</label>
      </div>

      <button class="primary-button" type="submit" :disabled="!canPlay || processing">PLAY</button>
    </form>
  </section>
</template>
