from decimal import Decimal

from app.schemas.documents import ExtractedDocumentData


def test_extracted_document_data_normalizes_amount_and_dates():
    payload = ExtractedDocumentData.model_validate(
        {
            "tipo_documento": "bolletta",
            "fornitore": "Enel",
            "importo": "EUR 123,45",
            "data_documento": "2026-04-15",
            "data_scadenza": "2026-05-02",
            "categoria": "utenze",
            "azione_consigliata": "Paga entro la scadenza.",
        }
    )

    assert payload.importo == Decimal("123.45")
    assert payload.data_documento.isoformat() == "2026-04-15"
    assert payload.data_scadenza.isoformat() == "2026-05-02"

