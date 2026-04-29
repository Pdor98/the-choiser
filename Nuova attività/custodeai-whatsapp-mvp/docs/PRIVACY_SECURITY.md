# PRIVACY_SECURITY.md

## Dati trattati

CustodeAI tratta:
- numero WhatsApp dell'utente
- nome profilo WhatsApp se presente
- immagini e PDF inviati dall'utente
- dati strutturati estratti dal documento
- scadenze e promemoria

## Misure minime consigliate

- Usa HTTPS per il webhook pubblico.
- Imposta `META_APP_SECRET` per verificare la firma webhook.
- Ruota periodicamente `WHATSAPP_ACCESS_TOKEN` e `OPENAI_API_KEY`.
- Limita l'accesso al database e cifra i backup.
- Conserva i file originali solo per il tempo strettamente necessario all'estrazione.
- Evita di loggare documenti completi o dati sensibili in chiaro.

## Retention

- Questo MVP scarica il file media, lo usa per l'estrazione e lo elimina dal filesystem temporaneo.
- Il database conserva il JSON estratto e il payload webhook del messaggio.
- Prima della messa in produzione e consigliato definire una retention esplicita per:
  - documenti analizzati
  - reminder inviati
  - metadati conversazionali

## OpenAI

- I contenuti dei documenti vengono inoltrati all'API OpenAI per l'estrazione strutturata.
- Prima dell'uso in produzione verifica policy interne, informative privacy e basi giuridiche applicabili.

## Meta / WhatsApp

- Verifica sempre le policy correnti di Meta per l'uso di WhatsApp Business Platform, template e messaging window.
- Il reminder fuori sessione richiede di norma un template approvato.

