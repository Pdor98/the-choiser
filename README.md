# The Choiser

The Choiser e una web app interattiva con mini-giochi, generatori casuali e strumenti utili. Il progetto e sviluppato con Next.js, ma viene pubblicato come sito statico su GitHub Pages tramite export nella cartella `docs/`.

## Link utili

- Sito live: [https://pdor98.github.io/the-choiser/](https://pdor98.github.io/the-choiser/)
- Repository: [https://github.com/Pdor98/the-choiser](https://github.com/Pdor98/the-choiser)

## Struttura del progetto

```text
the-choiser/
├── src/
│   ├── app/                  # pagine e route principali
│   ├── components/           # componenti UI e layout
│   ├── features/             # logiche delle sezioni Games, Random e Tools
│   ├── lib/                  # contenuti e helper condivisi
│   └── styles/               # tema e utility CSS
├── scripts/
│   ├── export-github-pages.mjs
│   └── preview-github-pages.mjs
├── docs/                     # build statica pubblicata da GitHub Pages
├── package.json
├── next.config.ts
└── README.md
```

## Stato reale del progetto

Anche se il sito pubblicato e statico, la sorgente non e piu un progetto HTML/CSS/JS vanilla puro. Oggi The Choiser usa:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion

Questo significa che:

- per sviluppare in locale si usa `npm run dev`
- per generare la versione pubblicabile si usa `npm run export:pages`
- GitHub Pages pubblica il contenuto gia compilato dentro `docs/`

## Lavorare offline in locale

Per sviluppare il progetto senza toccare subito la versione online:

1. Installa le dipendenze se necessario:

```bash
npm install
```

2. Avvia il sito in sviluppo locale:

```bash
npm run dev
```

3. Apri il browser su:

```text
http://localhost:3000
```

Questo e il modo migliore per modificare pagine, componenti e logica del progetto.

## Lavorare in Docker sulla stessa porta

Se vuoi tenere il progetto sempre disponibile su `http://localhost:3000` tramite container, usa:

```bash
npm run docker:up
```

Questo flusso monta il codice locale dentro `choiser-sim` e usa Next.js in sviluppo, quindi le modifiche in `src/` vengono riflesse nella stessa istanza Docker senza dover ricostruire ogni volta la build di produzione.

Comandi utili:

```bash
npm run docker:logs
npm run docker:down
```

## Testare in locale la versione GitHub Pages

Quando vuoi controllare esattamente cosa verra pubblicato online:

1. Genera la build statica:

```bash
npm run export:pages
```

2. Avvia l'anteprima locale della cartella `docs` con il base path corretto:

```bash
npm run preview:pages
```

3. Apri:

```text
http://127.0.0.1:4173/the-choiser/
```

Nota importante:

- non e consigliato aprire `docs/index.html` con doppio click
- GitHub Pages usa il base path `/the-choiser`, quindi la preview corretta va fatta tramite server locale

## Comandi disponibili

- `npm run dev` avvia l'ambiente di sviluppo locale
- `npm run build` compila l'app
- `npm run lint` controlla il codice
- `npm run typecheck` controlla i tipi TypeScript
- `npm run export:pages` rigenera `docs/` per GitHub Pages
- `npm run preview:pages` mostra in locale la build statica di `docs/`
- `npm run release:check` esegue lint, typecheck ed export finale

## Workflow consigliato

Per non rompere il sito pubblico, il flusso piu semplice e sicuro e questo:

1. lavori sul branch `develop`
2. testi in locale con `npm run dev`
3. fai il controllo finale con `npm run release:check`
4. provi la build pubblicabile con `npm run preview:pages`
5. salvi tutto con commit chiaro
6. fai push su `develop`
7. quando e tutto pronto, porti `develop` su `main`
8. fai push di `main`
9. GitHub Pages aggiorna il sito online leggendo `docs/`

## Comandi Git consigliati

Per lavorare in sicurezza:

```bash
git checkout develop
git pull origin develop
git status
git add .
git commit -m "Describe the update clearly"
git push origin develop
```

Quando vuoi pubblicare:

```bash
git checkout main
git pull origin main
git merge develop
npm run release:check
git add .
git commit -m "Publish latest Choiser updates"
git push origin main
```

## GitHub Pages

Il repository e configurato per pubblicare da:

- branch: `main`
- cartella: `/docs`

La presenza di `docs/.nojekyll` evita problemi con il deploy statico.

## Note pratiche

- `docs/` va tenuta versionata, perche e la versione che GitHub Pages serve online
- `out/` e solo una cartella temporanea di export locale
- il link a `TAB-WHO ?` e gia collegato sia dalla home sia dalla sezione Games
- per controllare il risultato finale su telefono, usa il link pubblico GitHub Pages dopo il push su `main`
- per il workflow operativo locale e di chiusura sessione, vedi `SESSION_WORKFLOW.md`
