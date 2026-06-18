### 28.4.28 A tabela INFORMATION\_SCHEMA INNODB\_TRX

A tabela `INNODB_TRX` fornece informações sobre cada transação atualmente em execução dentro de `InnoDB`, incluindo se a transação está aguardando um bloqueio, quando a transação começou e a instrução SQL que a transação está executando, se houver.

Para informações sobre o uso, consulte a Seção 17.15.2.1, “Usando informações de transação e bloqueio do InnoDB”.

A tabela `INNODB_TRX` tem essas colunas:

- `TRX_ID`

  Um número de ID de transação único, interno a `InnoDB`. Esses IDs não são criados para transações que são apenas de leitura e não bloqueiam. Para obter detalhes, consulte a Seção 10.5.3, “Otimizando Transações de Leitura Apenas de InnoDB”.

- `TRX_WEIGHT`

  O peso de uma transação, que reflete (mas não necessariamente o número exato de) linhas alteradas e o número de linhas bloqueadas pela transação. Para resolver um impasse, o `InnoDB` seleciona a transação com o menor peso como a “vítima” para ser revertida. As transações que alteraram tabelas não transacionais são consideradas mais pesadas do que outras, independentemente do número de linhas alteradas e bloqueadas.

- `TRX_STATE`

  O estado de execução da transação. Os valores permitidos são `RUNNING`, `LOCK WAIT`, `ROLLING BACK` e `COMMITTING`.

- `TRX_STARTED`

  A hora de início da transação.

- `TRX_REQUESTED_LOCK_ID`

  O ID do bloqueio para o qual a transação está aguardando, se `TRX_STATE` for `LOCK WAIT`; caso contrário, `NULL`. Para obter detalhes sobre o bloqueio, combine esta coluna com a coluna `ENGINE_LOCK_ID` da tabela do Schema de Desempenho `data_locks`.

- `TRX_WAIT_STARTED`

  O tempo em que a transação começou a aguardar a bloqueio, se `TRX_STATE` é `LOCK WAIT`; caso contrário, `NULL`.

- `TRX_MYSQL_THREAD_ID`

  O ID do fio do MySQL. Para obter detalhes sobre o fio, junte esta coluna com a coluna `ID` da tabela `INFORMATION_SCHEMA` `PROCESSLIST`, mas consulte a Seção 17.15.2.3, “Persistência e Consistência das Informações de Transação e Bloqueio do InnoDB”.

- `TRX_QUERY`

  A instrução SQL que está sendo executada pela transação.

- `TRX_OPERATION_STATE`

  A operação atual da transação, se houver; caso contrário, `NULL`.

- `TRX_TABLES_IN_USE`

  O número de tabelas `InnoDB` usadas durante o processamento da declaração SQL atual desta transação.

- `TRX_TABLES_LOCKED`

  O número de tabelas `InnoDB` nas quais a declaração SQL atual tem bloqueios de linha. (Como esses são bloqueios de linha, e não de tabela, as tabelas geralmente ainda podem ser lidas e escritas por várias transações, apesar de algumas linhas estarem bloqueadas.)

- `TRX_LOCK_STRUCTS`

  O número de bloqueios reservados pela transação.

- `TRX_LOCK_MEMORY_BYTES`

  O tamanho total ocupado pelas estruturas de bloqueio desta transação na memória.

- `TRX_ROWS_LOCKED`

  O número aproximado ou as linhas bloqueadas por essa transação. O valor pode incluir linhas marcadas para exclusão que estão fisicamente presentes, mas não são visíveis para a transação.

- `TRX_ROWS_MODIFIED`

  O número de linhas modificadas e inseridas nesta transação.

- `TRX_CONCURRENCY_TICKETS`

  Um valor que indica quanto trabalho a transação atual pode realizar antes de ser substituída, conforme especificado pela variável de sistema `innodb_concurrency_tickets`.

- `TRX_ISOLATION_LEVEL`

  O nível de isolamento da transação atual.

- `TRX_UNIQUE_CHECKS`

  Se os verificações únicas estão ativadas ou desativadas para a transação atual. Por exemplo, elas podem estar desativadas durante uma carga de dados em massa.

- `TRX_FOREIGN_KEY_CHECKS`

  Se as verificações de chave estrangeira estão ativadas ou desativadas para a transação atual. Por exemplo, elas podem estar desativadas durante uma carga de dados em massa.

- `TRX_LAST_FOREIGN_KEY_ERROR`

  A mensagem de erro detalhada para o último erro de chave estrangeira, se houver; caso contrário, `NULL`.

- `TRX_ADAPTIVE_HASH_LATCHED`

  Se o índice de hash adaptável está bloqueado pela transação atual. Quando o sistema de busca por índice de hash adaptável é particionado, uma única transação não bloqueia todo o índice de hash adaptável. A partição do índice de hash adaptável é controlada por `innodb_adaptive_hash_index_parts`, que é definido como 8 por padrão.

- `TRX_ADAPTIVE_HASH_TIMEOUT`

  Desatualizado no MySQL 5.7.8. Sempre retorna 0.

  Se deve liberar o gatilho de busca imediatamente para o índice de hash adaptável ou reservá-lo em todas as chamadas do MySQL. Quando não há disputa por um índice de hash adaptável, esse valor permanece zero e as instruções reservam o gatilho até que terminem. Durante períodos de disputa, ele conta para zero e as instruções liberam o gatilho imediatamente após cada busca de linha. Quando o sistema de busca por índice de hash adaptável está particionado (controlado por `innodb_adaptive_hash_index_parts`), o valor permanece 0.

- `TRX_IS_READ_ONLY`

  Um valor de 1 indica que a transação é apenas de leitura.

- `TRX_AUTOCOMMIT_NON_LOCKING`

  Um valor de 1 indica que a transação é uma declaração `SELECT` que não utiliza as cláusulas `FOR UPDATE` ou `LOCK IN SHARED MODE`, e está sendo executada com `autocommit` habilitado para que a transação contenha apenas essa única declaração. Quando essa coluna e `TRX_IS_READ_ONLY` estão ambos em 1, `InnoDB` otimiza a transação para reduzir o overhead associado às transações que alteram os dados da tabela.

- `TRX_SCHEDULE_WEIGHT`

  O peso do cronograma de transações atribuído pelo algoritmo de Cronograma de Transações Atento à Concorrência (CATS) às transações que aguardam uma trava. O valor é relativo aos valores de outras transações. Um valor maior tem um peso maior. O valor é calculado apenas para transações em um estado `LOCK WAIT`, conforme relatado pela coluna `TRX_STATE`. Um valor NULL é relatado para transações que não estão aguardando uma trava. O valor `TRX_SCHEDULE_WEIGHT` é diferente do valor `TRX_WEIGHT`, que é calculado por um algoritmo diferente para um propósito diferente.

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

- Use esta tabela para ajudar a diagnosticar problemas de desempenho que ocorrem durante períodos de alta carga concorrente. Seu conteúdo é atualizado conforme descrito na Seção 17.15.2.3, “Persistência e Consistência das Informações de Transação e Bloqueio do InnoDB”.

- Você deve ter o privilégio `PROCESS` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.
