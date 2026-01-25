#### 13.7.5.40 Instrução SHOW WARNINGS

```sql
SHOW WARNINGS [LIMIT [offset,] row_count]
SHOW COUNT(*) WARNINGS
```

`SHOW WARNINGS` é uma instrução de diagnóstico que exibe informações sobre as condições (errors, warnings e notes) resultantes da execução de uma instrução na sessão atual. Warnings são gerados para instruções DML como `INSERT`, `UPDATE` e `LOAD DATA`, bem como para instruções DDL como `CREATE TABLE` e `ALTER TABLE`.

A cláusula `LIMIT` possui a mesma sintaxe da instrução `SELECT`. Consulte [Section 13.2.9, “SELECT Statement”](select.html "13.2.9 SELECT Statement").

`SHOW WARNINGS` também é usado após `EXPLAIN`, para exibir a informação estendida gerada por `EXPLAIN`. Consulte [Section 8.8.3, “Extended EXPLAIN Output Format”](explain-extended.html "8.8.3 Extended EXPLAIN Output Format").

`SHOW WARNINGS` exibe informações sobre as condições resultantes da execução da instrução não-diagnóstica mais recente na sessão atual. Se a instrução mais recente resultou em um error durante o parsing, `SHOW WARNINGS` mostra as condições resultantes, independentemente do tipo de instrução (diagnóstica ou não-diagnóstica).

A instrução de diagnóstico `SHOW COUNT(*) WARNINGS` exibe o número total de errors, warnings e notes. Você também pode recuperar este número a partir da variável de sistema `warning_count`:

```sql
SHOW COUNT(*) WARNINGS;
SELECT @@warning_count;
```

Uma diferença nessas instruções é que a primeira é uma instrução de diagnóstico que não limpa a lista de mensagens. A segunda, por ser uma instrução `SELECT`, é considerada não-diagnóstica e limpa a lista de mensagens.

Uma instrução de diagnóstico relacionada, `SHOW ERRORS`, mostra apenas condições de error (exclui warnings e notes), e a instrução `SHOW COUNT(*) ERRORS` exibe o número total de errors. Consulte [Section 13.7.5.17, “SHOW ERRORS Statement”](show-errors.html "13.7.5.17 SHOW ERRORS Statement"). `GET DIAGNOSTICS` pode ser usada para examinar informações de condições individuais. Consulte [Section 13.6.7.3, “GET DIAGNOSTICS Statement”](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement").

Aqui está um exemplo simples que mostra warnings de conversão de dados para `INSERT`. O exemplo assume que o modo strict SQL está desabilitado. Com o modo strict habilitado, os warnings se tornariam errors e encerrariam o `INSERT`.

```sql
mysql> CREATE TABLE t1 (a TINYINT NOT NULL, b CHAR(4));
Query OK, 0 rows affected (0.05 sec)

mysql> INSERT INTO t1 VALUES(10,'mysql'), (NULL,'test'), (300,'xyz');
Query OK, 3 rows affected, 3 warnings (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 3

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 1265
Message: Data truncated for column 'b' at row 1
*************************** 2. row ***************************
  Level: Warning
   Code: 1048
Message: Column 'a' cannot be null
*************************** 3. row ***************************
  Level: Warning
   Code: 1264
Message: Out of range value for column 'a' at row 3
3 rows in set (0.00 sec)
```

A variável de sistema `max_error_count` controla o número máximo de mensagens de error, warning e note para as quais o servidor armazena informação, e, portanto, o número de mensagens que `SHOW WARNINGS` exibe. Para alterar o número de mensagens que o servidor pode armazenar, altere o valor de `max_error_count`. O padrão é 64.

`max_error_count` controla apenas quantas mensagens são armazenadas, e não quantas são contadas. O valor de `warning_count` não é limitado por `max_error_count`, mesmo que o número de mensagens geradas exceda `max_error_count`. O exemplo a seguir demonstra isso. A instrução `ALTER TABLE` produz três mensagens de warning (o modo strict SQL está desabilitado para que o exemplo evite a ocorrência de um error após um único problema de conversão). Apenas uma mensagem é armazenada e exibida porque `max_error_count` foi definido como 1, mas todas as três são contadas (como mostrado pelo valor de `warning_count`):

```sql
mysql> SHOW VARIABLES LIKE 'max_error_count';
+-----------------+-------+
| Variable_name   | Value |
+-----------------+-------+
| max_error_count | 64    |
+-----------------+-------+
1 row in set (0.00 sec)

mysql> SET max_error_count=1, sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

mysql> ALTER TABLE t1 MODIFY b CHAR;
Query OK, 3 rows affected, 3 warnings (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 3

mysql> SHOW WARNINGS;
+---------+------+----------------------------------------+
| Level   | Code | Message                                |
+---------+------+----------------------------------------+
| Warning | 1263 | Data truncated for column 'b' at row 1 |
+---------+------+----------------------------------------+
1 row in set (0.00 sec)

mysql> SELECT @@warning_count;
+-----------------+
| @@warning_count |
+-----------------+
|               3 |
+-----------------+
1 row in set (0.01 sec)
```

Para desabilitar o armazenamento de mensagens, defina `max_error_count` como 0. Neste caso, `warning_count` ainda indica quantos warnings ocorreram, mas as mensagens não são armazenadas e não podem ser exibidas.

A variável de sistema `sql_notes` controla se as mensagens de note incrementam `warning_count` e se o servidor as armazena. Por padrão, `sql_notes` é 1, mas se for definida como 0, notes não incrementam `warning_count` e o servidor não as armazena:

```sql
mysql> SET sql_notes = 1;
mysql> DROP TABLE IF EXISTS test.no_such_table;
Query OK, 0 rows affected, 1 warning (0.00 sec)
mysql> SHOW WARNINGS;
+-------+------+------------------------------------+
| Level | Code | Message                            |
+-------+------+------------------------------------+
| Note  | 1051 | Unknown table 'test.no_such_table' |
+-------+------+------------------------------------+
1 row in set (0.00 sec)

mysql> SET sql_notes = 0;
mysql> DROP TABLE IF EXISTS test.no_such_table;
Query OK, 0 rows affected (0.00 sec)
mysql> SHOW WARNINGS;
Empty set (0.00 sec)
```

O servidor MySQL envia para cada cliente uma contagem indicando o número total de errors, warnings e notes resultantes da instrução mais recente executada por aquele cliente. Na C API, este valor pode ser obtido chamando `mysql_warning_count()`. Consulte [mysql_warning_count()](/doc/c-api/5.7/en/mysql-warning-count.html).

No cliente **mysql**, você pode habilitar e desabilitar a exibição automática de warnings usando os comandos `warnings` e `nowarning`, respectivamente, ou seus atalhos, `\W` e `\w` (consulte [Section 4.5.1.2, “mysql Client Commands”](mysql-commands.html "4.5.1.2 mysql Client Commands")). Por exemplo:

```sql
mysql> \W
Show warnings enabled.
mysql> SELECT 1/0;
+------+
| 1/0  |
+------+
| NULL |
+------+
1 row in set, 1 warning (0.03 sec)

Warning (Code 1365): Division by 0
mysql> \w
Show warnings disabled.
```