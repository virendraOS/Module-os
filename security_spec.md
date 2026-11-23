# Security Specification — Xelvion Auth, Profiles, Consultations & Bookmarks

## 1. Data Invariants
1. **Identity Isolation (`users/{userId}`)**: A `UserProfile` document can only be created, read, or updated by the authenticated owner whose `request.auth.uid == userId`, or read by a bootstrapped verified admin (`skylarkvirendra@gmail.com` or `virendrasinghrawaat@gmail.com` with `request.auth.token.email_verified == true`).
2. **Master Gate on Subcollections**: `/users/{userId}/consultations/{consultationId}` and `/users/{userId}/bookmarks/{serviceId}` strictly verify parent `/users/{userId}` document existence via `exists(...)` on writes/single-doc reads while keeping `allow list` lookup-free using `resource.data.uid == userId`.
3. **Verified Email Mandate**: All writes require `request.auth.token.email_verified == true`.
4. **Immutable Ownership, Status State & Timestamps**: `uid`, `email`, `referenceId`, `serviceId`, and `createdAt` cannot be modified after creation. `createdAt == request.time` on create; consultation `status` must start as `'New'` on client creation and can only transition under admin privilege.
5. **Strict Keys (Anti-Shadow Fields)**: Every collection validates `hasAll` and `hasOnly` allowlists plus strict `.size()` and regex bounds matching `firebase-blueprint.json`.

## 2. "Dirty Dozen" Adversarial Payloads (All Must Return PERMISSION_DENIED)
1. **Unauthenticated Read**: `GET /users/uid123` or `LIST /users/uid123/consultations` with `auth = null`.
2. **Cross-User PII Read**: `GET /users/uid_victim/consultations/XIT-100001` as `auth.uid = uid_attacker`.
3. **Root Collection List Scraping**: `LIST /users` as any signed-in non-admin or signed-in user.
4. **Unverified Email Create**: `CREATE /users/uid123/bookmarks/cloud-services` with `auth.token.email_verified = false`.
5. **UID Spoofing on Subcollection Create**: `CREATE /users/uid123/consultations/XIT-100001` with `uid: "uid_other"` while `auth.uid = "uid123"`.
6. **Email Spoofing on Create**: `CREATE /users/uid123` with `email: "spoof@evil.com"` != `auth.token.email`.
7. **Shadow Field Injection (Privilege Escalation)**: `CREATE` or `UPDATE` on `users`, `consultations`, or `bookmarks` including `{ isAdmin: true }` or `{ role: "admin" }`.
8. **State Shortcutting on Consultation Create**: `CREATE /users/uid123/consultations/XIT-100001` with `status: "Won"` instead of `"New"`.
9. **Unauthorized Consultation Status Escalation**: Non-admin attempting `UPDATE /users/uid123/consultations/XIT-100001` to set `status: "Won"`.
10. **Forged `createdAt` Timestamp**: `CREATE /users/uid123/bookmarks/cloud-services` with client-provided `createdAt` != `request.time`.
11. **Value Poisoning (Oversized Message / Invalid Phone)**: `CREATE /users/uid123/consultations/XIT-100001` with `message` > 1500 chars or `phone: "<script>"`.
12. **Path Variable ID Poisoning**: `CREATE /users/uid123/consultations/bad$id*chars` or > 128 chars.
