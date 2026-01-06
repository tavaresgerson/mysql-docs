#### 25.12.6.1 A tabela events\_statements\_current

A tabela `events_statements_current` contém eventos de declarações atuais. A tabela armazena uma linha por thread, mostrando o status atual do evento de declaração mais recente monitorado da thread, portanto, não há uma variável do sistema para configurar o tamanho da tabela.

Das tabelas que contêm linhas de eventos de declarações, `events_statements_current` é a mais fundamental. Outras tabelas que contêm linhas de eventos de declarações são derivadas logicamente dos eventos atuais. Por exemplo, as tabelas `events_statements_history` e `events_statements_history_long` são coleções dos eventos de declarações mais recentes que terminaram, até um número máximo de linhas por fio e globalmente em todos os fios, respectivamente.

Para obter mais informações sobre a relação entre as três tabelas de eventos `events_statements_xxx`, consulte Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre como configurar se os eventos de declaração devem ser coletados, consulte Seção 25.12.6, "Tabelas de Eventos de Declaração do Schema de Desempenho".

A tabela `events_statements_current` tem as seguintes colunas:

- `THREAD_ID`, `EVENT_ID`

  O fio associado ao evento e o número do evento atual do fio quando o evento começa. Os valores `THREAD_ID` e `EVENT_ID` juntos identificam de forma única a linha. Nenhuma linha tem o mesmo par de valores.

- `END_EVENT_ID`

  Essa coluna é definida como `NULL` quando o evento começa e atualizada para o número atual do evento do thread quando o evento termina.

- `NOME_DO_Evento`

  O nome do instrumento a partir do qual o evento foi coletado. Este é um valor `NOME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 25.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

  Para as instruções SQL, o valor `EVENT_NAME` inicialmente é `statement/com/Query` até que a instrução seja analisada, e então muda para um valor mais apropriado, conforme descrito na Seção 25.12.6, “Tabelas de Eventos de Instruções do Schema de Desempenho”.

- `FONTE`

  O nome do arquivo fonte que contém o código instrumentado que produziu o evento e o número da linha no arquivo onde a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido.

- `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

  Informações de temporização para o evento. A unidade desses valores é picosegundos (trilhésimos de segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando o temporizador do evento começou e terminou. `TIMER_WAIT` é o tempo decorrido do evento (duração).

  Se um evento ainda não tiver terminado, `TIMER_END` é o valor atual do temporizador e `TIMER_WAIT` é o tempo que já passou (`TIMER_END` − `TIMER_START`).

  Se um evento for gerado a partir de um instrumento que tem `TIMED = NO`, as informações de temporização não são coletadas, e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

  Para discussão sobre picossegundos como unidade para tempos de eventos e fatores que afetam os valores de tempo, consulte Seção 25.4.1, “Cronometragem de Eventos do Schema de Desempenho”.

- `LOCK_TIME`

  O tempo gasto esperando por bloqueios de mesa. Esse valor é calculado em microsegundos, mas normalizado em picosegundos para facilitar a comparação com outros temporizadores do Schema de Desempenho.

- `SQL_TEXT`

  O texto da instrução SQL. Para um comando não associado a uma instrução SQL, o valor é `NULL`.

  O espaço máximo disponível para exibição de declarações é de 1024 bytes por padrão. Para alterar esse valor, defina a variável de sistema `performance_schema_max_sql_text_length` na inicialização do servidor.

- `DIGEST`

  O valor do digest MD5 é exibido como uma string de 32 caracteres hexadecimais, ou `NULL` se o consumidor `statements_digest` for `no`. Para obter mais informações sobre o digest de declarações, consulte Seção 25.10, “Digestas de Declarações do Schema de Desempenho”.

- `DIGEST_TEXT`

  O texto do digest de declarações normalizado ou `NULL` se o consumidor `statements_digest` for `no`. Para obter mais informações sobre o digest de declarações, consulte Seção 25.10, "Digestas de Declarações do Schema de Desempenho".

  A variável de sistema `performance_schema_max_digest_length` determina o número máximo de bytes disponíveis por sessão para o armazenamento do valor do digest. No entanto, o comprimento de exibição dos digests dos comandos pode ser maior que o tamanho do buffer disponível devido à codificação dos elementos do comando, como palavras-chave e valores literais, no buffer de digest. Consequentemente, os valores selecionados da coluna `DIGEST_TEXT` das tabelas de eventos de comandos podem parecer exceder o valor da variável `performance_schema_max_digest_length`.

- `CURRENT_SCHEMA`

  O banco de dados padrão para a declaração, `NULL` se não houver nenhum.

- `OBJECT_SCHEMA`, `OBJECT_NAME`, `OBJECT_TYPE`

  Para declarações aninhadas (programas armazenados), essas colunas contêm informações sobre a declaração pai. Caso contrário, elas são `NULL`.

- `OBJECT_INSTANCE_BEGIN`

  Esta coluna identifica a declaração. O valor é o endereço de um objeto na memória.

- `MYSQL_ERRNO`

  O número de erro de declaração, da área de diagnóstico de declaração.

- `RETURNED_SQLSTATE`

  O valor SQLSTATE da declaração, da área de diagnóstico da declaração.

- `MESSAGE_TEXT`

  Mensagem de erro de declaração, da área de diagnóstico de declaração.

- `ERROS`

  Se ocorreu um erro para a declaração. O valor é 0 se o valor SQLSTATE começa com `00` (conclusão) ou `01` (aviso). O valor é 1 se o valor SQLSTATE for qualquer outro.

- `AVISO`

  O número de avisos, da área de diagnóstico de declarações.

- `ROWS_AFECTADAS`

  O número de linhas afetadas pela declaração. Para uma descrição do significado de "afetada", consulte mysql\_affected\_rows().

- `ROWS_SENT`

  O número de linhas devolvidas pela declaração.

- `ROWS_EXAMINADAS`

  O número de linhas examinadas pela camada do servidor (não contando qualquer processamento interno dos motores de armazenamento).

- `CREATED_TMP_DISK_TABLES`

  Como a variável de status `Created_tmp_disk_tables`, mas específica para a declaração.

- `Criado tabelas temporárias`

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

  Como a variável de status `Sort_rows`, mas específica para a instrução.

- `SORT_SCAN`

  Como a variável de status `Sort_scan`, mas específica para a declaração.

- `NO_INDEX_USED`

  1 se a instrução realizar uma varredura de tabela sem usar um índice, 0 caso contrário.

- `NO_GOOD_INDEX_USED`

  1 se o servidor não encontrou um bom índice para usar para a declaração, 0 caso contrário. Para obter informações adicionais, consulte a descrição da coluna `Extra` da saída `EXPLAIN` para o valor `Range checked for each record` na Seção 8.8.2, “Formato de Saída EXPLAIN”.

- `NESTING_EVENT_ID`, `NESTING_EVENT_TYPE`, `NESTING_EVENT_LEVEL`

  Essas três colunas são usadas com outras colunas para fornecer informações conforme segue para declarações de nível superior (não aninhadas) e declarações aninhadas (executadas dentro de um programa armazenado).

  Para declarações de alto nível:

  ```sql
  OBJECT_TYPE = NULL
  OBJECT_SCHEMA = NULL
  OBJECT_NAME = NULL
  NESTING_EVENT_ID = NULL
  NESTING_EVENT_TYPE = NULL
  NESTING_LEVEL = 0
  ```

  Para declarações aninhadas:

  ```sql
  OBJECT_TYPE = the parent statement object type
  OBJECT_SCHEMA = the parent statement object schema
  OBJECT_NAME = the parent statement object name
  NESTING_EVENT_ID = the parent statement EVENT_ID
  NESTING_EVENT_TYPE = 'STATEMENT'
  NESTING_LEVEL = the parent statement NESTING_LEVEL plus one
  ```

A operação `TRUNCATE TABLE` é permitida para a tabela `events_statements_current`. Ela remove as linhas.
