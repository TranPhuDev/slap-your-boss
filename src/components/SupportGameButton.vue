<script setup lang="ts">
defineProps<{
  href: string
  compact?: boolean
}>()
</script>

<template>
  <a
    v-if="href"
    class="support-game-button"
    :class="{ compact }"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span aria-hidden="true">♥</span>
    <span>{{ compact ? 'Support on Ko-fi' : 'Support this game on Ko-fi' }}</span>
  </a>
</template>
