#### 29.12.6.1 Tabela events\_statements\_current

A tabela `events_statements_current` contém eventos de declaração atuais. A tabela armazena uma linha por thread, mostrando o status atual do evento de declaração mais recente monitorado pela thread, portanto, não há uma variável do sistema para configurar o tamanho da tabela.

Das tabelas que contêm linhas de eventos de declaração, `events_statements_current` é a mais fundamental. Outras tabelas que contêm linhas de eventos de declaração são derivadas logicamente dos eventos atuais. Por exemplo, as tabelas `events_statements_history` e `events_statements_history_long` são coleções dos eventos de declaração mais recentes que terminaram, até um número máximo de linhas por fio e globalmente em todos os fios, respectivamente.

Para obter mais informações sobre a relação entre as três tabelas de eventos `events_statements_xxx`, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre como configurar se os eventos de declaração devem ser coletados, consulte a Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.

A tabela `events_statements_current` tem essas colunas:

- `THREAD_ID`, `EVENT_ID`

  O fio associado ao evento e o número atual do evento quando o evento começa. Os valores `THREAD_ID` e `EVENT_ID` juntos identificam de forma única a linha. Nenhuma linha tem o mesmo par de valores.

- `END_EVENT_ID`

  Essa coluna é definida como `NULL` quando o evento começa e atualizada para o número atual do evento da thread quando o evento termina.

- `EVENT_NAME`

  O nome do instrumento a partir do qual o evento foi coletado. Este é um valor `NAME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 29.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

  Para as instruções SQL, o valor `EVENT_NAME` é inicialmente `statement/com/Query` até que a instrução seja analisada, e então muda para um valor mais apropriado, conforme descrito na Seção 29.12.6, “Tabelas de Eventos de Instruções do Gerenciamento de Desempenho”.

- `SOURCE`

  O nome do arquivo fonte que contém o código instrumentado que produziu o evento e o número da linha no arquivo onde a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido.

- `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

  Informações de temporização para o evento. A unidade desses valores é picosegundos (trilhésimos de segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando o temporizador do evento começou e terminou. `TIMER_WAIT` é o tempo decorrido do evento (duração).

  Se um evento ainda não tiver terminado, `TIMER_END` é o valor atual do temporizador e `TIMER_WAIT` é o tempo que já passou (`TIMER_END` − `TIMER_START`).

  Se um evento for gerado a partir de um instrumento que tem `TIMED = NO`, as informações de temporização não são coletadas, e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

  Para discussão sobre picossegundos como unidade para tempos de eventos e fatores que afetam os valores de tempo, consulte a Seção 29.4.1, “Tempo de Ocorrência do Schema de Desempenho”.

- `LOCK_TIME`

  O tempo gasto esperando por bloqueios de mesa. Esse valor é calculado em microsegundos, mas normalizado em picosegundos para facilitar a comparação com outros temporizadores do Schema de Desempenho.

- `SQL_TEXT`

  O texto da instrução SQL. Para um comando não associado a uma instrução SQL, o valor é `NULL`.

  O espaço máximo disponível para exibição de declarações é de 1024 bytes por padrão. Para alterar esse valor, defina a variável de sistema `performance_schema_max_sql_text_length` no início do servidor. (Alterar esse valor afeta também as colunas em outras tabelas do Schema de Desempenho. Consulte a Seção 29.10, “Digestas e Amostragem de Declarações do Schema de Desempenho”).

- `DIGEST`

  O valor do digest SHA-256 é apresentado como uma string de 64 caracteres hexadecimais, ou `NULL` se o consumidor `statements_digest` for `no`. Para obter mais informações sobre o digest de declarações, consulte a Seção 29.10, “Digestas e Amostragem de Declarações do Schema de Desempenho”.

- `DIGEST_TEXT`

  O texto do digest de declaração normalizado ou `NULL` se o consumidor `statements_digest` for `no`. Para obter mais informações sobre o digest de declaração, consulte a Seção 29.10, “Digestas e Amostragem de Declarações do Schema de Desempenho”.

  A variável de sistema `performance_schema_max_digest_length` determina o número máximo de bytes disponíveis por sessão para o armazenamento do valor do digest. No entanto, o comprimento da exibição dos digests dos eventos de declaração pode ser maior que o tamanho do buffer disponível devido à codificação dos elementos da declaração, como palavras-chave e valores literais, no buffer do digest. Consequentemente, os valores selecionados da coluna `DIGEST_TEXT` das tabelas de eventos de declaração podem parecer exceder o valor `performance_schema_max_digest_length`.

- `CURRENT_SCHEMA`

  O banco de dados padrão para a declaração, `NULL` se não houver nenhum.

- `OBJECT_SCHEMA`, `OBJECT_NAME`, `OBJECT_TYPE`

  Para declarações aninhadas (programas armazenados), essas colunas contêm informações sobre a declaração pai. Caso contrário, são `NULL`.

- `OBJECT_INSTANCE_BEGIN`

  Esta coluna identifica a declaração. O valor é o endereço de um objeto na memória.

- `MYSQL_ERRNO`

  O número de erro de declaração, da área de diagnóstico de declaração.

- `RETURNED_SQLSTATE`

  O valor SQLSTATE da declaração, da área de diagnóstico da declaração.

- `MESSAGE_TEXT`

  Mensagem de erro de declaração, da área de diagnóstico de declaração.

- `ERRORS`

  Se ocorreu um erro para a declaração. O valor é 0 se o valor SQLSTATE começa com `00` (conclusão) ou `01` (aviso). O valor é 1 se o valor SQLSTATE for qualquer outro.

- `WARNINGS`

  O número de avisos, da área de diagnóstico de declarações.

- `ROWS_AFFECTED`

  O número de linhas afetadas pela declaração. Para uma descrição do significado de "afetada", consulte mysql\_affected\_rows().

- `ROWS_SENT`

  O número de linhas devolvidas pela declaração.

- `ROWS_EXAMINED`

  O número de linhas examinadas pela camada do servidor (não contando qualquer processamento interno dos motores de armazenamento).

- `CREATED_TMP_DISK_TABLES`

  Como a variável de status `Created_tmp_disk_tables`, mas específica para a declaração.

- `CREATED_TMP_TABLES`

  Como a variável de status `Created_tmp_tables`, mas específica para a declaração.

- `SELECT_FULL_JOIN`

  Como a variável de status `Select_full_join`, mas específica para a declaração.

- `SELECT_FULL_RANGE_JOIN`

  Como a variável de status `Select_full_range_join`, mas específica para a declaração.

- `SELECT_RANGE`

  Como a variável de status `Select_range`, mas específica para a declaração.

- `SELECT_RANGE_CHECK`

  Como a variável de status `Select_range_check`, mas específica para a declaração.

- `SELECT_SCAN`

  Como a variável de status `Select_scan`, mas específica para a declaração.

- `SORT_MERGE_PASSES`

  Como a variável de status `Sort_merge_passes`, mas específica para a declaração.

- `SORT_RANGE`

  Como a variável de status `Sort_range`, mas específica para a declaração.

- `SORT_ROWS`

  Como a variável de status `Sort_rows`, mas específica para a declaração.

- `SORT_SCAN`

  Como a variável de status `Sort_scan`, mas específica para a declaração.

- `NO_INDEX_USED`

  1 se a instrução realizar uma varredura de tabela sem usar um índice, 0 caso contrário.

- `NO_GOOD_INDEX_USED`

  1 se o servidor não encontrou um bom índice para usar na declaração, 0 caso contrário. Para obter informações adicionais, consulte a descrição da coluna `Extra` do `EXPLAIN` de saída para o valor `Range checked for each record` na Seção 10.8.2, “Formato de Saída EXPLAIN”.

- `NESTING_EVENT_ID`, `NESTING_EVENT_TYPE`, `NESTING_EVENT_LEVEL`

  Essas três colunas são usadas com outras colunas para fornecer informações conforme segue para declarações de nível superior (não aninhadas) e declarações aninhadas (executadas dentro de um programa armazenado).

  Para declarações de alto nível:

  ```
  OBJECT_TYPE = NULL
  OBJECT_SCHEMA = NULL
  OBJECT_NAME = NULL
  NESTING_EVENT_ID = the parent transaction EVENT_ID
  NESTING_EVENT_TYPE = 'TRANSACTION'
  NESTING_LEVEL = 0
  ```

  Para declarações aninhadas:

  ```
  OBJECT_TYPE = the parent statement object type
  OBJECT_SCHEMA = the parent statement object schema
  OBJECT_NAME = the parent statement object name
  NESTING_EVENT_ID = the parent statement EVENT_ID
  NESTING_EVENT_TYPE = 'STATEMENT'
  NESTING_LEVEL = the parent statement NESTING_LEVEL plus one
  ```

- `STATEMENT_ID`

  O ID da consulta mantido pelo servidor no nível SQL. O valor é único para a instância do servidor, pois esses IDs são gerados usando um contador global que é incrementado de forma atômica. Esta coluna foi adicionada no MySQL 8.0.14.

- `CPU_TIME`

  O tempo gasto na CPU para o thread atual, expresso em picosegundos. Esta coluna foi adicionada no MySQL 8.0.28.

- `MAX_CONTROLLED_MEMORY`

  Relata o valor máximo de memória controlada utilizada por uma declaração durante a execução.

  Esta coluna foi adicionada no MySQL 8.0.31.

- `MAX_TOTAL_MEMORY`

  Relata o valor máximo de memória utilizado por uma declaração durante a execução.

  Esta coluna foi adicionada no MySQL 8.0.31.

- `EXECUTION_ENGINE`

  O motor de execução de consultas. O valor é `PRIMARY` ou `SECONDARY`. Para uso com o MySQL HeatWave Service e o MySQL HeatWave, onde o motor `PRIMARY` é `InnoDB` e o motor `SECONDARY` é o MySQL HeatWave (`RAPID`). Para o MySQL Community Edition Server, o MySQL Enterprise Edition Server (on-premise) e o MySQL HeatWave Service sem o MySQL HeatWave, o valor é sempre `PRIMARY`. Esta coluna foi adicionada no MySQL 8.0.29.

A tabela `events_statements_current` tem esses índices:

- Chave primária em (`THREAD_ID`, `EVENT_ID`)

`TRUNCATE TABLE` é permitido para a tabela `events_statements_current`. Ele remove as linhas.
