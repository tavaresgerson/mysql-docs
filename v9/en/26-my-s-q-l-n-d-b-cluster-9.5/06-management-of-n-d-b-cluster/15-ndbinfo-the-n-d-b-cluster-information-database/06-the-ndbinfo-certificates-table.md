#### 25.6.15.6 The ndbinfo certificates Table

The `certificates` table provides information about the certificates used by nodes connecting with TLS link encryption (see Section 25.6.19.5, “TLS Link Encryption for NDB Cluster”).

The `certificates` table contains the following columns:

* `Node_id`

  ID of the node where this certificate is found

* `Name`

  Certificate name

* `Expires`

  Expiration date, in `mm-nnn-yyyy` format (for example, `18-Dec-2023`).

* `Serial`

  Serial number
