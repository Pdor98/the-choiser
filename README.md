# The Choiser

The Choiser is a modern interactive web app that mixes mini-games, random generators, and useful tools in a single polished experience. It is built with Next.js and exported as a static site so it can run smoothly on GitHub Pages without any backend.

## Live Demo

[Open the live site](https://pdor98.github.io/the-choiser/)

## Highlights

- dark, responsive UI designed for desktop and mobile
- category-based navigation for Random, Games, and Tools
- interactive mini-games including `TAB-WHO ?`
- static export workflow ready for GitHub Pages deployment

## Included Experiences

### Home

- category hub with direct access to the app sections

### Random

- random number generator
- "what should I do today?" generator

### Games

- `TAB-WHO ?`
- Guess the Number
- Bottle Spin
- Elimination Wheel
- Dice Arena

### Tools

- countdown timer

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion

## Local Development

Run the project locally with:

```bash
npm run dev
```

Useful scripts:

- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run export:pages`

## GitHub Pages

This repository is configured to publish the static export from the `docs/` folder.

Generate the deployable build with:

```bash
npm run export:pages
```

The export script:

- builds the app in static export mode
- rewrites routes and assets for `/the-choiser`
- generates the publishable files into `docs/`
- creates `docs/.nojekyll`

### Publish Steps

1. Push the repository to GitHub.
2. Run `npm run export:pages`.
3. Commit and push the updated `docs/` folder.
4. Open `Settings -> Pages`.
5. Set `Deploy from branch`.
6. Choose `main` and `/docs`.
7. Wait for GitHub Pages to publish the site.

The final URL is:

```text
https://USERNAME.github.io/the-choiser
```

## Notes

- GitHub Pages does not build a Next.js app directly from the raw source tree, so this project publishes the generated static output from `docs/`.
- The local development environment uses a project-local Node 22 binary because Next.js 16 requires Node 20.9 or newer.
