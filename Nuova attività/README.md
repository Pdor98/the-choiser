# CustodeAI

CustodeAI e un MVP backend-first per ricevere bollette, scontrini, contratti e ricevute via Telegram, analizzarli con OpenAI, salvare i dati strutturati e creare promemoria prima della scadenza.

## Stack

- FastAPI
- Telegram Bot API
- PostgreSQL / Supabase Postgres
- OpenAI API
- APScheduler
- Struttura pronta per futura dashboard Next.js

## Struttura

```text
.
├── AGENTS.md
├── apps
│   ├── api
│   │   ├── app
│   │   │   ├── api
│   │   │   ├── core
│   │   │   ├── db
│   │   │   ├── repositories
│   │   │   ├── schemas
│   │   │   └── services
│   │   ├── sql
│   │   └── tests
│   └── dashboard
├── pyproject.toml
└── .env.example
```

## Flusso MVP

1. Telegram invia un update webhook a FastAPI.
2. Il backend scarica il file dal Bot API e lo salva in `storage/tmp`.
3. Il file viene inviato a OpenAI per l'estrazione strutturata.
4. I dati vengono salvati nel database.
5. Il bot invia un riepilogo e propone la creazione del promemoria.
6. Lo scheduler controlla i promemoria in scadenza e invia il reminder su Telegram.

## Avvio rapido

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e .[dev]
cp .env.example .env
uvicorn --app-dir apps/api app.main:app --reload
```

Compila `OPENAI_API_KEY` nel file `.env` per abilitare il proxy AI cloud usato dall'app iOS.

Per usare JARVIS gratis con un modello locale, puoi invece avviare un server OpenAI-compatible sul Mac, per esempio LM Studio sulla porta `1234`, e lasciare attive queste variabili:

```bash
JARVIS_BASE_URL=http://127.0.0.1:1234/v1
JARVIS_API_KEY=lm-studio
JARVIS_MODEL=
```

Con `JARVIS_MODEL` vuoto, il backend prova a usare automaticamente il primo modello locale esposto dal server.

## Endpoint principali

- `GET /api/v1/health`
- `GET /api/v1/documents`
- `GET /api/v1/documents/{document_id}`
- `POST /api/v1/documents/{document_id}/reminders`
- `GET /api/v1/reminders`
- `POST /api/v1/jarvis/responses`
- `POST /api/v1/telegram/webhook`
- `POST /api/v1/telegram/set-webhook`

## Note operative

- Supabase puo essere usato impostando `DATABASE_URL` con la stringa Postgres del progetto.
- Il file sorgente viene salvato localmente in modo temporaneo e rimosso dopo l'estrazione.
- La cartella `apps/dashboard` e un placeholder per la futura app Next.js.
