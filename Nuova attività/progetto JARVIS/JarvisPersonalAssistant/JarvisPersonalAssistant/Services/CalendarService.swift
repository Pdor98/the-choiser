import EventKit
import Foundation

struct CreateReminderArguments: Codable {
    let title: String
    let notes: String?
    let dueAtISO8601: String?

    enum CodingKeys: String, CodingKey {
        case title
        case notes
        case dueAtISO8601 = "due_at_iso8601"
    }
}

struct CreateCalendarEventArguments: Codable {
    let title: String
    let startAtISO8601: String
    let endAtISO8601: String
    let notes: String?
    let location: String?

    enum CodingKeys: String, CodingKey {
        case title
        case startAtISO8601 = "start_at_iso8601"
        case endAtISO8601 = "end_at_iso8601"
        case notes
        case location
    }
}

enum CalendarServiceError: LocalizedError {
    case calendarAccessDenied
    case remindersAccessDenied
    case noDefaultCalendar
    case noDefaultReminderCalendar
    case invalidEventDates

    var errorDescription: String? {
        switch self {
        case .calendarAccessDenied:
            return "Accesso al calendario negato. Abilitalo in Impostazioni > Privacy e sicurezza > Calendari."
        case .remindersAccessDenied:
            return "Accesso ai promemoria negato. Abilitalo in Impostazioni > Privacy e sicurezza > Promemoria."
        case .noDefaultCalendar:
            return "Non ho trovato un calendario predefinito in cui salvare l'evento."
        case .noDefaultReminderCalendar:
            return "Non ho trovato una lista promemoria predefinita."
        case .invalidEventDates:
            return "La data di fine evento deve essere successiva alla data di inizio."
        }
    }
}

final class CalendarService {
    private let eventStore = EKEventStore()

    func createReminder(_ args: CreateReminderArguments) async throws -> String {
        try await ensureReminderAccess()
        guard let calendar = eventStore.defaultCalendarForNewReminders() else {
            throw CalendarServiceError.noDefaultReminderCalendar
        }

        let reminder = EKReminder(eventStore: eventStore)
        reminder.title = args.title
        reminder.notes = args.notes
        reminder.calendar = calendar

        if let due = args.dueAtISO8601?.trimmingCharacters(in: .whitespacesAndNewlines), !due.isEmpty {
            let date = try DateParsing.parseISO8601(due)
            reminder.dueDateComponents = DateParsing.dateComponents(for: date)
        }

        try eventStore.save(reminder, commit: true)
        return "Promemoria creato: \(args.title)"
    }

    func createCalendarEvent(_ args: CreateCalendarEventArguments) async throws -> String {
        try await ensureCalendarAccess()
        guard let calendar = eventStore.defaultCalendarForNewEvents else {
            throw CalendarServiceError.noDefaultCalendar
        }

        let start = try DateParsing.parseISO8601(args.startAtISO8601)
        let end = try DateParsing.parseISO8601(args.endAtISO8601)
        guard end > start else { throw CalendarServiceError.invalidEventDates }

        let event = EKEvent(eventStore: eventStore)
        event.title = args.title
        event.startDate = start
        event.endDate = end
        event.notes = args.notes
        event.location = args.location
        event.calendar = calendar

        try eventStore.save(event, span: .thisEvent, commit: true)
        return "Evento creato: \(args.title)"
    }

    private func ensureCalendarAccess() async throws {
        let status = EKEventStore.authorizationStatus(for: .event)

        if #available(iOS 17.0, *) {
            switch status {
            case .fullAccess, .writeOnly:
                return
            case .notDetermined:
                let granted = try await eventStore.requestFullAccessToEvents()
                if granted { return }
                throw CalendarServiceError.calendarAccessDenied
            default:
                throw CalendarServiceError.calendarAccessDenied
            }
        } else {
            switch status {
            case .authorized:
                return
            case .notDetermined:
                let granted = try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Bool, Error>) in
                    eventStore.requestAccess(to: .event) { granted, error in
                        if let error { continuation.resume(throwing: error) }
                        else { continuation.resume(returning: granted) }
                    }
                }
                if granted { return }
                throw CalendarServiceError.calendarAccessDenied
            default:
                throw CalendarServiceError.calendarAccessDenied
            }
        }
    }

    private func ensureReminderAccess() async throws {
        let status = EKEventStore.authorizationStatus(for: .reminder)

        if #available(iOS 17.0, *) {
            switch status {
            case .fullAccess:
                return
            case .notDetermined:
                let granted = try await eventStore.requestFullAccessToReminders()
                if granted { return }
                throw CalendarServiceError.remindersAccessDenied
            default:
                throw CalendarServiceError.remindersAccessDenied
            }
        } else {
            switch status {
            case .authorized:
                return
            case .notDetermined:
                let granted = try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Bool, Error>) in
                    eventStore.requestAccess(to: .reminder) { granted, error in
                        if let error { continuation.resume(throwing: error) }
                        else { continuation.resume(returning: granted) }
                    }
                }
                if granted { return }
                throw CalendarServiceError.remindersAccessDenied
            default:
                throw CalendarServiceError.remindersAccessDenied
            }
        }
    }
}
