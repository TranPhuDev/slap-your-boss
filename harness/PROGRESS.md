# PROGRESS.md

## Current Status

Active feature: F-011  
Overall status: Implemented through F-011 with command verification; browser/manual image verification remains pending  
Last updated: 2026-06-18

## Baseline

- `pnpm install`: not run in this session; dependencies were already present
- `node .\scripts\harness-check.mjs`: passed before implementation with F-001 active
- `pnpm build`: passed before implementation and after implementation
- Existing TypeScript errors: none observed
- Existing tests: Vitest suite added and passing

## Current Plan

1. Complete release verification with a browser and real face images when browser tooling is available.
2. Verify MediaPipe model/WASM asset loading under deployed HTTPS.
3. Inspect localStorage/network during manual browser verification.

## Work Log

### 2026-06-18 - F-011 external custom MP3 audio file support

Feature ID: F-011

Work performed:

- Added asynchronous loading/preloading and playback of external custom audio files `/sounds/slap.mp3` and `/sounds/heavy-slap.mp3` in `src/game/audio.ts`.
- Integrated graceful fallback to synthesized realistic slaps in case files are missing or load fails.
- Re-trigger loading on context resume to support copy-pasted files without full engine reinits.

Files modified:

- `src/game/audio.ts`
- `harness/PROGRESS.md`

Commands run:

```text
pnpm test
pnpm typecheck
pnpm build
node .\scripts\harness-check.mjs
```

Results:

- `pnpm test` passed: 1 file, 13 tests.
- `pnpm typecheck` passed.
- `pnpm build` passed.
- Harness check passed with F-011 active.

Remaining:

- Visual/manual verification on physical devices/browsers is still pending due to Playwright NPM download restrictions.

### 2026-06-18 - F-011 programmatic realistic slap sound synthesis

Feature ID: F-011

Work performed:

- Replaced simple synthetic square/sawtooth oscillator tones for normal and heavy slaps with programmatically synthesized realistic slap sounds in `src/game/audio.ts`.
- Implemented a short, sharp bandpass-filtered white noise burst (mimicking the hand skin impact contact "crack").
- Implemented a lowpass-filtered swept-frequency triangle oscillator (mimicking the bass impact resonance "thud").

Files modified:

- `src/game/audio.ts`
- `harness/PROGRESS.md`

Commands run:

```text
pnpm test
pnpm typecheck
pnpm build
node .\scripts\harness-check.mjs
```

Results:

- `pnpm test` passed: 1 file, 13 tests.
- `pnpm typecheck` passed.
- `pnpm build` passed.
- Harness check passed with F-011 active.

Remaining:

- Visual/manual verification on physical devices/browsers is still pending due to Playwright NPM download restrictions.

### 2026-06-18 - F-011 disable gameplay head background color removal

Feature ID: F-011

Work performed:

- Commented out the `removeBackgroundFromBorder(canvas)` call in `drawIsolatedHeadCropToCanvas` inside `FaceMeshBuilder.ts`.
- This preserves the original photo background color and prevents glaring/white artifacts at the crop borders in gameplay.
- Added `export` to `removeBackgroundFromBorder` declaration to satisfy TypeScript strict unused check while keeping the function code available.

Files modified:

- `src/game/face/FaceMeshBuilder.ts`
- `harness/PROGRESS.md`

Commands run:

```text
pnpm test
pnpm typecheck
pnpm build
node .\scripts\harness-check.mjs
```

Results:

- `pnpm test` passed: 1 file, 13 tests.
- `pnpm typecheck` passed.
- `pnpm build` passed.
- Harness check passed with F-011 active.

Remaining:

- Visual/manual verification on physical devices/browsers is still pending due to Playwright NPM download restrictions.

### 2026-06-18 - F-011 remove gameplay face outline ellipse

Feature ID: F-011

Work performed:

- Removed the dark outline circle/ellipse drawn over the boss face mesh in the gameplay scene inside `FaceMeshRenderer.ts`.
- Kept the `outlineOverlay` Graphics object initialized and cleared on destroy to prevent runtime errors, but removed the stroke rendering.

Files modified:

- `src/game/face/FaceMeshRenderer.ts`
- `harness/PROGRESS.md`

Commands run:

```text
pnpm test
pnpm typecheck
pnpm build
node .\scripts\harness-check.mjs
```

Results:

- `pnpm test` passed: 1 file, 13 tests.
- `pnpm typecheck` passed.
- `pnpm build` passed.
- Harness check passed with F-011 active.

Remaining:

- Visual/manual verification on physical devices/browsers is still pending due to Playwright NPM download restrictions.

### 2026-06-18 - F-011 remove tap-to-slap and widen swipe hit area

Feature ID: F-011

Work performed:

- Removed the click-to-slap gesture (`TAP` type gesture) by ignoring durations under 250ms with small movement in `createSlapFromGesture`.
- Expanded the slap hit area to span the full stage width and 10%-90% stage height in `isInHeadHitArea`, removing the narrow oval restriction ("khung") for swiping.
- Updated `createSlapFromGesture` unit tests in `src/game/game.test.ts` to expect `null` for taps while continuing to verify valid `SWIPE` events.

Files modified:

- `src/game/input.ts`
- `src/game/game.test.ts`
- `harness/PROGRESS.md`
- `harness/TEST_CASES.md`

Commands run:

```text
pnpm test
pnpm typecheck
pnpm build
node .\scripts\harness-check.mjs
```

Results:

- `pnpm test` passed: 1 file, 13 tests.
- `pnpm typecheck` passed.
- `pnpm build` passed.
- Harness check passed with F-011 active.

Remaining:

- Visual/manual verification on physical devices/browsers is still pending due to Playwright NPM download restrictions.

### 2026-06-18 - F-011 gameplay right-half cursor disappearance fix

Feature ID: F-011

Work performed:

- Fixed the desktop slap-hand cursor disappearing or jumping when hovering over the right half of gameplay.
- Consolidated cursor translation and horizontal flip into one inline `transform` using `translate3d(...) scaleX(...)`.
- Removed the separate `.flip` CSS scale path so the browser does not combine an individual `scale` property with the cursor translate transform.
- Added a stable transform origin and `will-change: transform` for the fixed cursor element.

Files modified:

- `src/components/GameStage.vue`
- `src/style.css`
- `harness/PROGRESS.md`
- `harness/TEST_CASES.md`

Commands run:

```text
pnpm test
pnpm typecheck
pnpm build
node .\scripts\harness-check.mjs
```

Results:

- `pnpm test` passed: 1 file, 13 tests.
- `pnpm typecheck` passed.
- `pnpm build` passed. Vite still emits the known non-fatal chunk-size warning.
- Harness check passed with F-011 active.

Remaining:

- Desktop browser hover verification on the right half of the gameplay viewport is still required. Existing Playwright/Chromium installation remains blocked by registry access, so this session could not capture a browser screenshot or pointer-hover artifact.

### 2026-06-18 - F-011 gameplay portrait background removal

Feature ID: F-011

Work performed:

- Added border-color based background removal for `drawIsolatedHeadCropToCanvas` before applying the gameplay head alpha mask.
- The remover samples the crop border as likely background, alpha-outs similar pixels, feathers partial matches, and protects the central face area from accidental removal.
- Gameplay still uses `backHeadCanvas` for the isolated real portrait and `faceTextureCanvas` for the mesh.

Files modified:

- `src/game/face/FaceMeshBuilder.ts`
- `harness/PROGRESS.md`

Commands run:

```text
pnpm test
pnpm typecheck
pnpm build
```

Results:

- `pnpm test` passed: 1 file, 13 tests.
- `pnpm typecheck` passed.
- `pnpm build` passed. Vite still emits the known non-fatal chunk-size warning.

Remaining:

- This is heuristic Canvas background removal, not semantic person segmentation. It works best when the crop border represents the background color and may leave artifacts on complex backgrounds.

### 2026-06-18 - F-011 smaller preview head and isolated gameplay head mask

Feature ID: F-011

Work performed:

- Reduced `.preview-real-head` size on landing so uploaded head preview fits the form layout better.
- Added `drawIsolatedHeadCropToCanvas` for gameplay head rendering with a tighter alpha mask intended to separate the real head from its background.
- Kept `headCanvas` using the softer/full mask for landing, while `backHeadCanvas` now uses the isolated gameplay mask.
- Kept `faceCrop` separate from `headCrop`; face mesh UVs still derive from `faceCrop`.

Files modified:

- `src/game/face/FaceMeshBuilder.ts`
- `src/services/faceProcessing.ts`
- `src/style.css`
- `harness/PROGRESS.md`

Commands run:

```text
pnpm test
pnpm typecheck
pnpm build
```

Results:

- `pnpm test` passed: 1 file, 13 tests.
- `pnpm typecheck` passed.
- `pnpm build` passed. Vite still emits the known non-fatal chunk-size warning.

Remaining:

- Browser/visual verification is still pending because Playwright could not be installed in this environment.

### 2026-06-18 - F-011 Playwright visual test harness setup

Feature ID: F-011

Work performed:

- Added `playwright.config.ts` for Chromium, fixed 960x720 viewport, `deviceScaleFactor = 1`, one worker, Vite dev server, HTML report, and failure trace/video/screenshot artifacts.
- Added package scripts: `test:e2e`, `test:visual`, `test:visual:update`, `test:e2e:ui`, and `test:e2e:report`.
- Added deterministic visual-test mode at `/?visualTest=real-head` that boots directly into gameplay with a Canvas fixture and no file chooser/MediaPipe run.
- Added `window.__SLAP_E2E__` API in dev visual-test mode with `isReady`, `pauseAnimations`, `advanceFrames`, `resetMesh`, `applySlap`, and `getRenderState`.
- Added quantitative render state for default overlays, back head, face mesh, eye effects, eye UV validity, hair alpha coverage, eye displacement, and mesh vertex count.
- Added Playwright visual specs under `tests/visual/real-head.spec.ts` and artifact output placeholders under `artifacts/visual`, `playwright-report`, and `test-results`.
- Configured Vitest to exclude Playwright visual specs.

Files created:

- `playwright.config.ts`
- `src/types/e2e.ts`
- `src/game/visualTestFixture.ts`
- `tests/visual/real-head.spec.ts`
- `artifacts/visual/.gitkeep`
- `playwright-report/.gitkeep`
- `test-results/.gitkeep`

Files modified:

- `package.json`
- `vite.config.ts`
- `src/App.vue`
- `src/components/GameStage.vue`
- `src/game/pixiRuntime.ts`
- `src/game/face/FaceMeshRenderer.ts`
- `harness/PROGRESS.md`
- `harness/TEST_CASES.md`

Commands run:

```text
pnpm add -D @playwright/test
pnpm test
pnpm typecheck
pnpm build
pnpm exec playwright install chromium
pnpm test:visual:update
pnpm test:visual
```

Results:

- `pnpm add -D @playwright/test` failed: registry access to `https://registry.npmjs.org/@playwright%2Ftest` returned `EACCES`.
- Because the dependency could not be installed or locked, `@playwright/test` was not left in `package.json`; otherwise every `pnpm` command attempted an install and failed.
- `pnpm exec playwright install chromium` failed because the `playwright` binary is not installed.
- `pnpm test:visual:update` and `pnpm test:visual` failed because `playwright` is not recognized.
- `pnpm test` passed after excluding `tests/visual`: 1 file, 13 tests.
- `pnpm typecheck` passed.
- `pnpm build` passed. Vite still emits the known non-fatal chunk-size warning.

Artifacts:

- `artifacts/visual/`: placeholder only; no screenshots generated because Playwright could not run.
- `playwright-report/`: placeholder only; no HTML report generated because Playwright could not run.
- `test-results/`: placeholder only; no traces/videos generated because Playwright could not run.

Remaining:

- Install `@playwright/test` and Chromium when registry/browser download access is available, then run `pnpm test:visual:update`, inspect `artifacts/visual/*.png`, run `pnpm test:visual`, and update blocked visual cases with real results.

### 2026-06-18 - F-011 full head crop and white-eye mitigation

Feature ID: F-011

Work performed:

- Expanded `headCrop` further left/right/top/bottom to retain hair, ears, forehead, and chin.
- Increased head canvas resolution from `440x520` to `520x640` and gameplay display size from `190x220` to `220x270`.
- Relaxed the soft mask so hair and upper head are less likely to be clipped.
- Stopped using the face-cutout back-head canvas in gameplay because it could expose holes/white gaps where face mesh topology does not fully cover eyes.
- Kept two distinct crops: `headCrop` for `backHeadSprite`/landing head and `faceCrop` for `faceMesh` UVs/texture.
- Confirmed `eyeEffects.visible = false` on mount and only enables for strong slap/high damage.

Files modified:

- `src/services/faceProcessing.ts`
- `src/game/face/FaceMeshBuilder.ts`
- `src/game/face/FaceMeshRenderer.ts`
- `src/style.css`
- `harness/PROGRESS.md`
- `harness/TEST_CASES.md`

Commands run:

```text
pnpm test
pnpm typecheck
pnpm build
```

Results:

- `pnpm test` passed: 1 file, 13 tests.
- `pnpm typecheck` passed.
- `pnpm build` passed. Vite still emits the known non-fatal chunk-size warning.

Remaining:

- Browser/manual visual verification is still required to confirm hair is visible, eyes look normal, no white-eye overlay is visible during idle gameplay, and no default head is rendered.

### 2026-06-18 - F-011 gameplay face overlap and eye distortion fix

Feature ID: F-011

Work performed:

- Split uploaded head rendering into two canvases: `headCanvas` for landing/result full real head, and `backHeadCanvas` for gameplay back-head with the face area cut out.
- Kept `faceTextureCanvas` and `meshData` tied to the face crop only, so UVs are still based on the face crop rather than the head crop.
- Updated `FaceMeshRenderer` to render `backHeadSprite` from `backHeadCanvas`, then `faceMesh`, then `outlineOverlay`, with `eyeEffects` hidden by default.
- Removed always-on eye overlays; `eyeEffects` only becomes visible for strong slaps or high damage and fades out.
- Reduced eye-region deformation weight and lowered max vertex displacement to reduce eye warping/white gaps.
- Added test coverage for mapping the face crop frame inside the head display, which verifies the separated back-head/mesh placement math.

Files modified:

- `src/types/game.ts`
- `src/game/face/types.ts`
- `src/game/face/FaceMeshBuilder.ts`
- `src/services/faceProcessing.ts`
- `src/game/face/FaceMeshRenderer.ts`
- `src/game/face/FaceDeformationSystem.ts`
- `src/game/game.test.ts`
- `harness/PROGRESS.md`
- `harness/TEST_CASES.md`

Commands run:

```text
node .\scripts\harness-check.mjs
pnpm test
pnpm typecheck
pnpm build
```

Results:

- Harness check passed with F-011 active.
- `pnpm test` passed: 1 file, 13 tests.
- `pnpm typecheck` passed.
- `pnpm build` passed. Vite still emits the known non-fatal chunk-size warning.

Remaining:

- Browser/manual gameplay verification is still required to visually confirm no face overlap, no default head/face rendering, normal eyes without special effect, SLAP AGAIN retention, and NEW BOSS reset.
- F-011 remains active until those visual checks are completed.

### 2026-06-18 - F-011 real uploaded head display

Feature ID: F-011

Work performed:

- Changed uploaded-photo preview from a cartoon head shell with an inner oval image to a real cropped head image placed directly above the cartoon neck/body.
- Expanded the head crop asymmetrically from the MediaPipe face landmarks to include hair, forehead, ears, cheeks, and chin.
- Added a soft alpha mask to the head crop canvas so the uploaded head is not a hard rectangle.
- Removed the gameplay cartoon outline/default head wrapper around uploaded faces; gameplay now uses `backHeadSprite` from the real head crop plus `faceMesh` for deformation.
- Kept the no-photo landing fallback as the default cartoon head.
- Added test coverage for the expanded head crop calculation.

Files modified:

- `src/game/face/FaceMeshBuilder.ts`
- `src/services/faceProcessing.ts`
- `src/components/CharacterPreview.vue`
- `src/game/face/FaceMeshRenderer.ts`
- `src/style.css`
- `src/game/game.test.ts`
- `harness/PROGRESS.md`
- `harness/TEST_CASES.md`

Commands run:

```text
node .\scripts\harness-check.mjs
pnpm test
pnpm typecheck
pnpm build
pnpm test
pnpm typecheck
pnpm build
```

Results:

- Harness check passed with F-011 active.
- First `pnpm test` passed: 1 file, 12 tests.
- First `pnpm typecheck` and `pnpm build` failed because `Graphics` was left as an unused import after removing the cartoon outline.
- Removed the unused import.
- Final `pnpm test` passed: 1 file, 12 tests.
- Final `pnpm typecheck` passed.
- Final `pnpm build` passed. Vite still emits the known non-fatal chunk-size warning.

Remaining:

- Browser/manual verification is still required for the requested visual checks: landing uses real head, gameplay uses real head, no cartoon head surrounds the photo, and SLAP AGAIN keeps the real head.
- F-011 remains active until those visual checks are completed.

### 2026-06-18 - F-011 MediaPipe Face Mesh implementation

Feature ID: F-011

Work performed:

- Added face mesh modules under `src/game/face` for topology, UV/vertex building, region classification, PixiJS `MeshSimple` rendering, slap impulse deformation, spring recovery, displacement clamp, and mesh reset.
- Updated upload processing to keep MediaPipe landmarks, head canvas, face texture canvas, and `FaceMeshData` after one-time detection.
- Replaced gameplay oval face sprite/default facial features with `FaceMeshRenderer`, using a head container made from back head sprite, mesh, outline, and impact effects.
- Removed default preview eyes when an uploaded face is displayed.
- Preserved mesh data across SLAP AGAIN by keeping `FaceAsset` in the shared app ref; NEW BOSS revokes object URLs and clears the profile.
- Added tests for UV mapping, official-style triangle topology validity, official MediaPipe topology validity, region classification, Gaussian falloff, spring recovery, displacement clamp, and mesh reset.

Files created:

- `src/game/face/types.ts`
- `src/game/face/faceMeshTopology.ts`
- `src/game/face/FaceMeshBuilder.ts`
- `src/game/face/FaceMeshRenderer.ts`
- `src/game/face/FaceDeformationSystem.ts`
- `src/game/face/FaceRegionClassifier.ts`

Files modified:

- `src/types/game.ts`
- `src/services/faceProcessing.ts`
- `src/game/pixiRuntime.ts`
- `src/components/CharacterPreview.vue`
- `src/style.css`
- `src/game/game.test.ts`
- `scripts/harness-check.mjs`
- `scripts/harness-start-feature.mjs`
- `harness/FEATURE_LIST.md`
- `harness/PROGRESS.md`
- `harness/TEST_CASES.md`
- `harness/DECISIONS.md`

Commands run:

```text
node .\scripts\harness-check.mjs
pnpm test
pnpm typecheck
pnpm build
```

Results:

- Harness check passed with F-011 active.
- `pnpm test` passed: 1 file, 11 tests.
- `pnpm typecheck` passed.
- `pnpm build` passed. Vite still emits the known non-fatal chunk-size warning.

Remaining:

- Browser verification with a real uploaded face is still required to visually confirm mesh alignment, region deformation, replay/new-boss cleanup, storage/network privacy inspection, and FPS.
- F-011 remains active until that manual/browser verification is completed.

### 2026-06-18 - Upload image processing bugfix

Feature IDs: F-002, F-009

Work performed:

- Fixed face processing so MediaPipe runtime version matches the installed package version.
- Switched face detector creation to CPU delegate for broader browser compatibility.
- Reset failed MediaPipe initialization promises so the user can retry by choosing the photo again.
- Added image decode fallback from `createImageBitmap(file, options)` to an object-URL backed image decode path.
- Added explicit user-facing messages for detector asset loading failures and image decode failures instead of falling back to the generic "Could not process this image."
- Added unit coverage for face-processing error formatting.

Files modified:

- `src/services/faceProcessing.ts`
- `src/components/LandingScreen.vue`
- `src/game/game.test.ts`
- `harness/PROGRESS.md`
- `harness/TEST_CASES.md`

Commands run:

```text
node .\scripts\harness-check.mjs
pnpm test
pnpm typecheck
pnpm build
```

Results:

- Harness check passed in release state.
- `pnpm test` passed: 1 file, 7 tests.
- `pnpm typecheck` passed.
- `pnpm build` passed. Vite still emits the known non-fatal chunk-size warning.

Remaining:

- Real browser upload must be retried by the user because this session has no browser automation tool and cannot inspect the user's selected local image.

### 2026-06-18 - Full implementation session

Feature IDs: F-001 through F-010

Work performed:

- Replaced the Vite starter with a playable Vue game flow: landing, face processing, countdown, PixiJS gameplay, slap input, effects, scoring, result, export, share fallback, and safe local stats.
- Added isolated modules for constants, validation, input classification, combo/round state, scoring, storage, audio, report export, face processing, and PixiJS runtime.
- Added Vitest coverage for clamp, boss-name validation, image validation, tap/swipe classification, combo reset, damage, stress, final score, and rank.
- Updated README with install, run, test, build, preview, privacy, browser support, limitations, and Cloudflare Pages deployment.
- Updated harness check to accept the final release state where all features are done and no feature is active.

Files created:

- `src/types/game.ts`
- `src/game/constants.ts`
- `src/game/audio.ts`
- `src/game/input.ts`
- `src/game/pixiRuntime.ts`
- `src/game/round.ts`
- `src/game/scoring.ts`
- `src/game/storage.ts`
- `src/game/game.test.ts`
- `src/utils/math.ts`
- `src/utils/validation.ts`
- `src/services/faceProcessing.ts`
- `src/services/reportExport.ts`
- `src/components/CharacterPreview.vue`
- `src/components/LandingScreen.vue`
- `src/components/GameStage.vue`
- `src/components/ResultScreen.vue`

Files modified:

- `src/App.vue`
- `src/style.css`
- `index.html`
- `package.json`
- `README.md`
- `scripts/harness-check.mjs`
- `harness/FEATURE_LIST.md`
- `harness/PROGRESS.md`
- `harness/TEST_CASES.md`
- `harness/DECISIONS.md`
- `harness/RISKS.md`

Commands run:

```text
node .\scripts\harness-check.mjs
pnpm build
pnpm test
pnpm typecheck
pnpm build
node .\scripts\harness-check.mjs
pnpm test
pnpm typecheck
pnpm build
pnpm typecheck
pnpm build
node .\scripts\harness-check.mjs
```

Results:

- Baseline harness check passed with F-001 active.
- Baseline build passed.
- Final harness check passed in release state: all features done; no active feature.
- Final `pnpm test` passed: 1 file, 6 tests.
- Final `pnpm typecheck` passed.
- Final `pnpm build` passed and created `dist/`. Vite emitted a non-fatal chunk-size warning because PixiJS/MediaPipe increase bundle size.
- After adding PixiJS comic text/damage tint, `pnpm typecheck`, `pnpm build`, and harness check passed again.

Blocked/not completed:

- Attempted production preview HTTP verification by starting `pnpm preview` in the background, but the shell policy rejected the background process command. No browser automation tool is available in this session.
- Real photo MediaPipe verification, no-face/multiple-face manual verification, network/storage inspection, and repeated-session browser memory checks still need manual browser verification.

## Rules

Append a dated entry for each work session. Include:

- feature ID;
- work performed;
- files changed;
- commands actually run;
- results;
- blockers;
- remaining work.

Do not erase history.
