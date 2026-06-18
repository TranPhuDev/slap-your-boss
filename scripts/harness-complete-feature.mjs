import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';

const path = 'harness/FEATURE_LIST.md';
const text = await readFile(path, 'utf8');
const active = [...text.matchAll(/^State:\s*active\s*$/gm)];

if (active.length !== 1) {
  console.error(`Expected exactly one active feature, found ${active.length}.`);
  process.exit(1);
}

const activeIndex = active[0].index ?? -1;
const headings = [...text.matchAll(/^##\s+(F-[A-Z0-9-]+)\s+—\s+(.+)$/gm)];
const heading = [...headings].reverse().find((item) => (item.index ?? 0) < activeIndex);
if (!heading) {
  console.error('Could not identify active feature.');
  process.exit(1);
}

const updated =
  text.slice(0, activeIndex) +
  'State: done' +
  text.slice(activeIndex + active[0][0].length);

await writeFile(path, updated, 'utf8');
console.log(`Marked ${heading[1]} — ${heading[2].trim()} as done.`);
console.log('No next feature was activated automatically.');
