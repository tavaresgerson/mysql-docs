#### 7.4.4.3 Formato de Registro Binário Misto

Ao executar no formato de registro `MIXED`, o servidor troca automaticamente do registro baseado em declarações para o registro baseado em linhas nas seguintes condições:

* Quando uma função contém `UUID()`.

* Quando uma ou mais tabelas com colunas `AUTO_INCREMENT` são atualizadas e um gatilho ou função armazenada é invocado. Como todas as outras declarações inseguras, isso gera uma mensagem de aviso se `binlog_format = STATEMENT`.

Para mais informações, consulte a Seção 19.5.1.1, “Replicação e AUTO\_INCREMENT”.

* Quando o corpo de uma visão requer replicação baseada em linhas, a declaração que cria a visão também a usa. Por exemplo, isso ocorre quando a declaração que cria uma visão usa a função `UUID()`.

* Quando envolve uma chamada a uma função carregável.

* Quando `FOUND_ROWS()` ou `ROW_COUNT()` é usado. (Bug
  #12092, Bug #30244)

* Quando `USER()`, `CURRENT_USER()` ou `CURRENT_USER` é usado. (Bug
  #28086)

* Quando uma das tabelas envolvidas é uma tabela de log no banco de dados `mysql`.

* Quando a função `LOAD_FILE()` é usada. (Bug #39701)

* Quando uma declaração se refere a uma ou mais variáveis de sistema. (Bug #31168)

**Exceção.** As seguintes variáveis de sistema, quando usadas com escopo de sessão (apenas), não fazem com que o formato de registro mude:

+ `auto_increment_increment`
+ `auto_increment_offset`
+ `character_set_client`
+ `character_set_connection`
+ `character_set_database`
+ `character_set_server`
+ `collation_connection`
+ `collation_database`
+ `collation_server`
+ `foreign_key_checks`
+ `identity`
+ `last_insert_id`
+ `lc_time_names`
+ `pseudo_thread_id`
+ `sql_auto_is_null`
+ `time_zone`
+ `timestamp`
+ `unique_checks`

Para informações sobre a determinação do escopo da variável de sistema, consulte a Seção 7.1.9, “Usando Variáveis de Sistema”.

Para obter informações sobre como a replicação trata o `sql_mode`, consulte a Seção 19.5.1.40, “Replicação e Variáveis”.

Em versões anteriores ao MySQL 8.0, quando o formato de registro binário misto estava em uso, se uma instrução era registrada por linha e a sessão que executou a instrução tinha tabelas temporárias, todas as instruções subsequentes eram tratadas como inseguras e registradas no formato baseado em linha até que todas as tabelas temporárias em uso por essa sessão fossem excluídas. No MySQL 9.5, as operações em tabelas temporárias não são registradas no formato de registro binário misto, e a presença de tabelas temporárias na sessão não tem impacto no modo de registro usado para cada instrução.

Observação

Um aviso é gerado se você tentar executar uma instrução usando o registro baseado em instrução que deve ser escrito usando o registro baseado em linha. O aviso é exibido tanto no cliente (na saída de `SHOW WARNINGS`) quanto no log de erro do **mysqld**. Um aviso é adicionado à tabela `SHOW WARNINGS` cada vez que tal instrução é executada. No entanto, apenas a primeira instrução que gerou o aviso para cada sessão do cliente é escrita no log de erro para evitar inundar o log.

Além das decisões acima, os motores individuais também podem determinar o formato de registro usado quando as informações em uma tabela são atualizadas. As capacidades de registro de um motor individual podem ser definidas da seguinte forma:

* Se um motor suporta registro baseado em linha, o motor é dito ser capaz de registro baseado em linha.

* Se um motor suporta registro baseado em instrução, o motor é dito ser capaz de registro baseado em instrução.

Um motor de armazenamento específico pode suportar um ou ambos os formatos de registro. A tabela a seguir lista os formatos suportados por cada motor.

<table summary="Formulários de registro suportados por cada motor de armazenamento."><col style="width: 50%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th scope="col">Motor de Armazenamento</th> <th scope="col">Registro de Linhas Suportado</th> <th scope="col">Registro de Declarações Suportado</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">ARCHIVE</code></th> <td>Sim</td> <td>Sim</td> </tr><tr> <th scope="row"><code class="literal">BLACKHOLE</code></th> <td>Sim</td> <td>Sim</td> </tr><tr> <th scope="row"><code class="literal">CSV</code></th> <td>Sim</td> <td>Sim</td> </tr><tr> <th scope="row"><code class="literal">EXAMPLE</code></th> <td>Sim</td> <td>Não</td> </tr><tr> <th scope="row"><code class="literal">FEDERATED</code></th> <td>Sim</td> <td>Sim</td> </tr><tr> <th scope="row"><code class="literal">HEAP</code></th> <td>Sim</td> <td>Sim</td> </tr><tr> <th scope="row"><code class="literal">InnoDB</code></th> <td>Sim</td> <td>Sim quando o nível de isolamento de transação é <a class="link" href="innodb-transaction-isolation-levels.html#isolevel_repeatable-read"><code class="literal">REPEATABLE READ</code></a> ou <a class="link" href="innodb-transaction-isolation-levels.html#isolevel_serializable"><code class="literal">SERIALIZABLE</code></a>; Não de outra forma.</td> </tr><tr> <th scope="row"><code class="literal">MyISAM</code></th> <td>Sim</td> <td>Sim</td> </tr><tr> <th scope="row"><code class="literal">MERGE</code></th> <td>Sim</td> <td>Sim</td> </tr><tr> <th scope="row"><a class="link" href="mysql-cluster.html" title="Capítulo 25 MySQL NDB Cluster 9.5"><code class="literal">NDB</code></a></th> <td>Sim</td> <td>Não</td> </tr></tbody></table>

Se uma declaração deve ser registrada e o modo de registro a ser utilizado é determinado de acordo com o tipo de declaração (segura, insegura ou injetada binariamente), o formato de registro binário (`STATEMENT`, `ROW` ou `MIXED`) e as capacidades de registro do motor de armazenamento (capaz de declarações, capaz de linhas, ambos ou nenhum). (A injeção binária refere-se ao registro de uma mudança que deve ser registrada usando o formato `ROW`.)

As declarações podem ser registradas com ou sem um aviso; as declarações falhas não são registradas, mas geram erros no log. Isso é mostrado na tabela de decisão a seguir. As colunas **Tipo**, **binlog\_format**, **SLC** e **RLC** delineiam as condições, e as colunas **Erro / Aviso** e **Registrado como** representam as ações correspondentes. **SLC** significa “capaz de registro de declarações”, e **RLC** significa “capaz de registro de linhas”.

<table summary="As informações neste quadro são usadas para determinar se uma declaração deve ser registrada e o modo de registro a ser utilizado. O quadro descreve condições (Segurança/insegurança, <code class="literal">binlog_format</code>, SLC, RLC) e ações correspondentes.">
<col style="width: 10%"/><col style="width: 25%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 25%"/>
<thead><tr> <th>Tipo</th> <th><a class="link" href="replication-options-binary-log.html#sysvar_binlog_format"><code>binlog_format</code></a></th> <th>SLC</th> <th>RLC</th> <th>Erro/Aviso</th> <th>Registrado como</th> </tr></thead><tbody><tr> <th>*</th> <td><code class="literal">*</code></td> <td>Não</td> <td>Não</td> <td><span class="errortext">Erro: Não é possível executar a declaração</span>: O registro binário é impossível, pois pelo menos um motor está envolvido que é incapaz de execução de declarações e de registros.</td> <td><code class="literal">-</code></td> </tr><tr> <th>Segurança</th> <td><code class="literal">STATEMENT</code></td> <td>Sim</td> <td>Não</td> <td>-</td> <td><code class="literal">STATEMENT</code></td> </tr><tr> <th>Segurança</th> <td><code class="literal">MIXED</code></td> <td>Sim</td> <td>Não</td> <td>-</td> <td><code class="literal">STATEMENT</code></td> </tr><tr> <th>Segurança</th> <td><code class="literal">ROW</code></td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Erro: Não é possível executar a declaração</span>: O registro binário é impossível, pois <code class="literal">BINLOG_FORMAT = ROW</code> e pelo menos uma tabela usa um motor de armazenamento que não é capaz de registro baseado em linhas.</td> <td><code class="literal">-</code></td> </tr><tr> <th>Insegurança</th> <td><code class="literal">STATEMENT</code></td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Aviso: Declaração binlogada em formato de declaração</span>, pois <code class="literal">BINLOG_FORMAT = STATEMENT</code></td> <td><code class="literal">STATEMENT</code></td> </tr><tr> <th>Insegurança</th> <td><code class="literal">MIXED</code></td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Erro: Não é possível executar a declaração</span>: O registro binário de uma declaração insegura é impossível quando o motor de armazenamento é limitado ao registro de declarações, mesmo que <code class="literal">BINLOG_FORMAT = MIXED</code>.</td> <td><code class="literal">-</code></td> </tr><tr> <th>Insegurança</th> <td><code class="literal">ROW</code></td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Erro: Não é possível executar a declaração</span>: O registro binário é impossível, pois <code class="literal">BINLOG_FORMAT = ROW</code> e pelo menos uma tabela usa um motor de armazenamento que não é capaz de registro baseado em linhas.</td> <td>-</td> </tr><tr> <th>Injeção de Linhas</th> <td><code class="literal">STATEMENT</code></td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Erro: Não é possível executar a injeção de linhas</span>: O registro binário é impossível, pois pelo menos uma tabela usa um motor de armazenamento que não é capaz de registro baseado em linhas.</td> <td>-</td> </tr><tr> <th>Injeção de Linhas</th> <td><code class="literal">MIXED</code></td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Erro: Não é possível executar a injeção de linhas</span>: O registro binário é impossível, pois pelo menos uma tabela usa um motor de armazenamento que não é capaz de registro baseado em linhas.</td> <td>-</td> </tr><tr> <th>Injeção de Linhas</th> <td><code class="literal">ROW</code></td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Erro: Não é possível executar a injeção de linhas</span>: O registro binário é impossível, pois <code class="literal">BINLOG_FORMAT = ROW</code> e pelo menos uma tabela usa um motor de armazenamento que não é capaz de registro baseado em linhas.</td> <td>-</td> </tr><tr> <th>Segurança</th> 

Quando uma mensagem de aviso é gerada pela determinação, uma mensagem de aviso padrão do MySQL é gerada (e está disponível usando `SHOW WARNINGS`). As informações também são escritas no log de erro do **mysqld**. Apenas um erro por instância de erro por conexão de cliente é registrado para evitar inundar o log. A mensagem do log inclui a instrução SQL que foi tentada.

Se uma réplica tiver `log_error_verbosity` definido para exibir avisos, a réplica imprime mensagens no log de erro para fornecer informações sobre seu status, como as coordenadas do log binário e do log de retransmissão onde começa seu trabalho, quando está passando para outro log de retransmissão, quando se reconecta após uma desconexão, declarações que são inseguras para o registro baseado em declarações, e assim por diante.