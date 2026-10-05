/**
 * Everything that is specific to *this* site rather than to the code.
 *
 * Components take what they show through props; routes get it from here. Plain
 * data on purpose — no JSX and no imports — so the infrastructure code can read
 * the same values (the domain, most of all) instead of keeping its own copy.
 */
export const site = {
  name: 'Сделано в Саратове',
  shortName: 'Build in Saratov',
  tagline: 'Специалист по веб-разработке.',
  description:
    'Блог веб-разработчика. Всё, что интересует людей, ответы на часто задаваемые вопросы, советы, обзоры. Рассказываю о последних трендах в сайтостроении.',

  /** Canonical origin, no trailing slash. Every indexed URL is built on it. */
  url: 'https://build-in-saratov.com',
  language: 'ru',
  themeColor: '#164194',

  twitter: 'act_as_samurai',
  yandexVerification: '50e6e8ee5aaa1f36',

  /** Public by nature: it travels in every request the tag makes. */
  analyticsId: 'G-5W0DYF99WS',

  /** `shortLabel` is the one-word form used where space is tight. */
  navigation: [
    {
      to: '/',
      label: 'Главная',
      shortLabel: 'Главная',
      hint: 'Перейти на главную страницу',
      icon: 'home',
    },
    {
      to: '/articles/',
      label: 'Статьи',
      shortLabel: 'Статьи',
      hint: 'Прочитать последние записи в блоге',
      icon: 'article',
    },
    {
      to: '/about/',
      label: 'О сайте',
      shortLabel: 'О сайте',
      hint: 'Узнать больше об этом сайте',
      icon: 'question',
    },
    {
      to: '/contact/',
      label: 'Обратная связь',
      shortLabel: 'Контакт',
      hint: 'Связаться со мной',
      icon: 'contact',
    },
  ],
} as const;

export type Site = typeof site;

/** An absolute URL on the canonical origin, for metadata and feeds. */
export const absoluteUrl = (path: string): string => new URL(path, site.url).toString();
