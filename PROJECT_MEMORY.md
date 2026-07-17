# Project Memory

Ultimo aggiornamento: 2026-07-15

## Identita progetto

- Nome: Choiser / The Choiser
- Sezioni principali: Home, Random, Games, Tools
- Games attivi: TAB-WHO?, Chi è più probabile che…?, Obbligo o Verità, Gira la Bottiglia, Ruota Elimina-Nomi, Indovina il Numero
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
- `Chi è più probabile che…?` è un gioco sociale semplice nella pagina `Games`, aperto da `/games#most-likely`, con modalità `Normale`, `Piccante soft` e `Deep`.
- Le domande di `Chi è più probabile che…?` devono restare facili da espandere negli array `mostLikelyNormal`, `mostLikelySpicy`, `mostLikelyDeep`.
- `TAB-WHO?` ha ora due modalità:
  - `Solo rapido` dentro la pagina gioco
  - `Stanza locale` con codice e sincronizzazione multi-dispositivo via API Next locali
- La modalità `Stanza locale` funziona in sviluppo / runtime Next, ma non deve apparire nella build GitHub Pages statica.
- La stanza locale ora gestisce anche il turno attivo: l'host può assegnarlo o farlo avanzare, mentre il punteggio e i controlli del round sono disponibili all'host o al giocatore attivo.
- Il lavoro sul turno attivo è locale e non ancora committato; il flusso è stato verificato con due schede browser e server Next attivo.
- La condivisione della stanza locale ora offre un pannello Manuale / QR code dopo la creazione, con QR generato localmente e link/codice come fallback.
- Per usare il QR da un altro dispositivo in LAN, il computer host deve essere raggiunto tramite il proprio indirizzo di rete, non tramite localhost.
- Entrando in Gioca con altri, la stanza host viene creata automaticamente; il join tramite codice, link o QR resta disponibile per gli altri partecipanti.
- Su `origin/develop` è stato rilevato un force update con commit non Choiser/CustodeAI; non fare force push su quel branch senza verifica esplicita.

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
