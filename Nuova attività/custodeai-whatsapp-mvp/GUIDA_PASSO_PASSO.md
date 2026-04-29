# GUIDA_PASSO_PASSO.md

Questa guida e pensata per chi non programma.

## 1. Apri GitHub

Entra nel tuo account GitHub.

## 2. Apri il repository

Apri il repository che contiene `custodeai-whatsapp-mvp`.

## 3. Clicca Code

In alto nel repository premi `Code`.

## 4. Clicca Codespaces

Nel menu che si apre clicca `Codespaces`.

## 5. Clicca Create codespace on main

Aspetta che il Codespace si apra.

## 6. Apri Terminal

Nel Codespace apri il terminale.

## 7. Copia questo comando

```bash
cp .env.example .env
```

## 8. Apri .env

Apri il file `.env`.

## 9. Inserisci le chiavi

Dentro `.env` inserisci:

- `PUBLIC_BASE_URL`
- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `META_APP_SECRET`
- `OPENAI_API_KEY`

## 10. Avvia il progetto

Esegui questi due comandi:

```bash
bash scripts/setup_dev.sh
bash scripts/start_dev.sh
```

## 11. Vai nella tab Ports

In Codespaces apri la tab `Ports`.

## 12. Rendi Public la porta 8000

Trova la porta `8000` e cambiala in `Public`.

## 13. Copia l'URL

Copia l'URL pubblico della porta `8000`.

## 14. Apri /health

Apri nel browser:

```text
https://URL/health
```

## 15. Se vedi {"status":"ok"}, vai su Meta

Se il browser mostra `{"status":"ok"}`, il backend e attivo.

## 16. Inserisci il Callback URL su Meta

Nel pannello Meta inserisci:

```text
https://URL/webhooks/whatsapp
```

## 17. Verify token

Inserisci come verify token:

```text
custodeai12345
```

Oppure lo stesso valore che hai messo in `WHATSAPP_VERIFY_TOKEN`.

## 18. Sottoscrivi messages

Nel webhook Meta sottoscrivi l'evento:

```text
messages
```

## 19. Scrivi “ciao” su WhatsApp

Invia il messaggio:

```text
ciao
```

al numero WhatsApp di test collegato a Meta.
