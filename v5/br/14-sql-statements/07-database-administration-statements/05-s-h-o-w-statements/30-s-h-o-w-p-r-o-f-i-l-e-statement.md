#### 13.7.5.30 Instrução SHOW PROFILE

```sql
SHOW PROFILE [type [, type] ... ]
    [FOR QUERY n]
    [LIMIT row_count [OFFSET offset

type: {
    ALL
  | BLOCK IO
  | CONTEXT SWITCHES
  | CPU
  | IPC
  | MEMORY
  | PAGE FAULTS
  | SOURCE
  | SWAPS
}
```

As instruções [`SHOW PROFILE`](show-profile.html "13.7.5.30 SHOW PROFILE Statement") e [`SHOW PROFILES`](show-profiles.html "13.7.5.31 SHOW PROFILES Statement") exibem informações de profiling que indicam o uso de recursos para instruções executadas durante a sessão atual.

Nota

As instruções [`SHOW PROFILE`](show-profile.html "13.7.5.30 SHOW PROFILE Statement") e [`SHOW PROFILES`](show-profiles.html "13.7.5.31 SHOW PROFILES Statement") estão descontinuadas (deprecated); espere que elas sejam removidas em uma futura versão do MySQL. Use o [Performance Schema](performance-schema.html "Chapter 25 MySQL Performance Schema") em seu lugar; consulte [Seção 25.19.1, “Query Profiling Using Performance Schema”](performance-schema-query-profiling.html "25.19.1 Query Profiling Using Performance Schema").

Para controlar o profiling, use a variável de sessão [`profiling`](server-system-variables.html#sysvar_profiling), que tem um valor padrão de 0 (`OFF`). Habilite o profiling definindo [`profiling`](server-system-variables.html#sysvar_profiling) como 1 ou `ON`:

```sql
mysql> SET profiling = 1;
```

[`SHOW PROFILES`](show-profiles.html "13.7.5.31 SHOW PROFILES Statement") exibe uma lista das instruções mais recentes enviadas ao server. O tamanho da lista é controlado pela variável de sessão [`profiling_history_size`](server-system-variables.html#sysvar_profiling_history_size), que tem um valor padrão de 15. O valor máximo é 100. Definir o valor como 0 tem o efeito prático de desabilitar o profiling.

Todas as instruções são profiled, exceto [`SHOW PROFILE`](show-profile.html "13.7.5.30 SHOW PROFILE Statement") e [`SHOW PROFILES`](show-profiles.html "13.7.5.31 SHOW PROFILES Statement"), portanto, nenhuma dessas instruções aparece na lista de profile. Instruções malformadas são profiled. Por exemplo, `SHOW PROFILING` é uma instrução ilegal, e um erro de sintaxe ocorre se você tentar executá-la, mas ela aparece na lista de profiling.

[`SHOW PROFILE`](show-profile.html "13.7.5.30 SHOW PROFILE Statement") exibe informações detalhadas sobre uma única instrução. Sem a cláusula `FOR QUERY n`, a saída se refere à instrução executada mais recentemente. Se `FOR QUERY n` for incluída, [`SHOW PROFILE`](show-profile.html "13.7.5.30 SHOW PROFILE Statement") exibe informações para a instrução *`n`*. Os valores de *`n`* correspondem aos valores de `Query_ID` exibidos por [`SHOW PROFILES`](show-profiles.html "13.7.5.31 SHOW PROFILES Statement").

A cláusula `LIMIT row_count` pode ser fornecida para limitar a saída a *`row_count`* linhas. Se `LIMIT` for fornecido, `OFFSET offset` pode ser adicionado para iniciar a saída *`offset`* linhas no conjunto completo de linhas.

Por padrão, [`SHOW PROFILE`](show-profile.html "13.7.5.30 SHOW PROFILE Statement") exibe as colunas `Status` e `Duration`. Os valores de `Status` são semelhantes aos valores de `State` exibidos por [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"), embora possa haver algumas pequenas diferenças de interpretação para as duas instruções em relação a alguns valores de status (consulte [Seção 8.14, “Examining Server Thread (Process) Information”](thread-information.html "8.14 Examining Server Thread (Process) Information")).

Valores *`type`* opcionais podem ser especificados para exibir tipos adicionais específicos de informação:

* `ALL` exibe todas as informações
* `BLOCK IO` exibe contagens para operações de input e output de bloco

* `CONTEXT SWITCHES` exibe contagens para trocas de contexto voluntárias e involuntárias

* `CPU` exibe tempos de uso de CPU do usuário e do sistema

* `IPC` exibe contagens para mensagens enviadas e recebidas

* `MEMORY` não está implementado atualmente
* `PAGE FAULTS` exibe contagens para falhas de página maiores e menores

* `SOURCE` exibe os nomes de funções do código-fonte, juntamente com o nome e o número da linha do arquivo no qual a função ocorre

* `SWAPS` exibe contagens de swap

O profiling é habilitado por sessão. Quando uma sessão termina, suas informações de profiling são perdidas.

```sql
mysql> SELECT @@profiling;
+-------------+
| @@profiling |
+-------------+
|           0 |
+-------------+
1 row in set (0.00 sec)

mysql> SET profiling = 1;
Query OK, 0 rows affected (0.00 sec)

mysql> DROP TABLE IF EXISTS t1;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> CREATE TABLE T1 (id INT);
Query OK, 0 rows affected (0.01 sec)

mysql> SHOW PROFILES;
+----------+----------+--------------------------+
| Query_ID | Duration | Query                    |
+----------+----------+--------------------------+
|        0 | 0.000088 | SET PROFILING = 1        |
|        1 | 0.000136 | DROP TABLE IF EXISTS t1  |
|        2 | 0.011947 | CREATE TABLE t1 (id INT) |
+----------+----------+--------------------------+
3 rows in set (0.00 sec)

mysql> SHOW PROFILE;
+----------------------+----------+
| Status               | Duration |
+----------------------+----------+
| checking permissions | 0.000040 |
| creating table       | 0.000056 |
| After create         | 0.011363 |
| query end            | 0.000375 |
| freeing items        | 0.000089 |
| logging slow query   | 0.000019 |
| cleaning up          | 0.000005 |
+----------------------+----------+
7 rows in set (0.00 sec)

mysql> SHOW PROFILE FOR QUERY 1;
+--------------------+----------+
| Status             | Duration |
+--------------------+----------+
| query end          | 0.000107 |
| freeing items      | 0.000008 |
| logging slow query | 0.000015 |
| cleaning up        | 0.000006 |
+--------------------+----------+
4 rows in set (0.00 sec)

mysql> SHOW PROFILE CPU FOR QUERY 2;
+----------------------+----------+----------+------------+
| Status               | Duration | CPU_user | CPU_system |
+----------------------+----------+----------+------------+
| checking permissions | 0.000040 | 0.000038 |   0.000002 |
| creating table       | 0.000056 | 0.000028 |   0.000028 |
| After create         | 0.011363 | 0.000217 |   0.001571 |
| query end            | 0.000375 | 0.000013 |   0.000028 |
| freeing items        | 0.000089 | 0.000010 |   0.000014 |
| logging slow query   | 0.000019 | 0.000009 |   0.000010 |
| cleaning up          | 0.000005 | 0.000003 |   0.000002 |
+----------------------+----------+----------+------------+
7 rows in set (0.00 sec)
```

Nota

O profiling é apenas parcialmente funcional em algumas arquiteturas. Para valores que dependem da system call `getrusage()`, `NULL` é retornado em sistemas como Windows que não suportam a chamada. Além disso, o profiling é por process e não por thread. Isso significa que a atividade em threads dentro do server, diferente da sua própria, pode afetar as informações de timing que você vê.

As informações de profiling também estão disponíveis na tabela [`PROFILING`](information-schema-profiling-table.html "24.3.19 The INFORMATION_SCHEMA PROFILING Table") do `INFORMATION_SCHEMA`. Consulte [Seção 24.3.19, “The INFORMATION_SCHEMA PROFILING Table”](information-schema-profiling-table.html "24.3.19 The INFORMATION_SCHEMA PROFILING Table"). Por exemplo, as seguintes queries são equivalentes:

```sql
SHOW PROFILE FOR QUERY 2;

SELECT STATE, FORMAT(DURATION, 6) AS DURATION
FROM INFORMATION_SCHEMA.PROFILING
WHERE QUERY_ID = 2 ORDER BY SEQ;
```
