import type { ServerBuild } from 'react-router';
// Produced by `react-router build`; it has to exist before this is bundled.
// @ts-expect-error -- emitted JavaScript without type declarations
import * as build from '../build/server/index.js';
import { createRequestHandler } from './createRequestHandler.ts';

/**
 * The Lambda@Edge entry point: CloudFront's origin-request event in, a
 * rendered page out. Bundled by CDK (`infra/lib/website-stack.ts`).
 *
 * The build is emitted JavaScript with no declarations, so its inferred shape
 * does not line up with `ServerBuild` even though it is exactly that; the
 * assertion states the contract with the build step.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-unnecessary-type-assertion -- generated artifact without declarations; see above
export const handler = createRequestHandler({ build: build as unknown as ServerBuild });
