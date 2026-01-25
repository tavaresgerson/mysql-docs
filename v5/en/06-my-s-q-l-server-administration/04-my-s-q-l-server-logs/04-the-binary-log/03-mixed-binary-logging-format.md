#### 5.4.4.3 Formato de Binary Logging Misto

Ao executar no formato de logging `MIXED`, o servidor alterna automaticamente do logging baseado em Statement (`statement-based`) para o logging baseado em Row (`row-based`) sob as seguintes condições:

* Quando uma instrução DML (Data Manipulation Language) atualiza uma tabela [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

* Quando uma função contém [`UUID()`](miscellaneous-functions.html#function_uuid).

* Quando uma ou mais tabelas com colunas `AUTO_INCREMENT` são atualizadas e um Trigger ou Stored Function é invocado. Assim como todas as outras Statements não seguras (`unsafe statements`), isso gera um Warning se [`binlog_format = STATEMENT`](replication-options-binary-log.html#sysvar_binlog_format).

  Para mais informações, consulte [Section 16.4.1.1, “Replication and AUTO_INCREMENT”](replication-features-auto-increment.html "16.4.1.1 Replication and AUTO_INCREMENT").

* Quando o corpo de uma View requer replicação baseada em Row (`row-based replication`), a Statement que cria a View também a utiliza. Por exemplo, isso ocorre quando a Statement de criação da View usa a função [`UUID()`](miscellaneous-functions.html#function_uuid).

* Quando uma chamada para uma função carregável (`loadable function`) está envolvida.
* Se uma Statement for logada por Row e a Session que executou a Statement tiver quaisquer temporary tables, o logging por Row será usado para todas as Statements subsequentes (exceto aquelas que acessam temporary tables) até que todas as temporary tables em uso por essa Session sejam descartadas (`dropped`).

  Isso é verdadeiro, independentemente de qualquer temporary table ter sido efetivamente logada ou não.

  Temporary tables não podem ser logadas usando o formato baseado em Row; portanto, uma vez que o logging baseado em Row é usado, todas as Statements subsequentes que usam essa tabela são consideradas não seguras (`unsafe`). O servidor aproxima essa condição tratando todas as Statements executadas durante a Session como não seguras até que a Session não mantenha mais nenhuma temporary table.

* Quando [`FOUND_ROWS()`](information-functions.html#function_found-rows) ou [`ROW_COUNT()`](information-functions.html#function_row-count) é usado. (Bug #12092, Bug #30244)

* Quando [`USER()`](information-functions.html#function_user), [`CURRENT_USER()`](information-functions.html#function_current-user), ou [`CURRENT_USER`](information-functions.html#function_current-user) é usado. (Bug #28086)

* Quando uma Statement se refere a uma ou mais System Variables. (Bug #31168)

  **Exceção.** As seguintes System Variables, quando usadas apenas com escopo de Session, não causam a alternância do formato de logging:

  + [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment)
  + [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset)
  + [`character_set_client`](server-system-variables.html#sysvar_character_set_client)
  + [`character_set_connection`](server-system-variables.html#sysvar_character_set_connection)
  + [`character_set_database`](server-system-variables.html#sysvar_character_set_database)
  + [`character_set_server`](server-system-variables.html#sysvar_character_set_server)
  + [`collation_connection`](server-system-variables.html#sysvar_collation_connection)
  + [`collation_database`](server-system-variables.html#sysvar_collation_database)
  + [`collation_server`](server-system-variables.html#sysvar_collation_server)
  + [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks)
  + [`identity`](server-system-variables.html#sysvar_identity)
  + [`last_insert_id`](server-system-variables.html#sysvar_last_insert_id)
  + [`lc_time_names`](server-system-variables.html#sysvar_lc_time_names)
  + [`pseudo_thread_id`](server-system-variables.html#sysvar_pseudo_thread_id)
  + [`sql_auto_is_null`](server-system-variables.html#sysvar_sql_auto_is_null)
  + [`time_zone`](server-system-variables.html#sysvar_time_zone)
  + [`timestamp`](server-system-variables.html#sysvar_timestamp)
  + [`unique_checks`](server-system-variables.html#sysvar_unique_checks)

  Para informações sobre como determinar o escopo de System Variables, consulte [Section 5.1.8, “Using System Variables”](using-system-variables.html "5.1.8 Using System Variables").

  Para informações sobre como a Replication trata [`sql_mode`](server-system-variables.html#sysvar_sql_mode), consulte [Section 16.4.1.37, “Replication and Variables”](replication-features-variables.html "16.4.1.37 Replication and Variables").

* Quando uma das tabelas envolvidas é uma tabela de log no Database `mysql`.

* Quando a função [`LOAD_FILE()`](string-functions.html#function_load-file) é usada. (Bug #39701)

Note

Um Warning é gerado se você tentar executar uma Statement usando logging baseado em Statement que deveria ser escrito usando logging baseado em Row. O Warning é exibido tanto no client (na saída de [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement")) quanto através do error log do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Um Warning é adicionado à tabela [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") sempre que tal Statement é executada. No entanto, apenas a primeira Statement que gerou o Warning para cada Session de Client é escrita no error log para evitar sobrecarregar o log.

Além das decisões acima, Engines individuais também podem determinar o formato de logging usado quando informações em uma tabela são atualizadas. As capacidades de logging de um Engine individual podem ser definidas como segue:

* Se um Engine suporta logging baseado em Row, o Engine é considerado capaz de logging por Row (`row-logging capable`).

* Se um Engine suporta logging baseado em Statement, o Engine é considerado capaz de logging por Statement (`statement-logging capable`).

Um determinado Storage Engine pode suportar um ou ambos os formatos de logging. A tabela a seguir lista os formatos suportados por cada Engine.

<table summary="Formatos de logging suportados por cada Storage Engine."><col style="width: 50%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Storage Engine</th> <th>Logging por Row Suportado</th> <th>Logging por Statement Suportado</th> </tr></thead><tbody><tr> <th><code>ARCHIVE</code></th> <td>Sim</td> <td>Sim</td> </tr><tr> <th><code>BLACKHOLE</code></th> <td>Sim</td> <td>Sim</td> </tr><tr> <th><code>CSV</code></th> <td>Sim</td> <td>Sim</td> </tr><tr> <th><code>EXAMPLE</code></th> <td>Sim</td> <td>Não</td> </tr><tr> <th><code>FEDERATED</code></th> <td>Sim</td> <td>Sim</td> </tr><tr> <th><code>HEAP</code></th> <td>Sim</td> <td>Sim</td> </tr><tr> <th><code>InnoDB</code></th> <td>Sim</td> <td>Sim, quando o nível de isolamento de Transaction é <code>REPEATABLE READ</code> ou <code>SERIALIZABLE</code>; Não, caso contrário.</td> </tr><tr> <th><code>MyISAM</code></th> <td>Sim</td> <td>Sim</td> </tr><tr> <th><code>MERGE</code></th> <td>Sim</td> <td>Sim</td> </tr><tr> <th><code>NDB</code></th> <td>Sim</td> <td>Não</td> </tr></tbody></table>

Se uma Statement deve ser logada e o modo de logging a ser usado é determinado de acordo com o tipo de Statement (segura, não segura ou injeção binária), o formato de binary logging (`STATEMENT`, `ROW` ou `MIXED`), e as capacidades de logging do Storage Engine (capaz de Statement, capaz de Row, ambos ou nenhum). (Injeção binária refere-se ao logging de uma alteração que deve ser logada usando o formato `ROW`.)

Statements podem ser logadas com ou sem um Warning; Statements que falham não são logadas, mas geram Errors no log. Isso é mostrado na seguinte tabela de decisão. As colunas **Type**, **binlog_format**, **SLC** e **RLC** descrevem as condições, e as colunas **Error / Warning** e **Logged as** representam as ações correspondentes. **SLC** significa “capaz de logging por Statement” (`statement-logging capable`), e **RLC** significa “capaz de logging por Row” (`row-logging capable`).

<table summary="As informações nesta tabela são usadas para determinar se uma Statement deve ser logada e o modo de logging a ser usado. A tabela descreve condições (Segura/Não segura, binlog_format, SLC, RLC) e ações correspondentes."><col style="width: 10%"/><col style="width: 25%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 25%"/><thead><tr> <th>Tipo</th> <th><code>binlog_format</code></th> <th>SLC</th> <th>RLC</th> <th>Error / Warning</th> <th>Logado como</th> </tr></thead><tbody><tr> <th>*</th> <td><code>*</code></td> <td>Não</td> <td>Não</td> <td><span class="errortext">Error: Cannot execute statement</span>: Binary logging é impossível visto que pelo menos um Engine está envolvido que é incapaz de logging por Row e incapaz de logging por Statement.</td> <td><code>-</code></td> </tr><tr> <th>Safe</th> <td><code>STATEMENT</code></td> <td>Sim</td> <td>Não</td> <td>-</td> <td><code>STATEMENT</code></td> </tr><tr> <th>Safe</th> <td><code>MIXED</code></td> <td>Sim</td> <td>Não</td> <td>-</td> <td><code>STATEMENT</code></td> </tr><tr> <th>Safe</th> <td><code>ROW</code></td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Error: Cannot execute statement</span>: Binary logging é impossível visto que <code>BINLOG_FORMAT = ROW</code> e pelo menos uma tabela usa um Storage Engine que não é capaz de logging baseado em Row.</td> <td><code>-</code></td> </tr><tr> <th>Unsafe</th> <td><code>STATEMENT</code></td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Warning: Unsafe statement binlogged in statement format</span>, visto que <code>BINLOG_FORMAT = STATEMENT</code></td> <td><code>STATEMENT</code></td> </tr><tr> <th>Unsafe</th> <td><code>MIXED</code></td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Error: Cannot execute statement</span>: Binary logging de uma Statement não segura é impossível quando o Storage Engine está limitado a logging baseado em Statement, mesmo que <code>BINLOG_FORMAT = MIXED</code>.</td> <td><code>-</code></td> </tr><tr> <th>Unsafe</th> <td><code>ROW</code></td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Error: Cannot execute statement</span>: Binary logging é impossível visto que <code>BINLOG_FORMAT = ROW</code> e pelo menos uma tabela usa um Storage Engine que não é capaz de logging baseado em Row.</td> <td>-</td> </tr><tr> <th>Row Injection</th> <td><code>STATEMENT</code></td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Error: Cannot execute row injection</span>: Binary logging não é possível visto que pelo menos uma tabela usa um Storage Engine que não é capaz de logging baseado em Row.</td> <td>-</td> </tr><tr> <th>Row Injection</th> <td><code>MIXED</code></td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Error: Cannot execute row injection</span>: Binary logging não é possível visto que pelo menos uma tabela usa um Storage Engine que não é capaz de logging baseado em Row.</td> <td>-</td> </tr><tr> <th>Row Injection</th> <td><code>ROW</code></td> <td>Sim</td> <td>Não</td> <td><span class="errortext">Error: Cannot execute row injection</span>: Binary logging não é possível visto que pelo menos uma tabela usa um Storage Engine que não é capaz de logging baseado em Row.</td> <td>-</td> </tr><tr> <th>Safe</th> <td><code>STATEMENT</code></td> <td>Não</td> <td>Sim</td> <td><span class="errortext">Error: Cannot execute statement</span>: Binary logging é impossível visto que <code>BINLOG_FORMAT = STATEMENT</code> e pelo menos uma tabela usa um Storage Engine que não é capaz de logging baseado em Statement.</td> <td><code>-</code></td> </tr><tr> <th>Safe</th> <td><code>MIXED</code></td> <td>Não</td> <td>Sim</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th>Safe</th> <td><code>ROW</code></td> <td>Não</td> <td>Sim</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th>Unsafe</th> <td><code>STATEMENT</code></td> <td>Não</td> <td>Sim</td> <td><span class="errortext">Error: Cannot execute statement</span>: Binary logging é impossível visto que <code>BINLOG_FORMAT = STATEMENT</code> e pelo menos uma tabela usa um Storage Engine que não é capaz de logging baseado em Statement.</td> <td>-</td> </tr><tr> <th>Unsafe</th> <td><code>MIXED</code></td> <td>Não</td> <td>Sim</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th>Unsafe</th> <td><code>ROW</code></td> <td>Não</td> <td>Sim</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th>Row Injection</th> <td><code>STATEMENT</code></td> <td>Não</td> <td>Sim</td> <td><span class="errortext">Error: Cannot execute row injection</span>: Binary logging não é possível visto que <code>BINLOG_FORMAT = STATEMENT</code>.</td> <td><code>-</code></td> </tr><tr> <th>Row Injection</th> <td><code>MIXED</code></td> <td>Não</td> <td>Sim</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th>Row Injection</th> <td><code>ROW</code></td> <td>Não</td> <td>Sim</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th>Safe</th> <td><code>STATEMENT</code></td> <td>Sim</td> <td>Sim</td> <td>-</td> <td><code>STATEMENT</code></td> </tr><tr> <th>Safe</th> <td><code>MIXED</code></td> <td>Sim</td> <td>Sim</td> <td>-</td> <td><code>STATEMENT</code></td> </tr><tr> <th>Safe</th> <td><code>ROW</code></td> <td>Sim</td> <td>Sim</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th>Unsafe</th> <td><code>STATEMENT</code></td> <td>Sim</td> <td>Sim</td> <td><span class="errortext">Warning: Unsafe statement binlogged in statement format</span> visto que <code>BINLOG_FORMAT = STATEMENT</code>.</td> <td><code>STATEMENT</code></td> </tr><tr> <th>Unsafe</th> <td><code>MIXED</code></td> <td>Sim</td> <td>Sim</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th>Unsafe</th> <td><code>ROW</code></td> <td>Sim</td> <td>Sim</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th>Row Injection</th> <td><code>STATEMENT</code></td> <td>Sim</td> <td>Sim</td> <td><span class="errortext">Error: Cannot execute row injection</span>: Binary logging não é possível porque <code>BINLOG_FORMAT = STATEMENT</code>.</td> <td>-</td> </tr><tr> <th>Row Injection</th> <td><code>MIXED</code></td> <td>Sim</td> <td>Sim</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th>Row Injection</th> <td><code>ROW</code></td> <td>Sim</td> <td>Sim</td> <td>-</td> <td><code>ROW</code></td> </tr></tbody></table>

Quando um Warning é produzido pela determinação, um Warning padrão do MySQL é gerado (e está disponível usando [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement")). A informação também é escrita no error log do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Apenas um Error para cada instância de Error por conexão de Client é registrado para evitar sobrecarregar o log. A mensagem de log inclui a Statement SQL que foi tentada.

Se [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) for 2 ou maior em uma Replica, a Replica imprime mensagens no error log para fornecer informações sobre seu status, como as coordenadas do Binary Log e do Relay Log onde ela inicia seu trabalho, quando está alternando para outro Relay Log, quando se reconecta após uma desconexão, Statements que são não seguras para logging baseado em Statement, e assim por diante.