#### 25.12.15.3 Tabelas de Resumo de Statement (Statement Summary Tables)

O Performance Schema mantém tabelas para coletar Statement Events (eventos de Statement) atuais e recentes, e agrega essas informações em tabelas de resumo (summary tables). [Seção 25.12.6, “Performance Schema Statement Event Tables”] descreve os Events nos quais os resumos de Statement são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos Statement Events, as tabelas de Statement Event atuais e históricas, e como controlar a coleta de Statement Events, que é parcialmente desabilitada por padrão.

Exemplo de informações de resumo de Statement Event:

```sql
mysql> SELECT *
       FROM performance_schema.events_statements_summary_global_by_event_name\G
*************************** 1. row ***************************
                 EVENT_NAME: statement/sql/select
                 COUNT_STAR: 25
             SUM_TIMER_WAIT: 1535983999000
             MIN_TIMER_WAIT: 209823000
             AVG_TIMER_WAIT: 61439359000
             MAX_TIMER_WAIT: 1363397650000
              SUM_LOCK_TIME: 20186000000
                 SUM_ERRORS: 0
               SUM_WARNINGS: 0
          SUM_ROWS_AFFECTED: 0
              SUM_ROWS_SENT: 388
          SUM_ROWS_EXAMINED: 370
SUM_CREATED_TMP_DISK_TABLES: 0
     SUM_CREATED_TMP_TABLES: 0
       SUM_SELECT_FULL_JOIN: 0
 SUM_SELECT_FULL_RANGE_JOIN: 0
           SUM_SELECT_RANGE: 0
     SUM_SELECT_RANGE_CHECK: 0
            SUM_SELECT_SCAN: 6
      SUM_SORT_MERGE_PASSES: 0
             SUM_SORT_RANGE: 0
              SUM_SORT_ROWS: 0
              SUM_SORT_SCAN: 0
          SUM_NO_INDEX_USED: 6
     SUM_NO_GOOD_INDEX_USED: 0
...
```

Cada tabela de resumo de Statement possui uma ou mais colunas de agrupamento para indicar como a tabela agrega os Events. Os nomes dos Events referem-se aos nomes dos instrumentos de Event na tabela [`setup_instruments`]:

* [`events_statements_summary_by_account_by_event_name`] tem as colunas `EVENT_NAME`, `USER` e `HOST`. Cada linha resume Events para um Account (combinação de user e host) e nome de Event fornecidos.

* [`events_statements_summary_by_digest`] tem as colunas `SCHEMA_NAME` e `DIGEST`. Cada linha resume Events por Schema e valor de Digest. (A coluna `DIGEST_TEXT` contém o texto do Statement Digest normalizado correspondente, mas não é uma coluna de agrupamento nem de resumo.)

  O número máximo de linhas na tabela é autoajustado na inicialização do servidor. Para definir este máximo explicitamente, defina a variável de sistema [`performance_schema_digests_size`] na inicialização do servidor.

* [`events_statements_summary_by_host_by_event_name`] tem as colunas `EVENT_NAME` e `HOST`. Cada linha resume Events para um Host e nome de Event fornecidos.

* [`events_statements_summary_by_program`] tem as colunas `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Cada linha resume Events para um Stored Program fornecido (Stored Procedure ou Function, Trigger ou Event).

* [`events_statements_summary_by_thread_by_event_name`] tem as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume Events para um Thread e nome de Event fornecidos.

* [`events_statements_summary_by_user_by_event_name`] tem as colunas `EVENT_NAME` e `USER`. Cada linha resume Events para um User e nome de Event fornecidos.

* [`events_statements_summary_global_by_event_name`] tem uma coluna `EVENT_NAME`. Cada linha resume Events para um nome de Event fornecido.

* [`prepared_statements_instances`] tem uma coluna `OBJECT_INSTANCE_BEGIN`. Cada linha resume Events para um Prepared Statement fornecido.

Cada tabela de resumo de Statement possui estas colunas de resumo contendo valores agregados (com exceções conforme observado):

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

  Estas colunas são análogas às colunas com os mesmos nomes nas tabelas de resumo de Wait Event (consulte [Seção 25.12.15.1, “Wait Event Summary Tables”]), exceto que as tabelas de resumo de Statement agregam Events de [`events_statements_current`] em vez de [`events_waits_current`].

  A tabela [`prepared_statements_instances`] não possui estas colunas.

* `SUM_xxx`

  O agregado da coluna *`xxx`* correspondente na tabela [`events_statements_current`]. Por exemplo, as colunas `SUM_LOCK_TIME` e `SUM_ERRORS` nas tabelas de resumo de Statement são os agregados das colunas `LOCK_TIME` e `ERRORS` na tabela [`events_statements_current`].

A tabela [`events_statements_summary_by_digest`] possui estas colunas de resumo adicionais:

* `FIRST_SEEN`, `LAST_SEEN`

  Timestamps indicando quando Statements com o valor de Digest fornecido foram vistos pela primeira vez e mais recentemente.

A tabela [`events_statements_summary_by_program`] possui estas colunas de resumo adicionais:

* `COUNT_STATEMENTS`, `SUM_STATEMENTS_WAIT`, `MIN_STATEMENTS_WAIT`, `AVG_STATEMENTS_WAIT`, `MAX_STATEMENTS_WAIT`

  Estatísticas sobre Statements aninhados invocados durante a execução do Stored Program.

A tabela [`prepared_statements_instances`] possui estas colunas de resumo adicionais:

* `COUNT_EXECUTE`, `SUM_TIMER_EXECUTE`, `MIN_TIMER_EXECUTE`, `AVG_TIMER_EXECUTE`, `MAX_TIMER_EXECUTE`

  Estatísticas agregadas para execuções do Prepared Statement.

O [`TRUNCATE TABLE`] é permitido para tabelas de resumo de Statement. Ele tem os seguintes efeitos:

* Para [`events_statements_summary_by_digest`], ele remove as linhas.

* Para outras tabelas de resumo não agregadas por Account, Host ou User, o truncation redefine as colunas de resumo para zero, em vez de remover as linhas.

* Para outras tabelas de resumo agregadas por Account, Host ou User, o truncation remove as linhas para Accounts, Hosts ou Users sem conexões e redefine as colunas de resumo para zero para as linhas restantes.

Além disso, cada tabela de resumo de Statement que é agregada por Account, Host, User ou Thread é implicitamente truncada pelo truncation da tabela de conexão da qual depende, ou pelo truncation de [`events_statements_summary_global_by_event_name`]. Para detalhes, consulte [Seção 25.12.8, “Performance Schema Connection Tables”].

##### Regras de Agregação de Statement Digest

Se o Consumer `statements_digest` estiver habilitado, a agregação em [`events_statements_summary_by_digest`] ocorre da seguinte forma quando um Statement é concluído. A agregação é baseada no valor de `DIGEST` calculado para o Statement.

* Se uma linha de [`events_statements_summary_by_digest`] já existir com o valor de Digest para o Statement que acabou de ser concluído, as estatísticas para o Statement são agregadas a essa linha. A coluna `LAST_SEEN` é atualizada para a hora atual.

* Se nenhuma linha tiver o valor de Digest para o Statement que acabou de ser concluído, e a tabela não estiver cheia, uma nova linha é criada para o Statement. As colunas `FIRST_SEEN` e `LAST_SEEN` são inicializadas com a hora atual.

* Se nenhuma linha tiver o valor de Statement Digest para o Statement que acabou de ser concluído, e a tabela estiver cheia, as estatísticas para o Statement que acabou de ser concluído são adicionadas a uma linha especial “catch-all” com `DIGEST` = `NULL`, que é criada, se necessário. Se a linha for criada, as colunas `FIRST_SEEN` e `LAST_SEEN` são inicializadas com a hora atual. Caso contrário, a coluna `LAST_SEEN` é atualizada com a hora atual.

A linha com `DIGEST` = `NULL` é mantida porque as tabelas do Performance Schema têm um tamanho máximo devido a restrições de memória. A linha `DIGEST` = `NULL` permite que Digests que não correspondam a outras linhas sejam contados mesmo se a tabela de resumo estiver cheia, usando um "other bucket" comum. Esta linha ajuda a estimar se o resumo do Digest é representativo:

* Uma linha `DIGEST` = `NULL` que tem um valor `COUNT_STAR` que representa 5% de todos os Digests mostra que o resumo do Digest é muito representativo; as outras linhas cobrem 95% dos Statements vistos.

* Uma linha `DIGEST` = `NULL` que tem um valor `COUNT_STAR` que representa 50% de todos os Digests mostra que o resumo do Digest não é muito representativo; as outras linhas cobrem apenas metade dos Statements vistos. Muito provavelmente, o DBA deve aumentar o tamanho máximo da tabela para que mais linhas contadas na linha `DIGEST` = `NULL` sejam contadas usando linhas mais específicas. Por padrão, o tamanho da tabela é autoajustado, mas se este tamanho for muito pequeno, defina a variável de sistema [`performance_schema_digests_size`] para um valor maior na inicialização do servidor.

##### Comportamento da Instrumentação de Stored Program

Para tipos de Stored Program para os quais a instrumentação está habilitada na tabela [`setup_objects`], [`events_statements_summary_by_program`] mantém estatísticas para Stored Programs da seguinte forma:

* Uma linha é adicionada para um Object quando ele é usado pela primeira vez no servidor.

* A linha para um Object é removida quando o Object é descartado (dropped).

* As estatísticas são agregadas na linha para um Object à medida que ele é executado.

Veja também [Seção 25.4.3, “Event Pre-Filtering”].