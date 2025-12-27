#### 29.12.6.1 A tabela `events_statements_current`

A tabela `events_statements_current` contém eventos de declarações atuais. A tabela armazena uma linha por thread, mostrando o status atual do evento de declaração mais recente da thread, portanto, não há uma variável de sistema para configurar o tamanho da tabela.

Das tabelas que contêm linhas de eventos de declarações, a `events_statements_current` é a mais fundamental. Outras tabelas que contêm linhas de eventos de declarações são derivadas logicamente dos eventos atuais. Por exemplo, as tabelas `events_statements_history` e `events_statements_history_long` são coleções dos eventos de declaração mais recentes que terminaram, até um número máximo de linhas por thread e globalmente em todas as threads, respectivamente.

Para mais informações sobre a relação entre as três tabelas de eventos `events_statements_xxx`, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para informações sobre como configurar se os eventos de declaração devem ser coletados, consulte a Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.

A tabela `events_statements_current` tem essas colunas:

* `THREAD_ID`, `EVENT_ID`

  O thread associado ao evento e o número do evento atual da thread quando o evento começa. Os valores de `THREAD_ID` e `EVENT_ID` juntos identificam de forma única a linha. Nenhuma linha tem o mesmo par de valores.

* `END_EVENT_ID`

  Esta coluna é definida como `NULL` quando o evento começa e atualizada para o número do evento atual da thread quando o evento termina.

* `EVENT_NAME`

O nome do instrumento a partir do qual o evento foi coletado. Este é um valor `NOME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 29.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

Para instruções SQL, o valor `NOME_DO_EVENTO` inicialmente é `instrução/com/Query` até que a instrução seja analisada, então muda para um valor mais apropriado, conforme descrito na Seção 29.12.6, “Tabelas de Eventos de Instruções do Schema de Desempenho”.

* `SOURCE`

  O nome do arquivo de origem que contém o código instrumentado que produziu o evento e o número da linha no arquivo em que a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido.

* `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

  Informações de temporização para o evento. A unidade para esses valores é picosegundos (trilhésimos de segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando a temporização do evento começou e terminou. `TIMER_WAIT` é o tempo decorrido do evento (duração).

  Se um evento não tiver terminado, `TIMER_END` é o valor atual do temporizador e `TIMER_WAIT` é o tempo decorrido até agora (`TIMER_END` − `TIMER_START`).

  Se um evento for produzido a partir de um instrumento que tem `TIMED = NO`, as informações de temporização não são coletadas, e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

  Para discussão sobre picosegundos como unidade de tempos de eventos e fatores que afetam os valores de tempo, consulte a Seção 29.4.1, “Temporização de Eventos do Schema de Desempenho”.

* `LOCK_TIME`

  O tempo gasto esperando por bloqueios de tabela. Esse valor é calculado em microsegundos, mas normalizado para picosegundos para facilitar a comparação com outros temporizadores do Schema de Desempenho.

O texto do comando SQL. Para um comando não associado a um comando SQL, o valor é `NULL`.

O espaço máximo disponível para exibição do comando é de 1024 bytes por padrão. Para alterar esse valor, defina a variável de sistema `performance_schema_max_sql_text_length` no início do servidor. (Alterar esse valor afeta também as colunas em outras tabelas do Schema de Desempenho. Consulte a Seção 29.10, “Digestas e Amostragem de Comandos do Schema de Desempenho”).

* `DIGEST`

  O valor do digest SHA-256 do comando como uma string de 64 caracteres hexadecimais, ou `NULL` se o consumidor `statements_digest` for `no`. Para mais informações sobre digestas de comandos, consulte a Seção 29.10, “Digestas e Amostragem de Comandos do Schema de Desempenho”.

* `DIGEST_TEXT`

  O texto normalizado do digest, ou `NULL` se o consumidor `statements_digest` for `no`. Para mais informações sobre digestas de comandos, consulte a Seção 29.10, “Digestas e Amostragem de Comandos do Schema de Desempenho”.

  A variável de sistema `performance_schema_max_digest_length` determina o número máximo de bytes disponíveis por sessão para armazenamento do valor do digest. No entanto, o comprimento de exibição dos digestas de comandos pode ser maior que o tamanho do buffer disponível devido à codificação de elementos do comando, como palavras-chave e valores literais, no buffer do digest. Consequentemente, os valores selecionados da coluna `DIGEST_TEXT` das tabelas de eventos de comando podem parecer exceder o valor de `performance_schema_max_digest_length`.

* `CURRENT_SCHEMA`

  O banco de dados padrão para o comando, `NULL` se não houver nenhum.

* `OBJECT_SCHEMA`, `OBJECT_NAME`, `OBJECT_TYPE`

  Para comandos aninhados (programas armazenados), essas colunas contêm informações sobre o comando pai. Caso contrário, são `NULL`.

* `OBJECT_INSTANCE_BEGIN`

Esta coluna identifica a declaração. O valor é o endereço de um objeto na memória.

* `MYSQL_ERRNO`

  O número de erro da declaração, da área de diagnóstico da declaração.

* `RETURNED_SQLSTATE`

  O valor SQLSTATE da declaração, da área de diagnóstico da declaração.

* `MESSAGE_TEXT`

  A mensagem de erro da declaração, da área de diagnóstico da declaração.

* `ERRORS`

  Se ocorreu um erro para a declaração. O valor é 0 se o valor SQLSTATE começar com `00` (conclusão) ou `01` (aviso). O valor é 1 se o valor SQLSTATE for qualquer outro.

* `WARNINGS`

  O número de avisos, da área de diagnóstico da declaração.

* `ROWS_AFFECTED`

  O número de linhas afetadas pela declaração. Para uma descrição do significado de “afetada”, consulte mysql\_affected\_rows().

* `ROWS_SENT`

  O número de linhas devolvidas pela declaração.

* `ROWS_EXAMINED`

  O número de linhas examinadas pela camada do servidor (não contando qualquer processamento interno dos motores de armazenamento).

* `CREATED_TMP_DISK_TABLES`

  Como a variável de status `Created_tmp_disk_tables`, mas específica para a declaração.

* `CREATED_TMP_TABLES`

  Como a variável de status `Created_tmp_tables`, mas específica para a declaração.

* `SELECT_FULL_JOIN`

  Como a variável de status `Select_full_join`, mas específica para a declaração.

* `SELECT_FULL_RANGE_JOIN`

  Como a variável de status `Select_full_range_join`, mas específica para a declaração.

* `SELECT_RANGE`

  Como a variável de status `Select_range`, mas específica para a declaração.

* `SELECT_RANGE_CHECK`

  Como a variável de status `Select_range_check`, mas específica para a declaração.

* `SELECT_SCAN`

  Como a variável de status `Select_scan`, mas específica para a declaração.

* `SORT_MERGE_PASSES`

  Como a variável de status `Sort_merge_passes`, mas específica para a declaração.

* `SORT_RANGE`

  Como a variável de status `Sort_range`, mas específica para a instrução.

* `SORT_ROWS`

  Como a variável de status `Sort_rows`, mas específica para a instrução.

* `SORT_SCAN`

  Como a variável de status `Sort_scan`, mas específica para a instrução.

* `NO_INDEX_USED`

  1 se a instrução realizar um varredura de tabela sem usar um índice, 0 caso contrário.

* `NO_GOOD_INDEX_USED`

  1 se o servidor não encontrar nenhum bom índice para usar na instrução, 0 caso contrário. Para informações adicionais, consulte a descrição da coluna `Extra` da saída `EXPLAIN` para o valor `Range checked for each record` na Seção 10.8.2, “Formato de Saída EXPLAIN”.

* `NESTING_EVENT_ID`, `NESTING_EVENT_TYPE`, `NESTING_EVENT_LEVEL`

  Essas três colunas são usadas com outras colunas para fornecer informações da seguinte forma para instruções de nível superior (não aninhadas) e instruções aninhadas (executadas dentro de um programa armazenado).

  Para instruções de nível superior:

  ```
  OBJECT_TYPE = NULL
  OBJECT_SCHEMA = NULL
  OBJECT_NAME = NULL
  NESTING_EVENT_ID = the parent transaction EVENT_ID
  NESTING_EVENT_TYPE = 'TRANSACTION'
  NESTING_LEVEL = 0
  ```

  Para instruções aninhadas:

  ```
  OBJECT_TYPE = the parent statement object type
  OBJECT_SCHEMA = the parent statement object schema
  OBJECT_NAME = the parent statement object name
  NESTING_EVENT_ID = the parent statement EVENT_ID
  NESTING_EVENT_TYPE = 'STATEMENT'
  NESTING_LEVEL = the parent statement NESTING_LEVEL plus one
  ```

* `STATEMENT_ID`

  O ID da consulta mantido pelo servidor no nível SQL. O valor é único para a instância do servidor porque esses IDs são gerados usando um contador global que é incrementado atomicamente.

* `CPU_TIME`

  O tempo gasto no CPU para o thread atual, expresso em picosegundos.

* `MAX_CONTROLLED_MEMORY`

  Relata a quantidade máxima de memória controlada usada por uma instrução durante a execução.

* `MAX_TOTAL_MEMORY`

  Relata a quantidade máxima de memória usada por uma instrução durante a execução.

* `EXECUTION_ENGINE`

O motor de execução de consultas. O valor é `PRIMARY` ou `SECONDARY`. Para uso com o MySQL HeatWave Service e o MySQL HeatWave, onde o motor `PRIMARY` é `InnoDB` e o motor `SECONDARY` é o MySQL HeatWave (`RAPID`). Para o MySQL Community Edition Server, o MySQL Enterprise Edition Server (on-premise) e o MySQL HeatWave Service sem o MySQL HeatWave, o valor é sempre `PRIMARY`.

A tabela `events_statements_current` tem esses índices:

* Chave primária em (`THREAD_ID`, `EVENT_ID`)

O `TRUNCATE TABLE` é permitido para a tabela `events_statements_current`. Ele remove as linhas.