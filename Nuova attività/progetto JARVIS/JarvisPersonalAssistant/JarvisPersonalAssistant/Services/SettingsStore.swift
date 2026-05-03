import Foundation
import Combine

@MainActor
final class SettingsStore: ObservableObject {
    @Published var apiKey: String
    @Published var backendBaseURL: String {
        didSet { UserDefaults.standard.set(backendBaseURL, forKey: Self.backendURLKey) }
    }
    @Published var model: String {
        didSet { UserDefaults.standard.set(model, forKey: Self.modelKey) }
    }
    @Published var speakResponses: Bool {
        didSet { UserDefaults.standard.set(speakResponses, forKey: Self.speakKey) }
    }

    private static let backendURLKey = "jarvis.backendBaseURL"
    private static let modelKey = "jarvis.model"
    private static let speakKey = "jarvis.speakResponses"

    init() {
        self.apiKey = KeychainStore.loadAPIKey() ?? ""
        self.backendBaseURL = UserDefaults.standard.string(forKey: Self.backendURLKey) ?? Self.defaultBackendBaseURL
        self.model = UserDefaults.standard.string(forKey: Self.modelKey) ?? ""
        if UserDefaults.standard.object(forKey: Self.speakKey) == nil {
            self.speakResponses = true
        } else {
            self.speakResponses = UserDefaults.standard.bool(forKey: Self.speakKey)
        }
    }

    var hasAPIKey: Bool {
        !apiKey.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    var hasCloudBackend: Bool {
        !backendBaseURL.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    func saveAPIKey(_ key: String) throws {
        let trimmed = key.trimmingCharacters(in: .whitespacesAndNewlines)
        try KeychainStore.saveAPIKey(trimmed)
        apiKey = trimmed
    }

    func deleteAPIKey() throws {
        try KeychainStore.deleteAPIKey()
        apiKey = ""
    }

    private static var defaultBackendBaseURL: String {
#if targetEnvironment(simulator)
        return "http://localhost:8000"
#else
        return ""
#endif
    }
}
