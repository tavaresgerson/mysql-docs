#### 13.7.4.3 SET NAMES Statement

```sql
SET NAMES {'charset_name'
    [COLLATE 'collation_name'] | DEFAULT}
```

Esta instrução define as três variáveis de sistema de sessão [`character_set_client`](server-system-variables.html#sysvar_character_set_client), [`character_set_connection`](server-system-variables.html#sysvar_character_set_connection) e [`character_set_results`](server-system-variables.html#sysvar_character_set_results) para o character set fornecido. Definir [`character_set_connection`](server-system-variables.html#sysvar_character_set_connection) para `charset_name` também define [`collation_connection`](server-system-variables.html#sysvar_collation_connection) para o collation padrão para `charset_name`. Consulte [Seção 10.4, “Connection Character Sets and Collations”](charset-connection.html "10.4 Connection Character Sets and Collations").

A cláusula opcional `COLLATE` pode ser usada para especificar um collation explicitamente. Se fornecido, o collation deve ser um dos collations permitidos para *`charset_name`*.

*`charset_name`* e *`collation_name`* podem estar entre aspas ou sem aspas.

O mapeamento padrão pode ser restaurado usando o valor `DEFAULT`. O padrão depende da configuração do servidor.

Alguns character sets não podem ser usados como o character set do cliente. Tentar usá-los com [`SET NAMES`](set-names.html "13.7.4.3 SET NAMES Statement") gera um erro. Consulte [Impermissible Client Character Sets](charset-connection.html#charset-connection-impermissible-client-charset "Impermissible Client Character Sets").