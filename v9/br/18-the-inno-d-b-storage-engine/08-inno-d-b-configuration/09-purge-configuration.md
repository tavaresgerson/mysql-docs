### 17.8.9 Configuração de Purga

O `InnoDB` não remove fisicamente uma linha do banco de dados imediatamente quando você a exclui com uma instrução SQL. Uma linha e seus registros de índice são removidos fisicamente apenas quando o `InnoDB` descarta o registro do log de desfazer escrito para a exclusão. Essa operação de remoção, que ocorre apenas após a linha não ser mais necessária para o controle de concorrência de várias versões (MVCC) ou para o rollback, é chamada de purga.

A purga é executada em um cronograma periódico. Ela analisa e processa as páginas do log de desfazer da lista de histórico, que é uma lista de páginas do log de desfazer para transações confirmadas que é mantida pelo sistema de transação `InnoDB`. A purga libera as páginas do log de desfazer da lista de histórico após processá-las.

#### Configurando Fios de Purga

As operações de purga são realizadas em segundo plano por um ou mais fios de purga. O número de fios de purga é controlado pela variável `innodb_purge_threads`. O valor padrão é 1 se o número de processadores lógicos disponíveis for ≤ 16, caso contrário, o padrão é 4.

Se a ação de DML estiver concentrada em uma única tabela, as operações de purga para a tabela são realizadas por um único fio de purga, o que pode resultar em operações de purga mais lentas, aumento do atraso de purga e aumento do tamanho do arquivo de espaço de tabela se as operações de DML envolverem valores de objetos grandes. Se o ajuste `innodb_max_purge_lag` for excedido, o trabalho de purga é automaticamente redistribuído entre os fios de purga disponíveis. Muitos fios de purga ativos nesse cenário podem causar concorrência com os fios de usuário, então gerencie o ajuste `innodb_purge_threads` de acordo. A variável `innodb_max_purge_lag` é definida como 0 por padrão, o que significa que não há atraso máximo de purga por padrão.

Se a ação DML estiver concentrada em poucas tabelas, mantenha o ajuste `innodb_purge_threads` baixo para que os threads não concorram entre si pelo acesso às tabelas ocupadas. Se as operações DML estiverem distribuídas por muitas tabelas, considere um ajuste maior para `innodb_purge_threads`. O número máximo de threads de purga é de 32.

O ajuste `innodb_purge_threads` é o número máximo de threads de purga permitidas. O sistema de purga ajusta automaticamente o número de threads de purga que são usadas.

#### Configurando o Tamanho do Conjunto de Purga

A variável `innodb_purge_batch_size` define o número de páginas do log de desfazer que a purga analisa e processa em um conjunto de uma lista de histórico. O valor padrão é 300. Em uma configuração de purga multithread, o thread de purga coordenador divide `innodb_purge_batch_size` por `innodb_purge_threads` e atribui esse número de páginas a cada thread de purga.

O sistema de purga também libera as páginas do log de desfazer que não são mais necessárias. Ele faz isso a cada 128 iterações através dos logs de desfazer. Além de definir o número de páginas do log de desfazer analisadas e processadas em um conjunto, a variável `innodb_purge_batch_size` define o número de páginas do log de desfazer que a purga libera a cada 128 iterações através dos logs de desfazer.

A variável `innodb_purge_batch_size` é destinada ao ajuste e à experimentação avançados do desempenho. A maioria dos usuários não precisa alterar `innodb_purge_batch_size` do seu valor padrão.

#### Configurando o Lag Máximo de Purga

A variável `innodb_max_purge_lag` define o lag máximo de purga desejado. Quando o lag de purga excede o limiar `innodb_max_purge_lag`, uma demora é imposta nas operações `INSERT`, `UPDATE` e `DELETE` para permitir tempo para que as operações de purga recuperem o atraso. O valor padrão é 0, o que significa que não há lag máximo de purga e nenhuma demora.

O sistema de transações `InnoDB` mantém uma lista de transações que têm registros de índice marcados para exclusão por operações `UPDATE` ou `DELETE`. O comprimento da lista é o atraso de purga.

O atraso de purga é calculado pela seguinte fórmula:

```
(purge_lag/innodb_max_purge_lag - 0.9995) * 10000
```

O atraso é calculado no início de um lote de purga.

Um ajuste típico de `innodb_max_purge_lag` para uma carga de trabalho problemática pode ser 1.000.000 (1 milhão), assumindo que as transações são pequenas, com apenas 100 bytes de tamanho, e é permitido ter 100 MB de linhas de tabela não purgadas.

A purga é apresentada como o valor `History list length` na seção `TRANSACTIONS` do `SHOW ENGINE INNODB STATUS`.

```
mysql> SHOW ENGINE INNODB STATUS;
...
------------
TRANSACTIONS
------------
Trx id counter 0 290328385
Purge done for trx's n:o < 0 290315608 undo n:o < 0 17
History list length 20
```

O `History list length` é tipicamente um valor baixo, geralmente menor que alguns milhares, mas uma carga de trabalho com muitos escritos ou transações de longa duração pode fazer com que ele aumente, mesmo para transações que são apenas de leitura. A razão pela qual uma transação de longa duração pode fazer com que o `History list length` aumente é que, sob um nível de isolamento de leitura consistente, como `REPEATABLE READ`, uma transação deve retornar o mesmo resultado que quando a vista de leitura para essa transação foi criada. Consequentemente, o sistema de controle de concorrência de múltiplas versões `InnoDB` (MVCC) deve manter uma cópia dos dados no log de desfazer até que todas as transações que dependem desses dados tenham concluído. Os seguintes são exemplos de transações de longa duração que podem fazer com que o `History list length` aumente:

* Uma operação `mysqldump` que usa a opção `--single-transaction` enquanto há uma quantidade significativa de DML concorrente.
* Executar uma consulta `SELECT` após desabilitar `autocommit` e esquecer de emitir um `COMMIT` ou `ROLLBACK` explícito.

Para evitar atrasos excessivos em situações extremas em que o atraso de purga se torna enorme, você pode limitar o atraso configurando a variável `innodb_max_purge_lag_delay`. A variável `innodb_max_purge_lag_delay` especifica o atraso máximo em microsegundos para o atraso imposto quando o limite `innodb_max_purge_lag` é excedido. O valor especificado de `innodb_max_purge_lag_delay` é um limite superior para o período de atraso calculado pela fórmula `innodb_max_purge_lag`.

#### Purga e Retrucamento de Espaços de Tabelas Undo

O sistema de purga também é responsável por truncar os espaços de tabelas undo. Você pode configurar a variável `innodb_purge_rseg_truncate_frequency` para controlar a frequência com que o sistema de purga procura por espaços de tabelas undo para truncar. Para mais informações, consulte Truncar Espaços de Tabelas Undo.