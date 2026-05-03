# AGENTS.md

## Scopo

CustodeAI e un MVP che riceve documenti da Telegram, li analizza con OpenAI, salva dati strutturati su Postgres e invia reminder prima della scadenza.

## Architettura

- `apps/api/app/main.py`: bootstrap FastAPI, engine SQLAlchemy e scheduler.
- `apps/api/app/api/routes`: endpoint HTTP e webhook Telegram.
- `apps/api/app/services`: orchestrazione business logic.
- `apps/api/app/repositories`: accesso al database.
- `apps/api/app/db/models.py`: modelli ORM.
- `apps/api/sql/schema.sql`: schema SQL iniziale per Postgres/Supabase.
- `apps/dashboard`: placeholder per futura dashboard Next.js.

## Convenzioni

- Python target: `>=3.9`.
- Preferire servizi piccoli e composabili.
- Non accoppiare route FastAPI con logica OpenAI o Telegram: la logica va nei `services`.
- Mantenere i payload estratti con chiavi italiane: `tipo_documento`, `fornitore`, `importo`, `data_documento`, `data_scadenza`, `categoria`, `azione_consigliata`.
- Usare sempre repository per scrivere nel database.

## Flusso Telegram

1. Ricezione update webhook.
2. Download file via Telegram Bot API.
3. Salvataggio temporaneo in `storage/tmp`.
4. Estrazione strutturata via OpenAI.
5. Persistenza in `documents`.
6. Invio riepilogo.
7. Conferma reminder via callback button.
8. Scheduler che invia reminder pendenti.

## Reminder

- Il reminder viene creato solo se esiste `data_scadenza`.
- L'orario del reminder usa `DEFAULT_TIMEZONE` e viene salvato in UTC.
- `REMINDER_DAYS_BEFORE` controlla quanti giorni prima avvisare.

## Testing

- Test minimi in `apps/api/tests`.
- Aggiungere almeno:
  - test endpoint salute
  - test schema di estrazione
  - test webhook Telegram con monkeypatch dei servizi

## Evoluzioni consigliate

- Spostare i file su Supabase Storage o S3.
- Aggiungere autenticazione dashboard.
- Aggiungere review umana/edit dei campi estratti.
- Tracciare confidence score e stato del documento.

