#### 25.12.9.2 The session_connect_attrs Table

Application programs can provide key-value connection attributes to be passed to the server at connect time. For descriptions of common attributes, see [Section 25.12.9, “Performance Schema Connection Attribute Tables”](performance-schema-connection-attribute-tables.html "25.12.9 Performance Schema Connection Attribute Tables").

The [`session_connect_attrs`](performance-schema-session-connect-attrs-table.html "25.12.9.2 The session_connect_attrs Table") table contains connection attributes for all sessions. To see connection attributes only for the current session, and other sessions associated with the session account, use the [`session_account_connect_attrs`](performance-schema-session-account-connect-attrs-table.html "25.12.9.1 The session_account_connect_attrs Table") table.

The [`session_connect_attrs`](performance-schema-session-connect-attrs-table.html "25.12.9.2 The session_connect_attrs Table") table has these columns:

* `PROCESSLIST_ID`

  The connection identifier for the session.

* `ATTR_NAME`

  The attribute name.

* `ATTR_VALUE`

  The attribute value.

* `ORDINAL_POSITION`

  The order in which the attribute was added to the set of connection attributes.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`session_connect_attrs`](performance-schema-session-connect-attrs-table.html "25.12.9.2 The session_connect_attrs Table") table.
