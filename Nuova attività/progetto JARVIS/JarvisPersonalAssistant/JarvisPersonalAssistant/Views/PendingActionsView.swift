import SwiftUI

struct PendingActionsView: View {
    let actions: [PendingAction]
    let onConfirm: (PendingAction) -> Void
    let onCancel: (PendingAction) -> Void

    var body: some View {
        if !actions.isEmpty {
            VStack(alignment: .leading, spacing: 12) {
                Text("Conferme richieste")
                    .font(.headline)

                ForEach(actions) { action in
                    VStack(alignment: .leading, spacing: 8) {
                        Text(action.title)
                            .font(.subheadline.bold())
                        Text(action.detail)
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                            .textSelection(.enabled)

                        HStack {
                            Button("Annulla", role: .cancel) { onCancel(action) }
                            Spacer()
                            Button("Conferma") { onConfirm(action) }
                                .buttonStyle(.borderedProminent)
                        }
                    }
                    .padding(12)
                    .background(Color.yellow.opacity(0.12))
                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                }
            }
            .padding(.vertical, 8)
        }
    }
}
