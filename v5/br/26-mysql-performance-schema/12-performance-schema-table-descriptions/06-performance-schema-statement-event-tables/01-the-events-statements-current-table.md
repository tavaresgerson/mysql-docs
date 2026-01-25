#### 25.12.6.1 A Tabela events_statements_current

A tabela [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table") contém eventos de statement atuais. A tabela armazena uma linha por Thread, mostrando o status atual do evento de statement monitorado mais recente do Thread, portanto, não há uma system variable para configurar o tamanho da tabela.

Das tabelas que contêm linhas de eventos de statement, a [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table") é a mais fundamental. Outras tabelas que contêm linhas de eventos de statement são derivadas logicamente dos eventos atuais. Por exemplo, as tabelas [`events_statements_history`](performance-schema-events-statements-history-table.html "25.12.6.2 The events_statements_history Table") e [`events_statements_history_long`](performance-schema-events-statements-history-long-table.html "25.12.6.3 The events_statements_history_long Table") são coleções dos eventos de statement mais recentes que terminaram, até um número máximo de linhas por Thread e globalmente em todos os Threads, respectivamente.

Para mais informações sobre a relação entre as três tabelas de eventos `events_statements_xxx`, veja [Seção 25.9, “Tabelas do Performance Schema para Eventos Atuais e Históricos”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

Para informações sobre como configurar a coleta de statement events, veja [Seção 25.12.6, “Tabelas de Statement Event do Performance Schema”](performance-schema-statement-tables.html "25.12.6 Performance Schema Statement Event Tables").

A tabela [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table") possui as seguintes colunas:

* `THREAD_ID`, `EVENT_ID`

  O Thread associado ao evento e o número do evento atual do Thread quando o evento começa. Os valores de `THREAD_ID` e `EVENT_ID` juntos identificam a linha de forma exclusiva. Não há duas linhas com o mesmo par de valores.

* `END_EVENT_ID`

  Esta coluna é definida como `NULL` quando o evento começa e é atualizada para o número do evento atual do Thread quando o evento termina.

* `EVENT_NAME`

  O nome do instrument a partir do qual o evento foi coletado. Este é um valor `NAME` da tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table"). Os nomes dos instruments podem ter várias partes e formar uma hierarquia, conforme discutido em [Seção 25.6, “Convenções de Nomenclatura de Instruments do Performance Schema”](performance-schema-instrument-naming.html "25.6 Performance Schema Instrument Naming Conventions").

  Para statements SQL, o valor `EVENT_NAME` inicialmente é `statement/com/Query` até que o statement seja analisado (parsed), então muda para um valor mais apropriado, conforme descrito em [Seção 25.12.6, “Tabelas de Statement Event do Performance Schema”](performance-schema-statement-tables.html "25.12.6 Performance Schema Statement Event Tables").

* `SOURCE`

  O nome do arquivo fonte contendo o código instrumentado que produziu o evento e o número da linha no arquivo onde a instrumentação ocorre. Isso permite que você verifique o código-fonte para determinar exatamente qual código está envolvido.

* `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

  Informações de tempo (Timing) para o evento. A unidade para esses valores é picosegundos (trilionésimos de segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando o timing do evento começou e terminou. `TIMER_WAIT` é o tempo decorrido (duração) do evento.

  Se um evento não terminou, `TIMER_END` é o valor atual do timer e `TIMER_WAIT` é o tempo decorrido até agora (`TIMER_END` − `TIMER_START`).

  Se um evento é produzido a partir de um instrument que tem `TIMED = NO`, as informações de timing não são coletadas e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

  Para discussão sobre picosegundos como unidade para tempos de evento e fatores que afetam os valores de tempo, veja [Seção 25.4.1, “Timing de Eventos do Performance Schema”](performance-schema-timing.html "25.4.1 Performance Schema Event Timing").

* `LOCK_TIME`

  O tempo gasto esperando por Lock de tabela. Este valor é calculado em microssegundos, mas normalizado para picosegundos para facilitar a comparação com outros timers do Performance Schema.

* `SQL_TEXT`

  O texto do statement SQL. Para um comando não associado a um statement SQL, o valor é `NULL`.

  O espaço máximo disponível para exibição do statement é de 1024 bytes por padrão. Para alterar este valor, defina a system variable [`performance_schema_max_sql_text_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_sql_text_length) na inicialização do server.

* `DIGEST`

  O valor MD5 do statement digest como uma string de 32 caracteres hexadecimais, ou `NULL` se o consumer `statements_digest` for `no`. Para mais informações sobre statement digesting, veja [Seção 25.10, “Statement Digests do Performance Schema”](performance-schema-statement-digests.html "25.10 Performance Schema Statement Digests").

* `DIGEST_TEXT`

  O texto normalizado do statement digest, ou `NULL` se o consumer `statements_digest` for `no`. Para mais informações sobre statement digesting, veja [Seção 25.10, “Statement Digests do Performance Schema”](performance-schema-statement-digests.html "25.10 Performance Schema Statement Digests").

  A system variable [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) determina o número máximo de bytes disponíveis por session para armazenamento do valor do digest. No entanto, o comprimento de exibição dos statement digests pode ser maior do que o tamanho do Buffer disponível devido à codificação de elementos do statement, como palavras-chave e valores literais no digest Buffer. Consequentemente, os valores selecionados da coluna `DIGEST_TEXT` das tabelas de statement event podem parecer exceder o valor de [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length).

* `CURRENT_SCHEMA`

  O Database padrão para o statement, `NULL` se não houver nenhum.

* `OBJECT_SCHEMA`, `OBJECT_NAME`, `OBJECT_TYPE`

  Para statements aninhados (programas armazenados), estas colunas contêm informações sobre o statement pai. Caso contrário, são `NULL`.

* `OBJECT_INSTANCE_BEGIN`

  Esta coluna identifica o statement. O valor é o endereço de um objeto na memória.

* `MYSQL_ERRNO`

  O número de erro do statement, da área de diagnóstico do statement.

* `RETURNED_SQLSTATE`

  O valor SQLSTATE do statement, da área de diagnóstico do statement.

* `MESSAGE_TEXT`

  A mensagem de erro do statement, da área de diagnóstico do statement.

* `ERRORS`

  Indica se ocorreu um erro para o statement. O valor é 0 se o valor SQLSTATE começar com `00` (conclusão) ou `01` (warning). O valor é 1 se o valor SQLSTATE for qualquer outro.

* `WARNINGS`

  O número de warnings, da área de diagnóstico do statement.

* `ROWS_AFFECTED`

  O número de linhas afetadas pelo statement. Para uma descrição do significado de "affected", veja [mysql_affected_rows()](/doc/c-api/5.7/en/mysql-affected-rows.html).

* `ROWS_SENT`

  O número de linhas retornadas pelo statement.

* `ROWS_EXAMINED`

  O número de linhas examinadas pela camada do server (sem contar qualquer processamento interno aos storage engines).

* `CREATED_TMP_DISK_TABLES`

  Semelhante à status variable [`Created_tmp_disk_tables`](server-status-variables.html#statvar_Created_tmp_disk_tables), mas específica para o statement.

* `CREATED_TMP_TABLES`

  Semelhante à status variable [`Created_tmp_tables`](server-status-variables.html#statvar_Created_tmp_tables), mas específica para o statement.

* `SELECT_FULL_JOIN`

  Semelhante à status variable [`Select_full_join`](server-status-variables.html#statvar_Select_full_join), mas específica para o statement.

* `SELECT_FULL_RANGE_JOIN`

  Semelhante à status variable [`Select_full_range_join`](server-status-variables.html#statvar_Select_full_range_join), mas específica para o statement.

* `SELECT_RANGE`

  Semelhante à status variable [`Select_range`](server-status-variables.html#statvar_Select_range), mas específica para o statement.

* `SELECT_RANGE_CHECK`

  Semelhante à status variable [`Select_range_check`](server-status-variables.html#statvar_Select_range_check), mas específica para o statement.

* `SELECT_SCAN`

  Semelhante à status variable [`Select_scan`](server-status-variables.html#statvar_Select_scan), mas específica para o statement.

* `SORT_MERGE_PASSES`

  Semelhante à status variable [`Sort_merge_passes`](server-status-variables.html#statvar_Sort_merge_passes), mas específica para o statement.

* `SORT_RANGE`

  Semelhante à status variable [`Sort_range`](server-status-variables.html#statvar_Sort_range), mas específica para o statement.

* `SORT_ROWS`

  Semelhante à status variable [`Sort_rows`](server-status-variables.html#statvar_Sort_rows), mas específica para o statement.

* `SORT_SCAN`

  Semelhante à status variable [`Sort_scan`](server-status-variables.html#statvar_Sort_scan), mas específica para o statement.

* `NO_INDEX_USED`

  1 se o statement executou um table scan sem usar um Index, 0 caso contrário.

* `NO_GOOD_INDEX_USED`

  1 se o server não encontrou um Index bom para usar no statement, 0 caso contrário. Para informações adicionais, veja a descrição da coluna `Extra` da saída de `EXPLAIN` para o valor `Range checked for each record` em [Seção 8.8.2, “Formato de Saída EXPLAIN”](explain-output.html "8.8.2 EXPLAIN Output Format").

* `NESTING_EVENT_ID`, `NESTING_EVENT_TYPE`, `NESTING_EVENT_LEVEL`

  Estas três colunas são usadas com outras colunas para fornecer informações, como segue, para statements de nível superior (não aninhados) e statements aninhados (executados dentro de um stored program).

  Para statements de nível superior:

  ```sql
  OBJECT_TYPE = NULL
  OBJECT_SCHEMA = NULL
  OBJECT_NAME = NULL
  NESTING_EVENT_ID = NULL
  NESTING_EVENT_TYPE = NULL
  NESTING_LEVEL = 0
  ```

  Para statements aninhados:

  ```sql
  OBJECT_TYPE = the parent statement object type
  OBJECT_SCHEMA = the parent statement object schema
  OBJECT_NAME = the parent statement object name
  NESTING_EVENT_ID = the parent statement EVENT_ID
  NESTING_EVENT_TYPE = 'STATEMENT'
  NESTING_LEVEL = the parent statement NESTING_LEVEL plus one
  ```

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para a tabela [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table"). Ele remove as linhas.