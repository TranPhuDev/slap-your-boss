export interface AudioEngine {
  resume: () => Promise<void>
  countdown: () => void
  slap: () => void
  heavySlap: () => void
  combo: () => void
  finish: () => void
  dispose: () => void
}

export function createAudioEngine(): AudioEngine {
  let context: AudioContext | null = null
  const getContext = () => {
    context ??= new AudioContext()
    return context
  }

  let slapBuffer: AudioBuffer | null = null
  let heavySlapBuffer: AudioBuffer | null = null

  const loadExternalBuffer = async (url: string): Promise<AudioBuffer | null> => {
    try {
      const res = await fetch(url).catch(() => null)
      if (!res || !res.ok) return null
      const arrayBuf = await res.arrayBuffer()
      const ctx = getContext()
      return await ctx.decodeAudioData(arrayBuf).catch(() => null)
    } catch {
      return null
    }
  }

  const initPreload = async () => {
    slapBuffer = await loadExternalBuffer('/sounds/slap.mp3')
    heavySlapBuffer = await loadExternalBuffer('/sounds/heavy-slap.mp3')
  }
  
  // Start preloading immediately
  void initPreload()

  const playBuffer = (buffer: AudioBuffer): boolean => {
    try {
      const ctx = getContext()
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.connect(ctx.destination)
      source.start()
      return true
    } catch {
      return false
    }
  }

  const tone = (frequency: number, duration: number, type: OscillatorType = 'square', gain = 0.08) => {
    const ctx = getContext()
    const oscillator = ctx.createOscillator()
    const volume = ctx.createGain()
    oscillator.type = type
    oscillator.frequency.value = frequency
    volume.gain.setValueAtTime(gain, ctx.currentTime)
    volume.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    oscillator.connect(volume).connect(ctx.destination)
    oscillator.start()
    oscillator.stop(ctx.currentTime + duration)
  }

  const playRealisticSlap = (isHeavy = false) => {
    const ctx = getContext()
    
    // 1. Noise Burst (hand contact "crack")
    const bufferSize = ctx.sampleRate * 0.1 // 100ms duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    
    const noiseNode = ctx.createBufferSource()
    noiseNode.buffer = buffer
    
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = isHeavy ? 1000 : 1300
    noiseFilter.Q.value = 2.0
    
    const noiseVolume = ctx.createGain()
    noiseVolume.gain.setValueAtTime(isHeavy ? 0.35 : 0.25, ctx.currentTime)
    noiseVolume.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isHeavy ? 0.06 : 0.04))
    
    noiseNode.connect(noiseFilter).connect(noiseVolume).connect(ctx.destination)
    noiseNode.start()
    noiseNode.stop(ctx.currentTime + 0.1)

    // 2. Low-frequency impact thud (flesh/cheek resonance)
    const oscillator = ctx.createOscillator()
    const oscillatorFilter = ctx.createBiquadFilter()
    const oscVolume = ctx.createGain()
    
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(isHeavy ? 130 : 160, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + (isHeavy ? 0.15 : 0.1))
    
    oscillatorFilter.type = 'lowpass'
    oscillatorFilter.frequency.value = isHeavy ? 300 : 400
    
    oscVolume.gain.setValueAtTime(isHeavy ? 0.45 : 0.3, ctx.currentTime)
    oscVolume.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isHeavy ? 0.18 : 0.12))
    
    oscillator.connect(oscillatorFilter).connect(oscVolume).connect(ctx.destination)
    oscillator.start()
    oscillator.stop(ctx.currentTime + (isHeavy ? 0.2 : 0.15))
  }

  return {
    resume: async () => {
      const ctx = getContext()
      if (ctx.state !== 'running') {
        await ctx.resume()
      }
      if (!slapBuffer || !heavySlapBuffer) {
        await initPreload()
      }
    },
    countdown: () => tone(520, 0.08, 'triangle', 0.05),
    slap: () => {
      if (slapBuffer && playBuffer(slapBuffer)) return
      playRealisticSlap(false)
    },
    heavySlap: () => {
      if (heavySlapBuffer && playBuffer(heavySlapBuffer)) return
      playRealisticSlap(true)
    },
    combo: () => tone(760, 0.12, 'square', 0.06),
    finish: () => {
      tone(430, 0.12, 'triangle', 0.06)
      window.setTimeout(() => tone(640, 0.16, 'triangle', 0.06), 120)
    },
    dispose: () => {
      void context?.close()
      context = null
      slapBuffer = null
      heavySlapBuffer = null
    },
  }
}
