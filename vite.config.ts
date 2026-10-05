import { resolve } from 'node:path';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig, loadEnv } from 'vite';
import { content } from './plugins/content/index.ts';

/*
 * No build-time Griffel extraction (`@griffel/vite-plugin`), on purpose.
 *
 * It was tried, with 1.0.1. React Router builds every route as its own entry,
 * so the plugin emits one stylesheet per chunk, and the same atomic rule —
 * `.f22iagw{display:flex}` — ends up in several of them. Atomic classes all
 * have the same specificity, so the cascade is decided by order alone: a copy
 * of a base rule in a stylesheet that loads later beats a media query in one
 * that loaded earlier, and a sidebar hidden below 1280px comes back.
 *
 * Styles are therefore generated at run time: rendered into `<head>` by the
 * server (`app/entry.server.tsx`), so the first paint needs no extra request,
 * and inserted in bucket order by Griffel's own renderer in the browser.
 * Revisit if the plugin learns to emit a single sheet across entries.
 */
export default defineConfig(({ mode }) => {
  // Server code reads `process.env`, which Vite does not fill from `.env` on
  // its own. Variables already exported in the shell win over the file.
  for (const [key, value] of Object.entries(loadEnv(mode, import.meta.dirname, ''))) {
    process.env[key] ??= value;
  }

  return {
    plugins: [
      content({
        locale: 'ru-RU',
        markdown: {
          embedTitle: 'Встроенное видео',
          tableLabel: 'Таблица, прокручивается по горизонтали',
        },
      }),
      reactRouter(),
    ],
    resolve: {
      alias: { '~': resolve(import.meta.dirname, 'app') },
    },
    server: { port: 3000 },
  };
});
