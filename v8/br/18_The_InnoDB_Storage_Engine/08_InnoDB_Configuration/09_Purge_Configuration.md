### 17.8.9 Configuração de purga

`InnoDB` não remove fisicamente uma linha do banco de dados imediatamente quando você a exclui com uma instrução SQL. Uma linha e seus registros de índice são removidos fisicamente apenas quando `InnoDB` descarta o registro do log de desfazer escrito para a exclusão. Essa operação de remoção, que ocorre apenas após a linha não ser mais necessária para o controle de concorrência de múltiplas versões (MVCC) ou rollback, é chamada de purga.

A purga é executada em um cronograma periódico. Ela analisa e processa as páginas do log de desfazer da lista de histórico, que é uma lista de páginas do log de desfazer para transações comprometidas, mantida pelo sistema de transação `InnoDB`. A purga libera as páginas do log de desfazer da lista de histórico após processá-las.

#### Configurar Purga de Tópicos

As operações de limpeza são realizadas em segundo plano por um ou mais threads de limpeza. O número de threads de limpeza é controlado pela variável `innodb_purge_threads`. O valor padrão é 4.

Se a ação de DML estiver concentrada em uma única tabela, as operações de purga para a tabela são realizadas por um único fio de purga, o que pode resultar em operações de purga mais lentas, aumento do atraso de purga e aumento do tamanho do arquivo de espaço de tabela se as operações de DML envolverem valores de objetos grandes. A partir do MySQL 8.0.26, se o ajuste `innodb_max_purge_lag` for excedido, o trabalho de purga é automaticamente redistribuído entre os fios de purga disponíveis. Muitos fios de purga ativos neste cenário podem causar concorrência com os fios de usuário, então gerencie o ajuste `innodb_purge_threads` de acordo. A variável `innodb_max_purge_lag` é definida como 0 por padrão, o que significa que não há atraso máximo de purga por padrão.

Se a ação de DML estiver concentrada em poucas tabelas, mantenha o valor de `innodb_purge_threads` baixo para que os threads não concorram entre si pelo acesso às tabelas ocupadas. Se as operações de DML estiverem distribuídas por muitas tabelas, considere um valor de `innodb_purge_threads` mais alto. O número máximo de threads de purga é de 32.

A configuração `innodb_purge_threads` é o número máximo de threads de purga permitidas. O sistema de purga ajusta automaticamente o número de threads de purga utilizadas.

#### Configurar o tamanho da batch de limpeza

A variável `innodb_purge_batch_size` define o número de páginas do log de desfazer que são limpas e processadas em um lote da lista de histórico. O valor padrão é 300. Em uma configuração de limpeza multisserial, o fio de limpeza do coordenador divide `innodb_purge_batch_size` por `innodb_purge_threads` e atribui esse número de páginas a cada fio de limpeza.

O sistema de limpeza também libera as páginas do registro de desfazer que não são mais necessárias. Isso é feito a cada 128 iterações pelos registros de desfazer. Além de definir o número de páginas do registro de desfazer analisadas e processadas em um lote, a variável `innodb_purge_batch_size` define o número de páginas do registro de desfazer que a limpeza libera a cada 128 iterações pelos registros de desfazer.

A variável `innodb_purge_batch_size` é destinada para ajustes avançados de desempenho e experimentação. A maioria dos usuários não precisa alterar `innodb_purge_batch_size` do seu valor padrão.

#### Configurando o Retardo Máximo de Purga

A variável `innodb_max_purge_lag` define o atraso máximo desejado para a purga. Quando o atraso de purga excede o limite `innodb_max_purge_lag`, uma demora é imposta nas operações `INSERT`, `UPDATE` e `DELETE` para permitir que as operações de purga recuperem o atraso. O valor padrão é 0, o que significa que não há atraso máximo nem demora.

O sistema de transações `InnoDB` mantém uma lista de transações que têm registros de índice marcados para exclusão por operações `UPDATE` ou `DELETE`. O comprimento da lista é o atraso de purga. Antes do MySQL 8.0.14, o atraso de purga é calculado pela seguinte fórmula, que resulta em um atraso mínimo de 5000 microsegundos:

```
(purge lag/innodb_max_purge_lag - 0.5) * 10000
```

A partir do MySQL 8.0.14, o atraso de purga é calculado pela seguinte fórmula revisada, que reduz o atraso mínimo para 5 microsegundos. Um atraso de 5 microsegundos é mais apropriado para sistemas modernos.

```
(purge_lag/innodb_max_purge_lag - 0.9995) * 10000
```

O atraso é calculado no início de um lote de limpeza.

Um ajuste típico de `innodb_max_purge_lag` para uma carga de trabalho problemática pode ser 1.000.000 (1 milhão), assumindo que as transações são pequenas, com apenas 100 bytes de tamanho, e é permitido ter 100 MB de linhas de tabela não limpas.

O atraso de purga é apresentado como o valor `History list length` na seção `TRANSACTIONS` do resultado `SHOW ENGINE INNODB STATUS`.

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

O `History list length` é tipicamente um valor baixo, geralmente menor que alguns milhares, mas uma carga de trabalho com muitas operações de escrita ou transações de longa duração pode fazer com que ele aumente, mesmo para transações que são apenas de leitura. A razão pela qual uma transação de longa duração pode fazer com que o `History list length` aumente é que, sob um nível de isolamento de visão de leitura consistente, como `REPEATABLE READ`, uma transação deve retornar o mesmo resultado que quando a visão de leitura para essa transação foi criada. Consequentemente, o sistema de controle de concorrência de múltiplas versões (MVCC) `InnoDB` deve manter uma cópia dos dados no log de desfazer até que todas as transações que dependem desses dados tenham sido concluídas. Os seguintes são exemplos de transações de longa duração que poderiam fazer com que o `History list length` aumente:

- Uma operação de **mysqldump** que usa a opção `--single-transaction` enquanto há uma quantidade significativa de DML concorrente.

- Executar uma consulta `SELECT` após desabilitar `autocommit` e esquecer de emitir um `COMMIT` ou `ROLLBACK` explícito.

Para evitar atrasos excessivos em situações extremas em que o atraso de purga se torna enorme, você pode limitar o atraso definindo a variável `innodb_max_purge_lag_delay`. A variável `innodb_max_purge_lag_delay` especifica o atraso máximo em microsegundos para o atraso imposto quando o limite `innodb_max_purge_lag` é excedido. O valor especificado `innodb_max_purge_lag_delay` é um limite superior para o período de atraso calculado pela fórmula `innodb_max_purge_lag`.

#### Limpeza e anulação da truncação de um espaço de tabela

O sistema de purga também é responsável por truncar os espaços de tabelas de desfazer. Você pode configurar a variável `innodb_purge_rseg_truncate_frequency` para controlar a frequência com que o sistema de purga procura por espaços de tabelas de desfazer para truncar. Para obter mais informações, consulte Truncar espaços de tabelas de desfazer.
