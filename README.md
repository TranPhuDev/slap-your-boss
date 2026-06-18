# Slap Your Boss

Slap Your Boss is a frontend-only 15-second cartoon web game built with Vue 3, TypeScript, Vite, PixiJS v8, MediaPipe Face Landmarker, Pointer Events, Web Audio API, Canvas API, and safe localStorage.

## Stack

- Vue 3 + TypeScript + Vite
- PixiJS v8 for the gameplay scene
- MediaPipe Face Landmarker for one-time local face detection
- Pointer Events for tap/swipe input
- Web Audio API and optional vibration
- Canvas API for report PNG export
- localStorage for settings/statistics only

## Install

```powershell
pnpm install
```

## Development

```powershell
pnpm dev
```

## Test

```powershell
pnpm test
pnpm typecheck
```

## Build

```powershell
pnpm build
```

Production output is written to `dist/`.

## SEO And Production Domain

The canonical production domain is:

```text
https://www.slap-your-boss.online/
```

SEO assets are static and live under `public/`:

- `favicon.svg`
- `apple-touch-icon.png`
- `og-cover.png`
- `robots.txt`
- `sitemap.xml`

The sitemap contains only the real home route. Do not add temporary gameplay states, Blob/Object URLs, uploaded images, boss names, or Vercel preview URLs to canonical metadata, Open Graph metadata, robots, sitemap, share copy, or Slap Report links.

## Preview

```powershell
pnpm preview
```

## Privacy

User photos are processed in the browser only and are never uploaded by this app. The app does not create a backend, API server, database, login, gallery, or cloud image storage.

Vercel Web Analytics is integrated once in `src/main.ts` with `inject()` from `@vercel/analytics`. The Vue component entry was not used because the current package's Vue entry imports `vue-router`, while this app does not use Vue Router. Analytics is used for basic page-view analytics only. Do not add custom analytics events or send boss names, uploaded image data, file names, Object URLs, Blob URLs, base64 data, landmarks, face meshes, face textures, camera information, or Slap Report contents to analytics.

localStorage is limited to:

- soundEnabled
- vibrationEnabled
- totalGames
- highestScore
- highestDamage
- highestCombo
- bestSlap

It must not contain photos, base64 images, File/Blob data, object URLs, textures, crops, or landmarks.

## Browser Support

Use a modern Chrome, Edge, Firefox, or Safari browser. Camera capture depends on browser/device support and is only a hint on the file input. Face detection requires the MediaPipe runtime/model assets to load over HTTPS or localhost.

## Limitations

- MediaPipe model and WASM assets are loaded from official/static runtime URLs at detection time.
- If model loading fails or no face is detected, PLAY remains disabled and the user can choose another image.
- Browser verification should be done manually with real face images because automated test assets are not included.

## Deploy To Cloudflare Pages

Use these settings:

```text
Framework preset: Vue
Build command: pnpm build
Output directory: dist
```

After deployment, verify direct refresh, model/WASM asset loading, photo processing, gameplay, Slap Report rendering, and the absence of photo upload requests.

## Deploy To Vercel

Use these settings:

```text
Framework preset: Vite
Install command: pnpm install
Build command: pnpm build
Output directory: dist
Production domain: https://www.slap-your-boss.online/
```

After deploy, verify:

1. Open `https://www.slap-your-boss.online/`.
2. Confirm the canonical URL is `https://www.slap-your-boss.online/`.
3. Confirm `https://www.slap-your-boss.online/robots.txt` loads.
4. Confirm `https://www.slap-your-boss.online/sitemap.xml` loads.
5. Confirm `https://www.slap-your-boss.online/og-cover.png` loads.
6. Confirm no URL includes boss names, uploaded image data, file names, Blob/Object URLs, landmarks, or face data.

### Enable Vercel Web Analytics

Manual production steps:

1. Go to the Vercel Dashboard.
2. Choose the `Slap Your Boss` project.
3. Open Analytics.
4. Click Enable if Analytics is not enabled yet.
5. Deploy production again.
6. Open `https://www.slap-your-boss.online/`.
7. Reload the page.
8. Check the Network request for Vercel Analytics.
9. Check data in the Vercel Dashboard after real production traffic exists.

Do not claim Analytics has collected production data until the production deployment is live and there has been at least one real visit.
