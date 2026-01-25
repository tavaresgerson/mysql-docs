#### 16.4.1.37 Replication e Variáveis

Variáveis de sistema não são replicadas corretamente ao usar o modo `STATEMENT`, exceto pelas seguintes variáveis quando usadas com escopo de sessão (session scope):

* [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment)
* [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset)
* [`character_set_client`](server-system-variables.html#sysvar_character_set_client)
* [`character_set_connection`](server-system-variables.html#sysvar_character_set_connection)
* [`character_set_database`](server-system-variables.html#sysvar_character_set_database)
* [`character_set_server`](server-system-variables.html#sysvar_character_set_server)
* [`collation_connection`](server-system-variables.html#sysvar_collation_connection)
* [`collation_database`](server-system-variables.html#sysvar_collation_database)
* [`collation_server`](server-system-variables.html#sysvar_collation_server)
* [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks)
* [`identity`](server-system-variables.html#sysvar_identity)
* [`last_insert_id`](server-system-variables.html#sysvar_last_insert_id)
* [`lc_time_names`](server-system-variables.html#sysvar_lc_time_names)
* [`pseudo_thread_id`](server-system-variables.html#sysvar_pseudo_thread_id)
* [`sql_auto_is_null`](server-system-variables.html#sysvar_sql_auto_is_null)
* [`time_zone`](server-system-variables.html#sysvar_time_zone)
* [`timestamp`](server-system-variables.html#sysvar_timestamp)
* [`unique_checks`](server-system-variables.html#sysvar_unique_checks)

Quando o modo `MIXED` é usado, as variáveis na lista anterior, quando utilizadas com escopo de sessão, causam uma mudança do log baseado em statement (statement-based logging) para o log baseado em linha (row-based logging). Consulte [Seção 5.4.4.3, “Mixed Binary Logging Format”](binary-log-mixed.html "5.4.4.3 Mixed Binary Logging Format").

[`sql_mode` ](server-system-variables.html#sysvar_sql_mode) também é replicado, exceto pelo modo [`NO_DIR_IN_CREATE`](sql-mode.html#sqlmode_no_dir_in_create); a replica sempre preserva seu próprio valor para [`NO_DIR_IN_CREATE`](sql-mode.html#sqlmode_no_dir_in_create), independentemente das alterações feitas no source. Isso é válido para todos os formatos de Replication.

No entanto, quando o [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") analisa um statement `SET @@sql_mode = mode`, o valor *`mode`* completo, incluindo [`NO_DIR_IN_CREATE`](sql-mode.html#sqlmode_no_dir_in_create), é passado para o servidor receptor. Por esse motivo, a Replication de tal statement pode não ser segura quando o modo `STATEMENT` está em uso.

A variável de sistema [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) não é replicada, independentemente do modo de logging; isso se destina a facilitar a Replication entre diferentes Storage Engines.

A variável de sistema [`read_only`](server-system-variables.html#sysvar_read_only) não é replicada. Além disso, a habilitação desta variável tem efeitos diferentes em relação a Temporary Tables, Lock de tabelas e ao statement [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") em diferentes versões do MySQL.

A variável de sistema [`max_heap_table_size`](server-system-variables.html#sysvar_max_heap_table_size) não é replicada. Aumentar o valor desta variável no source sem fazer o mesmo na replica pode eventualmente levar a erros de *Table is full* na replica ao tentar executar statements [`INSERT`](insert.html "13.2.5 INSERT Statement") em uma tabela [`MEMORY`](memory-storage-engine.html "15.3 The MEMORY Storage Engine") no source que é, portanto, permitido crescer mais do que sua contraparte na replica. Para mais informações, consulte [Seção 16.4.1.20, “Replication and MEMORY Tables”](replication-features-memory.html "16.4.1.20 Replication and MEMORY Tables").

Em Replication baseada em statement, as variáveis de sessão não são replicadas corretamente quando usadas em statements que atualizam tabelas. Por exemplo, a seguinte sequência de statements não insere os mesmos dados no source e na replica:

```sql
SET max_join_size=1000;
INSERT INTO mytable VALUES(@@max_join_size);
```

Isso não se aplica à sequência comum:

```sql
SET time_zone=...;
INSERT INTO mytable VALUES(CONVERT_TZ(..., ..., @@time_zone));
```

A Replication de variáveis de sessão não é um problema quando a Replication baseada em linha (row-based replication) está sendo usada, caso em que as variáveis de sessão são sempre replicadas com segurança. Consulte [Seção 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats").

As seguintes variáveis de sessão são gravadas no Binary Log e respeitadas pela replica ao analisar o Binary Log, independentemente do formato de logging:

* [`sql_mode`](server-system-variables.html#sysvar_sql_mode)
* [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks)
* [`unique_checks`](server-system-variables.html#sysvar_unique_checks)
* [`character_set_client`](server-system-variables.html#sysvar_character_set_client)
* [`collation_connection`](server-system-variables.html#sysvar_collation_connection)
* [`collation_database`](server-system-variables.html#sysvar_collation_database)
* [`collation_server`](server-system-variables.html#sysvar_collation_server)
* [`sql_auto_is_null`](server-system-variables.html#sysvar_sql_auto_is_null)

> Importante
>
> Embora as variáveis de sessão relacionadas a Character Sets e Collations sejam gravadas no Binary Log, a Replication entre diferentes Character Sets não é suportada.

Para ajudar a reduzir a possível confusão, recomendamos que você sempre use a mesma configuração para a variável de sistema [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) tanto no source quanto na replica, especialmente quando estiver executando o MySQL em plataformas com sistemas de arquivos que diferenciam maiúsculas de minúsculas (case-sensitive).