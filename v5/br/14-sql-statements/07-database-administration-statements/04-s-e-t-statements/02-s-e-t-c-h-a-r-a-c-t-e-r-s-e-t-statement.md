#### 13.7.4.2 SET CHARACTER SET Statement

```sql
SET {CHARACTER SET | CHARSET}
    {'charset_name' | DEFAULT}
```

This statement maps all strings sent between the server and the current client with the given mapping. `SET CHARACTER SET` sets three session system variables: [`character_set_client`](server-system-variables.html#sysvar_character_set_client) and [`character_set_results`](server-system-variables.html#sysvar_character_set_results) are set to the given character set, and [`character_set_connection`](server-system-variables.html#sysvar_character_set_connection) to the value of [`character_set_database`](server-system-variables.html#sysvar_character_set_database). See [Section 10.4, “Connection Character Sets and Collations”](charset-connection.html "10.4 Connection Character Sets and Collations").

*`charset_name`* may be quoted or unquoted.

The default character set mapping can be restored by using the value `DEFAULT`. The default depends on the server configuration.

Some character sets cannot be used as the client character set. Attempting to use them with [`SET CHARACTER SET`](set-character-set.html "13.7.4.2 SET CHARACTER SET Statement") produces an error. See [Impermissible Client Character Sets](charset-connection.html#charset-connection-impermissible-client-charset "Impermissible Client Character Sets").
