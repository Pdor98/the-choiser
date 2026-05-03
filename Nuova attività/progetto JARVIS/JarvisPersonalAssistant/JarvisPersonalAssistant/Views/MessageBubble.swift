import SwiftUI

struct MessageBubble: View {
    let message: ChatMessage

    var body: some View {
        HStack {
            if message.role == .user { Spacer(minLength: 48) }

            VStack(alignment: .leading, spacing: 6) {
                Text(message.role == .user ? "Tu" : "JARVIS")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Text(message.content)
                    .textSelection(.enabled)
            }
            .padding(12)
            .background(message.role == .user ? Color.accentColor.opacity(0.16) : Color.secondary.opacity(0.12))
            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))

            if message.role != .user { Spacer(minLength: 48) }
        }
    }
}
