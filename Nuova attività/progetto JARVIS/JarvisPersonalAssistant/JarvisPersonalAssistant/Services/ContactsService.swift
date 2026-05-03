import Contacts
import Foundation

struct ContactMatch: Codable, Equatable {
    let displayName: String
    let phoneNumbers: [String]
    let emailAddresses: [String]
}

enum ContactsServiceError: LocalizedError {
    case accessDenied
    case noMatch(String)
    case missingPhone(String)
    case missingEmail(String)

    var errorDescription: String? {
        switch self {
        case .accessDenied:
            return "Accesso ai contatti negato. Apri Impostazioni > Privacy e sicurezza > Contatti e abilita JARVIS."
        case .noMatch(let query):
            return "Nessun contatto trovato per \"\(query)\"."
        case .missingPhone(let name):
            return "Il contatto \"\(name)\" non ha un numero di telefono utilizzabile."
        case .missingEmail(let name):
            return "Il contatto \"\(name)\" non ha un'email utilizzabile."
        }
    }
}

final class ContactsService {
    private let store = CNContactStore()

    func requestAccessIfNeeded() async throws {
        let status = CNContactStore.authorizationStatus(for: .contacts)
        switch status {
        case .authorized:
            return
        case .notDetermined:
            let granted = try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Bool, Error>) in
                store.requestAccess(for: .contacts) { granted, error in
                    if let error { continuation.resume(throwing: error) }
                    else { continuation.resume(returning: granted) }
                }
            }
            if !granted { throw ContactsServiceError.accessDenied }
        default:
            throw ContactsServiceError.accessDenied
        }
    }

    func search(query: String, limit: Int = 5) async throws -> [ContactMatch] {
        try await requestAccessIfNeeded()

        let keys: [CNKeyDescriptor] = [
            CNContactGivenNameKey as CNKeyDescriptor,
            CNContactFamilyNameKey as CNKeyDescriptor,
            CNContactOrganizationNameKey as CNKeyDescriptor,
            CNContactPhoneNumbersKey as CNKeyDescriptor,
            CNContactEmailAddressesKey as CNKeyDescriptor
        ]

        let predicate = CNContact.predicateForContacts(matchingName: query)
        let contacts = try store.unifiedContacts(matching: predicate, keysToFetch: keys)

        let normalizedQuery = query.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
        let mapped = contacts.map(Self.mapContact)
        if !mapped.isEmpty { return Array(mapped.prefix(limit)) }

        var results: [ContactMatch] = []
        let request = CNContactFetchRequest(keysToFetch: keys)
        try store.enumerateContacts(with: request) { contact, stop in
            let match = Self.mapContact(contact)
            let haystack = ([match.displayName] + match.phoneNumbers + match.emailAddresses)
                .joined(separator: " ")
                .lowercased()
            if haystack.contains(normalizedQuery) {
                results.append(match)
            }
            if results.count >= limit { stop.pointee = true }
        }
        return results
    }

    func bestPhone(for name: String) async throws -> String {
        let matches = try await search(query: name, limit: 1)
        guard let first = matches.first else { throw ContactsServiceError.noMatch(name) }
        guard let phone = first.phoneNumbers.first else { throw ContactsServiceError.missingPhone(first.displayName) }
        return sanitizePhone(phone)
    }

    func bestEmail(for name: String) async throws -> String {
        let matches = try await search(query: name, limit: 1)
        guard let first = matches.first else { throw ContactsServiceError.noMatch(name) }
        guard let email = first.emailAddresses.first else { throw ContactsServiceError.missingEmail(first.displayName) }
        return email
    }

    private static func mapContact(_ contact: CNContact) -> ContactMatch {
        let components = [contact.givenName, contact.familyName]
            .filter { !$0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
        let name = components.isEmpty ? contact.organizationName : components.joined(separator: " ")
        return ContactMatch(
            displayName: name.isEmpty ? "Contatto senza nome" : name,
            phoneNumbers: contact.phoneNumbers.map { $0.value.stringValue },
            emailAddresses: contact.emailAddresses.map { String($0.value) }
        )
    }

    private func sanitizePhone(_ value: String) -> String {
        value.filter { char in
            char.isNumber || char == "+"
        }
    }
}
