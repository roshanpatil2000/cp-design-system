// Fails if a worklet in the built native bundle references an imported module object.
// Such a worklet captures the whole module and crashes on device with
// "[Worklets] Cannot copy value of type ...". Use src/motion/worklet.native.ts instead.
// Run after `yarn build`: yarn check:worklets
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist/native/index.js');
const code = readFileSync(file, 'utf8');
const MODULE_REF = /\bimport_[A-Za-z0-9_$]+\./g;

/** Returns the body of the function whose directive prologue starts at `index`. */
function functionBody(index) {
  const open = code.lastIndexOf('{', index);
  let depth = 0;
  for (let i = open; i < code.length; i++) {
    if (code[i] === '{') depth++;
    else if (code[i] === '}' && --depth === 0) return code.slice(open, i + 1);
  }
  throw new Error(`Unbalanced braces after offset ${open}`);
}

const problems = [];
let worklets = 0;
for (const match of code.matchAll(/["']worklet["'];/g)) {
  worklets++;
  const body = functionBody(match.index);
  const refs = [...new Set(body.match(MODULE_REF) ?? [])];
  if (refs.length) {
    const line = code.slice(0, match.index).split('\n').length;
    problems.push(`  dist/native/index.js:${line} uses ${refs.join(', ')}`);
  }
}

if (worklets === 0) {
  console.error('check-worklets: no worklets found; is dist/native/index.js built?');
  process.exit(1);
}
if (problems.length) {
  console.error(
    `check-worklets: ${problems.length} worklet(s) capture a whole module and will crash on device.\n` +
      `Import the function from src/motion/worklet.native.ts instead.\n${problems.join('\n')}`,
  );
  process.exit(1);
}
console.log(`check-worklets: ${worklets} worklets OK`);
