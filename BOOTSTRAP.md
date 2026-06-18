# BOOTSTRAP.md

## Root

Run commands from the directory containing `package.json`.

Expected path on the user's Windows machine:

```text
D:\game\slap-your-boss
```

## Runtime

- Node.js 22 recommended
- pnpm
- Modern Chrome/Edge/Firefox/Safari

## Commands

```bash
pnpm install
node scripts/harness-check.mjs
pnpm dev
pnpm build
pnpm preview
```

## Expected runtime dependencies

```text
vue
pixi.js
@mediapipe/tasks-vision
```

## Expected source areas

```text
public/models
public/cursors
public/sounds
public/characters
src/components
src/composables
src/game
src/services
src/types
src/utils
```

## Principles

- No environment secret is required for MVP.
- No backend endpoint is required.
- MediaPipe model files are static assets.
- User photos stay in browser memory.
- Production output is `dist/`.

## First Run

1. Confirm `package.json`.
2. Run `pnpm install`.
3. Run harness check.
4. Run `pnpm build` to establish baseline.
5. Record baseline in `harness/PROGRESS.md`.

## PowerShell

Do not use Bash continuation `\` in PowerShell. Use a single line or backtick.
