#### 26.4.4.22 O Procedimento ps_trace_statement_digest()

Rastreia toda a instrumentação do Performance Schema para um *statement digest* específico.

Se você encontrar uma instrução de interesse na tabela `events_statements_summary_by_digest` do Performance Schema, especifique o valor MD5 da coluna `DIGEST` para este procedimento e indique a duração e o intervalo de *polling*. O resultado é um relatório de todas as estatísticas rastreadas no Performance Schema para aquele *digest* durante o intervalo.

O procedimento também tenta executar `EXPLAIN` para o exemplo de execução mais longa do *digest* durante o intervalo. Essa tentativa pode falhar porque o Performance Schema trunca valores longos de `SQL_TEXT`. Consequentemente, o `EXPLAIN` falha devido a erros de *parse*.

Este procedimento desabilita o *binary logging* durante sua execução manipulando o valor de sessão da *system variable* `sql_log_bin`. Essa é uma operação restrita, portanto, o procedimento requer privilégios suficientes para definir *session variables* restritas. Consulte a Seção 5.1.8.1, “System Variable Privileges”.

##### Parâmetros

* `in_digest VARCHAR(32)`: O identificador do *statement digest* a ser analisado.

* `in_runtime INT`: Por quanto tempo executar a análise, em segundos.

* `in_interval DECIMAL(2,2)`: O intervalo de análise em segundos (que pode ser fracionário) no qual tentar tirar *snapshots*.

* `in_start_fresh BOOLEAN`: Se deve truncar as tabelas `events_statements_history_long` e `events_stages_history_long` do Performance Schema antes de iniciar.

* `in_auto_enable BOOLEAN`: Se deve habilitar automaticamente os *consumers* necessários.

##### Exemplo

```sql
mysql> CALL sys.ps_trace_statement_digest('891ec6860f98ba46d89dd20b0c03652c', 10, 0.1, TRUE, TRUE);
+--------------------+
| SUMMARY STATISTICS |
+--------------------+
| SUMMARY STATISTICS |
+--------------------+
1 row in set (9.11 sec)

+------------+-----------+-----------+-----------+---------------+------------+------------+
| executions | exec_time | lock_time | rows_sent | rows_examined | tmp_tables | full_scans |
+------------+-----------+-----------+-----------+---------------+------------+------------+
|         21 | 4.11 ms   | 2.00 ms   |         0 |            21 |          0 |          0 |
+------------+-----------+-----------+-----------+---------------+------------+------------+
1 row in set (9.11 sec)

+------------------------------------------+-------+-----------+
| event_name                               | count | latency   |
+------------------------------------------+-------+-----------+
| stage/sql/checking query cache for query |    16 | 724.37 us |
| stage/sql/statistics                     |    16 | 546.92 us |
| stage/sql/freeing items                  |    18 | 520.11 us |
| stage/sql/init                           |    51 | 466.80 us |
...
| stage/sql/cleaning up                    |    18 | 11.92 us  |
| stage/sql/executing                      |    16 | 6.95 us   |
+------------------------------------------+-------+-----------+
17 rows in set (9.12 sec)

+---------------------------+
| LONGEST RUNNING STATEMENT |
+---------------------------+
| LONGEST RUNNING STATEMENT |
+---------------------------+
1 row in set (9.16 sec)

+-----------+-----------+-----------+-----------+---------------+------------+-----------+
| thread_id | exec_time | lock_time | rows_sent | rows_examined | tmp_tables | full_scan |
+-----------+-----------+-----------+-----------+---------------+------------+-----------+
|    166646 | 618.43 us | 1.00 ms   |         0 |             1 |          0 |         0 |
+-----------+-----------+-----------+-----------+---------------+------------+-----------+
1 row in set (9.16 sec)

# Truncated for clarity...
+-----------------------------------------------------------------+
| sql_text                                                        |
+-----------------------------------------------------------------+
| select hibeventhe0_.id as id1382_, hibeventhe0_.createdTime ... |
+-----------------------------------------------------------------+
1 row in set (9.17 sec)

+------------------------------------------+-----------+
| event_name                               | latency   |
+------------------------------------------+-----------+
| stage/sql/init                           | 8.61 us   |
| stage/sql/Waiting for query cache lock   | 453.23 us |
| stage/sql/init                           | 331.07 ns |
| stage/sql/checking query cache for query | 43.04 us  |
...
| stage/sql/freeing items                  | 30.46 us  |
| stage/sql/cleaning up                    | 662.13 ns |
+------------------------------------------+-----------+
18 rows in set (9.23 sec)

+----+-------------+--------------+-------+---------------+-----------+---------+-------------+------+-------+
| id | select_type | table        | type  | possible_keys | key       | key_len | ref         | rows | Extra |
+----+-------------+--------------+-------+---------------+-----------+---------+-------------+------+-------+
|  1 | SIMPLE      | hibeventhe0_ | const | fixedTime     | fixedTime | 775     | const,const |    1 | NULL  |
+----+-------------+--------------+-------+---------------+-----------+---------+-------------+------+-------+
1 row in set (9.27 sec)

Query OK, 0 rows affected (9.28 sec)
```