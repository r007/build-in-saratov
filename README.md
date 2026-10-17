# Build in Saratov

https://build-in-saratov.com/ — a personal blog about web development.

Server-rendered with [React Router](https://reactrouter.com/) at the edge and
cached by CloudFront, so pages load like a static site while the site keeps a
server for the contact form, search and whatever comes next.

## Stack

- **React Router 8** (framework mode) + React 19 + TypeScript, built with Vite
- **Griffel** for component styles; plain CSS for the base and article typography
- **Markdown** posts compiled at build time: Shiki highlighting, responsive WebP images
- **AWS**: CloudFront → Lambda@Edge (rendering) + S3 (assets), SES (contact form),
  all defined with CDK
- No client-side data library, form library, HTTP client or hosted search

## Development

Requires Node 22.22 or newer.

```sh
npm install
npm run dev        # http://localhost:3000
```

| Command             | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Dev server with hot reload; drafts are visible      |
| `npm run build`     | Production build into `build/`                      |
| `npm start`         | Serve the production build locally                  |
| `npm run lint`      | ESLint                                              |
| `npm run typecheck` | Generate route types, then type-check app and infra |
| `npm run format`    | Prettier                                            |

No `.env` is needed. See `.env.example` for the optional settings.

## Writing

A post is a folder in `content/posts/`; the folder name is its URL.

```
content/posts/my-post/
  index.md
  cover.jpg
  diagram.png
```

```md
---
title: Заголовок
date: 2026-01-15T10:00:00+04:00
author: Сергей Монин
image: cover.jpg
tags: [Уроки]
draft: false
---

Текст. ![Подпись под картинкой](./diagram.png)
```

- Images are referenced relative to the post. Each one is resized to several
  WebP widths, and its alt text is shown as the caption.
- The first tag is the post's category. `content/tags.yaml` can give a tag a
  description.
- `draft: true` keeps a post out of production builds; it still shows in `npm run dev`.
- A fenced block with the language `grid|2` lays the images inside it out in two columns.

## Layout

```
app/
  components/   Generic, props-driven UI: Card, Banner, TextField, … No site copy.
  views/        Compositions that know about posts (which card shows what)
  routes/       One file per URL: loader, metadata, page
  content/      The content repository and search index (server only)
  styles/       Design tokens, base CSS, article typography
  site.ts       Everything specific to this site: name, URL, navigation
content/        Posts, authors, tags, images
plugins/content The build-time Markdown and image compiler (a Vite plugin)
server/         The Lambda@Edge adapter: caching, compression, headers
infra/          CDK infrastructure for the website and pipeline
```

Routes read content through `app/content/posts.server.ts` only. Its functions
are async on purpose, so moving posts or comments into a database later changes
that one file.

## License

MIT
