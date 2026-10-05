import { useEffect, useRef, type ReactNode } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
  type LinksFunction,
} from 'react-router';
import logoUrl from '~/assets/logo.svg';
import { AppShell } from '~/components/AppShell';
import { Banner } from '~/components/Banner';
import { glyphs } from '~/components/glyphs';
import { Icon } from '~/components/Icon';
import { Logo } from '~/components/Logo';
import { SearchField } from '~/components/SearchField';
import { Sidebar } from '~/components/Sidebar';
import { SkipLink } from '~/components/SkipLink';
import { TabBar } from '~/components/TabBar';
import { site } from '~/site';
import globalStyles from '~/styles/global.css?url';
import proseStyles from '~/styles/prose.css?url';
import type { Route } from './+types/root';

const MAIN_ID = 'content';
const SEARCH_PATH = '/search/';
const SEARCH_PARAM = 'q';
/** Pause after the last keystroke before results are fetched. */
const SEARCH_DEBOUNCE_MS = 250;

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: globalStyles },
  { rel: 'stylesheet', href: proseStyles },
  { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
  { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  { rel: 'manifest', href: '/manifest.webmanifest' },
];

/*
 * Google Analytics, loaded only for readers who have not asked to be left
 * alone (Do Not Track), and only in production. Page views on client-side
 * navigation are picked up by GA4's own history listener.
 *
 * A fixed literal apart from the measurement id, which is a public constant —
 * nothing here is derived from a request.
 */
const analyticsScript = `
if (navigator.doNotTrack !== '1' && window.doNotTrack !== '1') {
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${site.analyticsId}', { anonymize_ip: true, cookie_expires: 0 });
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=${site.analyticsId}';
  document.head.appendChild(s);
}`;

const tabGlyphs = {
  home: glyphs.home,
  article: glyphs.article,
  question: glyphs.question,
  contact: glyphs.contact,
} as const;

/**
 * Search as you type: a debounced navigation to the results page.
 *
 * The search field is an ordinary GET form and works without this. With it,
 * typing updates the results in place — and, because only the route's content
 * is replaced, the field keeps its focus and caret while it happens.
 */
const useLiveSearch = (): ((value: string) => void) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(
    () => () => {
      clearTimeout(timer.current);
    },
    [],
  );

  return (value) => {
    clearTimeout(timer.current);

    const query = value.trim();
    const onResults = pathname === SEARCH_PATH;
    // Clearing the field elsewhere on the site should not send the reader anywhere.
    if (query === '' && !onResults) return;

    timer.current = setTimeout(() => {
      const search = query === '' ? '' : `?${new URLSearchParams({ [SEARCH_PARAM]: query })}`;
      // One history entry for a whole search, not one per keystroke.
      void navigate(`${SEARCH_PATH}${search}`, { replace: onResults });
    }, SEARCH_DEBOUNCE_MS);
  };
};

export const Layout = ({ children }: { children: ReactNode }) => {
  const { pathname, search } = useLocation();
  const onSearch = useLiveSearch();
  const query =
    pathname === SEARCH_PATH ? (new URLSearchParams(search).get(SEARCH_PARAM) ?? '') : '';

  return (
    <html lang={site.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={site.themeColor} />
        <meta name="yandex-verification" content={site.yandexVerification} />
        <Meta />
        <Links />
        {import.meta.env.PROD ? (
          <script dangerouslySetInnerHTML={{ __html: analyticsScript }} />
        ) : null}
      </head>
      <body>
        <AppShell
          mainId={MAIN_ID}
          skipLink={<SkipLink href={`#${MAIN_ID}`}>Перейти к содержимому</SkipLink>}
          sidebar={
            <Sidebar
              label="Основная навигация"
              brand={
                <Logo
                  src={logoUrl}
                  alt={site.name}
                  height="60px"
                  to="/"
                  hint="Перейти на главную страницу"
                />
              }
              items={site.navigation}
              footer={
                <>
                  <p>Сайт адаптирован для слабовидящих, сделаем интернет чуточку доступнее.</p>
                  <Icon glyph={glyphs.accessibility} size="36px" />
                </>
              }
            >
              <SearchField
                // Remounting on a new URL query keeps the field in step with
                // back/forward navigation without making it controlled.
                key={pathname === SEARCH_PATH ? 'results' : 'elsewhere'}
                action={SEARCH_PATH}
                name={SEARCH_PARAM}
                label="Искать"
                placeholder="Например, WordPress"
                submitLabel="Найти"
                defaultValue={query}
                onValueChange={onSearch}
              />
            </Sidebar>
          }
          tabBar={
            <TabBar
              label="Основная навигация"
              items={[
                ...site.navigation.map((item) => ({
                  to: item.to,
                  label: item.shortLabel,
                  glyph: tabGlyphs[item.icon],
                })),
                { to: SEARCH_PATH, label: 'Поиск', glyph: glyphs.search },
              ]}
            />
          }
        >
          {children}
        </AppShell>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default function App() {
  return <Outlet />;
}

/**
 * Shown when rendering or loading fails unexpectedly.
 *
 * A missing page is not an error and never reaches this: unknown URLs are
 * matched by routes that render a proper 404 with suggestions.
 */
export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  const status = isRouteErrorResponse(error) ? error.status : 500;

  return (
    <>
      <title>{`Ошибка ${status} | ${site.name}`}</title>
      <Banner size="screen" eyebrow={`Ошибка ${status}`} title="Что-то пошло не так">
        <p>
          Попробуйте обновить страницу или <a href="/">вернуться на главную</a>.
        </p>
      </Banner>
    </>
  );
};
