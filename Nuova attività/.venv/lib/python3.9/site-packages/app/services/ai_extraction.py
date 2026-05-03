import base64

from app.schemas.documents import ExtractedDocumentData

SYSTEM_PROMPT = """
Sei un assistente che analizza documenti amministrativi italiani.
Classifica il documento ed estrai solo i campi richiesti.
Se un dato non e presente, restituisci null.
Valori ammessi per tipo_documento possono includere: bolletta, scontrino, contratto, ricevuta, altro.
Valori ammessi per categoria possono includere: utenze, casa, salute, lavoro, tasse, acquisti, abbonamenti, altro.
Le date devono essere nel formato ISO YYYY-MM-DD.
L'importo deve essere un numero senza simbolo di valuta.
L'azione_consigliata deve essere una frase breve e operativa in italiano.
""".strip()


class AIExtractionService:
    def __init__(self, settings):
        self.model = settings.openai_model
        self.client = None
        if settings.openai_api_key:
            from openai import OpenAI

            self.client = OpenAI(api_key=settings.openai_api_key)

    def extract_document(self, file_name: str, mime_type: str, content: bytes) -> ExtractedDocumentData:
        if self.client is None:
            raise RuntimeError("OPENAI_API_KEY is not configured")

        user_content = [
            {
                "type": "input_text",
                "text": "Analizza questo documento e restituisci un JSON conforme allo schema richiesto.",
            }
        ]
        user_content.append(self._build_file_input(file_name=file_name, mime_type=mime_type, content=content))

        response = self.client.responses.parse(
            model=self.model,
            input=[
                {
                    "role": "system",
                    "content": [{"type": "input_text", "text": SYSTEM_PROMPT}],
                },
                {
                    "role": "user",
                    "content": user_content,
                },
            ],
            text_format=ExtractedDocumentData,
        )

        if response.output_parsed is None:
            raise RuntimeError("OpenAI did not return a parsed payload")
        return response.output_parsed

    def _build_file_input(self, file_name: str, mime_type: str, content: bytes):
        encoded = base64.b64encode(content).decode("utf-8")
        if mime_type.startswith("image/"):
            return {
                "type": "input_image",
                "image_url": "data:{mime};base64,{payload}".format(mime=mime_type, payload=encoded),
                "detail": "high",
            }

        return {
            "type": "input_file",
            "filename": file_name,
            "file_data": encoded,
        }
