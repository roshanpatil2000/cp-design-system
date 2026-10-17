// Prints the CHANGELOG.md section for one version (used as the GitHub Release notes).
// Usage: node scripts/changelog-notes.mjs 0.6.1
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const version = process.argv[2];
if (!version) throw new Error('Usage: node scripts/changelog-notes.mjs <version>');

const changelog = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '..', 'CHANGELOG.md'),
  'utf8',
);
const sections = changelog.split(/^## /m).slice(1);
const section = sections.find((s) => s.startsWith(`${version} `) || s.startsWith(`${version}\n`));
if (!section) throw new Error(`No CHANGELOG.md section for ${version}`);

const body = section.slice(section.indexOf('\n') + 1).trim();
const install = `\`\`\`bash\nyarn add cp-design-system@${version}\n\`\`\``;
const links = `[npm](https://www.npmjs.com/package/cp-design-system/v/${version}) · [Docs and demos](https://roshanpatil2000.github.io/cp-design-system/)`;
process.stdout.write(`${body}\n\n${install}\n\n${links}\n`);
