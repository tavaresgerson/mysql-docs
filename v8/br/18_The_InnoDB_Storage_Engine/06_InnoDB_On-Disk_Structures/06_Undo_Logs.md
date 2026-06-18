### 17.6.6 Registros de desfazer

Um registro de log de desfazer é uma coleção de registros de log de desfazer associados a uma única transação de leitura e escrita. Um registro de log de desfazer contém informações sobre como desfazer a última alteração realizada por uma transação em um registro de índice agrupado. Se outra transação precisar ver os dados originais como parte de uma operação de leitura consistente, os dados não modificados são recuperados dos registros de log de desfazer. Os logs de desfazer existem dentro dos segmentos de log de desfazer, que estão contidos nos segmentos de rollback. Os segmentos de rollback residem nos espaços de tabelas de desfazer e no espaço de tabelas temporárias globais.

Os registros de desfazer que residem no espaço de tabelas temporárias globais são usados para transações que modificam dados em tabelas temporárias definidas pelo usuário. Esses registros de desfazer não são registrados novamente, pois não são necessários para a recuperação em caso de falha. Eles são usados apenas para o rollback enquanto o servidor estiver em execução. Esse tipo de registro de desfazer melhora o desempenho ao evitar o I/O de registro novamente.

Para obter informações sobre criptografia de dados em repouso para logs de desfazer, consulte Criptografia de Log de Desfazer.

Cada espaço de tabelas de desfazer e o espaço de tabelas temporárias globais suportam, individualmente, um máximo de 128 segmentos de rollback. A variável `innodb_rollback_segments` define o número de segmentos de rollback.

O número de transações que um segmento de rollback suporta depende do número de slots de desfazer no segmento de rollback e do número de logs de desfazer necessários para cada transação. O número de slots de desfazer em um segmento de rollback difere de acordo com o tamanho da página `InnoDB`.

<table summary="Número de slots de desfazer em um segmento de rollback para cada tamanho de página do InnoDB"><thead><tr> <th>Tamanho da página do InnoDB</th> <th>Número de slots de desfazer em um segmento de rollback (tamanho da página do InnoDB / 16)</th> </tr></thead><tbody><tr> <td>[[<code>4096 (4KB)</code>]]</td> <td>[[<code>256</code>]]</td> </tr><tr> <td>[[<code>8192 (8KB)</code>]]</td> <td>[[<code>512</code>]]</td> </tr><tr> <td>[[<code>16384 (16KB)</code>]]</td> <td>[[<code>1024</code>]]</td> </tr><tr> <td>[[<code>32768 (32KB)</code>]]</td> <td>[[<code>2048</code>]]</td> </tr><tr> <td>[[<code>65536 (64KB)</code>]]</td> <td>[[<code>4096</code>]]</td> </tr></tbody></table>

Uma transação é atribuída até quatro registros de desfazer, um para cada um dos seguintes tipos de operação:

1. `INSERT` operações em tabelas definidas pelo usuário

2. Operações `UPDATE` e `DELETE` em tabelas definidas pelo usuário

3. Operações `INSERT` em tabelas temporárias definidas pelo usuário

4. Operações `UPDATE` e `DELETE` em tabelas temporárias definidas pelo usuário

Os registros de desfazer são atribuídos conforme necessário. Por exemplo, uma transação que realiza as operações `INSERT`, `UPDATE` e `DELETE` em tabelas regulares e temporárias requer a atribuição completa de quatro registros de desfazer. Uma transação que realiza apenas as operações `INSERT` em tabelas regulares requer um único registro de desfazer.

Uma transação que realiza operações em tabelas regulares recebe logs de desfazer de um segmento de rollback de espaço de rollback de tabelas temporárias atribuído. Uma transação que realiza operações em tabelas temporárias recebe logs de desfazer de um segmento de rollback de espaço de tabelas temporárias globais atribuído.

Um registro de desfazer atribuído a uma transação permanece vinculado à transação por sua duração. Por exemplo, um registro de desfazer atribuído a uma transação para uma operação `INSERT` em uma tabela regular é usado para todas as operações `INSERT` em tabelas regulares realizadas por essa transação.

Dadas as fatores descritos acima, as seguintes fórmulas podem ser usadas para estimar o número de transações de leitura e escrita concorrentes que o `InnoDB` é capaz de suportar.

Nota

É possível encontrar um erro de limite de transação concorrente antes de atingir o número de transações de leitura e escrita concorrentes que o `InnoDB` é capaz de suportar. Isso ocorre quando um segmento de rollback atribuído a uma transação esgota as entradas de desfazer. Nesses casos, tente executar a transação novamente.

Quando as transações realizam operações em tabelas temporárias, o número de transações de leitura e escrita concorrentes que o `InnoDB` é capaz de suportar é limitado pelo número de segmentos de rollback alocados ao espaço de tabelas temporárias globais, que é de 128 por padrão.

- Se cada transação realizar uma operação de `INSERT` **ou** uma operação de `UPDATE` ou `DELETE`, o número de transações de leitura e escrita concorrentes que o `InnoDB` é capaz de suportar é:

  ```
  (innodb_page_size / 16) * innodb_rollback_segments * number of undo tablespaces
  ```

- Se cada transação realizar uma operação `INSERT` **e** uma operação `UPDATE` ou `DELETE`, o número de transações de leitura/escrita concorrentes que o `InnoDB` é capaz de suportar é:

  ```
  (innodb_page_size / 16 / 2) * innodb_rollback_segments * number of undo tablespaces
  ```

- Se cada transação realizar uma operação `INSERT` em uma tabela temporária, o número de transações de leitura e escrita concorrentes que o `InnoDB` é capaz de suportar é:

  ```
  (innodb_page_size / 16) * innodb_rollback_segments
  ```

- Se cada transação realizar uma operação `INSERT` **e** uma operação `UPDATE` ou `DELETE` em uma tabela temporária, o número de transações de leitura e escrita concorrentes que o `InnoDB` é capaz de suportar é:

  ```
  (innodb_page_size / 16 / 2) * innodb_rollback_segments
  ```
