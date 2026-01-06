#### 25.12.15.3 Tabelas de Resumo das Declarações

O Schema de Desempenho mantém tabelas para coletar eventos de declaração atuais e recentes, e agrega essas informações em tabelas resumidas. Seção 25.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho” descreve os eventos sobre os quais os resumos de declaração são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de declaração, as tabelas de eventos de declaração atuais e históricas, e como controlar a coleta de eventos de declaração, que está parcialmente desativada por padrão.

Exemplo de resumo de informações de evento de declaração:

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

Cada tabela de resumo de declaração tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se aos nomes dos instrumentos de evento na tabela `setup_instruments`:

- O `events_statements_summary_by_account_by_event_name` possui as colunas `EVENT_NAME`, `USER` e `HOST`. Cada linha resume os eventos para uma conta específica (combinação de usuário e host) e nome do evento.

- O `events_statements_summary_by_digest` possui as colunas `SCHEMA_NAME` e `DIGEST`. Cada linha resume os eventos por schema e valor de digest. (A coluna `DIGEST_TEXT` contém o texto normalizado do digest do statement correspondente, mas não é uma coluna de agrupamento nem de resumo.)

  O número máximo de linhas na tabela é dimensionado automaticamente ao iniciar o servidor. Para definir esse máximo explicitamente, defina a variável de sistema `performance_schema_digests_size` ao iniciar o servidor.

- O `events_statements_summary_by_host_by_event_name` possui as colunas `EVENT_NAME` e `HOST`. Cada linha resume os eventos para um determinado host e nome de evento.

- O `events_statements_summary_by_program` possui as colunas `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Cada linha resume os eventos para um determinado programa armazenado (procedimento armazenado ou função, gatilho ou evento).

- `events_statements_summary_by_thread_by_event_name` possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume os eventos para um determinado thread e nome de evento.

- O `events_statements_summary_by_user_by_event_name` possui as colunas `EVENT_NAME` e `USER`. Cada linha resume os eventos para um usuário e um nome de evento específicos.

- O `events_statements_summary_global_by_event_name` possui uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico.

- A tabela `prepared_statements_instances` possui uma coluna `OBJECT_INSTANCE_BEGIN`. Cada linha resume os eventos de um determinado comando preparado.

Cada tabela de resumo de declaração tem essas colunas de resumo contendo valores agregados (com exceções conforme indicado):

- `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

  Essas colunas são análogas às colunas dos mesmos nomes nas tabelas de resumo de eventos de espera (consulte Seção 25.12.15.1, “Tabelas de Resumo de Eventos de Espera”), exceto que as tabelas de resumo de declarações agregam eventos de `events_statements_current` em vez de `events_waits_current`.

  A tabela `prepared_statements_instances` não possui essas colunas.

- `SUM_xxx`

  O agregado da coluna correspondente ao *`xxx`* na tabela `events_statements_current`. Por exemplo, as colunas `SUM_LOCK_TIME` e `SUM_ERRORS` nos quadros de resumo de declarações são os agregados das colunas `LOCK_TIME` e `ERRORS` na tabela `events_statements_current`.

A tabela `events_statements_summary_by_digest` possui essas colunas de resumo adicionais:

- `PRIMEIRO_VISTO`, `ÚLTIMO_VISTO`

  Os tempos de registro indicam quando as declarações com o valor de digestão fornecido foram vistas pela primeira vez e quando foram vistas pela última vez.

A tabela `events_statements_summary_by_program` possui essas colunas de resumo adicionais:

- `CONTAS_STATEMENTS`, `SUMA_STATEMENTS_WAIT`, `MIN_STATEMENTS_WAIT`, `AVG_STATEMENTS_WAIT`, `MAX_STATEMENTS_WAIT`

  Estatísticas sobre declarações aninhadas invocadas durante a execução de programas armazenados.

A tabela `prepared_statements_instances` possui essas colunas de resumo adicionais:

- `CONTAR_EXECUTAR`, `SOMAR_TEMPO_EXECUTAR`, `MIN_TEMPO_EXECUTAR`, `MÉDIA_TEMPO_EXECUTAR`, `MAX_TEMPO_EXECUTAR`

  Estatísticas agregadas para execuções da declaração preparada.

A opção `TRUNCATE TABLE` é permitida para tabelas de resumo de declarações. Ela tem esses efeitos:

- Para `events_statements_summary_by_digest`, ele remove as linhas.

- Para outras tabelas de resumo que não são agregadas por conta, host ou usuário, o truncamento redefine as colunas de resumo para zero, em vez de remover linhas.

- Para outras tabelas resumidas agregadas por conta, host ou usuário, o truncamento remove linhas de contas, hosts ou usuários sem conexões e redefini o valor das colunas resumidas para zero para as linhas restantes.

Além disso, cada tabela de resumo de declarações que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual depende, ou pela truncagem de `events_statements_summary_global_by_event_name`. Para obter detalhes, consulte Seção 25.12.8, “Tabelas de Conexão do Schema de Desempenho”.

##### Regras de agregação do resumo das declarações

Se o consumidor `statements_digest` estiver habilitado, a agregação em `events_statements_summary_by_digest` ocorre da seguinte forma quando uma declaração é concluída. A agregação é baseada no valor `DIGEST` calculado para a declaração.

- Se uma linha do `events_statements_summary_by_digest` já existir com o valor do digest para a declaração que acabou de ser concluída, as estatísticas da declaração são agregadas a essa linha. A coluna `LAST_SEEN` é atualizada para a hora atual.

- Se nenhuma linha tiver o valor de digestão para a declaração que acabou de ser concluída e a tabela não estiver cheia, uma nova linha é criada para a declaração. As colunas `FIRST_SEEN` e `LAST_SEEN` são inicializadas com a hora atual.

- Se nenhuma linha tiver o valor do resumo da declaração para a declaração que acabou de ser concluída e a tabela estiver cheia, as estatísticas para a declaração que acabou de ser concluída são adicionadas a uma linha especial de “captura geral” com `DIGEST` = `NULL`, que é criada, se necessário. Se a linha for criada, as colunas `FIRST_SEEN` e `LAST_SEEN` são inicializadas com a hora atual. Caso contrário, a coluna `LAST_SEEN` é atualizada com a hora atual.

A linha com `DIGEST` = `NULL` é mantida porque as tabelas do Gerenciamento de Desempenho têm um tamanho máximo devido a restrições de memória. A linha `DIGEST` = `NULL` permite que os digests que não correspondem a outras linhas sejam contados mesmo que a tabela de resumo esteja cheia, usando um compartimento comum "outro". Essa linha ajuda você a estimar se o resumo do digest é representativo:

- Uma linha `DIGEST` = `NULL` que tem um valor `COUNT_STAR` que representa 5% de todos os digests mostra que a tabela de resumo de digests é muito representativa; as outras linhas cobrem 95% das declarações vistas.

- Uma linha `DIGEST` = `NULL` que tem um valor `COUNT_STAR` que representa 50% de todos os digests mostra que a tabela de resumo de digests não é muito representativa; as outras linhas cobrem apenas metade das declarações vistas. Muito provavelmente, o DBA deve aumentar o tamanho máximo da tabela para que mais das linhas contadas na linha `DIGEST` = `NULL` sejam contadas usando linhas mais específicas. Por padrão, a tabela é dimensionada automaticamente, mas se esse tamanho for muito pequeno, defina a variável de sistema `performance_schema_digests_size` para um valor maior no início do servidor.

##### Comportamento de Instrumentação de Programa Armazenado

Para os tipos de programas armazenados para os quais a instrumentação está habilitada na tabela `setup_objects`, a tabela `events_statements_summary_by_program` mantém estatísticas para os programas armazenados da seguinte forma:

- Uma linha é adicionada para um objeto quando ele é usado pela primeira vez no servidor.

- A linha para um objeto é removida quando o objeto é solto.

- As estatísticas são agregadas na linha de um objeto conforme ele é executado.

Veja também Seção 25.4.3, “Pré-filtragem de Eventos”.
