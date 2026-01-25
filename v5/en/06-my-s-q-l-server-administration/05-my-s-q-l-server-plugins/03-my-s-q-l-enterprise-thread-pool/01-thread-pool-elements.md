#### 5.5.3.1 Elementos do Thread Pool

O Thread Pool do MySQL Enterprise é composto pelos seguintes elementos:

* Um arquivo de biblioteca de plugin implementa um plugin para o código do thread pool, bem como várias tabelas de monitoramento associadas que fornecem informações sobre a operação do thread pool.

  Para uma descrição detalhada de como o thread pool funciona, consulte [Seção 5.5.3.3, “Thread Pool Operation”](thread-pool-operation.html "5.5.3.3 Thread Pool Operation").

  As tabelas `INFORMATION_SCHEMA` são nomeadas [`TP_THREAD_STATE`](information-schema-tp-thread-state-table.html "24.5.4 The INFORMATION_SCHEMA TP_THREAD_STATE Table"), [`TP_THREAD_GROUP_STATE`](information-schema-tp-thread-group-state-table.html "24.5.2 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATE Table") e [`TP_THREAD_GROUP_STATS`](information-schema-tp-thread-group-stats-table.html "24.5.3 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATS Table"). Essas tabelas fornecem informações sobre a operação do thread pool. Para mais informações, consulte [Seção 24.5, “INFORMATION_SCHEMA Thread Pool Tables”](thread-pool-information-schema-tables.html "24.5 INFORMATION_SCHEMA Thread Pool Tables").

* Diversas system variables (variáveis de sistema) estão relacionadas ao thread pool. A system variable [`thread_handling`](server-system-variables.html#sysvar_thread_handling) tem o valor `loaded-dynamically` quando o servidor carrega o plugin do thread pool com sucesso.

  As outras system variables relacionadas são implementadas pelo plugin do thread pool e não estão disponíveis a menos que ele esteja habilitado. Para obter informações sobre o uso dessas variáveis, consulte [Seção 5.5.3.3, “Thread Pool Operation”](thread-pool-operation.html "5.5.3.3 Thread Pool Operation") e [Seção 5.5.3.4, “Thread Pool Tuning”](thread-pool-tuning.html "5.5.3.4 Thread Pool Tuning").

* O Performance Schema possui instrumentos que expõem informações sobre o thread pool e podem ser usados para investigar o desempenho operacional. Para identificá-los, use esta Query:

  ```sql
  SELECT * FROM performance_schema.setup_instruments
  WHERE NAME LIKE '%thread_pool%';
  ```

  Para mais informações, consulte [Capítulo 25, *MySQL Performance Schema*](performance-schema.html "Capítulo 25 MySQL Performance Schema").