#### 25.12.2.2 A Tabela setup_consumers

A tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 A Tabela setup_consumers") lista os tipos de consumers para os quais a informação de event pode ser armazenada e quais estão habilitados:

```sql
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| events_stages_current            | NO      |
| events_stages_history            | NO      |
| events_stages_history_long       | NO      |
| events_statements_current        | YES     |
| events_statements_history        | YES     |
| events_statements_history_long   | NO      |
| events_transactions_current      | NO      |
| events_transactions_history      | NO      |
| events_transactions_history_long | NO      |
| events_waits_current             | NO      |
| events_waits_history             | NO      |
| events_waits_history_long        | NO      |
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| statements_digest                | YES     |
+----------------------------------+---------+
```

As configurações de consumer na tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 A Tabela setup_consumers") formam uma hierarquia de níveis mais altos para mais baixos. Para informações detalhadas sobre o efeito de habilitar diferentes consumers, consulte [Seção 25.4.7, “Pré-Filtragem por Consumer”](performance-schema-consumer-filtering.html "25.4.7 Pré-Filtragem por Consumer").

Modificações na tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 A Tabela setup_consumers") afetam o monitoramento imediatamente.

A tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 A Tabela setup_consumers") possui estas colunas:

* `NAME`

  O nome do consumer.

* `ENABLED`

  Indica se o consumer está habilitado. O valor é `YES` ou `NO`. Esta coluna pode ser modificada. Se você desabilitar um consumer, o server não gasta tempo adicionando informação de event a ele.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é permitido para a tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 A Tabela setup_consumers").