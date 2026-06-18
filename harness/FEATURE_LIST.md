# FEATURE_LIST.md

Allowed states: `planned`, `active`, `blocked`, `done`, `cancelled`.

Exactly one feature must be active during implementation.


---

## F-001 — Project foundation and landing screen

State: done
Priority: P0

### Behavior

When the site opens, show a mobile-first meme landing screen with a cartoon boss in a suit. The user enters a boss name, selects/captures a photo, sees processing/preview state, and can press PLAY only when required data and assets are ready.

### Scope

- Vue/Vite/TypeScript foundation
- Game state foundation
- Landing screen
- Suit character placeholder
- Boss-name validation
- Photo input validation shell
- Privacy notice
- Sound/vibration settings
- PLAY enabled rules

### Out of scope

- Final face detection
- PixiJS gameplay
- Face deformation
- Scoring/result/export

### Acceptance criteria

- Suit character is visible on first load.
- Boss name is trimmed, required, and limited to 30 characters.
- JPG/PNG/WEBP up to 10 MB are accepted.
- PLAY stays disabled until name, processed face, and assets are ready.
- No horizontal overflow at 360 px.
- `pnpm build` succeeds.

### Verification

- Run harness check.
- Run `pnpm build`.
- Test mobile and desktop layouts.
- Test invalid names and files.


---

## F-002 — Face detection, crop, and preview

State: done
Priority: P0

### Behavior

Detect the largest face locally, crop/mask it, and preview it on the suit character with transform controls.

### Scope

- Lazy-load MediaPipe
- Resize/decode image
- Largest-face selection
- Padded crop and soft mask
- Object URL lifecycle
- Move/zoom/rotate/reset preview
- Friendly errors

### Out of scope

- Gameplay deformation
- Report export

### Acceptance criteria

- Single face previews successfully.
- No-face image shows retryable error.
- Largest face is selected from multiple faces.
- Old Object URLs are revoked.
- No image data is uploaded or stored.
- `pnpm build` succeeds.

### Verification

- Test single/no/multiple face images.
- Inspect Network and browser storage.
- Replace image repeatedly.


---

## F-003 — PixiJS character scene and lifecycle

State: done
Priority: P0

### Behavior

Render the suit character and processed face with PixiJS, idle animation, responsive sizing, and complete cleanup.

### Scope

- PixiJS app wrapper
- Character renderer
- Face texture placement
- Idle motion
- Resize lifecycle
- Destroy/reset lifecycle

### Out of scope

- Slap input
- Face deformation
- Scoring

### Acceptance criteria

- Character and face render on mobile/desktop.
- Resize keeps alignment.
- Repeated mount/unmount does not duplicate canvas/listeners.
- `pnpm build` succeeds.

### Verification

- Repeat scene entry five times.
- Resize viewport.
- Inspect console/memory.


---

## F-004 — Countdown, timer, tap, and swipe

State: done
Priority: P0

### Behavior

PLAY starts 3-2-1-SLAP and an accurate 15-second round with valid tap/swipe SlapEvents.

### Scope

- Countdown
- performance.now timer
- Pointer Events
- Face hit area
- Tap/swipe classification
- 80 ms cooldown
- Stop at zero

### Out of scope

- Final effects
- Final scoring UI

### Acceptance criteria

- Round lasts about 15 seconds.
- Tap and each swipe create one event.
- Pointermove does not create repeated slaps.
- Outside/expired input is ignored.
- `pnpm build` succeeds.

### Verification

- Test mouse/touch/pointercancel.
- Test input calculations.
- Verify timer.


---

## F-005 — Face deformation and damage levels

State: done
Priority: P0

### Behavior

Each SlapEvent visibly deforms the face with spring recovery and five cartoon damage levels.

### Scope

- Renderer interface
- Mesh/control-point warp
- Region weights
- Head rotation
- Spring recovery
- Five levels

### Out of scope

- Blood
- Realistic injury
- Permanent destructive edits

### Acceptance criteria

- Left/right direction is correct.
- Face recovers near origin.
- Five levels are distinct.
- Texture remains recognizable.
- `pnpm build` succeeds.

### Verification

- Stress-test repeated slaps.
- Test reset/replay.
- Observe FPS and texture stability.


---

## F-006 — Effects, audio, vibration, and hand cursor

State: done
Priority: P1

### Behavior

Slaps trigger hands, comic effects, sound, optional vibration, and a desktop slap-hand cursor shown only during gameplay.

### Scope

- READY/DRAGGING/HITTING cursor
- Desktop fine-pointer detection
- Left/right cursor direction
- Hand animation
- Particles
- Camera shake
- Web Audio
- Vibration

### Out of scope

- Unlicensed assets

### Acceptance criteria

- Desktop gameplay uses hand cursor.
- Cursor resets after gameplay.
- Touch does not show fake cursor.
- Sound/vibration toggles work.
- Effects remain responsive.
- `pnpm build` succeeds.

### Verification

- Test desktop and touch emulation.
- Test unsupported vibration.
- Test replay cleanup.


---

## F-007 — Combo, scoring, rank, and report

State: done
Priority: P0

### Behavior

Track all gameplay metrics and show a Slap Report containing the boss name and rank.

### Scope

- Combo
- HUD
- Damage/stress formulas
- Best slap
- Final score/rank
- Result screen
- SLAP AGAIN
- NEW BOSS

### Out of scope

- Online leaderboard

### Acceptance criteria

- Values stay within documented bounds.
- Combo resets correctly.
- Report contains all metrics.
- Replay keeps boss and resets state.
- New Boss releases image resources.
- `pnpm build` succeeds.

### Verification

- Unit-test formula boundaries.
- Test replay/new-boss flows.


---

## F-008 — PNG export, share, and local stats

State: done
Priority: P1

### Behavior

Generate a 1080x1350 report PNG, share when supported, download otherwise, and store only safe statistics/settings.

### Scope

- Canvas export
- PNG download
- Web Share capability check
- Fallback
- LocalStats

### Out of scope

- Public link
- Server storage

### Acceptance criteria

- PNG includes character, name, metrics, rank, and branding.
- Share fallback works.
- Storage contains no image/base64/File/Blob/landmarks.
- `pnpm build` succeeds.

### Verification

- Test download/share branches.
- Inspect localStorage.


---

## F-009 — Privacy, errors, accessibility, and performance

State: done
Priority: P1

### Behavior

Harden the complete game for privacy, failures, accessibility, mobile performance, and repeated sessions.

### Scope

- Error states
- Focus/labels
- Reduced motion consideration
- Cleanup audit
- Privacy audit
- Performance optimization
- Fallback messaging

### Out of scope

- Major visual redesign

### Acceptance criteria

- No photo upload request exists.
- Failures provide recovery.
- Repeated sessions do not duplicate resources.
- Keyboard/focus is usable.
- Mobile gameplay remains smooth.
- `pnpm build` succeeds.

### Verification

- Use Network/Application/Performance/Memory tools.
- Run regression cases.


---

## F-010 — Deployment and release verification

State: done
Priority: P1

### Behavior

Prepare a verified static production build for Cloudflare Pages.

### Scope

- Production build
- Static asset paths
- README
- Cloudflare settings
- Release checklist

### Out of scope

- Paid hosting
- Backend

### Acceptance criteria

- `dist/` builds successfully.
- Production preview loads assets/models.
- Deployment settings are documented.
- Release record is complete.

### Verification

- Run build and preview.
- Verify deployed refresh and assets.


---

## F-011 — MediaPipe Face Mesh deformation pipeline

State: blocked
Priority: P0

### Behavior

Replace the oval face sprite with a real MediaPipe landmark mesh rendered by PixiJS MeshSimple, with region-specific slap deformation and spring recovery.

### Scope

- Preserve one-time local MediaPipe detection.
- Store landmarks and mesh data in the shared face/profile data used by landing and gameplay.
- Build UVs, triangle indices, regions, rest vertices, current vertices, and velocities once after upload.
- Render uploaded face through PixiJS mesh during gameplay.
- Deform vertices by region, hit position, slap direction, power, and damage.
- Reset mesh on replay without deleting the selected boss face.

### Out of scope

- Backend, upload service, database, login, or public photo storage.
- Perfect production artist tuning beyond visible mesh deformation.

### Acceptance criteria

- Uploaded photo produces mesh data from MediaPipe landmarks.
- No default eyes, nose, or mouth are rendered over an uploaded face in gameplay.
- Landing and gameplay use the same processed face profile data.
- Slaps deform different facial regions differently and recover with spring physics.
- UVs and topology are built once, not in the gameplay loop.
- SLAP AGAIN keeps mesh data; NEW BOSS clears face data.
- `pnpm test`, `pnpm typecheck`, and `pnpm build` succeed.

### Verification

- Run `node .\scripts\harness-check.mjs`.
- Run `pnpm test`.
- Run `pnpm typecheck`.
- Run `pnpm build`.
- Record browser/manual verification limitations honestly.


---

## F-012 — Remove report save and share controls

State: done
Priority: P1

### Behavior

The result screen no longer offers Save Report or Share actions. Players can still review the Slap Report metrics, play again, or start with a new boss.

### Scope

- Remove save report and share controls from the result screen.
- Remove now-unused report export/download code if no longer referenced.
- Keep scoring, result metrics, replay, new boss, settings, and safe local stats behavior unchanged.

### Out of scope

- Backend, upload service, database, login, public links, or public photo storage.
- Major result screen redesign.
- Changes to gameplay scoring or face processing.

### Acceptance criteria

- Result screen contains no Save Report or Share button/action.
- No report PNG export/download/share code remains reachable from the app UI.
- Slap Report metrics remain visible.
- SLAP AGAIN and NEW BOSS still work.
- `pnpm test`, `pnpm typecheck`, and `pnpm build` succeed.

### Verification

- Run `node .\scripts\harness-check.mjs`.
- Run `pnpm test`.
- Run `pnpm typecheck`.
- Run `pnpm build`.


---

## F-013 — Cartoon bruise effects on slapped face

State: cancelled
Priority: P1

### Behavior

Gameplay shows cartoon bruise marks on the uploaded boss face as damage increases, while staying non-realistic and avoiding blood or gore.

### Scope

- Add stylized bruise overlays to the PixiJS gameplay face renderer.
- Scale bruise visibility with current face damage and slap direction.
- Keep replay reset and new boss cleanup behavior intact.
- Keep photo processing local and avoid storing image data.

### Out of scope

- Realistic wounds, blood, gore, or identity-targeted insults.
- Backend, upload service, database, login, or public photo storage.
- Re-running MediaPipe during gameplay.

### Acceptance criteria

- Bruise effects are visible at higher damage levels.
- Bruise effects are cartoon/stylized, not realistic injury.
- Bruise effects reset for SLAP AGAIN and clean up with the PixiJS renderer.
- No photo bytes/base64/File/Blob/landmarks are logged or persisted.
- `pnpm test`, `pnpm typecheck`, and `pnpm build` succeed.

### Verification

- Run `node .\scripts\harness-check.mjs`.
- Run `pnpm test`.
- Run `pnpm typecheck`.
- Run `pnpm build`.
- Record browser/manual verification limitations honestly.


---

## F-014 — Remove cartoon bruise effects

State: done
Priority: P1

### Behavior

Gameplay no longer shows the cartoon bruise overlay that was added in F-013. Existing face mesh deformation, slap effects, replay, and new boss behavior remain unchanged.

### Scope

- Remove the F-013 bruise overlay from the PixiJS face renderer.
- Remove now-unused bruise utility code, tests, and visual state fields.
- Keep existing slap deformation, eye effects, scoring, and result screen behavior unchanged.

### Out of scope

- Restoring report save/share.
- Major gameplay or renderer refactors.
- Backend, upload service, database, login, or public photo storage.

### Acceptance criteria

- No bruise overlay code remains in the gameplay renderer.
- No bruise utility or tests remain.
- Existing face deformation and slap impact effects still compile.
- `pnpm test`, `pnpm typecheck`, and `pnpm build` succeed.

### Verification

- Run `node .\scripts\harness-check.mjs`.
- Run `pnpm test`.
- Run `pnpm typecheck`.
- Run `pnpm build`.


---

## F-015 — Slightly longer slap effects

State: done
Priority: P1

### Behavior

Slap visual feedback lasts slightly longer so the head recoil, comic impact particles/text, and desktop hitting cursor feel less abrupt.

### Scope

- Increase PixiJS slap recoil duration modestly.
- Slow impact particle/text fade modestly.
- Keep scoring, input timing, round duration, and face processing unchanged.
- Keep cleanup behavior for particles and runtime destroy intact.

### Out of scope

- New visual effects or bruises.
- Changes to damage/scoring formulas.
- Backend, upload service, database, login, or public photo storage.

### Acceptance criteria

- Slap effects linger a little longer than before.
- Repeated slaps still clean up expired particles.
- Input cooldown and 15-second round timing are unchanged.
- `pnpm test`, `pnpm typecheck`, and `pnpm build` succeed.

### Verification

- Run `node .\scripts\harness-check.mjs`.
- Run `pnpm test`.
- Run `pnpm typecheck`.
- Run `pnpm build`.


---

## F-016 — Cartoon character favicon

State: done
Priority: P2

### Behavior

The website favicon shows a simple cartoon boss character instead of the default icon.

### Scope

- Replace the existing static favicon asset with an original cartoon character SVG.
- Keep the existing `/favicon.svg` link contract unchanged.
- Avoid using uploaded user photos or generated personal image data.

### Out of scope

- App UI redesign.
- Runtime image processing changes.
- Backend, upload service, database, login, or public photo storage.

### Acceptance criteria

- `public/favicon.svg` contains a cartoon character icon.
- `index.html` continues to reference `/favicon.svg`.
- The favicon asset is static and contains no user photo data.
- `pnpm build` succeeds.

### Verification

- Run `node .\scripts\harness-check.mjs`.
- Run `pnpm build`.


---

## F-017 — Animated gameplay combo badge

State: done
Priority: P1

### Behavior

During gameplay, combo is removed from the HUD row and appears as a cartoon animated `X1`, `X2`, etc. badge near the upper-right side of the character.

### Scope

- Remove the combo stat card from the gameplay HUD.
- Add a top-right animated combo badge using the existing combo state.
- Keep combo scoring/reset formulas unchanged.
- Preserve mobile layout and avoid blocking gameplay input.

### Out of scope

- Changes to scoring formulas, input cooldown, round timing, or result report metrics.
- New PixiJS gameplay effects.
- Backend, upload service, database, login, or public photo storage.

### Acceptance criteria

- Gameplay HUD no longer contains the Combo stat card.
- Combo appears as `Xn` in a cartoon-style badge near the character's upper-right side during gameplay.
- The combo badge animates when the displayed combo changes.
- Badge does not intercept gameplay pointer input.
- `pnpm test`, `pnpm typecheck`, and `pnpm build` succeed.

### Verification

- Run `node .\scripts\harness-check.mjs`.
- Run `pnpm test`.
- Run `pnpm typecheck`.
- Run `pnpm build`.


---

## F-018 — Harder scoring progression

State: done
Priority: P1

### Behavior

Gameplay scoring is harder so high damage, high stress release, and top ranks require stronger sustained play.

### Scope

- Tune score/damage/stress formulas to progress more slowly.
- Keep score and metric ranges capped at 0-100.
- Keep combo timing, input behavior, 15-second round duration, and result metrics unchanged.
- Update formula documentation and unit tests.

### Out of scope

- Changing round duration, input cooldown, face processing, or PixiJS visual effects.
- New leaderboard, backend, database, login, or public photo storage.

### Acceptance criteria

- Final score remains capped at 100.
- Low/no activity still scores low.
- Strong performance can still reach high ranks, but requires more effort than before.
- Existing result metrics and rank labels remain.
- `pnpm test`, `pnpm typecheck`, and `pnpm build` succeed.

### Verification

- Run `node .\scripts\harness-check.mjs`.
- Run `pnpm test`.
- Run `pnpm typecheck`.
- Run `pnpm build`.


---

## F-019 — Expanded score ranks

State: active
Priority: P1

### Behavior

The result screen can show seven score ranks instead of five, giving players two additional achievement tiers.

### Scope

- Add two new `rankForScore` tiers.
- Keep final score calculation and 0-100 score range unchanged.
- Update product rank documentation and unit tests.

### Out of scope

- Changing scoring formulas, input behavior, round duration, or result layout.
- Backend, upload service, database, login, or public photo storage.

### Acceptance criteria

- `rankForScore` returns seven distinct ranks across 0-100.
- Existing result screen continues to display the returned rank.
- Product rank documentation matches code.
- `pnpm test`, `pnpm typecheck`, and `pnpm build` succeed.

### Verification

- Run `node .\scripts\harness-check.mjs`.
- Run `pnpm test`.
- Run `pnpm typecheck`.
- Run `pnpm build`.
