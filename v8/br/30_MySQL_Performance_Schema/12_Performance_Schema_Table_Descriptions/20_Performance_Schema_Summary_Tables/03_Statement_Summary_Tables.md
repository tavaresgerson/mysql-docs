#### 29.12.20.3 Tabelas de Resumo de Declarações

O Schema de Desempenho mantém tabelas para coletar eventos de declaração atuais e recentes, e agrega essas informações em tabelas resumidas. A Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”, descreve os eventos sobre os quais os resumos de declaração são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de declaração, as tabelas de eventos de declaração atuais e históricas, e como controlar a coleta de eventos de declaração, que está parcialmente desativada por padrão.

Exemplo de resumo de informações de evento de declaração:

```
mysql> SELECT *
       FROM performance_schema.events_statements_summary_global_by_event_name\G
*************************** 1. row ***************************
                 EVENT_NAME: statement/sql/select
                 COUNT_STAR: 54
             SUM_TIMER_WAIT: 38860400000
             MIN_TIMER_WAIT: 52400000
             AVG_TIMER_WAIT: 719600000
             MAX_TIMER_WAIT: 12631800000
              SUM_LOCK_TIME: 88000000
                 SUM_ERRORS: 0
               SUM_WARNINGS: 0
          SUM_ROWS_AFFECTED: 0
              SUM_ROWS_SENT: 60
          SUM_ROWS_EXAMINED: 120
SUM_CREATED_TMP_DISK_TABLES: 0
     SUM_CREATED_TMP_TABLES: 21
       SUM_SELECT_FULL_JOIN: 16
 SUM_SELECT_FULL_RANGE_JOIN: 0
           SUM_SELECT_RANGE: 0
     SUM_SELECT_RANGE_CHECK: 0
            SUM_SELECT_SCAN: 41
      SUM_SORT_MERGE_PASSES: 0
             SUM_SORT_RANGE: 0
              SUM_SORT_ROWS: 0
              SUM_SORT_SCAN: 0
          SUM_NO_INDEX_USED: 22
     SUM_NO_GOOD_INDEX_USED: 0
               SUM_CPU_TIME: 0
      MAX_CONTROLLED_MEMORY: 2028360
           MAX_TOTAL_MEMORY: 2853429
            COUNT_SECONDARY: 0
...
```

Cada tabela de resumo de declaração tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se aos nomes dos instrumentos de evento na tabela `setup_instruments`:

- A tabela `events_statements_summary_by_account_by_event_name` possui as colunas `EVENT_NAME`, `USER` e `HOST`. Cada linha resume os eventos para uma conta específica (combinação de usuário e host) e o nome do evento.

- As colunas `events_statements_summary_by_digest` têm as colunas `SCHEMA_NAME` e `DIGEST`. Cada linha resume os eventos por esquema e valor de digestão. (A coluna `DIGEST_TEXT` contém o texto correspondente ao digestão de declaração normalizada, mas não é uma coluna de agrupamento nem de resumo. As colunas `QUERY_SAMPLE_TEXT`, `QUERY_SAMPLE_SEEN` e `QUERY_SAMPLE_TIMER_WAIT` também não são colunas de agrupamento nem de resumo; elas suportam a amostragem de declarações.)

  O número máximo de linhas na tabela é dimensionado automaticamente ao iniciar o servidor. Para definir esse máximo explicitamente, defina a variável de sistema `performance_schema_digests_size` ao iniciar o servidor.

- A tabela `events_statements_summary_by_host_by_event_name` possui as colunas `EVENT_NAME` e `HOST`. Cada linha resume os eventos para um determinado host e nome de evento.

- A tabela `events_statements_summary_by_program` possui as colunas `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Cada linha resume os eventos para um determinado programa armazenado (procedimento armazenado ou função, gatilho ou evento).

- A coluna `events_statements_summary_by_thread_by_event_name` tem as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume os eventos para um determinado fio e nome de evento.

- A tabela `events_statements_summary_by_user_by_event_name` possui as colunas `EVENT_NAME` e `USER`. Cada linha resume os eventos para um usuário e um nome de evento específicos.

- A coluna `events_statements_summary_global_by_event_name` tem uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico.

- A coluna `prepared_statements_instances` tem uma coluna `OBJECT_INSTANCE_BEGIN`. Cada linha resume os eventos para uma determinada declaração preparada.

Cada tabela de resumo de declaração tem essas colunas de resumo contendo valores agregados (com exceções conforme indicado):

- `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

  Essas colunas são análogas às colunas com os mesmos nomes nas tabelas de resumo de eventos de espera (ver Seção 29.12.20.1, “Tabelas de Resumo de Eventos de Espera”), exceto que as tabelas de resumo de declarações agregam eventos de `events_statements_current` em vez de `events_waits_current`.

  A tabela `prepared_statements_instances` não possui essas colunas.

- `SUM_xxx`

  O agregado da coluna correspondente ao `xxx` na tabela `events_statements_current`. Por exemplo, as colunas `SUM_LOCK_TIME` e `SUM_ERRORS` nos quadros de resumo das declarações são os agregados das colunas `LOCK_TIME` e `ERRORS` na tabela `events_statements_current`.

- `MAX_CONTROLLED_MEMORY`

  Relata o valor máximo de memória controlada utilizada por uma declaração durante a execução.

  Esta coluna foi adicionada no MySQL 8.0.31.

- `MAX_TOTAL_MEMORY`

  Relata o valor máximo de memória utilizado por uma declaração durante a execução.

  Esta coluna foi adicionada no MySQL 8.0.31.

- `COUNT_SECONDARY`

  O número de vezes que uma consulta foi processada no motor `SECONDARY`. Para uso com o MySQL HeatWave Service e o MySQL HeatWave, onde o motor `PRIMARY` é `InnoDB` e o motor `SECONDARY` é o MySQL HeatWave (`RAPID`). Para o MySQL Community Edition Server, o MySQL Enterprise Edition Server (on-premise) e o MySQL HeatWave Service sem o MySQL HeatWave, as consultas são sempre processadas no motor `PRIMARY`, o que significa que o valor é sempre 0 nesses servidores MySQL. A coluna `COUNT_SECONDARY` foi adicionada no MySQL 8.0.29.

A tabela `events_statements_summary_by_digest` tem essas colunas de resumo adicionais:

- `FIRST_SEEN`, `LAST_SEEN`

  Os tempos de registro indicam quando as declarações com o valor de digestão fornecido foram vistas pela primeira vez e quando foram vistas pela última vez.

- `QUANTILE_95`: O 95º percentil da latência da declaração, em picosegundos. Esse percentil é uma estimativa alta, calculada a partir dos dados do histograma coletados. Em outras palavras, para um determinado digest, 95% das declarações medidas têm uma latência menor que `QUANTILE_95`.

  Para acessar os dados do histograma, use as tabelas descritas na Seção 29.12.20.4, “Tabelas de Resumo de Histograma de Relatório”.

- `QUANTILE_99`: Semelhante a `QUANTILE_95`, mas para o 99º percentil.

- `QUANTILE_999`: Semelhante a `QUANTILE_95`, mas para o 99,9º percentil.

A tabela `events_statements_summary_by_digest` contém as seguintes colunas. Essas colunas não são de agregação nem de resumo; elas suportam a amostragem de declarações:

- `QUERY_SAMPLE_TEXT`

  Uma declaração SQL de amostra que produz o valor do digest no registro. Esta coluna permite que as aplicações acessem, para um determinado valor de digest, uma declaração realmente vista pelo servidor que produz esse digest. Uma utilização para isso pode ser executar `EXPLAIN` na declaração para examinar o plano de execução de uma declaração representativa associada a um digest que ocorre com frequência.

  Quando a coluna `QUERY_SAMPLE_TEXT` recebe um valor, as colunas `QUERY_SAMPLE_SEEN` e `QUERY_SAMPLE_TIMER_WAIT` também recebem valores.

  O espaço máximo disponível para exibição de declarações é de 1024 bytes por padrão. Para alterar esse valor, defina a variável de sistema `performance_schema_max_sql_text_length` no início do servidor. (Alterar esse valor afeta também as colunas em outras tabelas do Schema de Desempenho. Consulte a Seção 29.10, “Digestas e Amostragem de Declarações do Schema de Desempenho”).

  Para obter informações sobre a amostragem de declarações, consulte a Seção 29.10, “Resumo e Amostragem de Declarações do Schema de Desempenho”.

- `QUERY_SAMPLE_SEEN`

  Um marcador de tempo que indica quando a declaração na coluna `QUERY_SAMPLE_TEXT` foi vista.

- `QUERY_SAMPLE_TIMER_WAIT`

  O tempo de espera para a declaração de amostra na coluna `QUERY_SAMPLE_TEXT`.

A tabela `events_statements_summary_by_program` tem essas colunas de resumo adicionais:

- `COUNT_STATEMENTS`, `SUM_STATEMENTS_WAIT`, `MIN_STATEMENTS_WAIT`, `AVG_STATEMENTS_WAIT`, `MAX_STATEMENTS_WAIT`

  Estatísticas sobre declarações aninhadas invocadas durante a execução de programas armazenados.

A tabela `prepared_statements_instances` tem essas colunas de resumo adicionais:

- `COUNT_EXECUTE`, `SUM_TIMER_EXECUTE`, `MIN_TIMER_EXECUTE`, `AVG_TIMER_EXECUTE`, `MAX_TIMER_EXECUTE`

  Estatísticas agregadas para execuções da declaração preparada.

As tabelas de resumo das declarações têm esses índices:

- `events_transactions_summary_by_account_by_event_name`:

  - Chave primária em (`USER`, `HOST`, `EVENT_NAME`)

- `events_statements_summary_by_digest`:

  - Chave primária em (`SCHEMA_NAME`, `DIGEST`)

- `events_transactions_summary_by_host_by_event_name`:

  - Chave primária em (`HOST`, `EVENT_NAME`)

- `events_statements_summary_by_program`:

  - Chave primária em (`OBJECT_TYPE`, `OBJECT_SCHEMA`, `OBJECT_NAME`)

- `events_statements_summary_by_thread_by_event_name`:

  - Chave primária em (`THREAD_ID`, `EVENT_NAME`)

- `events_transactions_summary_by_user_by_event_name`:

  - Chave primária em (`USER`, `EVENT_NAME`)

- `events_statements_summary_global_by_event_name`:

  - Chave primária em (`EVENT_NAME`)

`TRUNCATE TABLE` é permitido para tabelas de resumo de declarações. Ele tem esses efeitos:

- Para `events_statements_summary_by_digest`, ele remove as linhas.

- Para outras tabelas de resumo que não são agregadas por conta, host ou usuário, o truncamento redefine as colunas de resumo para zero, em vez de remover linhas.

- Para outras tabelas resumidas agregadas por conta, host ou usuário, o truncamento remove linhas de contas, hosts ou usuários sem conexões e redefini o valor das colunas resumidas para zero para as linhas restantes.

Além disso, cada tabela de resumo de declaração que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão da qual depende, ou pela truncagem de `events_statements_summary_global_by_event_name`. Para obter detalhes, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.

Além disso, a truncação de `events_statements_summary_by_digest` trunca implicitamente `events_statements_histogram_by_digest`, e a truncação de `events_statements_summary_global_by_event_name` trunca implicitamente `events_statements_histogram_global`.

##### Regras de agregação do resumo das declarações

Se o consumidor `statements_digest` estiver habilitado, a agregação para `events_statements_summary_by_digest` ocorre da seguinte forma quando uma declaração é concluída. A agregação é baseada no valor `DIGEST` calculado para a declaração.

- Se uma linha `events_statements_summary_by_digest` já existir com o valor do digest para a declaração que acabou de ser concluída, as estatísticas da declaração são agregadas a essa linha. A coluna `LAST_SEEN` é atualizada para a hora atual.

- Se nenhuma linha tiver o valor do digest para a declaração que acabou de ser concluída e a tabela não estiver cheia, uma nova linha é criada para a declaração. As colunas `FIRST_SEEN` e `LAST_SEEN` são inicializadas com a hora atual.

- Se nenhuma linha tiver o valor do resumo da declaração para a declaração que acabou de ser concluída e a tabela estiver cheia, as estatísticas para a declaração que acabou de ser concluída são adicionadas a uma linha especial “genérica” com `DIGEST` = `NULL`, que é criada se necessário. Se a linha for criada, as colunas `FIRST_SEEN` e `LAST_SEEN` são inicializadas com a hora atual. Caso contrário, a coluna `LAST_SEEN` é atualizada com a hora atual.

A linha com `DIGEST` = `NULL` é mantida porque as tabelas do Schema de Desempenho têm um tamanho máximo devido a restrições de memória. A linha `DIGEST` = `NULL` permite que os digests que não correspondem a outras linhas sejam contados mesmo que a tabela de resumo esteja cheia, usando um compartimento comum “outro”. Esta linha ajuda você a estimar se o resumo do digest é representativo:

- Uma linha `DIGEST` = `NULL` que tem um valor `COUNT_STAR` que representa 5% de todos os resumos mostra que a tabela de resumos de digestos é muito representativa; as outras linhas cobrem 95% das declarações vistas.

- Uma linha `DIGEST` = `NULL` que tem um valor `COUNT_STAR` que representa 50% de todos os digests mostra que a tabela de resumo do digest não é muito representativa; as outras linhas cobrem apenas metade das declarações vistas. Muito provavelmente, o DBA deve aumentar o tamanho máximo da tabela para que mais das linhas contadas na linha `DIGEST` = `NULL` sejam contadas usando linhas mais específicas. Por padrão, a tabela é dimensionada automaticamente, mas se esse tamanho for muito pequeno, defina a variável de sistema `performance_schema_digests_size` para um valor maior no início do servidor.

##### Comportamento de Instrumentação de Programa Armazenado

Para os tipos de programas armazenados para os quais a instrumentação está habilitada na tabela `setup_objects`, o `events_statements_summary_by_program` mantém estatísticas para os programas armazenados da seguinte forma:

- Uma linha é adicionada para um objeto quando ele é usado pela primeira vez no servidor.

- A linha para um objeto é removida quando o objeto é solto.

- As estatísticas são agregadas na linha de um objeto conforme ele é executado.

Veja também a Seção 29.4.3, “Pré-filtragem de eventos”.
