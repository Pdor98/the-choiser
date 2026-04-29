# META_SETUP.md

## Setup rapido Meta / WhatsApp Cloud API

1. Crea un'app Business su `developers.facebook.com`.
2. Aggiungi il prodotto WhatsApp.
3. Recupera da Meta:
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `META_APP_SECRET`
4. Metti questi valori nel file `.env`.
5. Configura il webhook con:

Callback URL:

```text
https://URL-CODESPACES-O-DEPLOY/webhooks/whatsapp
```

Verify token:

```text
lo stesso valore di WHATSAPP_VERIFY_TOKEN
```

Evento da sottoscrivere:

```text
messages
```

6. Avvia il progetto:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

7. Manda un messaggio WhatsApp al numero configurato.

## Note

- Se `META_APP_SECRET` e vuoto, in ambiente `dev` il webhook viene accettato senza verifica firma.
- In ambienti non `dev`, conviene impostare sempre `META_APP_SECRET`.
- Per reminder fuori dalla finestra di 24 ore configura un template WhatsApp approvato.
