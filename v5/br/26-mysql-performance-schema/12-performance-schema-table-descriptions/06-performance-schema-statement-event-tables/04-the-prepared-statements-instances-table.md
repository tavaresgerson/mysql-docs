#### 25.12.6.4 A tabela prepared_statements_instances

O Schema de Desempenho oferece instrumentação para instruções preparadas, para as quais existem dois protocolos:

- O protocolo binário. Ele é acessado através da API C do MySQL e é mapeado para comandos de servidor subjacentes, conforme mostrado na tabela a seguir.

  <table summary="Como o protocolo binário acessado através da API C do MySQL se relaciona com os comandos do servidor subjacente."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Função da API C</th> <th>Comando do servidor correspondente</th> </tr></thead><tbody><tr> <td><code>mysql_stmt_prepare()</code></td> <td><code>COM_STMT_PREPARE</code></td> </tr><tr> <td><code>mysql_stmt_execute()</code></td> <td><code>COM_STMT_EXECUTE</code></td> </tr><tr> <td><code>mysql_stmt_close()</code></td> <td><code>COM_STMT_CLOSE</code></td> </tr></tbody></table>

- O protocolo de texto. Ele é acessado usando instruções SQL e é mapeado para comandos do servidor subjacente, conforme mostrado na tabela a seguir.

  <table summary="Como o protocolo de texto acessado por meio de instruções SQL se relaciona com os comandos do servidor subjacente."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Instrução SQL</th> <th>Comando do servidor correspondente</th> </tr></thead><tbody><tr> <td><code>PREPARE</code></td> <td><code>SQLCOM_PREPARE</code></td> </tr><tr> <td><code>EXECUTE</code></td> <td><code>SQLCOM_EXECUTE</code></td> </tr><tr> <td><code>DEALLOCATE PREPARE</code>,<code>DROP PREPARE</code></td> <td><code>SQLCOM_DEALLOCATE PREPARE</code></td> </tr></tbody></table>

A instrumentação de declaração preparada do Schema de desempenho abrange ambos os protocolos. A discussão a seguir se refere aos comandos do servidor, e não às funções da API C ou às declarações SQL.

Informações sobre declarações preparadas estão disponíveis na tabela `prepared_statements_instances`. Essa tabela permite a inspeção de declarações preparadas usadas no servidor e fornece estatísticas agregadas sobre elas. Para controlar o tamanho dessa tabela, defina a variável de sistema `performance_schema_max_prepared_statements_instances` na inicialização do servidor.

A coleta de informações de declarações preparadas depende dos instrumentos de declaração mostrados na tabela a seguir. Esses instrumentos são habilitados por padrão. Para modificá-los, atualize a tabela `setup_instruments`.

<table summary="A coleta de informações de declarações preparadas depende dos instrumentos de declaração mostrados nesta tabela."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Instrumento</th> <th>Comando do servidor</th> </tr></thead><tbody><tr> <td><code>statement/com/Prepare</code></td> <td><code>COM_STMT_PREPARE</code></td> </tr><tr> <td><code>statement/com/Execute</code></td> <td><code>COM_STMT_EXECUTE</code></td> </tr><tr> <td><code>statement/sql/prepare_sql</code></td> <td><code>SQLCOM_PREPARE</code></td> </tr><tr> <td><code>statement/sql/execute_sql</code></td> <td><code>SQLCOM_EXECUTE</code></td> </tr></tbody></table>

O Schema de Desempenho gerencia o conteúdo da tabela `prepared_statements_instances` da seguinte forma:

- Preparação de declarações

  Um comando `COM_STMT_PREPARE` ou `SQLCOM_PREPARE` cria uma instrução preparada no servidor. Se a instrução for instrumentada com sucesso, uma nova linha é adicionada à tabela `prepared_statements_instances`. Se a instrução não puder ser instrumentada, a variável de status `Performance_schema_prepared_statements_lost` é incrementada.

- Execução de declarações preparadas

  A execução de um comando `COM_STMT_EXECUTE` ou `SQLCOM_PREPARE` para uma instância de instrução preparada instrumentada atualiza a linha correspondente da tabela `prepared_statements_instances`.

- Liberação de declaração preparada

  A execução de um comando `COM_STMT_CLOSE` ou `SQLCOM_DEALLOCATE_PREPARE` para uma instância de instrução preparada instrumentada remove a linha correspondente da tabela `prepared_statements_instances`. Para evitar vazamentos de recursos, a remoção ocorre mesmo que as instruções preparadas descritas anteriormente sejam desativadas.

A tabela `prepared_statements_instances` tem as seguintes colunas:

- `OBJECT_INSTANCE_BEGIN`

  O endereço na memória da declaração preparada instrumentada.

- `ID_DECLARAÇÃO`

  O ID de declaração interno atribuído pelo servidor. Tanto os protocolos de texto quanto os binários usam IDs de declaração.

- `NOME_DECLARAÇÃO`

  Para o protocolo binário, esta coluna é `NULL`. Para o protocolo de texto, esta coluna é o nome da declaração externa atribuído pelo usuário. Por exemplo, para a seguinte declaração SQL, o nome da declaração preparada é `stmt`:

  ```sql
  PREPARE stmt FROM 'SELECT 1';
  ```

- `SQL_TEXT`

  O texto da declaração preparada, com marcadores de substituição `?`.

- `OWNER_THREAD_ID`, `OWNER_EVENT_ID`

  Essas colunas indicam o evento que criou a declaração preparada.

- `OWNER_OBJECT_TYPE`, `OWNER_OBJECT_SCHEMA`, `OWNER_OBJECT_NAME`

  Para uma declaração preparada criada por uma sessão de cliente, essas colunas são `NULL`. Para uma declaração preparada criada por um programa armazenado, essas colunas apontam para o programa armazenado. Um erro típico do usuário é esquecer de liberar declarações preparadas. Essas colunas podem ser usadas para encontrar programas armazenados que vazam declarações preparadas:

  ```sql
  SELECT
    OWNER_OBJECT_TYPE, OWNER_OBJECT_SCHEMA, OWNER_OBJECT_NAME,
    STATEMENT_NAME, SQL_TEXT
  FROM performance_schema.prepared_statements_instances
  WHERE OWNER_OBJECT_TYPE IS NOT NULL;
  ```

- `TIMER_PREPARE`

  O tempo gasto na execução da preparação da declaração em si.

- `COUNT_REPREPARE`

  O número de vezes que a declaração foi preparada internamente (veja Seção 8.10.4, "Cache de Declarações Preparadas e Programas Armazenados"). As estatísticas de tempo para a preparação não estão disponíveis porque são contadas como parte da execução da declaração, e não como uma operação separada.

- `CONTAR_EXECUTAR`, `SOMAR_TEMPO_EXECUTAR`, `MIN_TEMPO_EXECUTAR`, `MÉDIA_TEMPO_EXECUTAR`, `MAX_TEMPO_EXECUTAR`

  Estatísticas agregadas para execuções da declaração preparada.

- `SUM_xxx`

  As colunas `SUM_xxx` restantes são as mesmas das tabelas de resumo de declarações (consulte Seção 25.12.15.3, "Tabelas de Resumo de Declarações").

`TRUNCATE TABLE` redefini o número de estatísticas das colunas da tabela `prepared_statements_instances`.
