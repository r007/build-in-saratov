import type { Config } from '@react-router/dev/config';

export default {
  // Every page is rendered on the server (a Lambda@Edge in production) and
  // then cached by CloudFront, so readers get static-site speed while the
  // site keeps a server for forms, search and, later, comments.
  ssr: true,

  // The whole route table ships with the first page. With ten routes that is
  // a few hundred bytes, and it saves the `/__manifest` request the default
  // (lazy) mode makes before the first client-side navigation.
  routeDiscovery: { mode: 'initial' },
} satisfies Config;
