### 14.8.10 Configuração de purga

O `InnoDB` não remove fisicamente uma linha do banco de dados imediatamente quando você a exclui com uma instrução SQL. Uma linha e seus registros de índice são removidos fisicamente apenas quando o `InnoDB` descarta o registro do log de desfazer escrito para a exclusão. Essa operação de remoção, que ocorre apenas após a linha não ser mais necessária para o controle de concorrência de múltiplas versões (MVCC) ou rollback, é chamada de purga.

A purga é executada em um cronograma periódico. Ela analisa e processa as páginas do log de desfazer da lista de histórico, que é uma lista de páginas do log de desfazer para transações confirmadas, mantida pelo sistema de transação `InnoDB`. A purga libera as páginas do log de desfazer da lista de histórico após processá-las.

#### Configurar Purga de Tópicos

As operações de purga são realizadas em segundo plano por um ou mais threads de purga. O número de threads de purga é controlado pela variável `innodb_purge_threads`. O valor padrão é 4. Se a ação de DML estiver concentrada em uma única tabela, as operações de purga para a tabela são realizadas por um único thread de purga. Se a ação de DML estiver concentrada em algumas tabelas, mantenha o ajuste de `innodb_purge_threads` baixo para que os threads não concorram entre si pelo acesso às tabelas ocupadas. Se as operações de DML estiverem distribuídas em muitas tabelas, considere um ajuste maior de `innodb_purge_threads`. O número máximo de threads de purga é 32.

O ajuste `innodb_purge_threads` é o número máximo de threads de purga permitidas. O sistema de purga ajusta automaticamente o número de threads de purga utilizadas.

#### Configurar o tamanho da batch de limpeza

A variável `innodb_purge_batch_size` define o número de páginas do log de desfazer que são limpas e processadas em um lote da lista de histórico. O valor padrão é 300. Em uma configuração de purga multisserial, o thread de purga do coordenador divide `innodb_purge_batch_size` por `innodb_purge_threads` e atribui esse número de páginas a cada thread de purga.

O sistema de purga também libera as páginas do registro de desfazer que não são mais necessárias. Isso é feito a cada 128 iterações pelos registros de desfazer. Além de definir o número de páginas do registro de desfazer analisadas e processadas em um lote, a variável `innodb_purge_batch_size` define o número de páginas do registro de desfazer que a purga libera a cada 128 iterações pelos registros de desfazer.

A variável `innodb_purge_batch_size` é destinada para ajustes avançados de desempenho e experimentação. A maioria dos usuários não precisa alterar `innodb_purge_batch_size` do seu valor padrão.

#### Configurando o Retardo Máximo de Purga

A variável `innodb_max_purge_lag` define o atraso máximo de purga desejado. Quando o atraso de purga excede o limite `innodb_max_purge_lag`, uma demora é imposta nas operações `INSERT`, `UPDATE` e `DELETE` para permitir que as operações de purga recuperem o atraso. O valor padrão é 0, o que significa que não há atraso máximo de purga e nenhuma demora.

O sistema de transações `InnoDB` mantém uma lista de transações que têm registros de índice marcados para exclusão por operações `UPDATE` ou `DELETE`. O comprimento da lista é o atraso de purga. O atraso de purga é calculado pela seguinte fórmula, que resulta em um atraso mínimo de 5000 microsegundos:

```sql
(purge lag/innodb_max_purge_lag - 0.5) * 10000
```

O atraso é calculado no início de um lote de limpeza

Um valor típico de `innodb_max_purge_lag` para uma carga de trabalho problemática pode ser 1.000.000 (1 milhão), assumindo que as transações são pequenas, com apenas 100 bytes de tamanho, e é permitido ter 100 MB de linhas de tabela não purgadas.

O atraso de purga é apresentado como o valor `comprimento da lista de histórico` na seção `TRANSACTIONS` do resultado `SHOW ENGINE INNODB STATUS`.

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

O comprimento da lista de histórico é normalmente um valor baixo, geralmente menor que alguns milhares, mas uma carga de trabalho com muitas operações de escrita ou transações de longa duração pode fazer com que ele aumente, mesmo para transações que são apenas de leitura. A razão pela qual uma transação de longa duração pode fazer com que o comprimento da lista de histórico aumente é que, sob um nível de isolamento de visão de leitura consistente, como `REPEATABLE READ`, uma transação deve retornar o mesmo resultado que quando a visão de leitura para essa transação foi criada. Consequentemente, o sistema de controle de concorrência de múltiplas versões (MVCC) do `InnoDB` deve manter uma cópia dos dados no log de desfazer até que todas as transações que dependem desses dados tenham sido concluídas. Os seguintes são exemplos de transações de longa duração que podem fazer com que o comprimento da lista de histórico aumente:

- Uma operação **mysqldump** que usa a opção `--single-transaction` enquanto há uma quantidade significativa de DML concorrente.

- Executar uma consulta `SELECT` após desabilitar o `autocommit` e esquecer de emitir um `COMMIT` ou `ROLLBACK` explícito.

Para evitar atrasos excessivos em situações extremas em que o atraso de purga se torna enorme, você pode limitar o atraso configurando a variável `innodb_max_purge_lag_delay`. A variável `innodb_max_purge_lag_delay` especifica o atraso máximo em microsegundos para o atraso imposto quando o limite `innodb_max_purge_lag` é excedido. O valor especificado de `innodb_max_purge_lag_delay` é um limite superior para o período de atraso calculado pela fórmula `innodb_max_purge_lag`.

#### Limpeza e anulação da truncação de um espaço de tabela

O sistema de purga também é responsável por truncar os espaços de tabelas de undo. Você pode configurar a variável `innodb_purge_rseg_truncate_frequency` para controlar a frequência com que o sistema de purga procura por espaços de tabelas de undo para truncar. Para obter mais informações, consulte Truncar espaços de tabelas de undo.
