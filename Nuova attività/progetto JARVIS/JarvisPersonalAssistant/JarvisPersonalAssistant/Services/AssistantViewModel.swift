import Foundation
import Combine

private enum AssistantShortcutKeys {
    static let pendingPrompt = "jarvis.pendingShortcutPrompt"
}

@MainActor
private enum LocalAssistant {
    static func handle(_ text: String, with toolExecutor: ToolExecutor) async -> String {
        do {
            if let response = try handleReminder(text, with: toolExecutor) {
                return response
            }
            if let response = try handleEvent(text, with: toolExecutor) {
                return response
            }
        } catch {
            return "Non sono riuscito a preparare l'azione locale: \(error.localizedDescription)"
        }

        return """
        JARVIS e in modalita locale. Posso gia preparare promemoria ed eventi con conferma.
        Prova per esempio con: "Ricordami domani alle 9 di chiamare Marco" oppure "Crea un evento venerdi alle 18 chiamato palestra".
        """
    }

    private static func handleReminder(_ text: String, with toolExecutor: ToolExecutor) throws -> String? {
        let normalized = text.lowercased()
        let keywords = ["ricordami", "promemoria", "ricorda di", "ricordare"]
        guard keywords.contains(where: { normalized.contains($0) }) else { return nil }

        let dates = detectDates(in: text)
        let title = cleanupReminderTitle(text, dateRanges: dates.map(\.range))
        let dueDate = dates.first?.date
        _ = try toolExecutor.queueLocalReminder(title: title, notes: nil, dueDate: dueDate)

        if let dueDate {
            return "Ho preparato un promemoria locale con conferma per \"\(title)\" alle \(formatDate(dueDate))."
        }
        return "Ho preparato un promemoria locale con conferma per \"\(title)\"."
    }

    private static func handleEvent(_ text: String, with toolExecutor: ToolExecutor) throws -> String? {
        let normalized = text.lowercased()
        let keywords = ["crea un evento", "aggiungi un evento", "evento", "calendario"]
        guard keywords.contains(where: { normalized.contains($0) }) else { return nil }

        let dates = detectDates(in: text)
        guard let startDate = dates.first?.date else {
            return "Posso creare eventi anche in modalita locale, ma mi serve almeno una data o un orario chiaro."
        }

        let endDate = dates.dropFirst().first?.date ?? Calendar.current.date(byAdding: .hour, value: 1, to: startDate) ?? startDate.addingTimeInterval(3600)
        let title = cleanupEventTitle(text, dateRanges: dates.map(\.range))
        _ = try toolExecutor.queueLocalCalendarEvent(title: title, startDate: startDate, endDate: endDate, notes: nil, location: nil)

        return "Ho preparato un evento locale con conferma: \"\(title)\" dalle \(formatDate(startDate)) alle \(formatDate(endDate))."
    }

    private static func detectDates(in text: String) -> [NSTextCheckingResult] {
        guard let detector = try? NSDataDetector(types: NSTextCheckingResult.CheckingType.date.rawValue) else {
            return []
        }

        let range = NSRange(text.startIndex..<text.endIndex, in: text)
        return detector.matches(in: text, options: [], range: range).filter { $0.date != nil }
    }

    private static func cleanupReminderTitle(_ text: String, dateRanges: [NSRange]) -> String {
        var cleaned = removingRanges(dateRanges, from: text)
        let patterns = [
            "ricordami di", "ricordami", "ricorda di", "crea un promemoria", "aggiungi un promemoria", "promemoria"
        ]
        for pattern in patterns {
            cleaned = cleaned.replacingOccurrences(of: pattern, with: "", options: [.caseInsensitive, .diacriticInsensitive])
        }
        return normalizeTitle(cleaned, fallback: "Promemoria")
    }

    private static func cleanupEventTitle(_ text: String, dateRanges: [NSRange]) -> String {
        var cleaned = removingRanges(dateRanges, from: text)
        let patterns = [
            "crea un evento", "aggiungi un evento", "crea evento", "aggiungi evento", "evento", "calendario", "chiamato", "intitolato"
        ]
        for pattern in patterns {
            cleaned = cleaned.replacingOccurrences(of: pattern, with: "", options: [.caseInsensitive, .diacriticInsensitive])
        }
        return normalizeTitle(cleaned, fallback: "Nuovo evento")
    }

    private static func removingRanges(_ ranges: [NSRange], from text: String) -> String {
        guard !ranges.isEmpty else { return text }
        var result = text
        for range in ranges.sorted(by: { $0.location > $1.location }) {
            guard let stringRange = Range(range, in: result) else { continue }
            result.removeSubrange(stringRange)
        }
        return result
    }

    private static func normalizeTitle(_ text: String, fallback: String) -> String {
        let separators = CharacterSet(charactersIn: " ,.-:;")
        let trimmed = text.trimmingCharacters(in: separators.union(.whitespacesAndNewlines))
        return trimmed.isEmpty ? fallback : trimmed
    }

    private static func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "it_IT")
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}

@MainActor
final class AssistantViewModel: ObservableObject {
    @Published var messages: [ChatMessage] = [
        ChatMessage(role: .assistant, content: "Ciao, sono JARVIS. Posso aiutarti con promemoria, calendario, contatti, bozze messaggi/email e organizzazione quotidiana. Scrivi o detta una richiesta.")
    ]
    @Published var inputText = ""
    @Published var isSending = false
    @Published var errorMessage: String?

    private let settings: SettingsStore
    private let toolExecutor: ToolExecutor
    private let client = OpenAIResponsesClient()
    private let speaker = SpeechSpeaker()

    init(settings: SettingsStore, toolExecutor: ToolExecutor) {
        self.settings = settings
        self.toolExecutor = toolExecutor
    }

    func sendCurrentInput() async {
        let text = inputText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return }
        inputText = ""
        await send(text)
    }

    func send(_ text: String) async {
        guard settings.hasCloudBackend || settings.hasAPIKey else {
            let localReply = await LocalAssistant.handle(text, with: toolExecutor)
            messages.append(ChatMessage(role: .user, content: text))
            messages.append(ChatMessage(role: .assistant, content: localReply))
            if settings.speakResponses { speaker.speak(localReply) }
            return
        }
        guard !isSending else { return }

        isSending = true
        errorMessage = nil
        messages.append(ChatMessage(role: .user, content: text))

        do {
            var input = buildInputMessages()
            var finalText = ""

            for _ in 0..<3 {
                let response = try await client.createResponse(
                    input: input,
                    backendBaseURL: settings.backendBaseURL,
                    apiKey: settings.apiKey,
                    model: settings.model
                )
                input.append(contentsOf: response.outputRaw)

                if response.functionCalls.isEmpty {
                    finalText = response.outputText
                    break
                }

                for call in response.functionCalls {
                    let result = try await toolExecutor.executeToolCall(call)
                    input.append([
                        "type": "function_call_output",
                        "call_id": call.callID,
                        "output": result
                    ])
                }
            }

            if finalText.isEmpty {
                finalText = "Ho preparato l'azione. Controlla le conferme qui sotto."
            }

            messages.append(ChatMessage(role: .assistant, content: finalText))
            if settings.speakResponses { speaker.speak(finalText) }
        } catch {
            if settings.hasCloudBackend && !settings.hasAPIKey {
                let localReply = await LocalAssistant.handle(text, with: toolExecutor)
                let message = """
                Cloud non disponibile in questo momento: \(error.localizedDescription)

                \(localReply)
                """
                messages.append(ChatMessage(role: .assistant, content: message))
                if settings.speakResponses { speaker.speak(localReply) }
                isSending = false
                return
            }
            let message = error.localizedDescription
            errorMessage = message
            messages.append(ChatMessage(role: .assistant, content: "Errore: \(message)"))
        }

        isSending = false
    }

    func confirm(_ action: PendingAction) async {
        do {
            let result = try await toolExecutor.confirm(action)
            let message = "Fatto: \(result)"
            messages.append(ChatMessage(role: .assistant, content: message))
            if settings.speakResponses { speaker.speak(message) }
        } catch {
            let message = "Non sono riuscito a completare l'azione: \(error.localizedDescription)"
            messages.append(ChatMessage(role: .assistant, content: message))
            errorMessage = message
        }
    }

    func cancel(_ action: PendingAction) {
        toolExecutor.cancel(action)
        messages.append(ChatMessage(role: .assistant, content: "Azione annullata: \(action.title)."))
    }

    func consumeShortcutPromptIfPresent() async {
        guard let prompt = UserDefaults.standard.string(forKey: AssistantShortcutKeys.pendingPrompt), !prompt.isEmpty else { return }
        UserDefaults.standard.removeObject(forKey: AssistantShortcutKeys.pendingPrompt)
        await send(prompt)
    }

    private func buildInputMessages() -> [[String: Any]] {
        messages.suffix(18).compactMap { message in
            switch message.role {
            case .user:
                return ["role": "user", "content": message.content]
            case .assistant:
                return ["role": "assistant", "content": message.content]
            case .system:
                return nil
            }
        }
    }
}
