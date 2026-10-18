# Security Specification & Hardened Threat Matrix

## 1. Data Invariants
- **Identity Invariant**: A user document at `/users/{userId}` can only be created or modified if `request.auth.uid == userId`. No user can tamper with another user's profile.
- **Admin Privilege Escalation Guard**: The `role` field cannot be self-elevated to `admin` on create or update. Only whitelisted admin accounts (`shukla.mohit52@gmail.com`, `booksboon17@gmail.com`, `sgi181069@gmail.com`, `spiindia181069@gmail.com`) can access administrative functions.
- **Order Integrity**: A customer order at `/orders/{orderId}` must have `userId == request.auth.uid` on creation, and amounts cannot be negative.
- **Test Score Authenticity**: A test attempt at `/testAttempts/{attemptId}` must record `userId == request.auth.uid` and scores must not exceed valid upper bounds.
- **Default Deny**: All unspecified paths are closed by default.

## 2. The "Dirty Dozen" Threat Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated User Profile Write**: Unauthenticated client attempting to create `/users/fake-user-1`.
2. **Identity Spoofing in Profile**: Authenticated user `user_abc` attempting to create `/users/user_xyz`.
3. **Role Self-Escalation**: Student attempting to write `{ "role": "admin" }` to their user profile.
4. **Document ID Overflow Attack**: Attempting to write with a document ID longer than 128 characters.
5. **PII Scraping via Blanket List**: Unauthorized user querying `/users` without scoping to their own UID.
6. **Order Impersonation**: User `user_abc` submitting an order with `userId: "user_victim"`.
7. **Negative Order Amount**: Submitting an order with `totalAmount: -500`.
8. **Ghost Field Injection**: Adding arbitrary fields `{ "superAdminPrivileges": true }` to `/orders/ord_123`.
9. **Tampering with Another User's Order**: User `user_b` attempting to update an order owned by `user_a`.
10. **Test Score Forgery**: User `user_evil` submitting a test result with `userId: "user_good"`.
11. **Negative / NaN Test Score**: Submitting a test score with negative value or non-numeric type.
12. **Catch-All Path Intrusion**: Reading or writing to an undeclared collection `/system_secrets/config`.
