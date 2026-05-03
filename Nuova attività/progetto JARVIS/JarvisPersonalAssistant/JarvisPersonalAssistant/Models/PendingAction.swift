import Foundation

struct PendingAction: Identifiable, Codable, Equatable {
    let id: UUID
    let toolName: String
    let title: String
    let detail: String
    let argumentsJSON: String
    let createdAt: Date

    init(id: UUID = UUID(), toolName: String, title: String, detail: String, argumentsJSON: String, createdAt: Date = Date()) {
        self.id = id
        self.toolName = toolName
        self.title = title
        self.detail = detail
        self.argumentsJSON = argumentsJSON
        self.createdAt = createdAt
    }
}
