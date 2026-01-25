#### 26.4.4.25 O Procedimento statement_performance_analyzer()

Cria um relatório das statements (instruções) sendo executadas no servidor. As views são calculadas com base na atividade geral (overall) e/ou Delta.

Este procedimento desabilita o binary logging durante sua execução ao manipular o valor de sessão da variável de sistema `sql_log_bin`. Essa é uma operação restrita, portanto, o procedimento requer privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

##### Parâmetros

* `in_action ENUM('snapshot', 'overall', 'delta', 'create_tmp', 'create_table', 'save', 'cleanup')`: A ação a ser executada. Estes valores são permitidos:

  + `snapshot`: Armazena um snapshot. O padrão é criar um snapshot do conteúdo atual da tabela `events_statements_summary_by_digest` do Performance Schema. Ao definir `in_table`, isso pode ser sobrescrito para copiar o conteúdo da tabela especificada. O snapshot é armazenado na tabela temporária `tmp_digests` do schema `sys`.

  + `overall`: Gera uma análise baseada no conteúdo da tabela especificada por `in_table`. Para a análise overall, `in_table` pode ser `NOW()` para usar um snapshot recente. Isso sobrescreve um snapshot existente. Use `NULL` para `in_table` para usar o snapshot existente. Se `in_table` for `NULL` e não houver um snapshot existente, um novo snapshot é criado. O parâmetro `in_views` e a opção de configuração `statement_performance_analyzer.limit` afetam a operação deste procedimento.

  + `delta`: Gera uma análise Delta. O Delta é calculado entre a tabela de referência especificada por `in_table` e o snapshot, que deve existir. Esta ação usa a tabela temporária `tmp_digests_delta` do schema `sys`. O parâmetro `in_views` e a opção de configuração `statement_performance_analyzer.limit` afetam a operação deste procedimento.

  + `create_table`: Cria uma tabela regular adequada para armazenar o snapshot para uso posterior (por exemplo, para calcular Deltas).

  + `create_tmp`: Cria uma tabela temporária adequada para armazenar o snapshot para uso posterior (por exemplo, para calcular Deltas).

  + `save`: Salva o snapshot na tabela especificada por `in_table`. A tabela deve existir e ter a estrutura correta. Se não houver snapshot, um novo snapshot é criado.

  + `cleanup`: Remove as tabelas temporárias usadas para o snapshot e o Delta.

* `in_table VARCHAR(129)`: O parâmetro de tabela usado para algumas das ações especificadas pelo parâmetro `in_action`. Use o formato *`db_name.tbl_name`* ou *`tbl_name`* sem usar quaisquer caracteres de aspas de identificador (`` ` ``). Pontos (`.`) não são suportados em nomes de Database e tabela.

  O significado do valor de `in_table` para cada valor de `in_action` é detalhado nas descrições individuais dos valores de `in_action`.

* `in_views SET ('with_runtimes_in_95th_percentile', 'analysis', 'with_errors_or_warnings', 'with_full_table_scans', 'with_sorting', 'with_temp_tables', 'custom')`: Quais views incluir. Este parâmetro é um valor `SET`, podendo conter múltiplos nomes de view, separados por vírgulas. O padrão é incluir todas as views, exceto `custom`. Os seguintes valores são permitidos:

  + `with_runtimes_in_95th_percentile`: Usa a view `statements_with_runtimes_in_95th_percentile`.

  + `analysis`: Usa a view `statement_analysis`.

  + `with_errors_or_warnings`: Usa a view `statements_with_errors_or_warnings`.

  + `with_full_table_scans`: Usa a view `statements_with_full_table_scans`.

  + `with_sorting`: Usa a view `statements_with_sorting`.

  + `with_temp_tables`: Usa a view `statements_with_temp_tables`.

  + `custom`: Usa uma view customizada. Esta view deve ser especificada usando a opção de configuração `statement_performance_analyzer.view` para nomear uma Query ou uma view existente.

##### Opções de Configuração

A operação do Procedimento `statement_performance_analyzer()` pode ser modificada usando as seguintes opções de configuração ou suas variáveis definidas pelo usuário correspondentes (consulte a Seção 26.4.2.1, “A Tabela sys_config”):

* `debug`, `@sys.debug`

  Se esta opção for `ON`, produz saída de debug. O padrão é `OFF`.

* `statement_performance_analyzer.limit`, `@sys.statement_performance_analyzer.limit`

  O número máximo de linhas a retornar para views que não possuem um limit integrado. O padrão é 100.

* `statement_performance_analyzer.view`, `@sys.statement_performance_analyzer.view`

  A Query ou view customizada a ser usada. Se o valor da opção contiver um espaço, ele será interpretado como uma Query. Caso contrário, deve ser o nome de uma view existente que consulta a tabela `events_statements_summary_by_digest` do Performance Schema. Não pode haver uma cláusula `LIMIT` na definição da Query ou view se a opção de configuração `statement_performance_analyzer.limit` for maior que 0. Se estiver especificando uma view, use o mesmo formato que para o parâmetro `in_table`. O padrão é `NULL` (nenhuma view customizada definida).

##### Exemplo

Para criar um relatório com as Queries no 95º percentil desde o último truncamento de `events_statements_summary_by_digest` e com um período Delta de um minuto:

1. Cria uma tabela temporária para armazenar o snapshot inicial.
2. Cria o snapshot inicial.
3. Salva o snapshot inicial na tabela temporária.
4. Espera um minuto.
5. Cria um novo snapshot.
6. Executa a análise baseada no novo snapshot.
7. Executa a análise baseada no Delta entre os snapshots inicial e novo.

```sql
mysql> CALL sys.statement_performance_analyzer('create_tmp', 'mydb.tmp_digests_ini', NULL);
Query OK, 0 rows affected (0.08 sec)

mysql> CALL sys.statement_performance_analyzer('snapshot', NULL, NULL);
Query OK, 0 rows affected (0.02 sec)

mysql> CALL sys.statement_performance_analyzer('save', 'mydb.tmp_digests_ini', NULL);
Query OK, 0 rows affected (0.00 sec)

mysql> DO SLEEP(60);
Query OK, 0 rows affected (1 min 0.00 sec)

mysql> CALL sys.statement_performance_analyzer('snapshot', NULL, NULL);
Query OK, 0 rows affected (0.02 sec)

mysql> CALL sys.statement_performance_analyzer('overall', NULL, 'with_runtimes_in_95th_percentile');
+-----------------------------------------+
| Next Output                             |
+-----------------------------------------+
| Queries with Runtime in 95th Percentile |
+-----------------------------------------+
1 row in set (0.05 sec)

...

mysql> CALL sys.statement_performance_analyzer('delta', 'mydb.tmp_digests_ini', 'with_runtimes_in_95th_percentile');
+-----------------------------------------+
| Next Output                             |
+-----------------------------------------+
| Queries with Runtime in 95th Percentile |
+-----------------------------------------+
1 row in set (0.03 sec)

...
```

Cria um relatório overall das Queries do 95º percentil e as 10 principais Queries com full table scans:

```sql
mysql> CALL sys.statement_performance_analyzer('snapshot', NULL, NULL);
Query OK, 0 rows affected (0.01 sec)

mysql> SET @sys.statement_performance_analyzer.limit = 10;
Query OK, 0 rows affected (0.00 sec)

mysql> CALL sys.statement_performance_analyzer('overall', NULL, 'with_runtimes_in_95th_percentile,with_full_table_scans');
+-----------------------------------------+
| Next Output                             |
+-----------------------------------------+
| Queries with Runtime in 95th Percentile |
+-----------------------------------------+
1 row in set (0.01 sec)

...

+-------------------------------------+
| Next Output                         |
+-------------------------------------+
| Top 10 Queries with Full Table Scan |
+-------------------------------------+
1 row in set (0.09 sec)

...
```

Use uma view customizada mostrando as 10 principais Queries ordenadas pelo tempo total de execução, atualizando a view a cada minuto usando o comando **watch** no Linux:

```sql
mysql> CREATE OR REPLACE VIEW mydb.my_statements AS
       SELECT sys.format_statement(DIGEST_TEXT) AS query,
              SCHEMA_NAME AS db,
              COUNT_STAR AS exec_count,
              sys.format_time(SUM_TIMER_WAIT) AS total_latency,
              sys.format_time(AVG_TIMER_WAIT) AS avg_latency,
              ROUND(IFNULL(SUM_ROWS_SENT / NULLIF(COUNT_STAR, 0), 0)) AS rows_sent_avg,
              ROUND(IFNULL(SUM_ROWS_EXAMINED / NULLIF(COUNT_STAR, 0), 0)) AS rows_examined_avg,
              ROUND(IFNULL(SUM_ROWS_AFFECTED / NULLIF(COUNT_STAR, 0), 0)) AS rows_affected_avg,
              DIGEST AS digest
         FROM performance_schema.events_statements_summary_by_digest
       ORDER BY SUM_TIMER_WAIT DESC;
Query OK, 0 rows affected (0.10 sec)

mysql> CALL sys.statement_performance_analyzer('create_table', 'mydb.digests_prev', NULL);
Query OK, 0 rows affected (0.10 sec)

$> watch -n 60 "mysql sys --table -e \"
> SET @sys.statement_performance_analyzer.view = 'mydb.my_statements';
> SET @sys.statement_performance_analyzer.limit = 10;
> CALL statement_performance_analyzer('snapshot', NULL, NULL);
> CALL statement_performance_analyzer('delta', 'mydb.digests_prev', 'custom');
> CALL statement_performance_analyzer('save', 'mydb.digests_prev', NULL);
> \""

Every 60.0s: mysql sys --table -e "        ...  Mon Dec 22 10:58:51 2014

+----------------------------------+
| Next Output                      |
+----------------------------------+
| Top 10 Queries Using Custom View |
+----------------------------------+
+-------------------+-------+------------+---------------+-------------+---------------+-------------------+-------------------+----------------------------------+
| query             | db    | exec_count | total_latency | avg_latency | rows_sent_avg | rows_examined_avg | rows_affected_avg | digest                           |
+-------------------+-------+------------+---------------+-------------+---------------+-------------------+-------------------+----------------------------------+
...
```