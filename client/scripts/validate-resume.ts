import { readFileSync } from 'fs';
import { join } from 'path';
import { validateResumeData } from '../src/utils/validateResumeData';

const dataPath = join(__dirname, '../src/data/resume.master.json');
const raw = JSON.parse(readFileSync(dataPath, 'utf-8'));
const { errors, warnings } = validateResumeData(raw);

for (const w of warnings) {
  console.warn(`  WARN  ${w}`);
}
for (const e of errors) {
  console.error(`  ERROR ${e}`);
}

if (errors.length > 0) {
  console.error(`\nValidation failed: ${errors.length} error(s).`);
  process.exit(1);
}

console.log(`\nValidation passed${warnings.length > 0 ? ` (${warnings.length} warning(s))` : ''}.`);
