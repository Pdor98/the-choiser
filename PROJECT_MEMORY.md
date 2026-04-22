# Project Memory

Ultimo aggiornamento: 2026-04-22

## Identita progetto

- Nome: Choiser / The Choiser
- Sezioni principali: Home, Random, Games, Tools
- Stack: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- Repo locale: `/Users/Davide/Projects/Choiser-local`
- Repo remoto: `https://github.com/Pdor98/the-choiser.git`
- Sito live: `https://pdor98.github.io/the-choiser/`

## Direzione estetica

- Linguaggio visivo: dark, minimale, premium, pulito, mobile-first
- Home: identita piu fredda / blu
- Games: identita viola-blu
- Tools: identita verde controllata
- Random: identita piu calda / burgundy, ma come accento elegante e non come sfondo dominante

## Decisioni da ricordare

- Se una modifica porta una pagina nella direzione sbagliata, meglio nasconderla o fermarsi che forzarla.
- La `Corsa dei cavalli` per ora deve restare nascosta dalla pagina `Games`; il file puo restare nel repo per un eventuale ritorno futuro.
- Le pagine top-level devono essere coerenti tra loro come struttura e comportamento, cambiando solo il tono cromatico o il contenuto dove richiesto.
- I CTA hero su `Games`, `Random` e `Tools` devono comportarsi in modo coerente anche su mobile.

## Continuita operativa

- Se il contesto della chat manca, leggere prima:
  - `SESSION_STATE.md`
  - `PROJECT_MEMORY.md`
  - `WORKING_RULES.md`
  - `SESSION_WORKFLOW.md`
- Se serve altro contesto, usare `npm run session:resume`.

## Stato di lavoro ricorrente

- Il progetto viene lavorato soprattutto in locale.
- A fine sessione l'aspettativa standard e:
  - backup su iCloud
  - verifica locale
  - commit
  - push
  - pubblicazione online solo se richiesta

## Nota handoff

Se si passa a ChatGPT app o a una nuova chat, usare `CHATGPT_HANDOFF_TEMPLATE.md` per copiare lo stato senza perdere decisioni importanti.
