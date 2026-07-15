# Session State

Last updated: 2026-07-15

## Project Identity

- Project: Choiser / The Choiser
- Primary local repo: `/Users/Davide/Projects/Choiser-local`
- Legacy local repo path in older chats: `/Users/Davide/Documents/progetto`
- Remote GitHub repo: `https://github.com/Pdor98/the-choiser.git`
- Live site: `https://pdor98.github.io/the-choiser/`
- Main working branch: `develop`

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Docker workflow on `http://localhost:3000`

## Latest Published State

- Published online on 2026-07-15 from `main` after regenerating `docs/`.
- Live site: `https://pdor98.github.io/the-choiser/`
- Home, Random, Games and Tools now use the newer editorial / scroll-story composition shipped in this release.
- `TAB-WHO?` now supports a local room mode in the Next.js runtime:
  - create room
  - join with code
  - synchronized card / score / round state across devices on the same local service
- Important: the room mode is intentionally disabled in the GitHub Pages export because `docs/` is static and cannot serve Next API routes.
- `scripts/export-github-pages.mjs` temporarily excludes `src/app/api` and forces `NEXT_PUBLIC_TABWHO_ROOM_ENABLED=false` during Pages export so the public build stays static-compatible.
- Note: on 2026-05-12, `origin/develop` had been force-updated to unrelated `CustodeAI` commits. Do not force-push local `develop` over it without first checking repo intent.

## Durable User Preferences

- Work locally in this repo by default.
- Do not make the user reconstruct old context if it can be recovered locally.
- If a requested visual change is not being understood well, stop and realign instead of pushing multiple speculative edits.
- Prefer clarification formats like:
  - `adesso succede / io lo voglio cosi`
  - `non voglio / voglio`
  - `all'inizio / durante / alla fine`
  - one change at a time
- When closing a session, the standard expectation is:
  - backup to iCloud
  - final local verification of the requested change
  - commit saved changes
  - push to GitHub
  - if publishing is requested, update `docs/` and publish online

## Continuity Files

- Workflow reference: `SESSION_WORKFLOW.md`
- Repo-level startup rules for future Codex sessions: `AGENTS.md`
- Durable project memory: `PROJECT_MEMORY.md`
- Working communication rules: `WORKING_RULES.md`
- ChatGPT app bridge template: `CHATGPT_HANDOFF_TEMPLATE.md`
- Resume helper: `npm run session:resume`

## Known Codex Session Files

- `/Users/Davide/.codex/archived_sessions/rollout-2026-04-10T14-53-07-019d7774-0d03-7e51-bee2-3959d4f365bb.jsonl`
- `/Users/Davide/.codex/sessions/2026/04/10/rollout-2026-04-10T15-15-47-019d7788-cf76-7fe2-b5fc-3ba2ce9d4cf3.jsonl`
- `/Users/Davide/.codex/sessions/2026/04/18/rollout-2026-04-18T12-01-52-019da00a-2648-7c30-86d4-09e9dc16fb4b.jsonl`
- `/Users/Davide/.codex/sessions/2026/04/21/rollout-2026-04-21T15-42-10-019db046-e8c0-7352-aac4-b8734f2e7c57.jsonl`

## Recovered Historical Prompts

- Build Choiser as a production-quality Next.js + TypeScript + App Router + Tailwind project.
- Run the project in Docker and show the local simulation.
- Fix navbar bugs across all pages.
- Continue from the previous chat instead of restarting.
- Fix the login bug and explain what changed.
- Keep working locally and, when closing a session, back up to iCloud and publish saved changes online.
- Make the navbar move out of the way while scrolling on all pages.
- Save everything to cloud and put it online before closing the session.

## Quick Start For A Fresh Session

1. Read `SESSION_WORKFLOW.md`.
2. Read `SESSION_STATE.md`.
3. Read `PROJECT_MEMORY.md`.
4. Read `WORKING_RULES.md`.
5. Run `git status`.
6. If old chat context is missing, run `npm run session:resume`.
7. Continue from recovered repo context before asking the user to repeat prior instructions.
