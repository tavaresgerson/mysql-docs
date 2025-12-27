### 28.4.28 A Tabela `INFORMATION_SCHEMA.INNODB_TRX`

A tabela `INNODB_TRX` fornece informações sobre cada transação atualmente em execução dentro do `InnoDB`, incluindo se a transação está aguardando um bloqueio, quando a transação começou e a instrução SQL que a transação está executando, se houver.

Para informações sobre o uso, consulte a Seção 17.15.2.1, “Usando informações de transações e bloqueios do InnoDB”.

A tabela `INNODB_TRX` tem as seguintes colunas:

* `TRX_ID`

  Um número de ID de transação único, interno ao `InnoDB`. Esses IDs não são criados para transações que são apenas de leitura e não bloqueiam. Para detalhes, consulte a Seção 10.5.3, “Otimizando transações de leitura apenas do InnoDB”.

* `TRX_WEIGHT`

  O peso de uma transação, refletindo (mas não necessariamente a contagem exata) o número de linhas alteradas e o número de linhas bloqueadas pela transação. Para resolver um deadlock, o `InnoDB` seleciona a transação com o menor peso como a “vítima” para ser revertida. Transações que alteraram tabelas não transacionais são consideradas mais pesadas do que outras, independentemente do número de linhas alteradas e bloqueadas.

* `TRX_STATE`

  O estado da execução da transação. Os valores permitidos são `RUNNING`, `LOCK WAIT`, `ROLLING BACK` e `COMMITTING`.

* `TRX_STARTED`

  A hora em que a transação começou.

* `TRX_REQUESTED_LOCK_ID`

  O ID do bloqueio que a transação está aguardando atualmente, se `TRX_STATE` for `LOCK WAIT`; caso contrário, `NULL`. Para obter detalhes sobre o bloqueio, faça uma junção desta coluna com a coluna `ENGINE_LOCK_ID` da tabela `data_locks` do Schema de Desempenho.

* `TRX_WAIT_STARTED`

  O momento em que a transação começou a aguardar o bloqueio, se `TRX_STATE` for `LOCK WAIT`; caso contrário, `NULL`.

O ID do fio do MySQL. Para obter detalhes sobre o fio, junte esta coluna com a coluna `ID` da tabela `PROCESSLIST` do `INFORMATION_SCHEMA` `InnoDB`, mas veja a Seção 17.15.2.3, “Persistência e Consistência das Informações de Transação e Bloqueio do InnoDB”.

* `TRX_QUERY`

  A instrução SQL que está sendo executada pela transação.

* `TRX_OPERATION_STATE`

  A operação atual da transação, se houver; caso contrário, `NULL`.

* `TRX_TABLES_IN_USE`

  O número de tabelas `InnoDB` usadas durante o processamento da instrução SQL atual desta transação.

* `TRX_TABLES_LOCKED`

  O número de tabelas `InnoDB` que a instrução SQL atual tem blocos de linha. (Como esses são blocos de linha, e não blocos de tabela, as tabelas geralmente ainda podem ser lidas e escritas por várias transações, apesar de algumas linhas estarem bloqueadas.)

* `TRX_LOCK_STRUCTS`

  O número de blocos reservados pela transação.

* `TRX_LOCK_MEMORY_BYTES`

  O tamanho total ocupado pelas estruturas de bloqueio desta transação na memória.

* `TRX_ROWS_LOCKED`

  O número aproximado de linhas bloqueadas por esta transação. O valor pode incluir linhas marcadas para exclusão que estão fisicamente presentes, mas não são visíveis para a transação.

* `TRX_ROWS_MODIFIED`

  O número de linhas modificadas e inseridas nesta transação.

* `TRX_CONCURRENCY_TICKETS`

  Um valor que indica quanto trabalho a transação atual pode fazer antes de ser substituída, conforme especificado pela variável de sistema `innodb_concurrency_tickets`.

* `TRX_ISOLATION_LEVEL`

  O nível de isolamento da transação atual.

* `TRX_UNIQUE_CHECKS`

  Se os controles de unicidade estão ativados ou desativados para a transação atual. Por exemplo, eles podem estar desativados durante uma carga de dados em massa.

* `TRX_FOREIGN_KEY_CHECKS`

Se as verificações de chave estrangeira estão ativadas ou desativadas para a transação atual. Por exemplo, elas podem estar desativadas durante uma carga de dados em massa.

* `TRX_LAST_FOREIGN_KEY_ERROR`

  A mensagem de erro detalhada para o último erro de chave estrangeira, se houver; caso contrário, `NULL`.

* `TRX_ADAPTIVE_HASH_LATCHED`

  Se o índice de hash adaptável está bloqueado pela transação atual. Quando o sistema de busca por índice de hash adaptável é particionado, uma única transação não bloqueia todo o índice de hash adaptável. A partição do índice de hash adaptável é controlada por `innodb_adaptive_hash_index_parts`, que é definido como 8 por padrão.

* `TRX_ADAPTIVE_HASH_TIMEOUT`

  Desatualizado em MySQL 5.7.8. Sempre retorna 0.

  Se a busca pelo índice de hash adaptável deve ser liberada imediatamente ou reservada em chamadas do MySQL. Quando não há disputa por índice de hash adaptável, esse valor permanece zero e as instruções reservam o índice até que terminem. Durante períodos de disputa, ele conta para zero e as instruções liberam o índice imediatamente após cada busca de linha. Quando o sistema de busca por índice de hash adaptável é particionado (controlado por `innodb_adaptive_hash_index_parts`), o valor permanece 0.

* `TRX_IS_READ_ONLY`

  Um valor de 1 indica que a transação é de leitura somente.

* `TRX_AUTOCOMMIT_NON_LOCKING`

  Um valor de 1 indica que a transação é uma instrução `SELECT` que não usa as cláusulas `FOR UPDATE` ou `LOCK IN SHARED MODE` e está sendo executada com `autocommit` habilitado para que a transação contenha apenas essa única instrução. Quando esta coluna e `TRX_IS_READ_ONLY` estiverem ambos 1, o `InnoDB` otimiza a transação para reduzir o overhead associado às transações que alteram dados da tabela.

* `TRX_SCHEDULE_WEIGHT`

O peso do cronograma de transações atribuído pelo algoritmo de Cronograma de Transações Atento à Concorrência (CATS) às transações que aguardam uma trava. O valor é relativo aos valores de outras transações. Um valor maior tem um peso maior. O valor é calculado apenas para transações em estado `LOCK WAIT`, conforme relatado pela coluna `TRX_STATE`. Um valor NULL é relatado para transações que não estão aguardando uma trava. O valor `TRX_SCHEDULE_WEIGHT` é diferente do valor `TRX_WEIGHT`, que é calculado por um algoritmo diferente para um propósito diferente.

#### Exemplo

```
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
       trx_schedule_weight: NULL
```

#### Notas

* Use esta tabela para ajudar a diagnosticar problemas de desempenho que ocorrem durante períodos de alta carga concorrente. Seu conteúdo é atualizado conforme descrito na Seção 17.15.2.3, “Persistência e Consistência da Informação de Transações e Trava do InnoDB”.

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.