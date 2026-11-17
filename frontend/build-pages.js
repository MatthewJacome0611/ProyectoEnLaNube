import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const frontendDirectory = dirname(fileURLToPath(import.meta.url));
const outputDirectory = join(frontendDirectory, 'dist');

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of ['index.html', 'config.js', 'app.js', 'styles.css']) {
  await cp(join(frontendDirectory, file), join(outputDirectory, file));
}
