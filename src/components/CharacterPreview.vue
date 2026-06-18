<script setup lang="ts">
import type { FaceAsset } from '../types/game'

defineProps<{ face: FaceAsset | null }>()
</script>

<template>
  <div class="character-preview" aria-label="Boss character preview">
    <img
      v-if="face"
      class="preview-real-head"
      :src="face.objectUrl"
      alt="Detected head preview"
      draggable="false"
    />
    <div v-else class="preview-head">
      <span class="placeholder-face">?</span>
    </div>
    <div class="preview-neck"></div>
    <div class="preview-body">
      <div class="preview-shirt"></div>
      <div class="preview-tie"></div>
      <div class="preview-arm preview-arm-left"></div>
      <div class="preview-arm preview-arm-right"></div>
    </div>
  </div>
</template>
