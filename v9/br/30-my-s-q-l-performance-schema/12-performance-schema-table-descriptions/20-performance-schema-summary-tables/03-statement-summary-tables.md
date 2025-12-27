#### 29.12.20.3 Tabelas de Resumo de Eventos de Declaração

O Schema de Desempenho mantém tabelas para coletar eventos de declaração atuais e recentes, e agrega essas informações em tabelas de resumo. A Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”, descreve os eventos sobre os quais os resumos de declaração são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de declaração, as tabelas de eventos de declaração atuais e históricas, e como controlar a coleta de eventos de declaração, que é parcialmente desabilitada por padrão.

Informações de resumo de evento de declaração de exemplo:

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

Cada tabela de resumo de declaração tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se a nomes de instrumentos de evento na tabela `setup_instruments`:

* `events_statements_summary_by_account_by_event_name` tem as colunas `EVENT_NAME`, `USER` e `HOST`. Cada linha resume eventos para uma conta específica (combinação de usuário e host) e nome de evento.

* `events_statements_summary_by_digest` tem as colunas `SCHEMA_NAME` e `DIGEST`. Cada linha resume eventos por esquema e valor de digest. (A coluna `DIGEST_TEXT` contém o texto de digest de declaração normalizado correspondente, mas não é uma coluna de agrupamento nem de resumo. As colunas `QUERY_SAMPLE_TEXT`, `QUERY_SAMPLE_SEEN` e `QUERY_SAMPLE_TIMER_WAIT` também não são colunas de agrupamento nem de resumo; elas suportam a amostragem de declaração.)

O número máximo de linhas na tabela é dimensionado automaticamente no início do servidor. Para definir explicitamente esse máximo, defina a variável de sistema `performance_schema_digests_size` no início do servidor.

* `events_statements_summary_by_host_by_event_name` tem as colunas `EVENT_NAME` e `HOST`. Cada linha resume eventos para um host específico e nome de evento.

* `eventos_estatísticas_resumo_por_programa` tem as colunas `TIPO_OBJETO`, `ESQUEMA_OBJETO` e `NOME_OBJETO`. Cada linha resume os eventos para um determinado programa armazenado (procedimento armazenado ou função, gatilho ou evento).

* `eventos_estatísticas_resumo_por_thread_por_nome_evento` tem as colunas `ID_THREAD` e `NOME_EVENTO`. Cada linha resume os eventos para um determinado thread e nome de evento.

* `eventos_estatísticas_resumo_por_usuário_por_nome_evento` tem as colunas `NOME_EVENTO` e `USUÁRIO`. Cada linha resume os eventos para um determinado usuário e nome de evento.

* `eventos_estatísticas_resumo_global_por_nome_evento` tem uma coluna `NOME_EVENTO`. Cada linha resume os eventos para um determinado nome de evento.

* `instâncias_de_instruções_preparadas` tem uma coluna `INICIALIZAÇÃO_INSTÂNCIA`. Cada linha resume os eventos para uma determinada instância de instrução preparada.

Cada tabela de resumo de instruções tem essas colunas de resumo contendo valores agregados (com exceções conforme observado):

* `CONTAR_ESTAR`, `SUM_TEMPO_ATENDIMENTO`, `MIN_TEMPO_ATENDIMENTO`, `AVG_TEMPO_ATENDIMENTO`, `MAX_TEMPO_ATENDIMENTO`

Essas colunas são análogas às colunas dos mesmos nomes nas tabelas de resumo de eventos de espera (ver Seção 29.12.20.1, “Tabelas de Resumo de Eventos de Espera”), exceto que as tabelas de resumo de instruções agregam eventos de `eventos_instruções_correntes` em vez de `eventos_esperas_correntes`.

A tabela `instâncias_de_instruções_preparadas` não tem essas colunas.

* `SUM_xxx`

O agregado da coluna correspondente a *`xxx`* na tabela `eventos_instruções_correntes`. Por exemplo, as colunas `SUM_TEMPO_DE_BLOQUEIO` e `SUM_ERROS` nas tabelas de resumo de instruções são os agregados das colunas `TEMPO_DE_BLOQUEIO` e `ERROS` na tabela `eventos_instruções_correntes`.

* `MAX_MEMORIA_CONTROLADA`
* `MAX_MEMORIA_TOTAL`

Relata o valor máximo de memória utilizado por uma declaração durante a execução.

* `COUNT_SECONDARY`

  O número de vezes que uma consulta foi processada no motor `SECONDARY`. Para uso com o MySQL HeatWave Service e o MySQL HeatWave, onde o motor `PRIMARY` é `InnoDB` e o motor `SECONDARY` é MySQL HeatWave (`RAPID`). Para o MySQL Community Edition Server, MySQL Enterprise Edition Server (on-premise) e o MySQL HeatWave Service sem o MySQL HeatWave, as consultas são sempre processadas no motor `PRIMARY`, o que significa que o valor é sempre 0 nesses servidores MySQL.

A tabela `events_statements_summary_by_digest` tem essas colunas de resumo adicionais:

* `FIRST_SEEN`, `LAST_SEEN`

  Datas de início e de término quando as declarações com o valor de digest dado foram vistas pela primeira vez e mais recentemente.

* `QUANTILE_95`: O percentil 95 da latência da declaração, em picosegundos. Esse percentil é uma estimativa alta, calculada a partir dos dados do histograma coletados. Em outras palavras, para um digest dado, 95% das declarações medidas têm uma latência menor que `QUANTILE_95`.

  Para acessar os dados do histograma, use as tabelas descritas na Seção 29.12.20.4, “Tabelas de Resumo de Histograma de Declarações”.

* `QUANTILE_99`: Semelhante a `QUANTILE_95`, mas para o percentil 99.

* `QUANTILE_999`: Semelhante a `QUANTILE_95`, mas para o percentil 99,9.

A tabela `events_statements_summary_by_digest` contém as seguintes colunas. Essas não são colunas de agrupamento nem de resumo; elas suportam a amostragem de declarações:

* `QUERY_SAMPLE_TEXT`

Uma amostra de uma instrução SQL que produz o valor do digest no registro. Esta coluna permite que as aplicações acessem, para um determinado valor de digest, uma instrução realmente vista pelo servidor que produz esse digest. Uma utilização para isso pode ser executar `EXPLAIN` na instrução para examinar o plano de execução de uma instrução representativa associada a um digest que ocorre com frequência.

Quando a coluna `QUERY_SAMPLE_TEXT` é atribuída um valor, as colunas `QUERY_SAMPLE_SEEN` e `QUERY_SAMPLE_TIMER_WAIT` também são atribuídas valores.

O espaço máximo disponível para a exibição da instrução é de 1024 bytes por padrão. Para alterar esse valor, defina a variável de sistema `performance_schema_max_sql_text_length` no início do servidor. (Alterar esse valor afeta também as colunas de outras tabelas do Schema de Desempenho. Veja a Seção 29.10, “Digestas e Amostragem de Instruções do Schema de Desempenho”).

Para informações sobre a amostragem de instruções, veja a Seção 29.10, “Digestas e Amostragem de Instruções do Schema de Desempenho”.

* `QUERY_SAMPLE_SEEN`

Um timestamp indicando quando a instrução na coluna `QUERY_SAMPLE_TEXT` foi vista.

* `QUERY_SAMPLE_TIMER_WAIT`

O tempo de espera para a instrução de amostra na coluna `QUERY_SAMPLE_TEXT`.

As tabelas `events_statements_summary_by_program` têm essas colunas de resumo adicionais:

* `COUNT_STATEMENTS`, `SUM_STATEMENTS_WAIT`, `MIN_STATEMENTS_WAIT`, `AVG_STATEMENTS_WAIT`, `MAX_STATEMENTS_WAIT`

Estatísticas sobre instruções aninhadas invocadas durante a execução de programas armazenados.

A tabela `prepared_statements_instances` tem essas colunas de resumo adicionais:

* `COUNT_EXECUTE`, `SUM_TIMER_EXECUTE`, `MIN_TIMER_EXECUTE`, `AVG_TIMER_EXECUTE`, `MAX_TIMER_EXECUTE`

Estatísticas agregadas para execuções da instrução preparada.

As tabelas de resumo de instruções têm esses índices:

* `eventos_transacoes_resumo_por_conta_por_nome_de_evento`:

  + Chave primária em (`USER`, `HOST`, `NOME_DE_EVENTO`)

* `eventos_declaracoes_resumo_por_digest`:

  + Chave primária em (`NOME_DO_SCHEMA`, `DIGEST`)

* `eventos_transacoes_resumo_por_host_por_nome_de_evento`:

  + Chave primária em (`HOST`, `NOME_DE_EVENTO`)

* `eventos_declaracoes_resumo_por_programa`:

  + Chave primária em (`TIPO_OBJETO`, `SCHEMA_OBJETO`, `NOME_OBJETO`)

* `eventos_declaracoes_resumo_por_thread_por_nome_de_evento`:

  + Chave primária em (`ID_THREAD`, `NOME_DE_EVENTO`)

* `eventos_transacoes_resumo_por_usuario_por_nome_de_evento`:

  + Chave primária em (`USER`, `NOME_DE_EVENTO`)

* `eventos_declaracoes_resumo_global_por_nome_de_evento`:

  + Chave primária em (`NOME_DE_EVENTO`)

A `TRUNCATE TABLE` é permitida para tabelas de resumo de declarações. Ela tem esses efeitos:

* Para `eventos_declaracoes_resumo_por_digest`, ela remove as linhas.

* Para outras tabelas de resumo que não são agregadas por conta, host ou usuário, a truncagem redefine as colunas de resumo para zero em vez de remover linhas.

* Para outras tabelas de resumo que são agregadas por conta, host ou usuário, a truncagem remove linhas para contas, hosts ou usuários sem conexões e redefine as colunas de resumo para zero para as linhas restantes.

Além disso, cada tabela de resumo de declarações que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual depende, ou pela truncagem de `eventos_declaracoes_resumo_global_por_nome_de_evento`. Para detalhes, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.

Além disso, a truncagem de `eventos_declaracoes_resumo_por_digest` trunca implicitamente `eventos_declaracoes_histograma_por_digest`, e a truncagem de `eventos_declaracoes_resumo_global_por_nome_de_evento` trunca implicitamente `eventos_declaracoes_histograma_global`.

##### Regras de Agregação de Resumo de Digestas de Declarações

Se o consumidor `statements_digest` estiver habilitado, a agregação em `events_statements_summary_by_digest` ocorre da seguinte forma quando uma declaração é concluída. A agregação é baseada no valor `DIGEST` calculado para a declaração.

* Se uma linha `events_statements_summary_by_digest` já existir com o valor do digest da declaração que acabou de ser concluída, as estatísticas para a declaração são agregadas a essa linha. A coluna `LAST_SEEN` é atualizada para a hora atual.

* Se nenhuma linha tem o valor do digest da declaração que acabou de ser concluída, e a tabela não está cheia, uma nova linha é criada para a declaração. As colunas `FIRST_SEEN` e `LAST_SEEN` são inicializadas com a hora atual.

* Se nenhuma linha tem o valor do digest da declaração que acabou de ser concluída, e a tabela está cheia, as estatísticas para a declaração que acabou de ser concluída são adicionadas a uma linha especial "universal" com `DIGEST` = `NULL`, que é criada se necessário. Se a linha for criada, as colunas `FIRST_SEEN` e `LAST_SEEN` são inicializadas com a hora atual. Caso contrário, a coluna `LAST_SEEN` é atualizada com a hora atual.

A linha com `DIGEST` = `NULL` é mantida porque as tabelas do Performance Schema têm um tamanho máximo devido a restrições de memória. A linha `DIGEST` = `NULL` permite que digests que não correspondem a outras linhas sejam contados mesmo se a tabela de resumo estiver cheia, usando um compartimento comum "outro". Essa linha ajuda você a estimar se o resumo do digest é representativo:

* Uma linha `DIGEST` = `NULL` que tem um valor `COUNT_STAR` que representa 5% de todos os digests mostra que a tabela de resumo do digest é muito representativa; as outras linhas cobrem 95% das declarações vistas.

Uma linha `DIGEST` = `NULL` que tem um valor `COUNT_STAR` que representa 50% de todos os digests indica que a tabela de resumo de digests não é muito representativa; as outras linhas cobrem apenas metade das declarações vistas. Muito provavelmente, o DBA deve aumentar o tamanho máximo da tabela para que mais das linhas contadas na linha `DIGEST` = `NULL` sejam contadas usando linhas mais específicas. Por padrão, a tabela é dimensionada automaticamente, mas se esse tamanho for muito pequeno, defina a variável de sistema `performance_schema_digests_size` para um valor maior no início do servidor.

##### Comportamento de Instrumentação de Programas Armazenados

Para os tipos de programas armazenados para os quais a instrumentação está habilitada na tabela `setup_objects`, `events_statements_summary_by_program` mantém estatísticas para programas armazenados da seguinte forma:

* Uma linha é adicionada para um objeto quando ele é usado pela primeira vez no servidor.

* A linha para um objeto é removida quando o objeto é excluído.

* As estatísticas são agregadas na linha para um objeto conforme ele é executado.

Veja também a Seção 29.4.3, “Pré-filtragem de Eventos”.