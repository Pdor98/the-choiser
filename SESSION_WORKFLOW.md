# Session Workflow

Questa repo usa tre collegamenti operativi principali:

- Docker locale su `http://localhost:3000`
- GitHub su `Pdor98/the-choiser`
- GitHub Pages pubblicato da `main` tramite `docs/`

## Docker

Per lavorare sempre sulla stessa istanza locale:

```bash
npm run docker:up
```

Questo avvia `choiser-sim` in modalita sviluppo con il codice locale montato dentro il container, cosi le modifiche fatte in `src/` arrivano sulla `3000` senza ricostruire ogni volta l'immagine di produzione.

Comandi utili:

```bash
npm run docker:logs
npm run docker:down
```

## GitHub

Il repository remoto e:

```text
https://github.com/Pdor98/the-choiser.git
```

Workflow pratico:

1. lavora in locale
2. verifica su `http://localhost:3000`
3. esegui `npm run release:check` prima della pubblicazione
4. fai commit e push del codice
5. se stai pubblicando online, assicurati che `docs/` sia aggiornata

## GitHub Pages

La versione online pubblica legge da:

- branch `main`
- cartella `docs/`

Comandi:

```bash
npm run export:pages
npm run preview:pages
```

Preview locale build pubblicabile:

```text
http://127.0.0.1:4173/the-choiser/
```

## Chiusura sessione

Quando chiudiamo la sessione, il closeout standard deve essere:

1. backup del progetto su iCloud
2. verifica finale locale della modifica richiesta
3. commit delle modifiche da tenere
4. push su GitHub
5. se la modifica va pubblicata online, aggiornamento di `docs/` e pubblicazione

## Continuita sessione

Per evitare di perdere contesto quando Codex apre una chat nuova:

1. leggere `AGENTS.md`
2. leggere `SESSION_STATE.md`
3. eseguire `npm run session:resume` se la vecchia chat non e visibile

Questo permette di recuperare:

- percorso dei transcript locali di Codex
- ultimi prompt utente rilevanti per Choiser
- regole operative gia concordate per questa repo

## Regola pratica

Quando finisce una modifica, condividere sempre il link diretto della pagina da verificare.
