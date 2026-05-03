import Foundation

enum DateParsingError: LocalizedError {
    case invalidDate(String)

    var errorDescription: String? {
        switch self {
        case .invalidDate(let value):
            return "Data non valida: \(value). Usa ISO-8601, per esempio 2026-04-29T18:00:00+02:00."
        }
    }
}

enum DateParsing {
    static func parseISO8601(_ value: String) throws -> Date {
        let formatterWithFraction = ISO8601DateFormatter()
        formatterWithFraction.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        if let date = formatterWithFraction.date(from: value) { return date }

        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime]
        if let date = formatter.date(from: value) { return date }

        throw DateParsingError.invalidDate(value)
    }

    static func dateComponents(for date: Date) -> DateComponents {
        Calendar.current.dateComponents([.era, .year, .month, .day, .hour, .minute, .second, .timeZone], from: date)
    }
}
