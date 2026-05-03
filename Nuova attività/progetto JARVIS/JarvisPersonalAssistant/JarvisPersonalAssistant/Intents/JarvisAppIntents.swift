import AppIntents
import Foundation

enum JarvisShortcutKeys {
    static let pendingPrompt = "jarvis.pendingShortcutPrompt"
}

struct AskJarvisIntent: AppIntent {
    static var title: LocalizedStringResource = "Chiedi a JARVIS"
    static var description = IntentDescription("Invia una richiesta a JARVIS e apre l'app per eseguirla con eventuali conferme.")
    static var openAppWhenRun: Bool = true

    @Parameter(title: "Richiesta")
    var prompt: String

    static var parameterSummary: some ParameterSummary {
        Summary("Chiedi a JARVIS \(\.$prompt)")
    }

    func perform() async throws -> some IntentResult {
        UserDefaults.standard.set(prompt, forKey: JarvisShortcutKeys.pendingPrompt)
        return .result()
    }
}

struct JarvisShortcutsProvider: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: AskJarvisIntent(),
            phrases: [
                "Chiedi a \(.applicationName)",
                "Di a \(.applicationName)",
                "Parla con \(.applicationName)"
            ],
            shortTitle: "Chiedi",
            systemImageName: "sparkles"
        )
    }
}
