# Admin security: encrypted personal data + device-bound admin access

Two protections, both set up in **/admin -> Security**.

1. **Personal data is encrypted for the admin only.** Support requests (contacts, message, screenshot), question reports (note,
   contacts), purchases (buyer email, the Gumroad ping) and payment events (ping payload) are sealed with the admin's PUBLIC key
   (`ADMIN_SEAL_PUBLIC_KEY`) before they reach the database. Only the admin's browser holds the private key (IndexedDB, not
   extractable), so the server, Supabase and Vercel can't read them. Formats: `src/lib/seal-format.ts`.
2. **Admin APIs need a device signature.** Besides the admin email check, every `/api/admin/*` request carries an ECDSA signature
   from a key that lives in the admin's browser. Allowed browsers' public keys are in `ADMIN_DEVICE_KEYS` (comma-separated).
   The signature covers time (valid 2 minutes), method and path + query. Code: `src/lib/admin.ts`, `src/lib/admin-keys.ts`.

Support emails (Resend copies) are gone: requests only show on the admin dashboard.

## Setup order

1. Run `supabase/sealed.sql` (`npm run db:apply -- supabase/sealed.sql`, or paste it into the Supabase SQL Editor).
2. Open /admin (signed in as the admin) -> **Security**. **Device key first.** Step 1 "This device": create the device key, copy it into
   `ADMIN_DEVICE_KEYS` (Vercel -> Settings -> Environment Variables, and `.env.local` for localhost). Restart / redeploy.
   Keys are per browser AND per site address: localhost and the real domain each need their own (separate keys, comma-separated).
3. Step 2 "Decryption key": create it (passphrase, min. 12 characters), keep the downloaded `stellar-admin-key.json` safe, copy the
   public key into `ADMIN_SEAL_PUBLIC_KEY` (Vercel + `.env.local`). Restart / redeploy. Until BOTH `ADMIN_DEVICE_KEYS` and
   `ADMIN_SEAL_PUBLIC_KEY` are set (and the seal key isn't one of the device keys), the support and report forms answer 503
   and payments are stored without email / raw ping.
4. Encrypt the rows that already exist: `npm run data:seal` prints the Supabase host, the seal key's fingerprint (must match the one in
   Security) and the row counts, and changes nothing. Then `npm run data:seal -- --yes` seals them (support requests, question
   reports, purchases, payment events, screenshots). Safe to re-run. It refuses if `ADMIN_SEAL_PUBLIC_KEY` is also in `ADMIN_DEVICE_KEYS`.

The two keys look alike (both P-256 public keys): `ADMIN_DEVICE_KEYS` takes the DEVICE key, `ADMIN_SEAL_PUBLIC_KEY` the DECRYPTION key.
Security shows a short fingerprint next to each, and warns loudly if the device key ends up in the seal variable (sealing is then off).

Replacing the device key: "Make a new device key" keeps the working one signing; add the new key to `ADMIN_DEVICE_KEYS` next to the
old one, redeploy, then "Check again": once the server accepts the new key it becomes the active one.

After creating the decryption key you must verify the backup (pick the downloaded file, type its passphrase) before the public key for
the server is shown.

## Losing keys

The private key exists only in the browser that created it plus the passphrase-protected backup file. Lose both (or the passphrase)
and the encrypted data is gone for good. On a new browser or after clearing site data: Security -> "Restore from backup file".
Creating a new key (offered only while this browser's key doesn't match the server's) archives the old key in this browser, which still
opens old data here, but only its own backup file can restore it elsewhere.

**Browser storage:** the key lives in IndexedDB. Safari deletes a site's data after about 7 days without a visit, so there the backup file
is the only real copy; use Chrome or Edge for the admin and keep the backup file safe.
