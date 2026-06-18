#### 16.4.1.37 Replication e Variáveis

Variáveis de sistema não são replicadas corretamente ao usar o modo `STATEMENT`, exceto pelas seguintes variáveis quando usadas com escopo de sessão (session scope):

* `auto_increment_increment`
* `auto_increment_offset`
* `character_set_client`
* `character_set_connection`
* `character_set_database`
* `character_set_server`
* `collation_connection`
* `collation_database`
* `collation_server`
* `foreign_key_checks`
* `identity`
* `last_insert_id`
* `lc_time_names`
* `pseudo_thread_id`
* `sql_auto_is_null`
* `time_zone`
* `timestamp`
* `unique_checks`

Quando o modo `MIXED` é usado, as variáveis na lista anterior, quando utilizadas com escopo de sessão, causam uma mudança do log baseado em statement (statement-based logging) para o log baseado em linha (row-based logging). Consulte Seção 5.4.4.3, “Mixed Binary Logging Format”.

`sql_mode`  também é replicado, exceto pelo modo `NO_DIR_IN_CREATE`; a replica sempre preserva seu próprio valor para `NO_DIR_IN_CREATE`, independentemente das alterações feitas no source. Isso é válido para todos os formatos de Replication.

No entanto, quando o **mysqlbinlog** analisa um statement `SET @@sql_mode = mode`, o valor *`mode`* completo, incluindo `NO_DIR_IN_CREATE`, é passado para o servidor receptor. Por esse motivo, a Replication de tal statement pode não ser segura quando o modo `STATEMENT` está em uso.

A variável de sistema `default_storage_engine` não é replicada, independentemente do modo de logging; isso se destina a facilitar a Replication entre diferentes Storage Engines.

A variável de sistema `read_only` não é replicada. Além disso, a habilitação desta variável tem efeitos diferentes em relação a Temporary Tables, Lock de tabelas e ao statement `SET PASSWORD` em diferentes versões do MySQL.

A variável de sistema `max_heap_table_size` não é replicada. Aumentar o valor desta variável no source sem fazer o mesmo na replica pode eventualmente levar a erros de *Table is full* na replica ao tentar executar statements `INSERT` em uma tabela `MEMORY` no source que é, portanto, permitido crescer mais do que sua contraparte na replica. Para mais informações, consulte Seção 16.4.1.20, “Replication and MEMORY Tables”.

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

A Replication de variáveis de sessão não é um problema quando a Replication baseada em linha (row-based replication) está sendo usada, caso em que as variáveis de sessão são sempre replicadas com segurança. Consulte Seção 16.2.1, “Replication Formats”.

As seguintes variáveis de sessão são gravadas no Binary Log e respeitadas pela replica ao analisar o Binary Log, independentemente do formato de logging:

* `sql_mode`
* `foreign_key_checks`
* `unique_checks`
* `character_set_client`
* `collation_connection`
* `collation_database`
* `collation_server`
* `sql_auto_is_null`

> Importante
>
> Embora as variáveis de sessão relacionadas a Character Sets e Collations sejam gravadas no Binary Log, a Replication entre diferentes Character Sets não é suportada.

Para ajudar a reduzir a possível confusão, recomendamos que você sempre use a mesma configuração para a variável de sistema `lower_case_table_names` tanto no source quanto na replica, especialmente quando estiver executando o MySQL em plataformas com sistemas de arquivos que diferenciam maiúsculas de minúsculas (case-sensitive).