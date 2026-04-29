import base64
from datetime import date
from decimal import Decimal, ROUND_HALF_UP
import logging
import re
from typing import Optional

from pydantic import BaseModel, Field, field_validator

logger = logging.getLogger(__name__)

ITALIAN_MONTHS = {
    "gennaio": 1,
    "febbraio": 2,
    "marzo": 3,
    "aprile": 4,
    "maggio": 5,
    "giugno": 6,
    "luglio": 7,
    "agosto": 8,
    "settembre": 9,
    "ottobre": 10,
    "novembre": 11,
    "dicembre": 12,
}

KNOWN_PROVIDERS = [
    "enel",
    "eni",
    "acea",
    "hera",
    "a2a",
    "tim",
    "vodafone",
    "fastweb",
    "windtre",
    "iliad",
    "sky",
    "telepass",
    "agenzia delle entrate",
    "amazon",
]


class ExtractedDocument(BaseModel):
    tipo_documento: str = "altro"
    fornitore: Optional[str] = None
    importo: Optional[Decimal] = None
    valuta: Optional[str] = "EUR"
    data_documento: Optional[date] = None
    data_scadenza: Optional[date] = None
    categoria: Optional[str] = None
    azione_consigliata: Optional[str] = None
    riepilogo: str = ""
    confidenza: float = Field(default=0.0, ge=0.0, le=1.0)

    @field_validator("importo", mode="before")
    @classmethod
    def normalize_importo(cls, value):
        if value in (None, ""):
            return None
        if isinstance(value, Decimal):
            return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        if isinstance(value, (int, float)):
            return Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

        cleaned = re.sub(r"[^0-9,.\-]", "", str(value))
        if not cleaned:
            return None
        if "," in cleaned and "." in cleaned:
            cleaned = cleaned.replace(".", "").replace(",", ".")
        else:
            cleaned = cleaned.replace(",", ".")
        return Decimal(cleaned).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    @field_validator("data_documento", "data_scadenza", mode="before")
    @classmethod
    def normalize_date(cls, value):
        if value in (None, ""):
            return None
        if isinstance(value, date):
            return value
        return parse_date(str(value))


SYSTEM_PROMPT = """
Sei CustodeAI, un assistente che analizza documenti amministrativi italiani.
Restituisci sempre un oggetto strutturato con questi campi:
- tipo_documento
- fornitore
- importo
- valuta
- data_documento
- data_scadenza
- categoria
- azione_consigliata
- riepilogo
- confidenza

Regole:
- Se un campo non e presente, restituisci null.
- Le date devono essere nel formato ISO YYYY-MM-DD.
- L'importo deve essere numerico senza simboli.
- valuta deve essere un codice come EUR.
- tipo_documento deve essere uno tra: bolletta, scontrino, contratto, ricevuta, altro.
- categoria deve essere una categoria breve tra: utenze, casa, salute, lavoro, tasse, acquisti, abbonamenti, altro.
- azione_consigliata deve essere una frase breve e operativa in italiano.
- riepilogo deve essere una frase sintetica in italiano.
- confidenza deve essere un numero tra 0 e 1.
""".strip()


class OpenAIExtractor:
    def __init__(self, settings):
        self.settings = settings
        self.model = settings.openai_model
        self.client = None
        if settings.openai_api_key:
            from openai import OpenAI

            self.client = OpenAI(api_key=settings.openai_api_key)

    def extract_from_text(self, text: str) -> ExtractedDocument:
        if not self.client:
            return self._fallback_from_text(text)

        try:
            response = self.client.responses.parse(
                model=self.model,
                input=[
                    {
                        "role": "system",
                        "content": [{"type": "input_text", "text": SYSTEM_PROMPT}],
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "input_text",
                                "text": "Analizza questo testo e restituisci l'oggetto strutturato richiesto:\n\n{0}".format(
                                    text
                                ),
                            }
                        ],
                    },
                ],
                text_format=ExtractedDocument,
            )
            if response.output_parsed is not None:
                return response.output_parsed
        except Exception:
            logger.warning("OpenAI text extraction failed, using fallback heuristics instead.")

        return self._fallback_from_text(text)

    def extract_from_file(
        self,
        file_name: str,
        mime_type: str,
        content: bytes,
        caption: Optional[str] = None,
    ) -> ExtractedDocument:
        if not self.client:
            return self._fallback_from_file(file_name=file_name, mime_type=mime_type, caption=caption)

        user_content = [
            {
                "type": "input_text",
                "text": "Analizza il documento allegato e restituisci l'oggetto strutturato richiesto.",
            }
        ]
        if caption:
            user_content.append(
                {
                    "type": "input_text",
                    "text": "Contesto utente: {0}".format(caption),
                }
            )
        user_content.append(self._build_file_input(file_name=file_name, mime_type=mime_type, content=content))

        try:
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
                text_format=ExtractedDocument,
            )
            if response.output_parsed is not None:
                return response.output_parsed
        except Exception:
            logger.warning("OpenAI file extraction failed, using fallback heuristics instead.")

        return self._fallback_from_file(file_name=file_name, mime_type=mime_type, caption=caption)

    def _build_file_input(self, file_name: str, mime_type: str, content: bytes) -> dict:
        encoded = base64.b64encode(content).decode("utf-8")
        if mime_type.startswith("image/"):
            return {
                "type": "input_image",
                "image_url": "data:{0};base64,{1}".format(mime_type, encoded),
                "detail": "high",
            }

        return {
            "type": "input_file",
            "filename": file_name,
            "file_data": encoded,
        }

    def _fallback_from_file(self, file_name: str, mime_type: str, caption: Optional[str]) -> ExtractedDocument:
        text_hint = " ".join(part for part in [caption or "", file_name or "", mime_type or ""] if part)
        base = self._fallback_from_text(text_hint)
        if base.tipo_documento == "altro":
            base.tipo_documento = classify_document(text_hint)
        if not base.categoria:
            base.categoria = categorize_document(base.tipo_documento, text_hint)
        if not base.azione_consigliata:
            base.azione_consigliata = default_action(base.tipo_documento, base.data_scadenza)
        if not base.riepilogo:
            base.riepilogo = build_summary(base)
        if base.confidenza == 0.0:
            base.confidenza = 0.25 if caption else 0.15
        return base

    def _fallback_from_text(self, text: str) -> ExtractedDocument:
        normalized_text = text.strip()
        tipo_documento = classify_document(normalized_text)
        fornitore = detect_provider(normalized_text)
        importo = parse_amount(normalized_text)
        data_scadenza = extract_due_date(normalized_text)
        data_documento = extract_document_date(normalized_text, data_scadenza)
        categoria = categorize_document(tipo_documento, normalized_text)
        azione_consigliata = default_action(tipo_documento, data_scadenza)

        extraction = ExtractedDocument(
            tipo_documento=tipo_documento,
            fornitore=fornitore,
            importo=importo,
            valuta="EUR" if importo is not None else None,
            data_documento=data_documento,
            data_scadenza=data_scadenza,
            categoria=categoria,
            azione_consigliata=azione_consigliata,
            riepilogo="",
            confidenza=0.65 if data_scadenza or importo or fornitore else 0.35,
        )
        extraction.riepilogo = build_summary(extraction)
        return extraction


def classify_document(text: str) -> str:
    lowered = text.lower()
    if "bolletta" in lowered or any(provider in lowered for provider in ("enel", "eni", "acea", "hera", "a2a")):
        return "bolletta"
    if "scontrino" in lowered or "ricevuta fiscale" in lowered:
        return "scontrino"
    if "contratto" in lowered:
        return "contratto"
    if "ricevuta" in lowered:
        return "ricevuta"
    return "altro"


def categorize_document(tipo_documento: str, text: str) -> str:
    lowered = text.lower()
    if tipo_documento == "bolletta":
        return "utenze"
    if tipo_documento == "scontrino":
        return "acquisti"
    if tipo_documento == "contratto":
        return "casa" if "affitto" in lowered or "locazione" in lowered else "lavoro"
    if tipo_documento == "ricevuta":
        return "altro"
    if "abbonamento" in lowered:
        return "abbonamenti"
    return "altro"


def detect_provider(text: str) -> Optional[str]:
    lowered = text.lower()
    for provider in KNOWN_PROVIDERS:
        if provider in lowered:
            return provider.title()

    match = re.search(r"(?:bolletta|contratto|ricevuta|scontrino)\s+([A-Za-z][A-Za-z0-9 '&.-]{2,40})", text, re.IGNORECASE)
    if match:
        candidate = match.group(1).strip()
        candidate = re.split(r"\b(?:da|del|che|con|scade|entro)\b", candidate, maxsplit=1, flags=re.IGNORECASE)[0].strip()
        return candidate or None
    return None


def parse_amount(text: str) -> Optional[Decimal]:
    match = re.search(r"(\d{1,6}(?:[.,]\d{1,2})?)\s*(?:euro|eur|€)", text, re.IGNORECASE)
    if not match:
        match = re.search(r"(?:importo|totale|da)\s+(\d{1,6}(?:[.,]\d{1,2})?)", text, re.IGNORECASE)
    if not match:
        return None
    cleaned = match.group(1).replace(".", "").replace(",", ".")
    return Decimal(cleaned).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def parse_date(value: str) -> date:
    value = value.strip().lower()

    iso_match = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})", value)
    if iso_match:
        return date(int(iso_match.group(1)), int(iso_match.group(2)), int(iso_match.group(3)))

    slash_match = re.fullmatch(r"(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})", value)
    if slash_match:
        day_value = int(slash_match.group(1))
        month_value = int(slash_match.group(2))
        year_value = int(slash_match.group(3))
        if year_value < 100:
            year_value += 2000
        return date(year_value, month_value, day_value)

    month_match = re.fullmatch(
        r"(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+(\d{4})",
        value,
    )
    if month_match:
        day_value = int(month_match.group(1))
        month_value = ITALIAN_MONTHS[month_match.group(2)]
        year_value = int(month_match.group(3))
        return date(year_value, month_value, day_value)

    raise ValueError("Unsupported date format: {0}".format(value))


def extract_due_date(text: str) -> Optional[date]:
    patterns = [
        r"(?:scade(?:\s+il)?|entro(?:\s+il)?|scadenza(?:\s+il)?|pagare\s+entro(?:\s+il)?)\s+([0-9]{4}-[0-9]{2}-[0-9]{2})",
        r"(?:scade(?:\s+il)?|entro(?:\s+il)?|scadenza(?:\s+il)?|pagare\s+entro(?:\s+il)?)\s+([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4})",
        r"(?:scade(?:\s+il)?|entro(?:\s+il)?|scadenza(?:\s+il)?|pagare\s+entro(?:\s+il)?)\s+([0-9]{1,2}\s+(?:gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+[0-9]{4})",
    ]
    lowered = text.lower()
    for pattern in patterns:
        match = re.search(pattern, lowered, re.IGNORECASE)
        if match:
            try:
                return parse_date(match.group(1))
            except ValueError:
                return None
    return None


def extract_document_date(text: str, due_date: Optional[date]) -> Optional[date]:
    patterns = [
        r"(?:data(?:\s+documento)?|del)\s+([0-9]{4}-[0-9]{2}-[0-9]{2})",
        r"(?:data(?:\s+documento)?|del)\s+([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4})",
        r"(?:data(?:\s+documento)?|del)\s+([0-9]{1,2}\s+(?:gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+[0-9]{4})",
    ]
    lowered = text.lower()
    for pattern in patterns:
        match = re.search(pattern, lowered, re.IGNORECASE)
        if match:
            try:
                return parse_date(match.group(1))
            except ValueError:
                return None

    if due_date is not None:
        return due_date
    return None


def default_action(tipo_documento: str, due_date: Optional[date]) -> str:
    if due_date:
        return "Controlla il documento e completa l'azione entro la scadenza."
    if tipo_documento == "contratto":
        return "Rileggi il contratto e verifica clausole e date importanti."
    if tipo_documento == "scontrino":
        return "Conserva lo scontrino se ti serve per resi o rimborsi."
    return "Verifica il documento e archivialo correttamente."


def build_summary(extraction: ExtractedDocument) -> str:
    supplier = extraction.fornitore or "fornitore non trovato"
    amount = "{0:.2f} {1}".format(extraction.importo, extraction.valuta or "EUR") if extraction.importo else "importo non trovato"
    due = extraction.data_scadenza.isoformat() if extraction.data_scadenza else "nessuna scadenza rilevata"
    return "Documento {0} con {1}, {2}, scadenza {3}.".format(
        extraction.tipo_documento,
        supplier,
        amount,
        due,
    )
