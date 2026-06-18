# Agent Task Prompt

```text
Read AGENTS.md and every mandatory harness document before changing code.

Current task:
<DESCRIBE THE USER-VISIBLE BEHAVIOR>

Constraints:
- WIP=1.
- Work only on the single feature marked State: active.
- If none is active, create one with Behavior, Scope, Out of scope, Acceptance criteria, and Verification.
- No backend, database, authentication, or server photo upload.
- No unrelated refactor.
- Preserve client-side photo privacy.

Workflow:
1. Inspect the repository.
2. Run node scripts/harness-check.mjs.
3. Add a concise plan to harness/PROGRESS.md.
4. Implement the smallest complete solution.
5. Run relevant tests and pnpm build.
6. Update PROGRESS, TEST_CASES, and DECISIONS.
7. Report actual files, commands, outcomes, and limitations.

Do not stop at a mockup or explanation. Modify and verify the project.
```
