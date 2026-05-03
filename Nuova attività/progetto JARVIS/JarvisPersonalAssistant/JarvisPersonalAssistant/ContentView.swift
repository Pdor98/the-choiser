import SwiftUI

struct ContentView: View {
    @StateObject private var settings: SettingsStore
    @StateObject private var toolExecutor: ToolExecutor
    @StateObject private var viewModel: AssistantViewModel
    @StateObject private var speechRecognizer = SpeechRecognizer()

    init() {
        let settings = SettingsStore()
        let executor = ToolExecutor()
        _settings = StateObject(wrappedValue: settings)
        _toolExecutor = StateObject(wrappedValue: executor)
        _viewModel = StateObject(wrappedValue: AssistantViewModel(settings: settings, toolExecutor: executor))
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                ScrollViewReader { proxy in
                    ScrollView {
                        LazyVStack(alignment: .leading, spacing: 12) {
                            ForEach(viewModel.messages) { message in
                                MessageBubble(message: message)
                                    .id(message.id)
                            }

                            PendingActionsView(
                                actions: toolExecutor.pendingActions,
                                onConfirm: { action in Task { await viewModel.confirm(action) } },
                                onCancel: { action in viewModel.cancel(action) }
                            )
                            .id("pending-actions")
                        }
                        .padding()
                    }
                    .onChange(of: viewModel.messages.count) { _ in
                        withAnimation { proxy.scrollTo(viewModel.messages.last?.id, anchor: .bottom) }
                    }
                    .onChange(of: toolExecutor.pendingActions.count) { _ in
                        withAnimation { proxy.scrollTo("pending-actions", anchor: .bottom) }
                    }
                }

                Divider()

                inputBar
                    .padding()
                    .background(.bar)
            }
            .navigationTitle("JARVIS")
            .toolbar {
                NavigationLink(destination: SettingsPanel(settings: settings)) {
                    Image(systemName: "gearshape")
                }
            }
            .task { await viewModel.consumeShortcutPromptIfPresent() }
            .alert("Errore", isPresented: Binding(
                get: { viewModel.errorMessage != nil },
                set: { if !$0 { viewModel.errorMessage = nil } }
            )) {
                Button("OK", role: .cancel) { viewModel.errorMessage = nil }
            } message: {
                Text(viewModel.errorMessage ?? "")
            }
        }
    }

    private var inputBar: some View {
        VStack(spacing: 8) {
            if speechRecognizer.isRecording || !speechRecognizer.transcript.isEmpty {
                HStack(alignment: .top) {
                    Text(speechRecognizer.transcript.isEmpty ? "Sto ascoltando..." : speechRecognizer.transcript)
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                    Spacer()
                    if !speechRecognizer.transcript.isEmpty {
                        Button("Usa") {
                            viewModel.inputText = speechRecognizer.transcript
                            speechRecognizer.stop()
                        }
                    }
                }
            }

            HStack(spacing: 10) {
                Button {
                    Task {
                        if speechRecognizer.isRecording {
                            speechRecognizer.stop()
                            viewModel.inputText = speechRecognizer.transcript
                        } else {
                            do { try await speechRecognizer.start() }
                            catch { viewModel.errorMessage = error.localizedDescription }
                        }
                    }
                } label: {
                    Image(systemName: speechRecognizer.isRecording ? "stop.circle.fill" : "mic.circle.fill")
                        .font(.title2)
                }
                .accessibilityLabel(speechRecognizer.isRecording ? "Ferma dettatura" : "Avvia dettatura")

                TextField("Chiedi qualcosa...", text: $viewModel.inputText, axis: .vertical)
                    .textFieldStyle(.roundedBorder)
                    .lineLimit(1...4)
                    .disabled(viewModel.isSending)

                Button {
                    Task { await viewModel.sendCurrentInput() }
                } label: {
                    if viewModel.isSending {
                        ProgressView()
                    } else {
                        Image(systemName: "paperplane.fill")
                    }
                }
                .buttonStyle(.borderedProminent)
                .disabled(viewModel.inputText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || viewModel.isSending)
            }
        }
    }
}

#Preview {
    ContentView()
}
