#### 13.7.4.3 SET NAMES Statement

```sql
SET NAMES {'charset_name'
    [COLLATE 'collation_name'] | DEFAULT}
```

This statement sets the three session system variables [`character_set_client`](server-system-variables.html#sysvar_character_set_client), [`character_set_connection`](server-system-variables.html#sysvar_character_set_connection), and [`character_set_results`](server-system-variables.html#sysvar_character_set_results) to the given character set. Setting [`character_set_connection`](server-system-variables.html#sysvar_character_set_connection) to `charset_name` also sets [`collation_connection`](server-system-variables.html#sysvar_collation_connection) to the default collation for `charset_name`. See [Section 10.4, “Connection Character Sets and Collations”](charset-connection.html "10.4 Connection Character Sets and Collations").

The optional `COLLATE` clause may be used to specify a collation explicitly. If given, the collation must one of the permitted collations for *`charset_name`*.

*`charset_name`* and *`collation_name`* may be quoted or unquoted.

The default mapping can be restored by using a value of `DEFAULT`. The default depends on the server configuration.

Some character sets cannot be used as the client character set. Attempting to use them with [`SET NAMES`](set-names.html "13.7.4.3 SET NAMES Statement") produces an error. See [Impermissible Client Character Sets](charset-connection.html#charset-connection-impermissible-client-charset "Impermissible Client Character Sets").
