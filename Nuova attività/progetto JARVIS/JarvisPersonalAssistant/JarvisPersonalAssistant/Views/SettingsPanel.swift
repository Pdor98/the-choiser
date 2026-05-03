import SwiftUI

struct SettingsPanel: View {
    @ObservedObject var settings: SettingsStore
    @State private var localError: String?

    var body: some View {
        Form {
            Section("AI Cloud") {
                TextField("Backend URL", text: $settings.backendBaseURL)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .keyboardType(.URL)

                if settings.hasCloudBackend {
                    Text("JARVIS usa il backend cloud configurato qui sopra e non ha bisogno di una OpenAI API key dentro l'app.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                } else if settings.hasAPIKey {
                    Text("Nessun backend cloud configurato. Rimane disponibile il fallback diretto tramite API key locale.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                } else {
                    Text("Senza backend cloud configurato JARVIS torna in modalita locale. In simulatore puoi usare `http://localhost:8000`.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }

                TextField("Modello", text: $settings.model)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                Text("Lascia vuoto per usare il modello predefinito del backend.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }

            if settings.hasAPIKey {
                Section("Fallback Locale") {
                    Button("Rimuovi API key locale", role: .destructive) {
                        do { try settings.deleteAPIKey() }
                        catch { localError = error.localizedDescription }
                    }
                }
            }

            Section("Voce") {
                Toggle("Leggi risposte ad alta voce", isOn: $settings.speakResponses)
            }

            Section("Sicurezza") {
                Text("JARVIS non invia messaggi/email in automatico e non salva eventi o promemoria senza la tua conferma.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }

            if let localError {
                Section("Errore") {
                    Text(localError).foregroundStyle(.red)
                }
            }
        }
        .navigationTitle("Impostazioni")
    }
}
