# ChatGPT Full Context

Usa questo file quando vuoi passare il progetto a una nuova chat in modo molto piu dettagliato del file breve.

Puoi copiarlo interamente oppure usarlo come base da adattare prima di incollarlo.

---

## Progetto

- Nome: Choiser / The Choiser
- Repo locale: `/Users/Davide/Projects/Choiser-local`
- Repo GitHub: `https://github.com/Pdor98/the-choiser.git`
- Sito live: `https://pdor98.github.io/the-choiser/`
- Branch di lavoro principale: `develop`
- Stack:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - Framer Motion

## Identita del progetto

Choiser deve restare:

- dark
- minimale
- premium
- pulito
- mobile-first

Il sito non deve sembrare rumoroso, infantile o troppo arcade.

Le pagine devono sembrare parte dello stesso sistema visivo.

## Identita cromatiche delle pagine

- Home: piu fredda / blu
- Games: viola-blu
- Tools: verde controllato
- Random: piu calda / burgundy / wine red, ma come accento elegante, non come sfondo dominante

La regola importante e:

- stessa struttura visiva di base tra le pagine
- cambia la tonalita
- non cambia il linguaggio del design

## Regola di collaborazione molto importante

Se una modifica visiva non e capita bene:

- fermarsi
- non fare tanti tentativi di interpretazione
- riallinearsi prima di continuare

Formato preferito per riallinearci:

- adesso succede:
- io lo voglio cosi:
- non voglio che:
- voglio che:
- all'inizio:
- durante:
- alla fine:

Una modifica alla volta.

## Stato pubblicato vs stato locale

### Online

L'ultima versione pubblicata e la release che contiene:

- fix dei CTA mobile principali
- copy updates gia confermati
- struttura generale delle pagine coerente con Choiser

### Locale

Ci sono modifiche locali piu recenti che possono non essere ancora online.

Quando continui il lavoro, considera il repo locale come fonte piu aggiornata rispetto al sito live.

## Modifiche locali attuali da conoscere

### 1. Home - Scroll driven animation v1

Obiettivo:

- rendere la Home piu viva e piu premium
- senza effetti pesanti
- senza cambiare contenuti o struttura

Approccio tecnico:

- file:
  - `/Users/Davide/Projects/Choiser-local/src/components/home/home-scroll-stage.tsx`
  - `/Users/Davide/Projects/Choiser-local/src/app/globals.css`
- logica:
  - listener scroll/resize passivi
  - `requestAnimationFrame`
  - CSS custom properties per presence/focus

Effetto desiderato:

- fade-in
- slide-up leggero
- micro-scale molto discreto
- sezione attiva leggermente piu presente
- mobile piu leggero del desktop

Nota:

- e una v1 pensata per essere rifinita in seguito

### 2. Random - Riequilibrio identita calda

Situazione desiderata:

- Random deve distinguersi dalla Home
- ma non deve rompere la coerenza visiva del sito

Regola chiave:

- il rosso deve essere una luce, non uno sfondo

Modifiche locali:

- file:
  - `/Users/Davide/Projects/Choiser-local/src/app/random/page.tsx`
  - `/Users/Davide/Projects/Choiser-local/src/features/random/random-hub.tsx`

Cosa e stato fatto:

- background base riportato a `#0a0a0a`
- rosso concentrato come radial gradient centrale
- glow ridotto
- saturazione ridotta
- card e moduli riportati piu vicini al sistema dark generale
- il burgundy resta come accento elegante

Regola chiave da non perdere:

- Random deve essere piu calda delle altre
- ma non piu forte delle altre

### 3. Games - Corsa dei cavalli nascosta

Decisione attuale:

- la `Corsa dei cavalli` non convince come direzione della pagina Games
- per ora deve restare nascosta
- il file del gioco puo restare nel repo per tornarci in futuro

Modifica locale:

- file:
  - `/Users/Davide/Projects/Choiser-local/src/app/games/page.tsx`

Cosa e stato fatto:

- rimossa la card dal hub iniziale Games
- rimosso il pannello apribile dalla pagina Games
- il file del gioco resta presente:
  - `/Users/Davide/Projects/Choiser-local/src/features/games/horse-race.tsx`

Regola:

- non rilanciare questo gioco dentro Games senza una richiesta esplicita

### 4. Continuita tra chat

Per non perdere contesto tra Codex e altre chat sono stati creati questi file:

- `/Users/Davide/Projects/Choiser-local/AGENTS.md`
- `/Users/Davide/Projects/Choiser-local/SESSION_STATE.md`
- `/Users/Davide/Projects/Choiser-local/SESSION_WORKFLOW.md`
- `/Users/Davide/Projects/Choiser-local/PROJECT_MEMORY.md`
- `/Users/Davide/Projects/Choiser-local/WORKING_RULES.md`
- `/Users/Davide/Projects/Choiser-local/CHATGPT_HANDOFF_TEMPLATE.md`
- `/Users/Davide/Projects/Choiser-local/CHATGPT_COPY_PASTE.md`

## Strumenti di handoff

### File breve

- `/Users/Davide/Projects/Choiser-local/CHATGPT_COPY_PASTE.md`

Serve quando vuoi un copia-incolla veloce.

### File dettagliato

- `/Users/Davide/Projects/Choiser-local/CHATGPT_FULL_CONTEXT.md`

Serve quando vuoi passare piu contesto e meno rischio di perdita di informazioni.

### Template generico

- `/Users/Davide/Projects/Choiser-local/CHATGPT_HANDOFF_TEMPLATE.md`

Serve come struttura vuota da compilare.

### Pagina locale con tasto copia

Esiste anche una pagina locale per copiare il file breve:

- route locale: `http://localhost:3000/chatgpt-copy`
- file:
  - `/Users/Davide/Projects/Choiser-local/src/app/chatgpt-copy/page.tsx`
  - `/Users/Davide/Projects/Choiser-local/src/components/chatgpt-copy-panel.tsx`

Nota:

- al momento questa pagina usa il file breve, non il file lungo

## Cose da non reinterpretare

- Non rendere Random rosso dominante.
- Non trasformare le pagine in interfacce troppo diverse tra loro.
- Non riportare la `Corsa dei cavalli` dentro Games per adesso.
- Non insistere con piu tentativi se una modifica non e capita bene.
- Se una cosa e molto visiva o di timing, lavorare con:
  - screenshot
  - video
  - `adesso / voglio`
  - `all'inizio / durante / alla fine`

## File utili da leggere prima di lavorare

- `/Users/Davide/Projects/Choiser-local/AGENTS.md`
- `/Users/Davide/Projects/Choiser-local/SESSION_STATE.md`
- `/Users/Davide/Projects/Choiser-local/PROJECT_MEMORY.md`
- `/Users/Davide/Projects/Choiser-local/WORKING_RULES.md`
- `/Users/Davide/Projects/Choiser-local/SESSION_WORKFLOW.md`

## Se devi continuare il lavoro

Lavora cosi:

1. controlla lo stato locale del repo
2. considera il repo locale come piu aggiornato del live se ci sono modifiche non pubblicate
3. mantieni il linguaggio visivo Choiser
4. se una richiesta non e chiara, fermati e riallineati
5. una modifica alla volta

## Prompt operativo consigliato per la nuova chat

Puoi partire da questo:

"Sto lavorando sul progetto Choiser. Prima di proporre modifiche, leggi il contesto che ti ho incollato. Non reinterpretare aggressivamente il design. Mantieni Choiser dark, premium, minimale e coerente tra pagine. Se non capisci bene una modifica visiva, fermati e riallineati con me usando il formato: adesso succede / io lo voglio cosi / all'inizio / durante / alla fine."

---
