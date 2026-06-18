---
name: slap-game-harness
description: Enforces WIP=1, frontend-only architecture, photo privacy, game verification, and harness documentation for Slap Your Boss.
---

# Slap Game Harness Skill

For every implementation or bug-fix task:

1. Read `AGENTS.md`.
2. Run `node scripts/harness-check.mjs`.
3. Read the active feature.
4. Inspect existing code before editing.
5. Make the smallest complete in-scope change.
6. Protect photo privacy.
7. Clean up browser and PixiJS resources.
8. Run verification and `pnpm build`.
9. Update progress, tests, and decisions.

Hard constraints:

- WIP=1.
- Frontend-only.
- No photo leaves the device.
- No image/base64/landmarks in storage.
- No face detection in gameplay loop.
- No completion claim without real verification.
