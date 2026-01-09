#### 25.12.2.2 A tabela setup_consumers

A tabela `setup_consumers` lista os tipos de consumidores para os quais as informações dos eventos podem ser armazenadas e que estão habilitados:

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

As configurações de consumidor na tabela `setup_consumers` formam uma hierarquia de níveis mais altos para níveis mais baixos. Para informações detalhadas sobre o efeito de habilitar diferentes consumidores, consulte Seção 25.4.7, “Pré-filtragem por Consumidor”.

As modificações na tabela `setup_consumers` afetam o monitoramento imediatamente.

A tabela `setup_consumers` tem as seguintes colunas:

- `NOME`

  O nome do consumidor.

- `ativado`

  Se o consumidor está habilitado. O valor é `SIM` ou `NÃO`. Esta coluna pode ser modificada. Se você desabilitar um consumidor, o servidor não gasta tempo adicionando informações de eventos a ele.

A operação `TRUNCATE TABLE` não é permitida para a tabela `setup_consumers`.
