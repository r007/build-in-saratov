import { Form } from 'react-router';
import { Banner } from '~/components/Banner';
import { Button } from '~/components/Button';
import { ResultList } from '~/components/ResultList';
import { Section } from '~/components/Section';
import { Stack } from '~/components/Stack';
import { TextField } from '~/components/TextField';
import { searchPosts } from '~/content/search.server';
import { plural } from '~/plural';
import { pageMeta } from '~/seo';
import type { Route } from './+types/search';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const query = new URL(request.url).searchParams.get('q')?.trim() ?? '';

  return { query, results: await searchPosts(query) };
};

// Result pages are endless variations of the same content; keep them out of indexes.
export const meta: Route.MetaFunction = ({ loaderData: data }) =>
  pageMeta({
    title: data?.query ? `Поиск: ${data.query}` : 'Поиск по сайту',
    path: '/search/',
    index: false,
  });

export default function Search({ loaderData }: Route.ComponentProps) {
  const { query, results } = loaderData;
  const count = results.length;

  return (
    <>
      <Banner
        eyebrow="Поиск"
        title={query ? `Результаты по запросу: ${query}` : 'Поиск по сайту'}
      />
      <Section grow label="Результаты поиска">
        <Stack>
          <Form method="get" role="search">
            <TextField
              // Follows the URL, so it stays in step with the sidebar field and
              // with back/forward navigation.
              key={query}
              label="Что ищем?"
              name="q"
              type="search"
              placeholder="Например, WordPress"
              defaultValue={query}
            />
            <Button type="submit">Найти</Button>
          </Form>

          {/* Announced when it changes, so a screen reader hears that results arrived. */}
          <p role="status">
            {query === ''
              ? 'Введите запрос, чтобы найти статьи.'
              : count === 0
                ? 'Ничего не найдено 🤔'
                : `${plural(count, 'Найдена', 'Найдено', 'Найдено')} ${count} ${plural(count, 'запись', 'записи', 'записей')}.`}
          </p>

          {count > 0 ? (
            <ResultList
              items={results.map((result) => ({
                to: `/${result.slug}/`,
                title: result.title,
                excerpt: result.excerpt,
              }))}
            />
          ) : null}
        </Stack>
      </Section>
    </>
  );
}
