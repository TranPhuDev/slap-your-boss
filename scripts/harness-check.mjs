import { access, readFile } from 'node:fs/promises';
import process from 'node:process';

const requiredFiles = [
  'AGENTS.md',
  'BOOTSTRAP.md',
  'harness/FEATURE_LIST.md',
  'harness/PROGRESS.md',
  'harness/DECISIONS.md',
  'harness/TEST_CASES.md',
  'harness/RISKS.md',
  'docs/product-requirements.md',
  'docs/architecture-rules.md',
  'docs/frontend-rules.md',
  'docs/game-rules.md',
  'docs/face-processing-rules.md',
  'docs/privacy-security-rules.md',
  'docs/asset-rules.md',
  'docs/verification-rules.md',
  'docs/deployment-rules.md',
];

const failures = [];
for (const file of requiredFiles) {
  try {
    await access(file);
  } catch {
    failures.push(`Missing required file: ${file}`);
  }
}

if (failures.length === 0) {
  const text = await readFile('harness/FEATURE_LIST.md', 'utf8');
  const headings = [...text.matchAll(/^##\s+(F-[A-Z0-9-]+)\s+(?:—|â€”)\s+(.+)$/gm)];
  const features = headings.map((heading, index) => {
    const start = heading.index ?? 0;
    const end = headings[index + 1]?.index ?? text.length;
    const block = text.slice(start, end);
    return {
      id: heading[1],
      title: heading[2].trim(),
      state: block.match(/^State:\s*(\w+)\s*$/m)?.[1]?.toLowerCase() ?? '',
      block,
    };
  });

  const allowed = new Set(['planned', 'active', 'blocked', 'done', 'cancelled']);
  for (const feature of features) {
    if (!allowed.has(feature.state)) {
      failures.push(`${feature.id} has invalid or missing State.`);
    }
  }

  const active = features.filter((feature) => feature.state === 'active');
  const allDone = features.length > 0 && features.every((feature) => feature.state === 'done');
  if (active.length !== 1 && !allDone) {
    failures.push(`Expected exactly one active feature during implementation, or all features done for release. Found ${active.length} active.`);
  } else if (active.length === 1) {
    for (const section of ['Behavior', 'Scope', 'Out of scope', 'Acceptance criteria', 'Verification']) {
      if (!new RegExp(`^### ${section}\\s*$`, 'm').test(active[0].block)) {
        failures.push(`${active[0].id} is missing section: ${section}`);
      }
    }
    if (failures.length === 0) {
      console.log('Harness check passed.');
      console.log(`Active feature: ${active[0].id} - ${active[0].title}`);
    }
  } else if (failures.length === 0) {
    console.log('Harness check passed.');
    console.log('Release state: all features done; no active feature.');
  }
}

if (failures.length > 0) {
  console.error('Harness check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
}
