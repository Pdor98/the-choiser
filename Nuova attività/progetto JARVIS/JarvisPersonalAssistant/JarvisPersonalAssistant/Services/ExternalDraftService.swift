import Foundation
import UIKit

struct DraftMessageArguments: Codable {
    let recipientName: String
    let body: String
    let channel: String

    enum CodingKeys: String, CodingKey {
        case recipientName = "recipient_name"
        case body
        case channel
    }
}

struct DraftEmailArguments: Codable {
    let recipientName: String
    let subject: String
    let body: String

    enum CodingKeys: String, CodingKey {
        case recipientName = "recipient_name"
        case subject
        case body
    }
}

struct OpenURLArguments: Codable {
    let url: String
}

enum ExternalDraftServiceError: LocalizedError {
    case invalidURL(String)
    case cannotOpen(URL)
    case unsupportedChannel(String)

    var errorDescription: String? {
        switch self {
        case .invalidURL(let value):
            return "URL non valido: \(value)"
        case .cannotOpen(let url):
            return "Non posso aprire: \(url.absoluteString)"
        case .unsupportedChannel(let channel):
            return "Canale messaggi non supportato: \(channel)"
        }
    }
}

@MainActor
final class ExternalDraftService {
    func openMessageDraft(to phone: String, body: String, channel: String) async throws -> String {
        switch channel.lowercased() {
        case "sms":
            var components = URLComponents()
            components.scheme = "sms"
            components.path = phone
            components.queryItems = [URLQueryItem(name: "body", value: body)]
            guard let url = components.url else { throw ExternalDraftServiceError.invalidURL("sms") }
            try await open(url)
            return "Bozza SMS aperta. Invio manuale richiesto."
        case "whatsapp":
            var components = URLComponents(string: "whatsapp://send")
            components?.queryItems = [
                URLQueryItem(name: "phone", value: phone),
                URLQueryItem(name: "text", value: body)
            ]
            guard let url = components?.url else { throw ExternalDraftServiceError.invalidURL("whatsapp") }
            try await open(url)
            return "Bozza WhatsApp aperta. Invio manuale richiesto."
        default:
            throw ExternalDraftServiceError.unsupportedChannel(channel)
        }
    }

    func openEmailDraft(to email: String, subject: String, body: String) async throws -> String {
        var components = URLComponents()
        components.scheme = "mailto"
        components.path = email
        components.queryItems = [
            URLQueryItem(name: "subject", value: subject),
            URLQueryItem(name: "body", value: body)
        ]
        guard let url = components.url else { throw ExternalDraftServiceError.invalidURL("mailto") }
        try await open(url)
        return "Bozza email aperta. Invio manuale richiesto."
    }

    func openURL(_ value: String) async throws -> String {
        guard let url = URL(string: value), let scheme = url.scheme?.lowercased(), ["https", "http"].contains(scheme) else {
            throw ExternalDraftServiceError.invalidURL(value)
        }
        try await open(url)
        return "URL aperto: \(url.absoluteString)"
    }

    private func open(_ url: URL) async throws {
        guard UIApplication.shared.canOpenURL(url) || ["sms", "mailto", "http", "https"].contains(url.scheme?.lowercased() ?? "") else {
            throw ExternalDraftServiceError.cannotOpen(url)
        }

        let success = await withCheckedContinuation { continuation in
            UIApplication.shared.open(url, options: [:]) { success in
                continuation.resume(returning: success)
            }
        }
        if !success { throw ExternalDraftServiceError.cannotOpen(url) }
    }
}
