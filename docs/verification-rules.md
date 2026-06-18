# Verification Rules

Minimum commands before completion:

```bash
node scripts/harness-check.mjs
pnpm build
```

Use the active feature's Verification section.

Record actual outcomes in PROGRESS and TEST_CASES.

For image work inspect:

- Network
- local/session storage
- IndexedDB
- console
- repeated photo replacement

For game work repeat sessions to detect duplicate listeners, canvases, timers, audio, and retained textures.

Do not claim build/test success without actual successful execution.
