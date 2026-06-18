#### 6.4.6.1 Elements of MySQL Enterprise Firewall

MySQL Enterprise Firewall is based on a plugin library that includes these elements:

* A server-side plugin named `MYSQL_FIREWALL` examines SQL statements before they execute and, based on the registered firewall profiles, renders a decision whether to execute or reject each statement.

* Server-side plugins named `MYSQL_FIREWALL_USERS` and `MYSQL_FIREWALL_WHITELIST` implement `INFORMATION_SCHEMA` tables that provide views into the registered profiles.

* Profiles are cached in memory for better performance. Tables in the `mysql` system database provide persistent backing storage of firewall data.

* Stored procedures perform tasks such as registering firewall profiles, establishing their operational mode, and managing transfer of firewall data between the in-memory cache and persistent storage.

* Administrative functions provide an API for lower-level tasks such as synchronizing the cache with persistent storage.

* System variables enable firewall configuration and status variables provide runtime operational information.
