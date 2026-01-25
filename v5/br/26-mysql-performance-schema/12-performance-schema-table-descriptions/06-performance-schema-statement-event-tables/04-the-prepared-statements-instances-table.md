#### 25.12.6.4 A Tabela prepared_statements_instances

O Performance Schema fornece instrumentação para prepared statements, para os quais existem dois protocolos:

* O protocolo binário. Este é acessado através da C API do MySQL e mapeia comandos subjacentes do servidor conforme mostrado na tabela a seguir.

  <table summary="Como o protocolo binário acessado através da C API do MySQL mapeia comandos subjacentes do servidor."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Função C API</th> <th>Comando Correspondente do Servidor</th> </tr></thead><tbody><tr> <td><code>mysql_stmt_prepare()</code></td> <td><code>COM_STMT_PREPARE</code></td> </tr><tr> <td><code>mysql_stmt_execute()</code></td> <td><code>COM_STMT_EXECUTE</code></td> </tr><tr> <td><code>mysql_stmt_close()</code></td> <td><code>COM_STMT_CLOSE</code></td> </tr> </tbody></table>

* O protocolo de texto. Este é acessado usando instruções SQL e mapeia comandos subjacentes do servidor conforme mostrado na tabela a seguir.

  <table summary="Como o protocolo de texto acessado usando instruções SQL mapeia comandos subjacentes do servidor."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Instrução SQL</th> <th>Comando Correspondente do Servidor</th> </tr></thead><tbody><tr> <td><code>PREPARE</code></td> <td><code>SQLCOM_PREPARE</code></td> </tr><tr> <td><code>EXECUTE</code></td> <td><code>SQLCOM_EXECUTE</code></td> </tr><tr> <td><code>DEALLOCATE PREPARE</code>, <code>DROP PREPARE</code></td> <td><code>SQLCOM_DEALLOCATE PREPARE</code></td> </tr> </tbody></table>

A instrumentação de prepared statement do Performance Schema cobre ambos os protocolos. A discussão a seguir se refere aos comandos do servidor, e não às funções C API ou instruções SQL.

As informações sobre prepared statements estão disponíveis na tabela [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table"). Esta tabela permite a inspeção de prepared statements utilizados no servidor e fornece estatísticas agregadas sobre eles. Para controlar o tamanho desta tabela, defina a variável de sistema [`performance_schema_max_prepared_statements_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_prepared_statements_instances) na inicialização do servidor.

A coleta de informações de prepared statement depende dos instrumentos de instrução mostrados na tabela a seguir. Estes instrumentos são ativados por padrão. Para modificá-los, atualize a tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table").

<table summary="A coleta de informações de prepared statement depende dos instrumentos de instrução mostrados nesta tabela."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Instrumento</th> <th>Comando do Servidor</th> </tr></thead><tbody><tr> <td><code>statement/com/Prepare</code></td> <td><code>COM_STMT_PREPARE</code></td> </tr><tr> <td><code>statement/com/Execute</code></td> <td><code>COM_STMT_EXECUTE</code></td> </tr><tr> <td><code>statement/sql/prepare_sql</code></td> <td><code>SQLCOM_PREPARE</code></td> </tr><tr> <td><code>statement/sql/execute_sql</code></td> <td><code>SQLCOM_EXECUTE</code></td> </tr> </tbody></table>

O Performance Schema gerencia o conteúdo da tabela [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table") da seguinte forma:

* Preparação de Instruções (Statement preparation)

  Um comando `COM_STMT_PREPARE` ou `SQLCOM_PREPARE` cria um prepared statement no servidor. Se a instrução for instrumentada com sucesso, uma nova linha é adicionada à tabela [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table"). Se a instrução não puder ser instrumentada, a variável de status [`Performance_schema_prepared_statements_lost`](performance-schema-status-variables.html#statvar_Performance_schema_prepared_statements_lost) é incrementada.

* Execução de Prepared Statement

  A execução de um comando `COM_STMT_EXECUTE` ou `SQLCOM_PREPARE` para uma instância de prepared statement instrumentada atualiza a linha correspondente da tabela [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table").

* Desalocação de Prepared Statement

  A execução de um comando `COM_STMT_CLOSE` ou `SQLCOM_DEALLOCATE_PREPARE` para uma instância de prepared statement instrumentada remove a linha correspondente da tabela [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table"). Para evitar vazamentos de recursos (resource leaks), a remoção ocorre mesmo que os instrumentos de prepared statement descritos anteriormente estejam desabilitados.

A tabela [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table") possui estas colunas:

* `OBJECT_INSTANCE_BEGIN`

  O endereço na memória do prepared statement instrumentado.

* `STATEMENT_ID`

  O ID interno do statement atribuído pelo servidor. Os protocolos de texto e binário usam statement IDs.

* `STATEMENT_NAME`

  Para o protocolo binário, esta coluna é `NULL`. Para o protocolo de texto, esta coluna é o nome externo do statement atribuído pelo usuário. Por exemplo, para a seguinte instrução SQL, o nome do prepared statement é `stmt`:

  ```sql
  PREPARE stmt FROM 'SELECT 1';
  ```

* `SQL_TEXT`

  O texto do prepared statement, com marcadores placeholder `?`.

* `OWNER_THREAD_ID`, `OWNER_EVENT_ID`

  Estas colunas indicam o evento que criou o prepared statement.

* `OWNER_OBJECT_TYPE`, `OWNER_OBJECT_SCHEMA`, `OWNER_OBJECT_NAME`

  Para um prepared statement criado por uma sessão cliente, estas colunas são `NULL`. Para um prepared statement criado por um stored program, estas colunas apontam para o stored program. Um erro comum do usuário é esquecer de desalocar prepared statements. Estas colunas podem ser usadas para encontrar stored programs que vazam prepared statements:

  ```sql
  SELECT
    OWNER_OBJECT_TYPE, OWNER_OBJECT_SCHEMA, OWNER_OBJECT_NAME,
    STATEMENT_NAME, SQL_TEXT
  FROM performance_schema.prepared_statements_instances
  WHERE OWNER_OBJECT_TYPE IS NOT NULL;
  ```

* `TIMER_PREPARE`

  O tempo gasto executando a preparação da instrução em si.

* `COUNT_REPREPARE`

  O número de vezes que a instrução foi reprepared internamente (consulte [Section 8.10.4, “Caching of Prepared Statements and Stored Programs”](statement-caching.html "8.10.4 Caching of Prepared Statements and Stored Programs")). As estatísticas de tempo para repreparation não estão disponíveis porque é contada como parte da execução da instrução, e não como uma operação separada.

* `COUNT_EXECUTE`, `SUM_TIMER_EXECUTE`, `MIN_TIMER_EXECUTE`, `AVG_TIMER_EXECUTE`, `MAX_TIMER_EXECUTE`

  Estatísticas agregadas para execuções do prepared statement.

* `SUM_xxx`

  As colunas `SUM_xxx` restantes são as mesmas das tabelas de resumo de statement (consulte [Section 25.12.15.3, “Statement Summary Tables”](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables")).

O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") redefine as colunas de estatísticas da tabela [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table").