### 24.4.28 A Tabela INNODB_TRX do INFORMATION_SCHEMA

A tabela [`INNODB_TRX`](information-schema-innodb-trx-table.html "24.4.28 The INFORMATION_SCHEMA INNODB_TRX Table") fornece informações sobre cada transação atualmente em execução dentro do `InnoDB`, incluindo se a transação está esperando por um Lock, quando a transação começou e a instrução SQL que a transação está executando, se houver.

Para informações de uso, consulte [Seção 14.16.2.1, “Utilizando Informações de Transação e Locking do InnoDB”](innodb-information-schema-examples.html "14.16.2.1 Using InnoDB Transaction and Locking Information").

A tabela [`INNODB_TRX`](information-schema-innodb-trx-table.html "24.4.28 The INFORMATION_SCHEMA INNODB_TRX Table") possui as seguintes colunas:

* `TRX_ID`

  Um número de ID de transação exclusivo, interno ao `InnoDB`. Esses IDs não são criados para transações que são somente leitura (read only) e não Locking. Para detalhes, consulte [Seção 8.5.3, “Otimizando Transações Read-Only do InnoDB”](innodb-performance-ro-txn.html "8.5.3 Optimizing InnoDB Read-Only Transactions").

* `TRX_WEIGHT`

  O peso de uma transação, refletindo (mas não necessariamente a contagem exata de) o número de linhas alteradas e o número de linhas bloqueadas pela transação. Para resolver um deadlock, o `InnoDB` seleciona a transação com o menor peso como a "vítima" a ser revertida (roll back). Transações que alteraram tabelas não transacionais são consideradas mais pesadas do que outras, independentemente do número de linhas alteradas e bloqueadas.

* `TRX_STATE`

  O estado de execução da transação. Os valores permitidos são `RUNNING`, `LOCK WAIT`, `ROLLING BACK` e `COMMITTING`.

* `TRX_STARTED`

  O horário de início da transação.

* `TRX_REQUESTED_LOCK_ID`

  O ID do Lock pelo qual a transação está esperando atualmente, se `TRX_STATE` for `LOCK WAIT`; caso contrário, `NULL`. Para obter detalhes sobre o Lock, faça um JOIN desta coluna com a coluna `LOCK_ID` da tabela [`INNODB_LOCKS`](information-schema-innodb-locks-table.html "24.4.14 The INFORMATION_SCHEMA INNODB_LOCKS Table").

* `TRX_WAIT_STARTED`

  O horário em que a transação começou a esperar pelo Lock, se `TRX_STATE` for `LOCK WAIT`; caso contrário, `NULL`.

* `TRX_MYSQL_THREAD_ID`

  O ID de Thread do MySQL. Para obter detalhes sobre a Thread, faça um JOIN desta coluna com a coluna `ID` da tabela [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") do `INFORMATION_SCHEMA`, mas consulte [Seção 14.16.2.3, “Persistência e Consistência das Informações de Transação e Locking do InnoDB”](innodb-information-schema-internal-data.html "14.16.2.3 Persistence and Consistency of InnoDB Transaction and Locking Information").

* `TRX_QUERY`

  A instrução SQL que está sendo executada pela transação.

* `TRX_OPERATION_STATE`

  A operação atual da transação, se houver; caso contrário, `NULL`.

* `TRX_TABLES_IN_USE`

  O número de tabelas `InnoDB` usadas durante o processamento da instrução SQL atual desta transação.

* `TRX_TABLES_LOCKED`

  O número de tabelas `InnoDB` nas quais a instrução SQL atual possui Locks de linha. (Como se tratam de Locks de linha, e não Locks de tabela, as tabelas geralmente ainda podem ser lidas e escritas por múltiplas transações, apesar de algumas linhas estarem bloqueadas.)

* `TRX_LOCK_STRUCTS`

  O número de Locks reservados pela transação.

* `TRX_LOCK_MEMORY_BYTES`

  O tamanho total ocupado pelas estruturas de Lock desta transação na memória.

* `TRX_ROWS_LOCKED`

  O número aproximado de linhas bloqueadas por esta transação. O valor pode incluir linhas marcadas para exclusão (delete-marked rows) que estão fisicamente presentes, mas não visíveis para a transação.

* `TRX_ROWS_MODIFIED`

  O número de linhas modificadas e inseridas nesta transação.

* `TRX_CONCURRENCY_TICKETS`

  Um valor que indica quanto trabalho a transação atual pode fazer antes de ser trocada (swapped out), conforme especificado pela variável de sistema [`innodb_concurrency_tickets`](innodb-parameters.html#sysvar_innodb_concurrency_tickets).

* `TRX_ISOLATION_LEVEL`

  O nível de Isolation da transação atual.

* `TRX_UNIQUE_CHECKS`

  Indica se as verificações de Unique estão ativadas ou desativadas para a transação atual. Por exemplo, elas podem ser desativadas durante um carregamento de dados em massa (bulk data load).

* `TRX_FOREIGN_KEY_CHECKS`

  Indica se as verificações de Foreign Key estão ativadas ou desativadas para a transação atual. Por exemplo, elas podem ser desativadas durante um carregamento de dados em massa.

* `TRX_LAST_FOREIGN_KEY_ERROR`

  A mensagem de erro detalhada para o último erro de Foreign Key, se houver; caso contrário, `NULL`.

* `TRX_ADAPTIVE_HASH_LATCHED`

  Indica se o adaptive hash Index está bloqueado pela transação atual. Quando o sistema de busca do adaptive hash Index é particionado, uma única transação não bloqueia todo o adaptive hash Index. O particionamento do adaptive hash Index é controlado por [`innodb_adaptive_hash_index_parts`](innodb-parameters.html#sysvar_innodb_adaptive_hash_index_parts), que é definido como 8 por padrão.

* `TRX_ADAPTIVE_HASH_TIMEOUT`

  Descontinuado no MySQL 5.7.8. Sempre retorna 0.

  Indica se deve-se liberar o search latch imediatamente para o adaptive hash Index ou reservá-lo entre as chamadas do MySQL. Quando não há contenção no adaptive hash Index, esse valor permanece zero e as instruções reservam o latch até que terminem. Durante períodos de contenção, ele faz uma contagem regressiva até zero, e as instruções liberam o latch imediatamente após cada pesquisa de linha. Quando o sistema de busca do adaptive hash Index é particionado (controlado por [`innodb_adaptive_hash_index_parts`](innodb-parameters.html#sysvar_innodb_adaptive_hash_index_parts)), o valor permanece 0.

* `TRX_IS_READ_ONLY`

  Um valor de 1 indica que a transação é somente leitura (read only).

* `TRX_AUTOCOMMIT_NON_LOCKING`

  Um valor de 1 indica que a transação é uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement") que não usa as cláusulas `FOR UPDATE` ou `LOCK IN SHARED MODE`, e está sendo executada com [`autocommit`](server-system-variables.html#sysvar_autocommit) ativado, de modo que a transação contenha apenas esta instrução. Quando esta coluna e `TRX_IS_READ_ONLY` são ambas 1, o `InnoDB` otimiza a transação para reduzir a sobrecarga associada a transações que alteram dados da tabela.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TRX\G
*************************** 1. row ***************************
                    trx_id: 1510
                 trx_state: RUNNING
               trx_started: 2014-11-19 13:24:40
     trx_requested_lock_id: NULL
          trx_wait_started: NULL
                trx_weight: 586739
       trx_mysql_thread_id: 2
                 trx_query: DELETE FROM employees.salaries WHERE salary > 65000
       trx_operation_state: updating or deleting
         trx_tables_in_use: 1
         trx_tables_locked: 1
          trx_lock_structs: 3003
     trx_lock_memory_bytes: 450768
           trx_rows_locked: 1407513
         trx_rows_modified: 583736
   trx_concurrency_tickets: 0
       trx_isolation_level: REPEATABLE READ
         trx_unique_checks: 1
    trx_foreign_key_checks: 1
trx_last_foreign_key_error: NULL
 trx_adaptive_hash_latched: 0
 trx_adaptive_hash_timeout: 10000
          trx_is_read_only: 0
trx_autocommit_non_locking: 0
```

#### Notas

* Use esta tabela para ajudar a diagnosticar problemas de performance que ocorrem durante períodos de alta carga concorrente. Seu conteúdo é atualizado conforme descrito em [Seção 14.16.2.3, “Persistência e Consistência das Informações de Transação e Locking do InnoDB”](innodb-information-schema-internal-data.html "14.16.2.3 Persistence and Consistency of InnoDB Transaction and Locking Information").

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para consultar esta tabela.

* Use a tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") do `INFORMATION_SCHEMA` ou a instrução [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão (default values).