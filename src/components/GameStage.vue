<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { GAME_DURATION_MS } from '../game/constants'
import { PixiSlapRuntime } from '../game/pixiRuntime'
import { comboAfterIdle } from '../game/round'
import { createSlapFromGesture, type PointerSnapshot } from '../game/input'
import type { FaceAsset, RoundState, SafeSettings, SlapEvent } from '../types/game'
import type { SlapE2EApi } from '../types/e2e'

const HAND_HIT_CURSOR_DURATION_MS = 200

const props = defineProps<{
  bossName: string
  face: FaceAsset
  round: RoundState
  settings: SafeSettings
}>()

const emit = defineEmits<{
  slap: [event: SlapEvent]
  expired: []
}>()

const stage = ref<HTMLElement | null>(null)
const runtime = new PixiSlapRuntime()
const startPointer = ref<PointerSnapshot | null>(null)
const now = ref(performance.now())
const cursor = ref({ x: 0, y: 0, visible: false, hitting: false, flip: false })
let raf = 0

const timeLeft = computed(() => Math.max(0, GAME_DURATION_MS - (now.value - props.round.startedAt)))
const combo = computed(() => comboAfterIdle(props.round, now.value))
const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false

onMounted(async () => {
  if (stage.value) await runtime.mount(stage.value, props.face)
  installE2EApi()
  const tick = () => {
    now.value = performance.now()
    if (props.round.startedAt && now.value - props.round.startedAt >= GAME_DURATION_MS) emit('expired')
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
})

watch(
  () => props.round.lastSlapAt,
  () => {
    if (props.round.lastSlapAt > 0) {
      cursor.value.hitting = true
      window.setTimeout(() => (cursor.value.hitting = false), HAND_HIT_CURSOR_DURATION_MS)
    }
  },
)

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  if (window.__SLAP_E2E__) window.__SLAP_E2E__ = undefined
  void runtime.destroy()
  document.body.style.cursor = ''
})

function onPointerDown(event: PointerEvent) {
  if (!stage.value) return
  stage.value.setPointerCapture(event.pointerId)
  startPointer.value = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now() }
  updateCursor(event)
}

function onPointerMove(event: PointerEvent) {
  updateCursor(event)
}

function onPointerUp(event: PointerEvent) {
  if (!stage.value || !startPointer.value || startPointer.value.id !== event.pointerId) return
  const end = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now() }
  const slap = createSlapFromGesture(startPointer.value, end, stage.value.getBoundingClientRect(), props.round.lastSlapAt)
  startPointer.value = null
  if (slap) {
    runtime.applySlap(slap)
    emit('slap', slap)
    cursor.value.flip = slap.direction === 'LEFT'
  }
}

function onPointerCancel() {
  startPointer.value = null
}

function updateCursor(event: PointerEvent) {
  if (!finePointer) return
  cursor.value = {
    ...cursor.value,
    x: event.clientX,
    y: event.clientY,
    visible: true,
    flip: event.clientX > window.innerWidth / 2,
  }
}

function installE2EApi() {
  if (!import.meta.env.DEV || new URLSearchParams(window.location.search).get('visualTest') !== 'real-head') return
  const api: SlapE2EApi = {
    isReady: () => runtime.isReady(),
    pauseAnimations: () => {
      cancelAnimationFrame(raf)
      runtime.pauseAnimations()
    },
    advanceFrames: (count: number) => runtime.advanceFrames(count),
    resetMesh: () => runtime.resetMesh(),
    applySlap: (event: SlapEvent) => runtime.applySlap(event),
    getRenderState: () => runtime.getRenderState(),
  }
  window.__SLAP_E2E__ = api
}
</script>

<template>
  <section class="game-screen">
    <header class="hud">
      <div><span>Boss</span><strong>{{ bossName }}</strong></div>
      <div><span>Time</span><strong>{{ (timeLeft / 1000).toFixed(1) }}</strong></div>
      <div><span>Slaps</span><strong>{{ round.totalSlaps }}</strong></div>
      <div><span>Combo</span><strong>{{ combo }}</strong></div>
      <div><span>Damage</span><strong>{{ round.faceDamage }}%</strong></div>
    </header>
    <div
      ref="stage"
      class="pixi-stage"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerCancel"
      @pointerleave="onPointerCancel"
    ></div>
    <div
      v-if="finePointer && cursor.visible"
      class="hand-cursor"
      :class="{ hitting: cursor.hitting }"
      :style="{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0) scaleX(${cursor.flip ? -1 : 1})` }"
      aria-hidden="true"
    >✋</div>
  </section>
</template>
