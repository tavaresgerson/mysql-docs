### 14.8.10 Configuração do Purge

O `InnoDB` não remove fisicamente uma linha do Database imediatamente quando você a deleta usando uma instrução SQL. Uma linha e seus registros de Index são removidos fisicamente apenas quando o `InnoDB` descarta o registro de undo log escrito para a exclusão. Essa operação de remoção, que só ocorre após a linha não ser mais necessária para Multi-Version Concurrency Control (MVCC) ou rollback, é chamada de *purge*.

O Purge é executado em um cronograma periódico. Ele analisa e processa as páginas de undo log da *history list*, que é uma lista de páginas de undo log para transações commitadas e é mantida pelo sistema de transação `InnoDB`. O Purge libera as páginas de undo log da *history list* após processá-las.

#### Configurando Purge Threads

As operações de Purge são executadas em segundo plano por uma ou mais *purge threads*. O número de *purge threads* é controlado pela variável `innodb_purge_threads`. O valor padrão é 4. Se a ação DML estiver concentrada em uma única tabela, as operações de Purge para essa tabela serão executadas por uma única *purge thread*. Se a ação DML estiver concentrada em poucas tabelas, mantenha a configuração de `innodb_purge_threads` baixa para que as threads não disputem entre si o acesso às tabelas ocupadas. Se as operações DML estiverem distribuídas por muitas tabelas, considere uma configuração mais alta para `innodb_purge_threads`. O número máximo de *purge threads* é 32.

A configuração `innodb_purge_threads` é o número máximo de *purge threads* permitido. O sistema de Purge ajusta automaticamente o número de *purge threads* que são utilizadas.

#### Configurando o Purge Batch Size

A variável `innodb_purge_batch_size` define o número de páginas de undo log que o Purge analisa e processa em um Batch da *history list*. O valor padrão é 300. Em uma configuração de Purge multi-threaded, a *coordinator purge thread* divide `innodb_purge_batch_size` por `innodb_purge_threads` e atribui esse número de páginas a cada *purge thread*.

O sistema de Purge também libera as páginas de undo log que não são mais necessárias. Ele faz isso a cada 128 iterações pelos undo logs. Além de definir o número de páginas de undo log analisadas e processadas em um Batch, a variável `innodb_purge_batch_size` define o número de páginas de undo log que o Purge libera a cada 128 iterações pelos undo logs.

A variável `innodb_purge_batch_size` destina-se a *performance tuning* e experimentação avançados. A maioria dos usuários não precisa alterar o valor padrão de `innodb_purge_batch_size`.

#### Configurando o Maximum Purge Lag

A variável `innodb_max_purge_lag` define o *purge lag* máximo desejado. Quando o *purge lag* excede o limite de `innodb_max_purge_lag`, um atraso é imposto nas operações `INSERT`, `UPDATE` e `DELETE` para dar tempo para que as operações de Purge se atualizem (*catch up*). O valor padrão é 0, o que significa que não há *maximum purge lag* e nenhum atraso.

O sistema de transação `InnoDB` mantém uma lista de transações que tiveram registros de Index marcados para exclusão por operações `UPDATE` ou `DELETE`. O comprimento dessa lista é o *purge lag*. O atraso do *purge lag* é calculado pela seguinte fórmula, resultando em um atraso mínimo de 5000 microssegundos:

```sql
(purge lag/innodb_max_purge_lag - 0.5) * 10000
```

O atraso é calculado no início de um *purge batch*.

Uma configuração típica de `innodb_max_purge_lag` para uma workload problemática pode ser 1000000 (1 milhão), assumindo que as transações são pequenas, de apenas 100 bytes de tamanho, e é permissível ter 100 MB de linhas de tabela não purgadas.

O *purge lag* é apresentado como o valor `History list length` na seção `TRANSACTIONS` da saída de `SHOW ENGINE INNODB STATUS`.

```sql
mysql> SHOW ENGINE INNODB STATUS;
...
------------
TRANSACTIONS
------------
Trx id counter 0 290328385
Purge done for trx's n:o < 0 290315608 undo n:o < 0 17
History list length 20
```

O `History list length` é tipicamente um valor baixo, geralmente inferior a alguns milhares, mas uma *workload* com alta taxa de escrita (*write-heavy*) ou transações de longa duração podem fazer com que ele aumente, mesmo para transações de apenas leitura. A razão pela qual uma transação de longa duração pode causar o aumento do `History list length` é que, sob um nível de isolamento de transação de *consistent read*, como `REPEATABLE READ`, uma transação deve retornar o mesmo resultado de quando a *read view* para essa transação foi criada. Consequentemente, o sistema Multi-Version Concurrency Control (MVCC) do `InnoDB` deve manter uma cópia dos dados no undo log até que todas as transações que dependem desses dados tenham sido concluídas. A seguir estão exemplos de transações de longa duração que podem causar o aumento do `History list length`:

*   Uma operação **mysqldump** que usa a opção `--single-transaction` enquanto há uma quantidade significativa de DML concorrente.
*   Executar uma Query `SELECT` após desabilitar o `autocommit` e esquecer de emitir um `COMMIT` ou `ROLLBACK` explícito.

Para evitar atrasos excessivos em situações extremas onde o *purge lag* se torna muito grande, você pode limitar o atraso definindo a variável `innodb_max_purge_lag_delay`. A variável `innodb_max_purge_lag_delay` especifica o atraso máximo em microssegundos para o atraso imposto quando o limite `innodb_max_purge_lag` é excedido. O valor `innodb_max_purge_lag_delay` especificado é um limite superior para o período de atraso calculado pela fórmula `innodb_max_purge_lag`.

#### Purge e Truncamento de Undo Tablespace

O sistema de Purge também é responsável por truncar *undo tablespaces*. Você pode configurar a variável `innodb_purge_rseg_truncate_frequency` para controlar a frequência com que o sistema de Purge procura *undo tablespaces* para truncar. Para mais informações, consulte Truncating Undo Tablespaces.