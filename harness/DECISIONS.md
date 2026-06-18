# DECISIONS.md

## ADR-001 - Frontend-only application

Status: accepted  
Date: 2026-06-18

### Decision

Deploy as a static frontend with no backend/database/login.

### Consequences

Photos remain local; no cross-device history or trusted global leaderboard.

---

## ADR-002 - Vue + Vite + TypeScript + PixiJS + MediaPipe

Status: accepted  
Date: 2026-06-18

### Decision

Use Vue for UI, PixiJS for the game scene, and MediaPipe for one-time local face landmarks.

### Consequences

UI/runtime/service boundaries and explicit resource cleanup are required.

---

## ADR-003 - Photo data stays in memory

Status: accepted  
Date: 2026-06-18

### Decision

Use File/Object URL/Canvas data in memory. Never upload or persist image/base64/File/Blob/landmarks.

### Consequences

Refresh loses the current photo; Object URLs must be revoked.

---

## ADR-004 - WIP equals one

Status: accepted  
Date: 2026-06-18

### Decision

Only one feature may be active during implementation.

### Consequences

Smaller diffs, clearer verification, less scope drift.

---

## ADR-005 - Timer truth uses performance.now

Status: accepted  
Date: 2026-06-18

### Decision

Use `performance.now()` for the 15-second round.

---

## ADR-006 - Progressive deformation renderer

Status: accepted  
Date: 2026-06-18

### Decision

Use a PixiJS renderer interface with visible directional skew/scale/head impulse as the MVP deformation path.

### Consequences

The current implementation is visible and recoverable, but full landmark mesh deformation can be added later behind the same runtime boundary.

---

## ADR-007 - Desktop-only slap cursor

Status: accepted  
Date: 2026-06-18

### Decision

Show READY/DRAGGING/HITTING hand cursor only in PLAYING on fine-pointer devices; always restore normal cursor during cleanup.

---

## ADR-008 - Runtime MediaPipe asset loading

Status: accepted  
Date: 2026-06-18

### Decision

Load MediaPipe WASM/model assets from official/static runtime URLs during local face detection.

### Consequences

The app remains frontend-only and does not upload photos, but first detection requires network access to static model assets unless the project later vendors those files under `public/models`.

---

## ADR-009 - Release-state harness check

Status: accepted  
Date: 2026-06-18

### Decision

Allow `scripts/harness-check.mjs` to pass when every feature is `done` and no feature is active.

### Consequences

WIP=1 remains enforced during implementation, while the completed release can honestly represent "no active feature".

---

## ADR-010 - MediaPipe tessellation to PixiJS MeshSimple

Status: accepted  
Date: 2026-06-18

### Decision

Render uploaded faces in gameplay with PixiJS `MeshSimple` using landmarks from one-time MediaPipe Face Landmarker detection. Build UVs and vertices from the face crop, and derive triangle indices from official MediaPipe tessellation connections by finding fully connected 3-edge triangles.

### Consequences

Gameplay updates only vertex positions and velocities, not MediaPipe detection or topology. Browser visual verification is still required for final alignment and tuning with real photos.
