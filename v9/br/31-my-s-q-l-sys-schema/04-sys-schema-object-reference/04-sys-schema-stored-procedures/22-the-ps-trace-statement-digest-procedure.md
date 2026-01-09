#### 30.4.4.22 O procedimento ps_trace_statement_digest()

Traça toda a instrumentação do Performance Schema para um digest específico de uma declaração.

Se você encontrar uma declaração de interesse na tabela `events_statements_summary_by_digest` do Performance Schema, especifique o valor da coluna `DIGEST` MD5 dessa declaração e indique a duração e o intervalo de pesquisa. O resultado é um relatório de todas as estatísticas rastreadas no Performance Schema para esse digest durante o intervalo.

O procedimento também tenta executar `EXPLAIN` para o exemplo mais longo do digest durante o intervalo. Essa tentativa pode falhar porque o Performance Schema corta valores longos de `SQL_TEXT`. Consequentemente, `EXPLAIN` falha devido a erros de parse.

Este procedimento desabilita o registro binário durante sua execução manipulando o valor da sessão da variável de sistema `sql_log_bin`. Essa é uma operação restrita, portanto, o procedimento requer privilégios suficientes para definir variáveis de sessão restritas. Veja a Seção 7.1.9.1, “Privilégios de variáveis de sistema”.

##### Parâmetros

* `in_digest VARCHAR(32)`: O identificador do digest da declaração a ser analisada.

* `in_runtime INT`: Quanto tempo a análise deve durar em segundos.

* `in_interval DECIMAL(2,2)`: O intervalo de análise em segundos (que pode ser fracionário) em que tentar fazer instantâneos.

* `in_start_fresh BOOLEAN`: Se os valores das tabelas `events_statements_history_long` e `events_stages_history_long` do Performance Schema devem ser truncados antes de começar.

* `in_auto_enable BOOLEAN`: Se os consumidores necessários devem ser habilitados automaticamente.

##### Exemplo

```
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
| stage/sql/init                           | 331.07 ns |
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