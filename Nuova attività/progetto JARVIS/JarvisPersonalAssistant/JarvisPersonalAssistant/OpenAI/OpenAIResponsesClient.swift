import Foundation

struct ToolCall: Equatable {
    let callID: String
    let name: String
    let arguments: String
}

struct OpenAIResponseResult {
    let outputText: String
    let outputRaw: [[String: Any]]
    let functionCalls: [ToolCall]
}

enum OpenAIClientError: LocalizedError {
    case invalidURL
    case invalidResponse
    case httpError(status: Int, message: String)
    case malformedJSON

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "URL OpenAI non valido."
        case .invalidResponse:
            return "Risposta OpenAI non valida."
        case .httpError(let status, let message):
            return "Errore OpenAI HTTP \(status): \(message)"
        case .malformedJSON:
            return "JSON OpenAI non leggibile."
        }
    }
}

final class OpenAIResponsesClient {
    private let session: URLSession

    init(session: URLSession = .shared) {
        self.session = session
    }

    func createResponse(input: [[String: Any]], backendBaseURL: String, apiKey: String, model: String) async throws -> OpenAIResponseResult {
        if !backendBaseURL.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            return try await createBackendResponse(input: input, backendBaseURL: backendBaseURL, model: model)
        }
        return try await createDirectResponse(input: input, apiKey: apiKey, model: model)
    }

    private func createDirectResponse(input: [[String: Any]], apiKey: String, model: String) async throws -> OpenAIResponseResult {
        guard let url = URL(string: "https://api.openai.com/v1/responses") else {
            throw OpenAIClientError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 60

        let resolvedModel = normalizedModel(from: model) ?? "gpt-4.1-mini"
        let body: [String: Any] = [
            "model": resolvedModel,
            "instructions": SystemPrompt.build(),
            "input": input,
            "tools": ToolSchemas.all,
            "parallel_tool_calls": false,
            "store": false
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: body, options: [])

        let (data, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse else {
            throw OpenAIClientError.invalidResponse
        }

        guard (200..<300).contains(http.statusCode) else {
            let message = String(data: data, encoding: .utf8) ?? "Nessun dettaglio"
            throw OpenAIClientError.httpError(status: http.statusCode, message: message)
        }

        guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            throw OpenAIClientError.malformedJSON
        }

        let outputRaw = json["output"] as? [[String: Any]] ?? []
        let outputText = Self.extractOutputText(from: json, outputRaw: outputRaw)
        let calls = Self.extractFunctionCalls(from: outputRaw)

        return OpenAIResponseResult(outputText: outputText, outputRaw: outputRaw, functionCalls: calls)
    }

    private func createBackendResponse(input: [[String: Any]], backendBaseURL: String, model: String) async throws -> OpenAIResponseResult {
        guard let url = Self.makeBackendResponsesURL(from: backendBaseURL) else {
            throw OpenAIClientError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 60

        var body: [String: Any] = [
            "instructions": SystemPrompt.build(),
            "input": input,
            "tools": ToolSchemas.all,
            "parallel_tool_calls": false,
            "store": false
        ]
        if let resolvedModel = normalizedModel(from: model) {
            body["model"] = resolvedModel
        }
        request.httpBody = try JSONSerialization.data(withJSONObject: body, options: [])

        let (data, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse else {
            throw OpenAIClientError.invalidResponse
        }

        guard (200..<300).contains(http.statusCode) else {
            let message = String(data: data, encoding: .utf8) ?? "Nessun dettaglio"
            throw OpenAIClientError.httpError(status: http.statusCode, message: message)
        }

        guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            throw OpenAIClientError.malformedJSON
        }

        let outputRaw = json["output"] as? [[String: Any]] ?? []
        let outputText = Self.extractOutputText(from: json, outputRaw: outputRaw)
        let calls = Self.extractFunctionCalls(from: outputRaw)

        return OpenAIResponseResult(outputText: outputText, outputRaw: outputRaw, functionCalls: calls)
    }

    private static func extractOutputText(from json: [String: Any], outputRaw: [[String: Any]]) -> String {
        if let text = json["output_text"] as? String, !text.isEmpty {
            return text.trimmingCharacters(in: .whitespacesAndNewlines)
        }

        var parts: [String] = []
        for item in outputRaw {
            guard let content = item["content"] as? [[String: Any]] else { continue }
            for part in content {
                if let text = part["text"] as? String {
                    parts.append(text)
                }
            }
        }
        return parts.joined(separator: "\n").trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private static func extractFunctionCalls(from outputRaw: [[String: Any]]) -> [ToolCall] {
        outputRaw.compactMap { item in
            guard item["type"] as? String == "function_call",
                  let callID = item["call_id"] as? String,
                  let name = item["name"] as? String,
                  let arguments = item["arguments"] as? String
            else { return nil }

            return ToolCall(callID: callID, name: name, arguments: arguments)
        }
    }

    private static func makeBackendResponsesURL(from baseURL: String) -> URL? {
        let trimmed = baseURL.trimmingCharacters(in: .whitespacesAndNewlines)
        guard var components = URLComponents(string: trimmed) else { return nil }

        let normalizedPath = components.path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        if normalizedPath.hasSuffix("api/v1/jarvis/responses") {
            return components.url
        }
        if normalizedPath.hasSuffix("api/v1/jarvis") {
            components.path = "/" + normalizedPath + "/responses"
            return components.url
        }
        if normalizedPath.hasSuffix("api/v1") {
            components.path = "/" + normalizedPath + "/jarvis/responses"
            return components.url
        }

        let prefix = normalizedPath.isEmpty ? "" : "/" + normalizedPath
        components.path = prefix + "/api/v1/jarvis/responses"
        return components.url
    }

    private func normalizedModel(from value: String) -> String? {
        let trimmed = value.trimmingCharacters(in: .whitespacesAndNewlines)
        return trimmed.isEmpty ? nil : trimmed
    }
}
