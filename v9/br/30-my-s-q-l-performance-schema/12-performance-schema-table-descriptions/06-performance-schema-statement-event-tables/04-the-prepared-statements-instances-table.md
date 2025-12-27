#### 29.12.6.4 A tabela prepared\_statements\_instances

O Schema de Desempenho fornece instrumentação para instruções preparadas, para as quais existem dois protocolos:

* O protocolo binário. Este é acessado através da API C do MySQL e é mapeado para comandos do servidor subjacente, conforme mostrado na tabela a seguir.

<table summary="Como o protocolo binário acessado através da API C do MySQL é mapeado para comandos do servidor subjacente."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Função da API C</th> <th>Comando do servidor subjacente correspondente</th> </tr></thead><tbody><tr> <td><a class="ulink" href="/doc/c-api/9.5/pt_BR/mysql-stmt-prepare.html" target="_blank"><code class="literal">mysql_stmt_prepare()</code></a></td> <td><code class="literal">COM_STMT_PREPARE</code></td> </tr><tr> <td><a class="ulink" href="/doc/c-api/9.5/pt_BR/mysql-stmt-execute.html" target="_blank"><code class="literal">mysql_stmt_execute()</code></a></td> <td><code class="literal">COM_STMT_EXECUTE</code></td> </tr><tr> <td><a class="ulink" href="/doc/c-api/9.5/pt_BR/mysql-stmt-close.html" target="_blank"><code class="literal">mysql_stmt_close()</code></a></td> <td><code class="literal">COM_STMT_CLOSE</code></td> </tr></tbody></table>

* O protocolo de texto. Este é acessado usando instruções SQL e é mapeado para comandos do servidor subjacente, conforme mostrado na tabela a seguir.

A instrumentação de declarações preparadas do Schema de Desempenho cobre ambos os protocolos. A discussão a seguir se refere aos comandos do servidor, e não às funções da API C ou às declarações SQL.

As informações sobre declarações preparadas estão disponíveis na tabela `prepared_statements_instances`. Essa tabela permite a inspeção das declarações preparadas usadas no servidor e fornece estatísticas agregadas sobre elas. Para controlar o tamanho dessa tabela, defina a variável de sistema `performance_schema_max_prepared_statements_instances` no início do servidor.

A coleta de informações sobre declarações preparadas depende dos instrumentos de declaração mostrados na tabela a seguir. Esses instrumentos estão habilitados por padrão. Para modificá-los, atualize a tabela `setup_instruments`.

A Schema de Desempenho gerencia o conteúdo da tabela `prepared_statements_instances` da seguinte forma:

* Preparação de declarações

  O comando `COM_STMT_PREPARE` ou `SQLCOM_PREPARE` cria uma declaração preparada no servidor. Se a declaração puder ser instrumentada com sucesso, uma nova linha é adicionada à tabela `prepared_statements_instances`. Se a declaração não puder ser instrumentada, a variável de status `Performance_schema_prepared_statements_lost` é incrementada.

* Execução de declarações preparadas

  A execução do comando `COM_STMT_EXECUTE` ou `SQLCOM_PREPARE` para uma instância de declaração preparada instrumentada atualiza a linha correspondente na tabela `prepared_statements_instances`.

* Desalocação de declarações preparadas

  A execução do comando `COM_STMT_CLOSE` ou `SQLCOM_DEALLOCATE_PREPARE` para uma instância de declaração preparada instrumentada remove a linha correspondente da tabela `prepared_statements_instances`. Para evitar vazamentos de recursos, a remoção ocorre mesmo se as declarações preparadas instrumentadas descritas anteriormente forem desativadas.

A tabela `prepared_statements_instances` tem as seguintes colunas:

* `OBJECT_INSTANCE_BEGIN`

  O endereço na memória do comando preparado instrumentado.

* `STATEMENT_ID`

  O ID interno do comando atribuído pelo servidor. Os protocolos de texto e binário usam IDs de comando.

* `STATEMENT_NAME`

  Para o protocolo binário, esta coluna é `NULL`. Para o protocolo de texto, esta coluna é o nome do comando externo atribuído pelo usuário. Por exemplo, para a seguinte instrução SQL, o nome do comando preparado é `stmt`:

  ```
  PREPARE stmt FROM 'SELECT 1';
  ```

* `SQL_TEXT`

  O texto do comando preparado, com marcadores de substituição `?`.

* `OWNER_THREAD_ID`, `OWNER_EVENT_ID`

  Estas colunas indicam o evento que criou o comando preparado.

* `OWNER_OBJECT_TYPE`, `OWNER_OBJECT_SCHEMA`, `OWNER_OBJECT_NAME`

  Para um comando preparado criado por uma sessão de cliente, estas colunas são `NULL`. Para um comando preparado criado por um programa armazenado, estas colunas apontam para o programa armazenado. Um erro típico do usuário é esquecer de liberar comandos preparados. Estas colunas podem ser usadas para encontrar programas armazenados que liberam comandos preparados:

  ```
  SELECT
    OWNER_OBJECT_TYPE, OWNER_OBJECT_SCHEMA, OWNER_OBJECT_NAME,
    STATEMENT_NAME, SQL_TEXT
  FROM performance_schema.prepared_statements_instances
  WHERE OWNER_OBJECT_TYPE IS NOT NULL;
  ```

* O motor de execução da consulta. O valor é `PRIMARY` ou `SECONDARY`. Para uso com o MySQL HeatWave Service e o MySQL HeatWave, onde o motor `PRIMARY` é `InnoDB` e o motor `SECONDARY` é MySQL HeatWave (`RAPID`). Para o MySQL Community Edition Server, MySQL Enterprise Edition Server (on-premise) e o MySQL HeatWave Service sem o MySQL HeatWave, o valor é sempre `PRIMARY`.

* `TIMER_PREPARE`

  O tempo gasto executando a própria preparação do comando.

* `COUNT_REPREPARE`

O número de vezes que a declaração foi preparada internamente (veja a Seção 10.10.3, “Cache de Declarações Preparadas e Programas Armazenados”). As estatísticas de tempo para a preparação não estão disponíveis porque são contadas como parte da execução da declaração, e não como uma operação separada.

* `COUNT_EXECUTE`, `SUM_TIMER_EXECUTE`, `MIN_TIMER_EXECUTE`, `AVG_TIMER_EXECUTE`, `MAX_TIMER_EXECUTE`

  Estatísticas agregadas para execuções da declaração preparada.

* `SUM_xxx`

  As colunas `SUM_xxx` restantes são as mesmas das tabelas de resumo de declarações (veja a Seção 29.12.20.3, “Tabelas de Resumo de Declarações”).

* `MAX_CONTROLLED_MEMORY`

  Relata a quantidade máxima de memória controlada usada por uma declaração preparada durante a execução.

* `MAX_TOTAL_MEMORY`

  Relata a quantidade máxima de memória usada por uma declaração preparada durante a execução.

A tabela `prepared_statements_instances` tem esses índices:

* Chave primária em (`OBJECT_INSTANCE_BEGIN`)
* Índice em (`STATEMENT_ID`)
* Índice em (`STATEMENT_NAME`)
* Índice em (`OWNER_THREAD_ID`, `OWNER_EVENT_ID`)

* Índice em (`OWNER_OBJECT_TYPE`, `OWNER_OBJECT_SCHEMA`, `OWNER_OBJECT_NAME`)

O `TRUNCATE TABLE` redefini o índice das colunas de estatísticas da tabela `prepared_statements_instances`.