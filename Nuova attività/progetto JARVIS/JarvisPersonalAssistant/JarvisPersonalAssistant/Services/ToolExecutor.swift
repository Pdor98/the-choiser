import Foundation
import Combine

@MainActor
final class ToolExecutor: ObservableObject {
    @Published private(set) var pendingActions: [PendingAction] = []

    private let calendarService = CalendarService()
    private let contactsService = ContactsService()
    private let externalDraftService = ExternalDraftService()

    func executeToolCall(_ call: ToolCall) async throws -> String {
        switch call.name {
        case "search_contacts":
            let args = try decode(SearchContactsArguments.self, from: call.arguments)
            let matches = try await contactsService.search(query: args.query)
            if matches.isEmpty {
                return jsonString(["status": "no_results", "query": args.query])
            }
            let data = try JSONEncoder().encode(matches)
            return String(data: data, encoding: .utf8) ?? "[]"

        case "create_reminder", "create_calendar_event", "draft_message", "draft_email", "open_url":
            let action = try pendingAction(for: call)
            pendingActions.append(action)
            return jsonString([
                "status": "pending_confirmation",
                "action_id": action.id.uuidString,
                "title": action.title,
                "detail": action.detail
            ])

        default:
            return jsonString(["status": "unsupported_tool", "name": call.name])
        }
    }

    func confirm(_ action: PendingAction) async throws -> String {
        defer { remove(action) }

        switch action.toolName {
        case "create_reminder":
            let args = try decode(CreateReminderArguments.self, from: action.argumentsJSON)
            return try await calendarService.createReminder(args)

        case "create_calendar_event":
            let args = try decode(CreateCalendarEventArguments.self, from: action.argumentsJSON)
            return try await calendarService.createCalendarEvent(args)

        case "draft_message":
            let args = try decode(DraftMessageArguments.self, from: action.argumentsJSON)
            let phone = try await contactsService.bestPhone(for: args.recipientName)
            return try await externalDraftService.openMessageDraft(to: phone, body: args.body, channel: args.channel)

        case "draft_email":
            let args = try decode(DraftEmailArguments.self, from: action.argumentsJSON)
            let email = try await contactsService.bestEmail(for: args.recipientName)
            return try await externalDraftService.openEmailDraft(to: email, subject: args.subject, body: args.body)

        case "open_url":
            let args = try decode(OpenURLArguments.self, from: action.argumentsJSON)
            return try await externalDraftService.openURL(args.url)

        default:
            return "Azione non supportata: \(action.toolName)"
        }
    }

    func cancel(_ action: PendingAction) {
        remove(action)
    }

    func queueLocalReminder(title: String, notes: String?, dueDate: Date?) throws -> PendingAction {
        let formatter = ISO8601DateFormatter()
        let args = CreateReminderArguments(
            title: title,
            notes: notes,
            dueAtISO8601: dueDate.map { formatter.string(from: $0) }
        )
        let data = try JSONEncoder().encode(args)
        guard let argumentsJSON = String(data: data, encoding: .utf8) else {
            throw DecodingError.dataCorrupted(.init(codingPath: [], debugDescription: "Reminder JSON non UTF-8"))
        }

        var detail = "Titolo: \(title)"
        if let dueDate {
            detail += "\nScadenza: \(formatter.string(from: dueDate))"
        }
        if let notes, !notes.isEmpty {
            detail += "\nNote: \(notes)"
        }

        let action = PendingAction(
            toolName: "create_reminder",
            title: "Crea promemoria",
            detail: detail,
            argumentsJSON: argumentsJSON
        )
        pendingActions.append(action)
        return action
    }

    func queueLocalCalendarEvent(title: String, startDate: Date, endDate: Date, notes: String?, location: String?) throws -> PendingAction {
        let formatter = ISO8601DateFormatter()
        let args = CreateCalendarEventArguments(
            title: title,
            startAtISO8601: formatter.string(from: startDate),
            endAtISO8601: formatter.string(from: endDate),
            notes: notes,
            location: location
        )
        let data = try JSONEncoder().encode(args)
        guard let argumentsJSON = String(data: data, encoding: .utf8) else {
            throw DecodingError.dataCorrupted(.init(codingPath: [], debugDescription: "Event JSON non UTF-8"))
        }

        var detail = "Titolo: \(title)\nInizio: \(formatter.string(from: startDate))\nFine: \(formatter.string(from: endDate))"
        if let location, !location.isEmpty {
            detail += "\nLuogo: \(location)"
        }
        if let notes, !notes.isEmpty {
            detail += "\nNote: \(notes)"
        }

        let action = PendingAction(
            toolName: "create_calendar_event",
            title: "Crea evento calendario",
            detail: detail,
            argumentsJSON: argumentsJSON
        )
        pendingActions.append(action)
        return action
    }

    private func remove(_ action: PendingAction) {
        pendingActions.removeAll { $0.id == action.id }
    }

    private func pendingAction(for call: ToolCall) throws -> PendingAction {
        switch call.name {
        case "create_reminder":
            let args = try decode(CreateReminderArguments.self, from: call.arguments)
            var detail = "Titolo: \(args.title)"
            if let due = args.dueAtISO8601, !due.isEmpty { detail += "\nScadenza: \(due)" }
            if let notes = args.notes, !notes.isEmpty { detail += "\nNote: \(notes)" }
            return PendingAction(toolName: call.name, title: "Crea promemoria", detail: detail, argumentsJSON: call.arguments)

        case "create_calendar_event":
            let args = try decode(CreateCalendarEventArguments.self, from: call.arguments)
            var detail = "Titolo: \(args.title)\nInizio: \(args.startAtISO8601)\nFine: \(args.endAtISO8601)"
            if let location = args.location, !location.isEmpty { detail += "\nLuogo: \(location)" }
            if let notes = args.notes, !notes.isEmpty { detail += "\nNote: \(notes)" }
            return PendingAction(toolName: call.name, title: "Crea evento calendario", detail: detail, argumentsJSON: call.arguments)

        case "draft_message":
            let args = try decode(DraftMessageArguments.self, from: call.arguments)
            let detail = "A: \(args.recipientName)\nCanale: \(args.channel)\nTesto: \(args.body)"
            return PendingAction(toolName: call.name, title: "Prepara messaggio", detail: detail, argumentsJSON: call.arguments)

        case "draft_email":
            let args = try decode(DraftEmailArguments.self, from: call.arguments)
            let detail = "A: \(args.recipientName)\nOggetto: \(args.subject)\nTesto: \(args.body)"
            return PendingAction(toolName: call.name, title: "Prepara email", detail: detail, argumentsJSON: call.arguments)

        case "open_url":
            let args = try decode(OpenURLArguments.self, from: call.arguments)
            return PendingAction(toolName: call.name, title: "Apri link", detail: args.url, argumentsJSON: call.arguments)

        default:
            return PendingAction(toolName: call.name, title: call.name, detail: call.arguments, argumentsJSON: call.arguments)
        }
    }

    private func decode<T: Decodable>(_ type: T.Type, from json: String) throws -> T {
        guard let data = json.data(using: .utf8) else {
            throw DecodingError.dataCorrupted(.init(codingPath: [], debugDescription: "Arguments non UTF-8"))
        }
        return try JSONDecoder().decode(type, from: data)
    }

    private func jsonString(_ dictionary: [String: Any]) -> String {
        guard let data = try? JSONSerialization.data(withJSONObject: dictionary, options: [.prettyPrinted]),
              let string = String(data: data, encoding: .utf8) else {
            return "{}"
        }
        return string
    }
}

private struct SearchContactsArguments: Codable {
    let query: String
}
