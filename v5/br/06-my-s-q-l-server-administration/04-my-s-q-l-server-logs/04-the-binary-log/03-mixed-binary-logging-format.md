#### 5.4.4.3 Formato de registro binário misto

Ao executar no formato de registro `MIXED`, o servidor muda automaticamente do registro baseado em declarações para o registro baseado em linhas nas seguintes condições:

- Quando uma instrução DML atualiza uma tabela `NDBCLUSTER`.

- Quando uma função contém `UUID()`.

- Quando uma ou mais tabelas com colunas `AUTO_INCREMENT` são atualizadas e um gatilho ou função armazenada é acionado. Como todos os outros comandos inseguros, isso gera uma mensagem de aviso se [`binlog_format = STATEMENT`](https://pt.wikipedia.org/wiki/Replicação_de_dados#Op%C3%A7%C3%B5es_de_log_bin%C3%A1rio.3F).

  Para mais informações, consulte Seção 16.4.1.1, “Replicação e AUTO_INCREMENT”.

- Quando o corpo de uma visão requer replicação baseada em linhas, a instrução que cria a visão também a utiliza. Por exemplo, isso ocorre quando a instrução que cria uma visão utiliza a função `UUID()`.

- Quando envolve uma chamada para uma função carregável.

- Se uma declaração for registrada por linha e a sessão que executou a declaração tiver tabelas temporárias, a registro por linha será usado para todas as declarações subsequentes (exceto aquelas que acessam tabelas temporárias) até que todas as tabelas temporárias em uso por essa sessão sejam excluídas.

  Isso é verdade, independentemente de as tabelas temporárias serem ou não realmente registradas.

  As tabelas temporárias não podem ser registradas usando o formato baseado em linhas; portanto, uma vez que o registro baseado em linhas seja usado, todas as instruções subsequentes que utilizam essa tabela serão inseguras. O servidor aproxima essa condição tratando todas as instruções executadas durante a sessão como inseguras até que a sessão não contenha mais nenhuma tabela temporária.

- Quando [`FOUND_ROWS()`](https://pt.wikibooks.org/wiki/PHP/Fun%C3%A7%C3%B5es/FOUND_ROWS) ou [`ROW_COUNT()`](https://pt.wikibooks.org/wiki/PHP/Fun%C3%A7%C3%B5es/ROW_COUNT) é usado. (Bug #12092, Bug #30244)

- Quando `USER()`, `CURRENT_USER()` ou `CURRENT_USER` são usados. (Bug #28086)

- Quando uma declaração se refere a uma ou mais variáveis do sistema. (Bug #31168)

  **Exceção.** As seguintes variáveis de sistema, quando usadas com escopo de sessão (somente), não fazem com que o formato de registro mude:

  - [`auto_increment_increment`](https://replication-options-source.html#sysvar_auto_increment_increment)
  - [`auto_increment_offset`](https://replication-options-source.html#sysvar_auto_increment_offset)
  - `character_set_client`
  - `character_set_connection`
  - `character_set_database`
  - `character_set_server`
  - `collation_connection`
  - `collation_database`
  - `collation_server`
  - `foreign_key_checks`
  - `identidade`
  - `last_insert_id`
  - `lc_time_names`
  - `pseudo_thread_id`
  - `sql_auto_is_null`
  - `time_zone`
  - `timestamp`
  - `unique_checks`

  Para obter informações sobre a determinação do escopo das variáveis do sistema, consulte Seção 5.1.8, “Usando Variáveis do Sistema”.

  Para obter informações sobre como a replicação trata do `sql_mode`, consulte Seção 16.4.1.37, “Replicação e Variáveis”.

- Quando uma das tabelas envolvidas for uma tabela de registro no banco de dados `mysql`.

- Quando a função `LOAD_FILE()` é usada. (Bug #39701)

Nota

Um aviso é gerado se você tentar executar uma instrução usando o registro baseado em instruções que deve ser escrito usando o registro baseado em linhas. O aviso é exibido tanto no cliente (na saída de `SHOW WARNINGS`) quanto no log de erro do **mysqld**. Um aviso é adicionado à tabela `SHOW WARNINGS` toda vez que tal instrução é executada. No entanto, apenas a primeira instrução que gerou o aviso para cada sessão do cliente é escrita no log de erro para evitar inundar o log.

Além das decisões acima, os motores individuais também podem determinar o formato de registro usado quando as informações em uma tabela são atualizadas. As capacidades de registro de um motor individual podem ser definidas da seguinte forma:

- Se um motor suportar o registro baseado em linhas, diz-se que o motor é capaz de registro de linha.

- Se um motor suportar o registro baseado em declarações, diz-se que o motor é capaz de registro baseado em declarações.

Um motor de armazenamento específico pode suportar um ou ambos os formatos de registro. A tabela a seguir lista os formatos suportados por cada motor.

<table summary="Formatos de registro suportados por cada motor de armazenamento."><col style="width: 50%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Motor de Armazenamento</th> <th>Registro de linhas suportado</th> <th>Suporte para registro de declarações</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>MERGE</code>]</th> <td>Sim</td> <td>Sim</td> </tr><tr> <th>[[PH_HTML_CODE_<code>MERGE</code>]</th> <td>Sim</td> <td>Sim</td> </tr><tr> <th>[[<code>CSV</code>]]</th> <td>Sim</td> <td>Sim</td> </tr><tr> <th>[[<code>EXAMPLE</code>]]</th> <td>Sim</td> <td>Não</td> </tr><tr> <th>[[<code>FEDERATED</code>]]</th> <td>Sim</td> <td>Sim</td> </tr><tr> <th>[[<code>HEAP</code>]]</th> <td>Sim</td> <td>Sim</td> </tr><tr> <th>[[<code>InnoDB</code>]]</th> <td>Sim</td> <td>Sim, quando o nível de isolamento de transação é[[<code>REPEATABLE READ</code>]]ou[[<code>SERIALIZABLE</code>]]; Não de outra forma.</td> </tr><tr> <th>[[<code>MyISAM</code>]]</th> <td>Sim</td> <td>Sim</td> </tr><tr> <th>[[<code>MERGE</code>]]</th> <td>Sim</td> <td>Sim</td> </tr><tr> <th>[[<code>BLACKHOLE</code><code>MERGE</code>]</th> <td>Sim</td> <td>Não</td> </tr></tbody></table>

Se uma declaração deve ser registrada e o modo de registro a ser utilizado é determinado de acordo com o tipo de declaração (seguro, inseguro ou injetado binário), o formato de registro binário (`STATEMENT`, `ROW` ou `MIXED`) e as capacidades de registro do motor de armazenamento (capaz de declaração, capaz de linha, ambos ou nenhum). (Injeção binária refere-se ao registro de uma mudança que deve ser registrada usando o formato `ROW`.

As declarações podem ser registradas com ou sem um aviso; as declarações falhas não são registradas, mas geram erros no log. Isso é mostrado na tabela de decisão a seguir. As colunas **Tipo**, **binlog_format**, **SLC** e **RLC** definem as condições, e as colunas **Erro / Aviso** e **Registrado como** representam as ações correspondentes. **SLC** significa "capaz de registrar declarações", e **RLC** significa "capaz de registrar linhas".

<table summary="As informações desta tabela são usadas para determinar se uma declaração deve ser registrada e o modo de registro a ser utilizado. A tabela descreve condições (Segurança/Insegurança, binlog_format, SLC, RLR) e ações correspondentes."><col style="width: 10%"/><col style="width: 25%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 25%"/><thead><tr> <th>Tipo</th> <th>[[PH_HTML_CODE_<code>STATEMENT</code>]</th> <th>SLC</th> <th>RLC</th> <th>Erro/Aviso</th> <th>Registrado como</th> </tr></thead><tbody><tr> <th>*</th> <td>[[PH_HTML_CODE_<code>STATEMENT</code>]</td> <td>Não</td> <td>Não</td> <td><span class="errortext">Erro: Não é possível executar a instrução</span>: O registro binário é impossível, pois pelo menos um motor está envolvido, que é incapaz de realizar operações de linha e de declaração.</td> <td>[[PH_HTML_CODE_<code>STATEMENT</code>]</td> </tr><tr> <th>Seguro</th> <td>[[PH_HTML_CODE_<code>MIXED</code>]</td> <td>Sim</td> <td>Não</td> <td>-</td> <td>[[PH_HTML_CODE_<code>BINLOG_FORMAT = MIXED</code>]</td> </tr><tr> <th>Seguro</th> <td>[[PH_HTML_CODE_<code>-</code>]</td> <td>Sim</td> <td>Não</td> <td>-</td> <td>[[PH_HTML_CODE_<code>ROW</code>]</td> </tr><tr> <th>Seguro</th> <td>[[PH_HTML_CODE_<code>BINLOG_FORMAT = ROW</code>]</td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Erro: Não é possível executar a instrução</span>: O registro binário é impossível, pois [[PH_HTML_CODE_<code>STATEMENT</code>] e pelo menos uma tabela usa um mecanismo de armazenamento que não é capaz de registrar registros baseados em linhas.</td> <td>[[PH_HTML_CODE_<code>MIXED</code>]</td> </tr><tr> <th>Inseguro</th> <td>[[<code>STATEMENT</code>]]</td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Aviso: declaração insegura registrada em formato de log de declaração</span>, desde [[<code>*</code><code>STATEMENT</code>]</td> <td>[[<code>STATEMENT</code>]]</td> </tr><tr> <th>Inseguro</th> <td>[[<code>MIXED</code>]]</td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Erro: Não é possível executar a instrução</span>: O registro binário de uma declaração insegura é impossível quando o mecanismo de armazenamento é limitado ao registro baseado em declarações, mesmo que [[<code>BINLOG_FORMAT = MIXED</code>]].</td> <td>[[<code>-</code>]]</td> </tr><tr> <th>Inseguro</th> <td>[[<code>ROW</code>]]</td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Erro: Não é possível executar a instrução</span>: O registro binário é impossível, pois [[<code>BINLOG_FORMAT = ROW</code>]] e pelo menos uma tabela usa um mecanismo de armazenamento que não é capaz de registrar registros baseados em linhas.</td> <td>-</td> </tr><tr> <th>Injeção de linha</th> <td>[[<code>STATEMENT</code>]]</td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Erro: Não é possível executar a injeção de linha</span>: O registro binário não é possível, pois pelo menos uma tabela usa um mecanismo de armazenamento que não é capaz de registrar registros baseados em linhas.</td> <td>-</td> </tr><tr> <th>Injeção de linha</th> <td>[[<code>MIXED</code>]]</td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Erro: Não é possível executar a injeção de linha</span>: O registro binário não é possível, pois pelo menos uma tabela usa um mecanismo de armazenamento que não é capaz de registrar registros baseados em linhas.</td> <td>-</td> </tr><tr> <th>Injeção de linha</th> <td>[[<code>-</code><code>STATEMENT</code>]</td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Erro: Não é possível executar a injeção de linha</span>: O registro binário não é possível, pois pelo menos uma tabela usa um mecanismo de armazenamento que não é capaz de registrar registros baseados em linhas.</td> <td>-</td> </tr><tr> <th>Seguro</th> <td>[[<code>-</code><code>STATEMENT</code>]</td> <td>Não</td> <td>Sim</td> <td><span class="errortext">Erro: Não é possível executar a instrução</span>: O registro binário é impossível, pois [[<code>-</code><code>STATEMENT</code>] e pelo menos uma tabela usa um mecanismo de armazenamento que não é capaz de registrar instruções.</td> <td>[[<code>-</code><code>MIXED</code>]</td> </tr><tr> <th>Seguro</th> <td>[[<code>-</code><code>BINLOG_FORMAT = MIXED</code>]</td> <td>Não</td> <td>Sim</td> <td>-</td> <td>[[<code>-</code><code>-</code>]</td> </tr><tr> <th>Seguro</th> <td>[[<code>-</code><code>ROW</code>]</td> <td>Não</td> <td>Sim</td> <td>-</td> <td>[[<code>-</code><code>BINLOG_FORMAT = ROW</code>]</td> </tr><tr> <th>Inseguro</th> <td>[[<code>-</code><code>STATEMENT</code>]</td> <td>Não</td> <td>Sim</td> <td><span class="errortext">Erro: Não é possível executar a instrução</span>: O registro binário é impossível, pois [[<code>-</code><code>MIXED</code>] e pelo menos uma tabela usa um mecanismo de armazenamento que não é capaz de registrar instruções.</td> <td>-</td> </tr><tr> <th>Inseguro</th> <td>[[<code>STATEMENT</code><code>STATEMENT</code>]</td> <td>Não</td> <td>Sim</td> <td>-</td> <td>[[<code>STATEMENT</code><code>STATEMENT</code>]</td> </tr><tr> <th>Inseguro</th> <td>[[<code>STATEMENT</code><code>STATEMENT</code>]</td> <td>Não</td> <td>Sim</td> <td>-</td> <td>[[<code>STATEMENT</code><code>MIXED</code>]</td> </tr><tr> <th>Injeção de linha</th> <td>[[<code>STATEMENT</code><code>BINLOG_FORMAT = MIXED</code>]</td> <td>Não</td> <td>Sim</td> <td><span class="errortext">Erro: Não é possível executar a injeção de linha</span>: O registro binário não é possível devido a [[<code>STATEMENT</code><code>-</code>].</td> <td>[[<code>STATEMENT</code><code>ROW</code>]</td> </tr><tr> <th>Injeção de linha</th> <td>[[<code>STATEMENT</code><code>BINLOG_FORMAT = ROW</code>]</td> <td>Não</td> <td>Sim</td> <td>-</td> <td>[[<code>STATEMENT</code><code>STATEMENT</code>]</td> </tr><tr> <th>Injeção de linha</th> <td>[[<code>STATEMENT</code><code>MIXED</code>]</td> <td>Não</td> <td>Sim</td> <td>-</td> <td>[[<code>STATEMENT</code><code>STATEMENT</code>]</td> </tr><tr> <th>Seguro</th> <td>[[<code>STATEMENT</code><code>STATEMENT</code>]</td> <td>Sim</td> <td>Sim</td> <td>-</td> <td>[[<code>STATEMENT</code><code>STATEMENT</code>]</td> </tr><tr> <th>Seguro</th> <td>[[<code>STATEMENT</code><code>MIXED</code>]</td> <td>Sim</td> <td>Sim</td> <td>-</td> <td>[[<code>STATEMENT</code><code>BINLOG_FORMAT = MIXED</code>]</td> </tr><tr> <th>Seguro</th> <td>[[<code>STATEMENT</code><code>-</code>]</td> <td>Sim</td> <td>Sim</td> <td>-</td> <td>[[<code>STATEMENT</code><code>ROW</code>]</td> </tr><tr> <th>Inseguro</th> <td>[[<code>STATEMENT</code><code>BINLOG_FORMAT = ROW</code>]</td> <td>Sim</td> <td>Sim</td> <td><span class="errortext">Aviso: declaração insegura registrada em formato de log de declaração</span>desde [[<code>STATEMENT</code><code>STATEMENT</code>].</td> <td>[[<code>STATEMENT</code><code>MIXED</code>]</td> </tr><tr> <th>Inseguro</th> <td>[[<code>MIXED</code><code>STATEMENT</code>]</td> <td>Sim</td> <td>Sim</td> <td>-</td> <td>[[<code>MIXED</code><code>STATEMENT</code>]</td> </tr><tr> <th>Inseguro</th> <td>[[<code>MIXED</code><code>STATEMENT</code>]</td> <td>Sim</td> <td>Sim</td> <td>-</td> <td>[[<code>MIXED</code><code>MIXED</code>]</td> </tr><tr> <th>Injeção de linha</th> <td>[[<code>MIXED</code><code>BINLOG_FORMAT = MIXED</code>]</td> <td>Sim</td> <td>Sim</td> <td><span class="errortext">Erro: Não é possível executar a injeção de linha</span>: O registro binário não é possível porque [[<code>MIXED</code><code>-</code>].</td> <td>-</td> </tr><tr> <th>Injeção de linha</th> <td>[[<code>MIXED</code><code>ROW</code>]</td> <td>Sim</td> <td>Sim</td> <td>-</td> <td>[[<code>MIXED</code><code>BINLOG_FORMAT = ROW</code>]</td> </tr><tr> <th>Injeção de linha</th> <td>[[<code>MIXED</code><code>STATEMENT</code>]</td> <td>Sim</td> <td>Sim</td> <td>-</td> <td>[[<code>MIXED</code><code>MIXED</code>]</td> </tr></tbody></table>

Quando uma mensagem de aviso é gerada pela determinação, uma mensagem padrão do MySQL é gerada (e está disponível usando `SHOW WARNINGS`). As informações também são escritas no log de erro do **mysqld**. Apenas um erro por instância de erro por conexão de cliente é registrado para evitar inundar o log. A mensagem do log inclui a instrução SQL que foi tentada.

Se `log_error_verbosity` for 2 ou superior em uma replica, a replica imprime mensagens no log de erro para fornecer informações sobre seu status, como as coordenadas do log binário e do log de retransmissão onde ele começa seu trabalho, quando está mudando para outro log de retransmissão, quando se reconecta após uma desconexão, declarações que são inseguras para o registro baseado em declarações, e assim por diante.
