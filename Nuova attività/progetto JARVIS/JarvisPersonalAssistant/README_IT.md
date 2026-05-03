# JARVIS Personal Assistant — iPhone MVP

Questa è una base Xcode per uso personale. L'app non sostituisce Siri come servizio di sistema, ma crea un assistente AI controllato e sicuro tramite app, App Intents/Shortcuts e permessi iOS.

## Funzioni già incluse

- Chat AI in italiano tramite OpenAI Responses API.
- Strumenti/funzioni per: cercare contatti, creare promemoria, creare eventi calendario, preparare bozze SMS/WhatsApp, preparare bozze email, aprire link.
- Conferma obbligatoria prima di ogni azione che modifica dati o apre app esterne.
- API key salvata in Keychain, non in UserDefaults.
- Dettatura vocale tramite Speech framework e lettura risposte tramite AVSpeechSynthesizer.
- App Shortcut: "Chiedi a JARVIS ..." / "Di a JARVIS ...".

## Avvio rapido

1. Apri `JarvisPersonalAssistant.xcodeproj` con Xcode.
2. Seleziona il target `JarvisPersonalAssistant`.
3. In `Signing & Capabilities`, imposta il tuo Apple Developer Team personale.
4. Collega l'iPhone e fai Run.
5. Nell'app, apri l'icona ingranaggio e incolla la tua OpenAI API key.
6. Prova: `Ricordami domani alle 9 di chiamare Marco` oppure `Crea un evento venerdì dalle 18 alle 19 chiamato palestra`.

## Note importanti

- iOS non permette a un'app terza di avere accesso totale alle altre app o di sostituire Siri completamente.
- Messaggi, WhatsApp ed email vengono aperti come bozze: l'invio resta manuale.
- Calendario e Promemoria vengono modificati solo dopo conferma.
- Foto, dati bancari, password e codici non sono integrati di proposito.
- Per un uso pubblico su App Store servirebbero ulteriori controlli privacy, logging, rate-limit e un backend per proteggere la API key.

## Prossimi miglioramenti consigliati

- Aggiungere memoria locale cifrata delle preferenze.
- Aggiungere routine personali: "sto uscendo", "giornata lavoro", "sera".
- Integrare Shortcuts più avanzati con output strutturato.
- Passare da dettatura + TTS a OpenAI Realtime API per conversazioni vocali più naturali.
