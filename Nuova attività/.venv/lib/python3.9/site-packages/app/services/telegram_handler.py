from app.schemas.telegram import TelegramUpdate


class TelegramUpdateHandler:
    def __init__(self, settings, telegram_bot_service, document_pipeline_service, reminder_service):
        self.settings = settings
        self.telegram_bot_service = telegram_bot_service
        self.document_pipeline_service = document_pipeline_service
        self.reminder_service = reminder_service

    def handle_payload(self, payload: dict) -> str:
        update = TelegramUpdate.model_validate(payload)
        return self.handle_update(update)

    def handle_update(self, update: TelegramUpdate) -> str:
        if update.callback_query:
            return self._handle_callback(update.callback_query)
        if update.message:
            return self._handle_message(update.message)
        return "ignored_update"

    def _handle_message(self, message) -> str:
        if message.document:
            return self._handle_document_message(message)
        if message.photo:
            return self._handle_photo_message(message)
        if message.text:
            return self._handle_text_message(message)

        self.telegram_bot_service.send_message(
            chat_id=message.chat.id,
            text="Inviami un PDF o un'immagine di bolletta, scontrino, contratto o ricevuta.",
        )
        return "unsupported_message"

    def _handle_text_message(self, message) -> str:
        if message.text == "/start":
            self.telegram_bot_service.send_message(
                chat_id=message.chat.id,
                text="Ciao. Inviami un PDF o una foto e ti restituisco i dati strutturati con un reminder opzionale.",
            )
            return "start_message"

        self.telegram_bot_service.send_message(
            chat_id=message.chat.id,
            text="Per ora posso analizzare PDF e immagini. Prova a inviarmi il documento da classificare.",
        )
        return "text_message"

    def _handle_document_message(self, message) -> str:
        mime_type = message.document.mime_type or "application/octet-stream"
        if not (mime_type == "application/pdf" or mime_type.startswith("image/")):
            self.telegram_bot_service.send_message(
                chat_id=message.chat.id,
                text="Formato non supportato. Invia un PDF o un'immagine.",
            )
            return "unsupported_file"

        file_name = message.document.file_name or "document.pdf"
        self.telegram_bot_service.send_message(chat_id=message.chat.id, text="Sto analizzando il documento...")
        try:
            result = self.document_pipeline_service.process_telegram_file(
                telegram_user_id=message.from_user.id,
                chat_id=message.chat.id,
                username=message.from_user.username,
                first_name=message.from_user.first_name,
                last_name=message.from_user.last_name,
                telegram_file_id=message.document.file_id,
                file_name=file_name,
                mime_type=mime_type,
            )
        except Exception:
            self.telegram_bot_service.send_message(
                chat_id=message.chat.id,
                text="C'e stato un problema durante l'analisi del file. Controlla la configurazione e riprova.",
            )
            return "document_processing_error"
        reply_markup = None
        if result.data_scadenza:
            reply_markup = self.telegram_bot_service.build_reminder_keyboard(result.document_id)
        self.telegram_bot_service.send_message(
            chat_id=message.chat.id,
            text=result.build_summary_text(self.settings.reminder_days_before),
            reply_markup=reply_markup,
        )
        return "document_processed"

    def _handle_photo_message(self, message) -> str:
        photo = message.photo[-1]
        self.telegram_bot_service.send_message(chat_id=message.chat.id, text="Sto analizzando l'immagine...")
        try:
            result = self.document_pipeline_service.process_telegram_file(
                telegram_user_id=message.from_user.id,
                chat_id=message.chat.id,
                username=message.from_user.username,
                first_name=message.from_user.first_name,
                last_name=message.from_user.last_name,
                telegram_file_id=photo.file_id,
                file_name="telegram-photo-{0}.jpg".format(photo.file_unique_id),
                mime_type="image/jpeg",
            )
        except Exception:
            self.telegram_bot_service.send_message(
                chat_id=message.chat.id,
                text="C'e stato un problema durante l'analisi dell'immagine. Controlla la configurazione e riprova.",
            )
            return "photo_processing_error"
        reply_markup = None
        if result.data_scadenza:
            reply_markup = self.telegram_bot_service.build_reminder_keyboard(result.document_id)
        self.telegram_bot_service.send_message(
            chat_id=message.chat.id,
            text=result.build_summary_text(self.settings.reminder_days_before),
            reply_markup=reply_markup,
        )
        return "photo_processed"

    def _handle_callback(self, callback_query) -> str:
        data = callback_query.data or ""
        chunks = data.split(":")
        if len(chunks) != 3 or chunks[0] != "reminder":
            self.telegram_bot_service.answer_callback_query(callback_query.id, text="Azione non riconosciuta.")
            return "unknown_callback"

        _, action, document_id = chunks
        if action == "create":
            try:
                result = self.reminder_service.create_reminder_for_document(document_id)
                self.telegram_bot_service.answer_callback_query(callback_query.id, text="Promemoria creato.")
                if callback_query.message:
                    self.telegram_bot_service.send_message(
                        chat_id=callback_query.message.chat.id,
                        text=result.message,
                    )
                return "reminder_created"
            except ValueError as exc:
                self.telegram_bot_service.answer_callback_query(callback_query.id, text="Impossibile creare il promemoria.")
                if callback_query.message:
                    self.telegram_bot_service.send_message(chat_id=callback_query.message.chat.id, text=str(exc))
                return "reminder_error"

        if action == "skip":
            try:
                self.reminder_service.skip_reminder_for_document(document_id)
                self.telegram_bot_service.answer_callback_query(callback_query.id, text="Promemoria saltato.")
                if callback_query.message:
                    self.telegram_bot_service.send_message(
                        chat_id=callback_query.message.chat.id,
                        text="Va bene, nessun promemoria creato per questo documento.",
                    )
                return "reminder_skipped"
            except ValueError as exc:
                self.telegram_bot_service.answer_callback_query(callback_query.id, text="Documento non trovato.")
                if callback_query.message:
                    self.telegram_bot_service.send_message(chat_id=callback_query.message.chat.id, text=str(exc))
                return "reminder_skip_error"

        self.telegram_bot_service.answer_callback_query(callback_query.id, text="Azione non supportata.")
        return "unsupported_callback"
