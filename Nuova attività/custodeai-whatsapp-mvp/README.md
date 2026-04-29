# CustodeAI WhatsApp MVP

## Cos'è CustodeAI

CustodeAI e un assistente che riceve messaggi WhatsApp, immagini e PDF, estrae i dati importanti da bollette, scontrini, contratti e ricevute, li salva e crea promemoria prima della scadenza.

## Cosa fa l'MVP

- risponde su `GET /health` con `{"status":"ok"}`
- riceve webhook WhatsApp Cloud API da Meta
- verifica il webhook con `WHATSAPP_VERIFY_TOKEN`
- gestisce messaggi di testo, immagini e documenti/PDF
- scarica i media da WhatsApp usando `WHATSAPP_ACCESS_TOKEN`
- usa OpenAI se configurato
- usa un fallback locale se `OPENAI_API_KEY` manca
- salva tutto in SQLite di default
- crea promemoria se trova una data di scadenza
- invia un riepilogo all'utente su WhatsApp

## Come avviarlo in locale

Apri il terminale dentro la cartella del progetto e lancia:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python scripts/init_db.py
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Server atteso:

- API locale su `http://127.0.0.1:8000`
- healthcheck su `http://127.0.0.1:8000/health`

## Come avviarlo in GitHub Codespaces

1. Apri il repository su GitHub.
2. Clicca `Code`.
3. Clicca `Codespaces`.
4. Clicca `Create codespace on main` oppure sul branch che vuoi usare.
5. Quando il Codespace e pronto, apri il terminale.
6. Esegui:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python scripts/init_db.py
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

7. Apri la tab `Ports`.
8. Trova la porta `8000`.
9. Impostala come `Public`.
10. Apri l'URL pubblico e testa `/health`.

Esempio:

```text
https://URL-CODESPACES-O-DEPLOY/health
```

## Come compilare .env

Parti sempre da `.env.example`:

```bash
cp .env.example .env
```

Compila i campi principali:

- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `META_APP_SECRET`
- `OPENAI_API_KEY`
- `PUBLIC_BASE_URL`

Importante:

- non pubblicare mai `.env` su GitHub
- non incollare token o API key nel codice
- non fare commit di database, upload o log reali

## Collegamento WhatsApp Cloud API

Nel pannello Meta Developers configura il webhook con:

Callback URL:

```text
https://URL-CODESPACES-O-DEPLOY/webhooks/whatsapp
```

Verify token:

```text
stesso valore di WHATSAPP_VERIFY_TOKEN, per esempio custodeai12345
```

Evento da sottoscrivere:

```text
messages
```

Da sapere:

- `WHATSAPP_ACCESS_TOKEN` si prende da Meta
- `WHATSAPP_PHONE_NUMBER_ID` si prende da Meta
- `OPENAI_API_KEY` si prende da OpenAI
- questi valori non devono mai essere pubblicati su GitHub

## Come testare /health

Con il server avviato:

```bash
curl http://127.0.0.1:8000/health
```

Risultato atteso:

```json
{"status":"ok"}
```

## Come testare il webhook

1. Avvia il server.
2. Assicurati che `PUBLIC_BASE_URL` punti all'URL pubblico reale.
3. Configura su Meta il webhook `GET/POST` su:

```text
https://URL-CODESPACES-O-DEPLOY/webhooks/whatsapp
```

4. Usa lo stesso verify token messo in `.env`.
5. Invia un messaggio WhatsApp al numero collegato.
6. Controlla che il backend risponda e salvi i dati.

## Come mandare il primo messaggio WhatsApp

Puoi provare con:

```text
Ciao
```

oppure con un testo piu utile:

```text
Ricordami la bolletta Enel da 82,30 euro che scade il 15 maggio 2026
```

Oppure invia:

- una foto di uno scontrino
- un PDF di una bolletta
- un contratto in PDF

## Problemi comuni e soluzioni

### Il server non parte

- controlla di aver attivato `.venv`
- esegui di nuovo `pip install -r requirements.txt`
- esegui `python scripts/init_db.py`

### /health non risponde con status ok

- verifica di aver avviato esattamente:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Meta non verifica il webhook

- controlla che la path sia `/webhooks/whatsapp`
- controlla che `WHATSAPP_VERIFY_TOKEN` e il token inserito in Meta coincidano
- controlla che la porta `8000` sia `Public` in Codespaces

### Ricevi webhook ma non partono i reminder

- di default `ENABLE_REMINDER_WORKER=false`
- per testare il worker, metti `ENABLE_REMINDER_WORKER=true`
- se il reminder cade fuori dalla finestra di 24 ore, configura un template WhatsApp approvato

### OPENAI_API_KEY manca

- il progetto non va in crash
- per i messaggi testuali usa un fallback locale
- per immagini e PDF senza chiave OpenAI il risultato sara piu limitato

## Note di sicurezza

- non committare mai `.env`
- non committare token, chiavi API o database locali
- non salvare log con dati personali
- la firma `X-Hub-Signature-256` viene verificata se `META_APP_SECRET` e configurato
