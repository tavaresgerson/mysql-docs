### 17.6.6 Registros de Anulação

Um registro de anulação é uma coleção de registros de log de anulação associados a uma única transação de leitura/escrita. Um registro de log de anulação contém informações sobre como anular a última alteração realizada por uma transação em um registro de índice agrupado. Se outra transação precisar ver os dados originais como parte de uma operação de leitura consistente, os dados não modificados são recuperados dos registros de log de anulação. Os logs de anulação existem dentro dos segmentos de log de anulação, que estão contidos nos segmentos de rollback. Os segmentos de rollback residem nos espaços de tabelas de anulação e no espaço de tabelas temporárias globais.

Os logs de anulação que residem no espaço de tabelas temporárias globais são usados para transações que modificam dados em tabelas temporárias definidas pelo usuário. Esses logs de anulação não são registrados novamente, pois não são necessários para a recuperação em caso de falha. Eles são usados apenas para rollback enquanto o servidor estiver em execução. Esse tipo de log de anulação melhora o desempenho ao evitar o I/O de registro novamente.

Para obter informações sobre a criptografia de dados em repouso para logs de anulação, consulte Criptografia de Log de Anulação.

Cada espaço de tabelas de anulação e o espaço de tabelas temporárias globais individualmente suportam no máximo 128 segmentos de rollback. A variável `innodb_rollback_segments` define o número de segmentos de rollback.

O número de transações que um segmento de rollback suporta depende do número de slots de anulação no segmento de rollback e do número de logs de anulação necessários por cada transação. O número de slots de anulação em um segmento de rollback difere de acordo com o tamanho da página do `InnoDB`.

<table summary="Número de slots de desfazer em um segmento de rollback para cada tamanho de página do InnoDB"><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Tamanho de Página do InnoDB</th> <th>Número de Slots de Desfazer em um Segmento de Rollback (Tamanho de Página do InnoDB / 16)</th> </tr></thead><tbody><tr> <td><code class="literal">4096 (4KB)</code></td> <td><code class="literal">256</code></td> </tr><tr> <td><code class="literal">8192 (8KB)</code></td> <td><code class="literal">512</code></td> </tr><tr> <td><code class="literal">16384 (16KB)</code></td> <td><code class="literal">1024</code></td> </tr><tr> <td><code class="literal">32768 (32KB)</code></td> <td><code class="literal">2048</code></td> </tr><tr> <td><code class="literal">65536 (64KB)</code></td> <td><code class="literal">4096</code></td> </tr></tbody></table>

Uma transação é atribuída até quatro logs de desfazer, um para cada um dos seguintes tipos de operação:

1. Operações `INSERT` em tabelas definidas pelo usuário

2. Operações `UPDATE` e `DELETE` em tabelas definidas pelo usuário

3. Operações `INSERT` em tabelas temporárias definidas pelo usuário

4. Operações `UPDATE` e `DELETE` em tabelas temporárias definidas pelo usuário

Os logs de desfazer são atribuídos conforme necessário. Por exemplo, uma transação que realiza operações `INSERT`, `UPDATE` e `DELETE` em tabelas regulares e temporárias requer uma atribuição completa de quatro logs de desfazer. Uma transação que realiza apenas operações `INSERT` em tabelas regulares requer um único log de desfazer.

Uma transação que realiza operações em tabelas regulares é atribuída logs de desfazer de um segmento de rollback de espaço de tabelas de desfazer atribuído. Uma transação que realiza operações em tabelas temporárias é atribuída logs de desfazer de um segmento de rollback de espaço de tabelas temporárias globais atribuído.

Um registro de desfazer atribuído a uma transação permanece vinculado à transação por sua duração. Por exemplo, um registro de desfazer atribuído a uma transação para uma operação `INSERT` em uma tabela regular é usado para todas as operações `INSERT` em tabelas regulares realizadas por essa transação.

Dadas as fatores descritos acima, as seguintes fórmulas podem ser usadas para estimar o número de transações de leitura-escrita concorrentes que o `InnoDB` é capaz de suportar.

Nota

É possível encontrar um erro de limite de transação concorrente antes de atingir o número de transações de leitura-escrita concorrentes que o `InnoDB` é capaz de suportar. Isso ocorre quando um segmento de rollback atribuído a uma transação esgota as vagas de desfazer. Nesses casos, tente executar a transação novamente.

Quando as transações realizam operações em tabelas temporárias, o número de transações de leitura-escrita concorrentes que o `InnoDB` é capaz de suportar é limitado pelo número de segmentos de rollback alocados ao espaço de tabelas temporárias globais, que é de 128 por padrão.

* Se cada transação realizar uma operação de `INSERT` **ou** uma operação de `UPDATE` ou `DELETE`, o número de transações de leitura-escrita concorrentes que o `InnoDB` é capaz de suportar é:

  ```
  (innodb_page_size / 16) * innodb_rollback_segments * number of undo tablespaces
  ```

* Se cada transação realizar uma operação de `INSERT` **e** uma operação de `UPDATE` ou `DELETE`, o número de transações de leitura-escrita concorrentes que o `InnoDB` é capaz de suportar é:

  ```
  (innodb_page_size / 16 / 2) * innodb_rollback_segments * number of undo tablespaces
  ```

* Se cada transação realizar uma operação de `INSERT` em uma tabela temporária, o número de transações de leitura-escrita concorrentes que o `InnoDB` é capaz de suportar é:

  ```
  (innodb_page_size / 16) * innodb_rollback_segments
  ```

* Se cada transação realizar uma operação de `INSERT` **e** uma operação de `UPDATE` ou `DELETE` em uma tabela temporária, o número de transações de leitura e escrita concorrentes que o `InnoDB` é capaz de suportar é: