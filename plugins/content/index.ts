import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import type { Content } from '../../app/content/types.ts';
import { compileContent, type CompileOptions } from './compile.ts';

const VIRTUAL_ID = 'virtual:content';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

export type ContentPluginOptions = Partial<
  Omit<CompileOptions, 'includeDrafts' | 'markdown'> & {
    markdown: Partial<CompileOptions['markdown']>;
  }
>;

/**
 * Exposes the compiled content directory as the module `virtual:content`.
 *
 * Import it only from `.server` modules: it carries the full text of every
 * post for the search index, which has no business in a browser bundle.
 *
 * During development the directory is watched, so saving a Markdown file
 * recompiles it and reloads the page. Drafts are visible in development and
 * left out of production builds entirely — they are not hidden at render time,
 * they are simply not in the bundle.
 */
export const content = (overrides: ContentPluginOptions = {}): Plugin => {
  // Set once Vite has resolved its config; every other hook runs after that.
  let resolved: CompileOptions | undefined = undefined;
  let compiled: Promise<Content> | undefined = undefined;

  const getOptions = (): CompileOptions => {
    if (!resolved) throw new Error('The content plugin was used before Vite resolved its config');
    return resolved;
  };

  const load = async (): Promise<Content> => {
    compiled ??= compileContent(getOptions());
    return await compiled;
  };

  return {
    name: 'build-in-saratov:content',

    configResolved(config) {
      const contentDir = resolve(config.root, overrides.contentDir ?? 'content');

      resolved = {
        contentDir,
        // Inside `public/` so the dev server serves the files as they are, and
        // a build copies them into the client output with everything else.
        mediaDir: resolve(config.root, overrides.mediaDir ?? 'public/media'),
        publicPath: overrides.publicPath ?? '/media',
        locale: overrides.locale ?? 'en',
        includeDrafts: config.command === 'serve',
        coverWidth: overrides.coverWidth ?? 1200,
        avatarWidth: overrides.avatarWidth ?? 96,
        markdown: {
          imageWidth: 1200,
          codeTheme: 'github-dark-high-contrast',
          embedTitle: 'Embedded content',
          tableLabel: 'Table',
          excerptLength: 140,
          ...overrides.markdown,
        },
      };
    },

    /*
     * Compile before anything is bundled, not on first import.
     *
     * The virtual module is only imported by server code, and the server build
     * runs after the client build — which is the one that copies `public/` into
     * the output. Left lazy, a clean checkout would publish a site whose images
     * had not been generated yet.
     */
    async buildStart() {
      if (!getOptions().includeDrafts) await load();
    },

    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
    },

    async load(id) {
      if (id !== RESOLVED_ID) return undefined;

      const data = await load();
      return Object.entries(data)
        .map(([name, value]) => `export const ${name} = ${JSON.stringify(value)};`)
        .join('\n');
    },

    configureServer(server) {
      const { contentDir } = getOptions();
      server.watcher.add(contentDir);

      const onChange = (file: string): void => {
        if (!file.startsWith(contentDir)) return;

        compiled = undefined;
        for (const environment of Object.values(server.environments)) {
          const module = environment.moduleGraph.getModuleById(RESOLVED_ID);
          if (module) environment.moduleGraph.invalidateModule(module);
        }
        server.ws.send({ type: 'full-reload' });
      };

      server.watcher.on('add', onChange);
      server.watcher.on('change', onChange);
      server.watcher.on('unlink', onChange);
    },
  };
};
