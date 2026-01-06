#### 26.4.4.25 Procedimento statement\_performance\_analyzer()

Cria um relatório das declarações em execução no servidor. As visualizações são calculadas com base na atividade geral e/ou delta.

Esse procedimento desabilita o registro binário durante sua execução, manipulando o valor da sessão da variável de sistema `sql_log_bin`. Essa é uma operação restrita, portanto, o procedimento requer privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

##### Parâmetros

- `in_action ENUM('snapshot', 'geral', 'delta', 'create_tmp', 'create_table', 'salvar', 'limpar')`: A ação a ser realizada. Esses valores são permitidos:

  - `snapshot`: Armazenar um instantâneo. O padrão é criar um instantâneo do conteúdo atual da tabela `events_statements_summary_by_digest` do Schema de Desempenho. Ao definir `in_table`, isso pode ser sobrescrito para copiar o conteúdo da tabela especificada. O instantâneo é armazenado na tabela temporária `tmp_digests` do esquema `sys`.

  - `overall`: Gerar uma análise com base no conteúdo da tabela especificada por `in_table`. Para a análise geral, `in_table` pode ser `NOW()` para usar uma instantânea recente. Isso sobrescreve uma instantânea existente. Use `NULL` para `in_table` para usar a instantânea existente. Se `in_table` for `NULL` e não existir nenhuma instantânea, uma nova instantânea é criada. O parâmetro `in_views` e a opção de configuração `statement_performance_analyzer.limit` afetam o funcionamento deste procedimento.

  - `delta`: Gerar uma análise delta. O delta é calculado entre a tabela de referência especificada por `in_table` e o instantâneo, que deve existir. Esta ação utiliza a tabela temporária `sys` `tmp_digests_delta`. Os parâmetros `in_views` e a opção de configuração `statement_performance_analyzer.limit` afetam o funcionamento deste procedimento.

  - `create_table`: Crie uma tabela regular adequada para armazenar o instantâneo para uso posterior (por exemplo, para calcular deltas).

  - `create_tmp`: Crie uma tabela temporária adequada para armazenar o instantâneo para uso posterior (por exemplo, para calcular deltas).

  - `salvar`: Salve o instantâneo na tabela especificada por `in_table`. A tabela deve existir e ter a estrutura correta. Se não existir nenhum instantâneo, um novo instantâneo será criado.

  - `cleanup`: Remova as tabelas temporárias usadas para o instantâneo e o delta.

- `in_table VARCHAR(129)`: O parâmetro de tabela usado para algumas das ações especificadas pelo parâmetro `in_action`. Use o formato *`db_name.tbl_name`* ou *`tbl_name`* sem usar caracteres de citação de identificadores com barra invertida (\`\`\`). Os pontos (`.`) não são suportados em nomes de banco de dados e tabelas.

  O significado do valor `in_table` para cada valor `in_action` está detalhado nas descrições individuais dos valores `in_action`.

- `in_views SET ('com_runtimes_no_95º percentil', 'análise', 'com_erros_ou_alertas', 'com_pesquisas_de_tabela_inteiras', 'com_classificação', 'com_tabelas_temporárias', 'personalizado')`: Quais vistas incluir. Este parâmetro é um valor `SET`, portanto, pode conter vários nomes de vistas, separados por vírgulas. O padrão é incluir todas as vistas, exceto `personalizado`. Os seguintes valores são permitidos:

  - `with_runtimes_in_95th_percentile`: Use a visualização `statements_with_runtimes_in_95th_percentile`.

  - `analysis`: Use a visualização `statement_analysis`.

  - `with_errors_or_warnings`: Use a visualização `statements_with_errors_or_warnings`.

  - `with_full_table_scans`: Use a visualização `statements_with_full_table_scans`.

  - `with_sorting`: Use a visualização `statements_with_sorting`.

  - `with_temp_tables`: Use a visualização `statements_with_temp_tables`.

  - `custom`: Use uma visualização personalizada. Essa visualização deve ser especificada usando a opção de configuração `statement_performance_analyzer.view` para nomear uma consulta ou uma visualização existente.

##### Opções de configuração

A operação `statement_performance_analyzer()` pode ser modificada usando as seguintes opções de configuração ou suas variáveis definidas pelo usuário correspondentes (consulte a Seção 26.4.2.1, "A Tabela sys\_config"):

- `debug`, `@sys.debug`

  Se esta opção estiver ativada, será gerado o output de depuração. O padrão é `OFF`.

- `statement_performance_analyzer.limit`, `@sys.statement_performance_analyzer.limit`

  O número máximo de linhas a serem retornadas para visualizações que não têm um limite embutido. O padrão é 100.

- `statement_performance_analyzer.view`, `@sys.statement_performance_analyzer.view`

  A consulta ou visualização personalizada a ser usada. Se o valor da opção contiver um espaço, ela é interpretada como uma consulta. Caso contrário, deve ser o nome de uma visualização existente que consulta a tabela `events_statements_summary_by_digest` do Schema de Desempenho. Não pode haver nenhuma cláusula `LIMIT` na definição da consulta ou visualização se a opção de configuração `statement_performance_analyzer.limit` for maior que 0. Se estiver especificando uma visualização, use o mesmo formato que para o parâmetro `in_table`. O padrão é `NULL` (nenhuma visualização personalizada definida).

##### Exemplo

Para criar um relatório com as consultas no 95º percentil desde a última truncação de `events_statements_summary_by_digest` e com um período de delta de um minuto:

1. Crie uma tabela temporária para armazenar o instantâneo inicial.
2. Crie o instantâneo inicial.
3. Salve o instantâneo inicial na tabela temporária.
4. Aguarde um minuto.
5. Crie um novo instantâneo.
6. Realize a análise com base no novo instantâneo.
7. Realize análises com base no delta entre as instantâneas iniciais e as novas.

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

Crie um relatório geral das consultas do 95º percentil e das 10 principais consultas com varreduras completas da tabela:

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

Use uma visualização personalizada que mostre as 10 consultas mais frequentes, classificadas pelo tempo total de execução, atualizando a visualização a cada minuto usando o comando **watch** no Linux:

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
