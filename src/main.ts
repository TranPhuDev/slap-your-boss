import { createApp } from 'vue'
import { inject, type BeforeSendEvent } from '@vercel/analytics'
import './style.css'
import App from './App.vue'

const sensitiveSearchParams = ['bossName', 'fileName', 'image', 'face', 'landmarks', 'base64', 'blob']

function sanitizeAnalyticsEvent(event: BeforeSendEvent): BeforeSendEvent | null {
  try {
    const url = new URL(event.url)
    if (url.protocol === 'blob:' || url.protocol === 'data:') return null
    for (const param of sensitiveSearchParams) url.searchParams.delete(param)
    return { ...event, url: url.toString() }
  } catch {
    if (event.url.includes('blob:') || event.url.includes('base64')) return null
    return event
  }
}

inject({
  beforeSend: sanitizeAnalyticsEvent,
  framework: 'vue',
})

createApp(App).mount('#app')
