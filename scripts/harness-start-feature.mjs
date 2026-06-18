import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';

const [, , id, title, behavior] = process.argv;
if (!id || !title || !behavior) {
  console.error('Usage: node scripts/harness-start-feature.mjs F-011 "Title" "User-visible behavior"');
  process.exit(1);
}
if (!/^F-[A-Z0-9-]+$/.test(id)) {
  console.error('Feature ID must match F-XXX.');
  process.exit(1);
}

const path = 'harness/FEATURE_LIST.md';
const text = await readFile(path, 'utf8');

if (new RegExp(`^##\\s+${id}\\s+(?:—|â€”)`, 'm').test(text)) {
  console.error(`${id} already exists.`);
  process.exit(1);
}
if ((text.match(/^State:\s*active\s*$/gm) ?? []).length > 0) {
  console.error('An active feature already exists. Complete or change it first.');
  process.exit(1);
}

const block = `

---

## ${id} — ${title}

State: active
Priority: P1

### Behavior

${behavior.trim()}

### Scope

- Implement the smallest complete change required for this behavior.

### Out of scope

- Unrelated refactors or features.

### Acceptance criteria

- The described behavior works.
- Cleanup and error paths are handled.
- \`pnpm build\` succeeds.

### Verification

- Run \`node scripts/harness-check.mjs\`.
- Run relevant tests.
- Run \`pnpm build\`.
- Record manual verification.
`;

await writeFile(path, text.trimEnd() + block + '\n', 'utf8');
console.log(`Created and activated ${id} — ${title}`);
