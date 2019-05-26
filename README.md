# Build in Saratov

Demo: https://build-in-saratov.com/  

This is personal web development related blog of freelance developer.

![Website](https://i.giphy.com/media/3HB4HLIicwMxUzBjzJ/giphy.webp)

## Features 

- Built with [Gatsby](http://gatsbyjs.org/), GraphQL & AWS Amplify
- Web safe fonts
- Build-in Google Analytics
- Posts are stored in Markdown
- Social share buttons
- Syntax highlight with Prism.js
- Automatic sitemap, robots.txt generation
- Contact form with Lambda endpoint
- Improved SEO

### Todo list
- [ ] Add PWA functionality
- [ ] Implement comments
- [ ] Fix website navigation on tablets

## Deploy this app (2 options)

### One-click Deploy to the Amplify Console

[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/r007/build-in-saratov)

### Deploy using the Amplify CLI

1. Clone the repo

```sh
git clone https://github.com/r007/build-in-saratov

cd build-in-saratov
```

2. Initialize the Amplify project

```sh
amplify init
```

3. Deploy the back end

```sh
amplify push
```

4. Launch the app

```sh
npm start
```
