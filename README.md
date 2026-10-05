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
  CodePipeline/CodeBuild (deploys), all defined with CDK
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
infra/          CDK: the website stack and the deploy pipeline
```

Routes read content through `app/content/posts.server.ts` only. Its functions
are async on purpose, so moving posts or comments into a database later changes
that one file.

## Deployment

Two stacks, both in `us-east-1` (CloudFront, its certificate and Lambda@Edge
have to live there). Settings are in the `context` block of `cdk.json`.

| Stack                    | What it is                                               |
| ------------------------ | -------------------------------------------------------- |
| `BuildInSaratovWebsite`  | Distribution, edge function, bucket, certificate, DNS    |
| `BuildInSaratovPipeline` | Builds and deploys the website on every push to `master` |

How a request is served: a CloudFront Function normalises the host and trailing
slash; CloudFront answers from its cache; on a miss the Lambda@Edge function
renders the page and says how long it may be kept (an hour, then served stale
for up to a day while it is refreshed). Every deploy invalidates the cache.

```sh
npm run deploy                          # build, then deploy the website stack
npx cdk deploy BuildInSaratovPipeline   # the pipeline is deployed by hand
```

### Moving from Amplify (one time)

The domain currently points at an Amplify app. Do these in order.

**Before merging this work into `master`:** turn off automatic builds for the
`master` branch of the Amplify app (`d1nkpx6yfwrw1v`, eu-central-1). Amplify
still builds `master` on every push and publishes the `public/` directory —
which now holds only icons — so a merge would replace the live site with an
empty one.

1. **Deploy a preview.** With `"attachDomain": false` in `cdk.json`:

   ```sh
   npm run deploy
   ```

   This creates everything except the DNS records, and issues the certificate.
   The site is at the `DistributionDomainName` printed at the end, marked
   `noindex`. Check it there, including the contact form.

2. **Cut over.** The site is unreachable from the first command until the
   deploy finishes — expect ten to fifteen minutes.

   ```sh
   # Release the domain from Amplify. CloudFront refuses a domain name that
   # another distribution still claims.
   aws amplify delete-domain-association --region eu-central-1 \
     --app-id d1nkpx6yfwrw1v --domain-name build-in-saratov.com
   ```

   Then, in the Route 53 zone, delete the apex `A` record and the `www` `CNAME`
   if Amplify left them behind: CloudFormation will not overwrite records it
   did not create. Leave the `_…` validation records alone.

   Set `"attachDomain": true` in `cdk.json`, run `npm run deploy`, and commit
   the change.

3. **Check the certificate.** In ACM (us-east-1), confirm the new certificate's
   validation records still exist in the zone. Amplify's own certificate used a
   record of the same name; if removing the domain deleted it, re-create it from
   the ACM console, or the certificate will fail to renew in a year.

4. **Set up the pipeline.** It pulls through the existing GitHub connection,
   whose ARN it reads from SSM (the ARN contains the account id, so it is not
   in this repository):

   ```sh
   aws ssm put-parameter --region us-east-1 --type String \
     --name /build-in-saratov/github-connection-arn \
     --value "$(aws codestar-connections list-connections --region us-east-1 \
       --query "Connections[?ConnectionName=='github-connection'].ConnectionArn | [0]" \
       --output text)"

   npx cdk deploy BuildInSaratovPipeline
   ```

   The connection's GitHub App must have access to this repository.

5. **Clean up** once the new site has been live for a while: delete the Amplify
   app, and the old contact form stack (`contact-lambda-dev`, us-east-1).

### Configuration and secrets

The server needs no secrets today: mail is authorised by its IAM role.
Non-secret settings (`cdk.json`) are compiled into the edge bundle, because a
Lambda@Edge function cannot have environment variables.

If a secret is ever needed, it goes in an SSM `SecureString`: give the server
the parameter's _path_ and read the value at run time. It must not enter a
bundle, a CloudFormation template or `cdk.out`.

## License

MIT
