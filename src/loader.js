import { readdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

// Import the default export of every .js file in a directory (skipping _private.js files).
export async function loadModules(dir) {
  const files = (await readdir(dir)).filter((f) => f.endsWith('.js') && !f.startsWith('_'));
  return Promise.all(
    files.map(async (file) => (await import(pathToFileURL(path.join(dir, file)).href)).default),
  );
}

export const commandsDir = path.join(import.meta.dirname, 'commands');
export const eventsDir = path.join(import.meta.dirname, 'events');
