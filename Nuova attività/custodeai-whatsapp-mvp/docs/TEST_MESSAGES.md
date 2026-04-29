# TEST_MESSAGES.md

Usa questi messaggi per validare il comportamento del bot.

## Primo contatto

Messaggio:

```text
Ciao
```

Risultato atteso:
- il bot spiega che puo ricevere PDF e immagini

## Bolletta PDF

Invia:
- un PDF di test con importo e scadenza leggibili

Risultato atteso:
- risposta "Sto analizzando il documento..."
- riepilogo strutturato
- richiesta di creazione promemoria

## Scontrino foto

Invia:
- foto di uno scontrino

Risultato atteso:
- classificazione `scontrino`
- assenza probabile di `data_scadenza`
- niente reminder automatico

## Reminder manuale fallback

Messaggio:

```text
PROMEMORIA <document_id>
```

Risultato atteso:
- creazione del promemoria se il documento ha `data_scadenza`

## Reminder skip fallback

Messaggio:

```text
SALTA <document_id>
```

Risultato atteso:
- aggiornamento dello stato reminder a `skipped`

