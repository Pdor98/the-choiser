# Choiser Session Rules

This repository is the durable local workspace for Choiser.

## Read First

At the start of every new Codex session in this repo:

1. Read `SESSION_WORKFLOW.md`.
2. Read `SESSION_STATE.md`.
3. If the conversation context looks incomplete, run `npm run session:resume`.

## Repo Identity

- Primary local path: `/Users/Davide/Projects/Choiser-local`
- Legacy local path used by older sessions: `/Users/Davide/Documents/progetto`
- Remote repo: `https://github.com/Pdor98/the-choiser.git`

## Durable User Preferences

- Work locally in this repository by default.
- Avoid asking the user to restate old context if it can be recovered from repo files or local Codex session logs.
- When a session is ending, follow the closeout workflow in `SESSION_WORKFLOW.md`.
- Keep `SESSION_STATE.md` updated when the project state or workflow changes in a meaningful way.

## Continuity

If Codex opens in a fresh chat and the old thread is not visible in the UI, treat `SESSION_STATE.md` plus `npm run session:resume` as the continuity source of truth before asking the user to repeat anything.
