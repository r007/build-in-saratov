import { createDOMRenderer, RendererProvider } from '@griffel/react';
import { compareCSSQueries } from '@griffel/sort-css-queries';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

/*
 * Configured the same way as the renderer in `entry.server.tsx`, and it has to
 * stay that way: rules added in the browser are inserted relative to the ones
 * the server sent, so two different orderings would fight over the cascade.
 */
const renderer = createDOMRenderer(document, { compareMediaQueries: compareCSSQueries });

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RendererProvider renderer={renderer}>
        <HydratedRouter />
      </RendererProvider>
    </StrictMode>,
  );
});
