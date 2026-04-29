# AGENTS.md

## Scopo

Questo progetto implementa un MVP WhatsApp-first di CustodeAI con:
- webhook Meta / WhatsApp Cloud API
- analisi AI di immagini, PDF e testo
- salvataggio dati su SQLite di default
- reminder programmati

## Runtime consigliato

- Python consigliato: `3.11`
- Compatibilita mantenuta il piu possibile con Python `3.9`

## Layout

- `app/main.py`: FastAPI, `/health`, verifica webhook e ricezione webhook
- `app/whatsapp/client.py`: chiamate Graph API per messaggi e download media
- `app/whatsapp/webhook_parser.py`: normalizzazione payload Meta in eventi applicativi
- `app/ai/extractor.py`: estrazione strutturata con OpenAI + fallback locale
- `app/services/processor.py`: logica principale del bot
- `app/services/reminders.py`: scheduling e dispatch reminder
- `app/models.py`: modelli SQLAlchemy
- `app/db.py`: engine, session factory e normalizzazione URL SQLite
- `docs/`: setup, privacy e test manuali

## Convenzioni

- Non mettere logica business direttamente negli endpoint FastAPI.
- Non stampare payload completi, token, URL media firmati o chiavi API nei log.
- Mantenere i campi estratti in italiano.
- Non committare `.env`, database, upload reali o file con dati personali.

## Reminder

- Il worker parte solo se `ENABLE_REMINDER_WORKER=true`.
- Se il reminder cade fuori dalla finestra di 24 ore, usare template WhatsApp se configurato.

## Testing

- I test usano SQLite locale.
- Prima di chiudere il lavoro eseguire:
  - `python scripts/init_db.py`
  - `pytest`
  - `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`
