# The Choiser

The Choiser is a polished interactive web app with mini-games, random generators, and practical tools. The project is built with Next.js but is also prepared for static export so it can be published on GitHub Pages and opened from phones, tablets, and other devices without a backend.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion

## Local scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run export:pages`

## GitHub Pages setup

This repository is configured to generate a static export into the `docs/` folder. That is the publishable version for GitHub Pages.

### Export the site

Run:

```bash
npm run export:pages
```

This script:

- builds the app in static export mode
- rewrites asset paths for the `/the-choiser` GitHub Pages URL
- generates the deployable site into `docs/`
- creates `docs/.nojekyll`

## How to publish on GitHub Pages

1. Create a GitHub repository named `the-choiser`.
2. Push the whole project to the `main` branch.
3. Run `npm run export:pages`.
4. Commit and push the generated `docs/` folder.
5. Open `Settings -> Pages`.
6. Set:
   - `Source`: `Deploy from branch`
   - `Branch`: `main`
   - `Folder`: `/docs`
7. Save and wait for GitHub Pages to publish the site.

The final URL will be:

```text
https://USERNAME.github.io/the-choiser
```

## Important note

GitHub Pages does not build a Next.js application directly from source when using the repository branch as a static site source. Because of that, this project must publish the generated static output from `docs/`, not the raw source files from the repository root.

## Mobile compatibility

The app is responsive and optimized for modern browsers on:

- phones
- tablets
- desktops

## Environment note

The local setup available during development ships with Node 18, while Next.js 16 requires Node 20.9 or newer. To keep the project runnable without changing the system installation, the scripts use the project-local Node 22 binary provided by the `node` package.
