#### 13.7.4.2 Instrução SET CHARACTER SET

```sql
SET {CHARACTER SET | CHARSET}
    {'charset_name' | DEFAULT}
```

Esta instrução mapeia todas as *strings* enviadas entre o *server* e o *client* atual com o *mapping* fornecido. `SET CHARACTER SET` define três *session system variables*: [`character_set_client`](server-system-variables.html#sysvar_character_set_client) e [`character_set_results`](server-system-variables.html#sysvar_character_set_results) são definidas para o *character set* fornecido, e [`character_set_connection`](server-system-variables.html#sysvar_character_set_connection) é definida para o valor de [`character_set_database`](server-system-variables.html#sysvar_character_set_database). Consulte [Seção 10.4, “Character Sets e Collations de Conexão”](charset-connection.html "10.4 Connection Character Sets and Collations").

*`charset_name`* pode estar entre aspas ou sem aspas.

O *character set mapping* padrão pode ser restaurado usando o valor `DEFAULT`. O padrão depende da configuração do *server*.

Alguns *character sets* não podem ser usados como o *client character set*. A tentativa de usá-los com [`SET CHARACTER SET`](set-character-set.html "13.7.4.2 SET CHARACTER SET Statement") resulta em um *error*. Consulte [Character Sets de Client Não Permitidos](charset-connection.html#charset-connection-impermissible-client-charset "Impermissible Client Character Sets").