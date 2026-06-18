#### 29.12.18.2 The keyring\_keys table

MySQL Server supports a keyring that enables internal server
components and plugins to securely store sensitive information
for later retrieval. See [Section 8.4.5, “The MySQL Keyring”](keyring.html "8.4.5 The MySQL Keyring").

The [`keyring_keys`](performance-schema-keyring-keys-table.html "29.12.18.2 The keyring_keys table") table exposes
metadata for keys in the keyring. Key metadata includes key
IDs, key owners, and backend key IDs. The
[`keyring_keys`](performance-schema-keyring-keys-table.html "29.12.18.2 The keyring_keys table") table does
*not* expose any sensitive keyring data
such as key contents.

The [`keyring_keys`](performance-schema-keyring-keys-table.html "29.12.18.2 The keyring_keys table") table has these
columns:

* `KEY_ID`

  The key identifier.

* `KEY_OWNER`

  The owner of the key.

* `BACKEND_KEY_ID`

  The ID used for the key by the keyring backend.

The [`keyring_keys`](performance-schema-keyring-keys-table.html "29.12.18.2 The keyring_keys table") table has no
indexes.

[`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") is not permitted
for the [`keyring_keys`](performance-schema-keyring-keys-table.html "29.12.18.2 The keyring_keys table") table.