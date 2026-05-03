import Foundation

enum ToolSchemas {
    static let all: [[String: Any]] = [
        [
            "type": "function",
            "name": "search_contacts",
            "description": "Cerca contatti nella rubrica dell'utente per nome, cognome, telefono o email. Non modifica dati.",
            "parameters": [
                "type": "object",
                "properties": [
                    "query": ["type": "string", "description": "Nome, cognome, email o numero da cercare."]
                ],
                "required": ["query"],
                "additionalProperties": false
            ]
        ],
        [
            "type": "function",
            "name": "create_reminder",
            "description": "Prepara la creazione di un promemoria. L'app chiederà conferma prima di salvarlo.",
            "parameters": [
                "type": "object",
                "properties": [
                    "title": ["type": "string"],
                    "notes": ["type": "string"],
                    "due_at_iso8601": ["type": "string", "description": "Data/ora di scadenza in ISO-8601 con offset. Può essere vuota se non serve."]
                ],
                "required": ["title"],
                "additionalProperties": false
            ]
        ],
        [
            "type": "function",
            "name": "create_calendar_event",
            "description": "Prepara la creazione di un evento calendario. L'app chiederà conferma prima di salvarlo.",
            "parameters": [
                "type": "object",
                "properties": [
                    "title": ["type": "string"],
                    "start_at_iso8601": ["type": "string"],
                    "end_at_iso8601": ["type": "string"],
                    "notes": ["type": "string"],
                    "location": ["type": "string"]
                ],
                "required": ["title", "start_at_iso8601", "end_at_iso8601"],
                "additionalProperties": false
            ]
        ],
        [
            "type": "function",
            "name": "draft_message",
            "description": "Prepara una bozza SMS o WhatsApp. L'app aprirà l'app di messaggistica e l'utente dovrà inviare manualmente.",
            "parameters": [
                "type": "object",
                "properties": [
                    "recipient_name": ["type": "string", "description": "Nome del destinatario in rubrica."],
                    "body": ["type": "string", "description": "Testo del messaggio."],
                    "channel": ["type": "string", "enum": ["sms", "whatsapp"]]
                ],
                "required": ["recipient_name", "body", "channel"],
                "additionalProperties": false
            ]
        ],
        [
            "type": "function",
            "name": "draft_email",
            "description": "Prepara una bozza email. L'app aprirà Mail o il client predefinito e l'utente dovrà inviare manualmente.",
            "parameters": [
                "type": "object",
                "properties": [
                    "recipient_name": ["type": "string", "description": "Nome del destinatario in rubrica."],
                    "subject": ["type": "string"],
                    "body": ["type": "string"]
                ],
                "required": ["recipient_name", "subject", "body"],
                "additionalProperties": false
            ]
        ],
        [
            "type": "function",
            "name": "open_url",
            "description": "Prepara l'apertura di un URL sicuro. L'app chiederà conferma prima di aprire link esterni.",
            "parameters": [
                "type": "object",
                "properties": [
                    "url": ["type": "string", "description": "URL assoluto, preferibilmente https://"]
                ],
                "required": ["url"],
                "additionalProperties": false
            ]
        ]
    ]
}
