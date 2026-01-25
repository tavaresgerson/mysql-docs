### 14.6.7 Undo Logs

Um Undo Log é uma coleção de registros de Undo Log associados a uma única transação de leitura e escrita (`read-write transaction`). Um registro de Undo Log contém informações sobre como desfazer a alteração mais recente de uma transação em um registro de clustered index. Se outra transação precisar visualizar os dados originais como parte de uma operação de leitura consistente (`consistent read operation`), os dados não modificados são recuperados dos registros de Undo Log. Os Undo Logs existem dentro de segmentos de Undo Log, que estão contidos em Rollback Segments. Os Rollback Segments residem no system tablespace, nos undo tablespaces e no temporary tablespace.

Os Undo Logs que residem no temporary tablespace são usados para transações que modificam dados em temporary tables definidas pelo usuário. Esses Undo Logs não são registrados no Redo Log (não são *redo-logged*), pois não são necessários para a recuperação de falhas (`crash recovery`). Eles são usados apenas para Rollback enquanto o server está em execução. Esse tipo de Undo Log beneficia a performance ao evitar I/O de *redo logging*.

O `InnoDB` suporta um máximo de 128 Rollback Segments, dos quais 32 são alocados para o temporary tablespace. Isso deixa 96 Rollback Segments que podem ser atribuídos a transações que modificam dados em tabelas regulares. A variável `innodb_rollback_segments` define o número de Rollback Segments usados pelo `InnoDB`.

O número de transações que um Rollback Segment suporta depende do número de *undo slots* no Rollback Segment e do número de Undo Logs exigidos por cada transação. O número de *undo slots* em um Rollback Segment difere de acordo com o Page Size do `InnoDB`.

<table summary="Número de undo slots em um rollback segment para cada Page Size do InnoDB"><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Page Size do InnoDB</th> <th>Número de Undo Slots em um Rollback Segment (Page Size do InnoDB / 16)</th> </tr></thead><tbody><tr> <td><code>4096 (4KB)</code></td> <td><code>256</code></td> </tr><tr> <td><code>8192 (8KB)</code></td> <td><code>512</code></td> </tr><tr> <td><code>16384 (16KB)</code></td> <td><code>1024</code></td> </tr><tr> <td><code>32768 (32KB)</code></td> <td><code>2048</code></td> </tr><tr> <td><code>65536 (64KB)</code></td> <td><code>4096</code></td> </tr> </tbody></table>

Uma transação recebe a atribuição de até quatro Undo Logs, um para cada um dos seguintes tipos de operação:

1. Operações `INSERT` em tabelas definidas pelo usuário
2. Operações `UPDATE` e `DELETE` em tabelas definidas pelo usuário
3. Operações `INSERT` em temporary tables definidas pelo usuário
4. Operações `UPDATE` e `DELETE` em temporary tables definidas pelo usuário

Os Undo Logs são atribuídos conforme a necessidade. Por exemplo, uma transação que executa operações `INSERT`, `UPDATE` e `DELETE` em tabelas regulares e temporary tables requer uma atribuição completa de quatro Undo Logs. Uma transação que executa apenas operações `INSERT` em tabelas regulares requer um único Undo Log.

Uma transação que executa operações em tabelas regulares recebe Undo Logs de um Rollback Segment atribuído do system tablespace ou undo tablespace. Uma transação que executa operações em temporary tables recebe Undo Logs de um Rollback Segment atribuído do temporary tablespace.

Um Undo Log atribuído a uma transação permanece anexado a ela durante toda a sua duração. Por exemplo, um Undo Log atribuído a uma transação para uma operação `INSERT` em uma tabela regular é usado para todas as operações `INSERT` em tabelas regulares executadas por essa transação.

Dados os fatores descritos acima, as seguintes fórmulas podem ser usadas para estimar o número de transações concorrentes de leitura e escrita (`read-write transactions`) que o `InnoDB` é capaz de suportar.

Nota
É possível encontrar um erro de limite de transação concorrente antes de atingir o número de transações concorrentes de leitura e escrita que o `InnoDB` é capaz de suportar. Isso ocorre quando o Rollback Segment atribuído a uma transação fica sem *undo slots*. Nesses casos, tente reexecutar a transação.

Quando as transações executam operações em temporary tables, o número de transações concorrentes de leitura e escrita que o `InnoDB` é capaz de suportar é restringido pelo número de Rollback Segments alocados ao temporary tablespace, que é 32.

* Se cada transação executa uma operação `INSERT` **ou** uma operação `UPDATE` ou `DELETE`, o número de transações concorrentes de leitura e escrita que o `InnoDB` é capaz de suportar é:

  ```sql
  (innodb_page_size / 16) * (innodb_rollback_segments - 32)
  ```

* Se cada transação executa uma operação `INSERT` **e** uma operação `UPDATE` ou `DELETE`, o número de transações concorrentes de leitura e escrita que o `InnoDB` é capaz de suportar é:

  ```sql
  (innodb_page_size / 16 / 2) * (innodb_rollback_segments - 32)
  ```

* Se cada transação executa uma operação `INSERT` em uma temporary table, o número de transações concorrentes de leitura e escrita que o `InnoDB` é capaz de suportar é:

  ```sql
  (innodb_page_size / 16) * 32
  ```

* Se cada transação executa uma operação `INSERT` **e** uma operação `UPDATE` ou `DELETE` em uma temporary table, o número de transações concorrentes de leitura e escrita que o `InnoDB` é capaz de suportar é:

  ```sql
  (innodb_page_size / 16 / 2) * 32
  ```
