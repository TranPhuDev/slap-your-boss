# AGENTS.md

## Project Context

This repository contains **Slap Your Boss**, a 15-second frontend-only cartoon web game.

Stack:

- Vue 3
- TypeScript
- Vite
- PixiJS v8
- MediaPipe Face Landmarker
- Pointer Events
- Web Audio API
- Canvas API
- localStorage for safe non-image settings/statistics only

No login, backend, database, server-side face processing, or public photo storage is allowed.

## Mandatory Reading Before Coding

Read in order:

1. `BOOTSTRAP.md`
2. `harness/FEATURE_LIST.md`
3. `harness/PROGRESS.md`
4. `harness/DECISIONS.md`
5. `harness/TEST_CASES.md`
6. `harness/RISKS.md`
7. `docs/product-requirements.md`
8. `docs/architecture-rules.md`
9. `docs/frontend-rules.md`
10. `docs/game-rules.md`
11. `docs/face-processing-rules.md`
12. `docs/privacy-security-rules.md`
13. `docs/asset-rules.md`
14. `docs/verification-rules.md`
15. `docs/deployment-rules.md`

If a required file is missing or unreadable, stop code changes and report it.

## Active Feature Rule

WIP = 1.

Only work on the feature containing the exact line:

```text
State: active
```

in `harness/FEATURE_LIST.md`.

Before coding:

```bash
node scripts/harness-check.mjs
```

If no feature is active, automatically create/activate a feature for the current task and fill:

- Behavior
- Scope
- Out of scope
- Acceptance criteria
- Verification

Ensure every other feature is not active.

If multiple features are active, fix the harness first. Do not code until exactly one remains active.

## Scope Rules

- Do not refactor outside the active feature.
- Do not add backend, database, Firebase, authentication, or image upload.
- Do not rename public contracts without an explicit requirement.
- Reuse existing project patterns.
- Prefer the smallest complete change.
- Document meaningful architecture changes in `harness/DECISIONS.md`.

## Implementation Rules

- Keep TypeScript strict.
- Avoid `any`; isolate unavoidable external typing gaps.
- Separate Vue UI, PixiJS runtime, face processing, scoring, and export logic.
- Never place the whole game in one component/class.
- Do not run MediaPipe in the gameplay loop.
- Never log image bytes, base64, landmarks, uploaded File objects, or face crops.
- Clean up Object URLs, listeners, timers, RAF, PixiJS resources, and audio nodes.
- Preserve mobile-first behavior and desktop support.
- Cartoon effects only; no blood or realistic injury.

## Workflow

### Before implementation

1. Inspect the repository.
2. Run harness check.
3. Identify the active feature.
4. Read relevant code and tests.
5. Add a short plan to `harness/PROGRESS.md`.
6. Identify cleanup, privacy, and performance risks.

### After implementation

1. Run the active feature verification.
2. Run relevant tests.
3. Run `pnpm build`.
4. Update `harness/TEST_CASES.md` with actual outcomes.
5. Update `harness/PROGRESS.md` with files and commands.
6. Update `harness/DECISIONS.md` when needed.
7. Mark the feature done only when all acceptance criteria pass.
8. Do not auto-activate the next feature unless requested.

## Definition of Done

A feature is done only when:

- acceptance criteria pass;
- build succeeds;
- actual verification is recorded;
- cleanup/replay behavior is checked where relevant;
- no photo is uploaded or improperly persisted;
- limitations are stated honestly.

## Final Report

Report:

1. Active feature and final state.
2. Files created/modified.
3. Behavior implemented.
4. Commands actually run and outcomes.
5. Known limitations/blockers.

Never claim a command passed unless it was executed successfully.
