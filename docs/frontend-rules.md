# Frontend Rules

- Vue 3 Composition API and strict TypeScript.
- Avoid `any`.
- Never render boss name using `v-html`.
- Mobile-first, usable from 360 px.
- Prefer `100dvh` and safe-area support.
- `touch-action: none` only in gameplay region.
- Visible focus states and clear labels.
- Accept JPG/JPEG/PNG/WEBP, max 10 MB.
- Camera capture is a hint, not guaranteed.

localStorage may contain only safe statistics/settings:

- totalGames
- highestDamage
- highestCombo
- highestScore
- bestSlap
- soundEnabled
- vibrationEnabled

Never store File, Blob, base64, Object URL, pixels, texture, or landmarks.
