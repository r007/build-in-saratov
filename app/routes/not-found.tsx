import { data } from 'react-router';
import { listPosts } from '~/content/posts.server';
import { pageMeta } from '~/seo';
import { NotFound } from '~/views/NotFound';
import type { Route } from './+types/not-found';

const SUGGESTIONS = 3;

/** Catches every URL no other route matched and answers it with a real 404. */
export const loader = async () =>
  data({ suggestions: await listPosts({ limit: SUGGESTIONS }) }, { status: 404 });

export const meta: Route.MetaFunction = () =>
  pageMeta({ title: 'Страница не найдена', path: '/', index: false });

export default function NotFoundRoute({ loaderData }: Route.ComponentProps) {
  return <NotFound suggestions={loaderData.suggestions} />;
}
