#### 15.7.7.43 Declaração de AVISOS

```
SHOW WARNINGS [LIMIT [offset,] row_count]
SHOW COUNT(*) WARNINGS
```

`SHOW WARNINGS` é uma declaração de diagnóstico que exibe informações sobre as condições (erros, avisos e notas) resultantes da execução de uma declaração na sessão atual. Os avisos são gerados para declarações DML, como `INSERT`, `UPDATE` e `LOAD DATA`, bem como para declarações DDL, como `CREATE TABLE` e `ALTER TABLE`.

A cláusula `LIMIT` tem a mesma sintaxe que a da declaração `SELECT`. Veja a Seção 15.2.13, “Declaração SELECT”.

`SHOW WARNINGS` também é usado após `EXPLAIN`, para exibir as informações extensas geradas por `EXPLAIN`. Veja a Seção 10.8.3, “Formato de Saída Extendida do EXPLAIN”.

`SHOW WARNINGS` exibe informações sobre as condições resultantes da execução da declaração mais recente não diagnóstica na sessão atual. Se a declaração mais recente resultou em um erro durante a análise, `SHOW WARNINGS` mostra as condições resultantes, independentemente do tipo da declaração (diagnóstica ou não diagnóstica).

A declaração de diagnóstico `SHOW COUNT(*) WARNINGS` exibe o número total de erros, avisos e notas. Você também pode recuperar esse número a partir da variável de sistema `warning_count`:

```
SHOW COUNT(*) WARNINGS;
SELECT @@warning_count;
```

A diferença nesses comandos é que o primeiro é um comando de diagnóstico que não limpa a lista de mensagens. O segundo, por ser uma declaração `SELECT`, é considerado não diagnóstica e limpa a lista de mensagens.

Uma declaração de diagnóstico relacionada, `SHOW ERRORS`, mostra apenas as condições de erro (exclui avisos e notas), e a declaração `SHOW COUNT(*) ERRORS` exibe o número total de erros. Veja a Seção 15.7.7.19, “Declaração SHOW ERRORS”. `GET DIAGNOSTICS` pode ser usado para examinar informações para condições individuais. Veja a Seção 15.6.7.3, “Declaração GET DIAGNOSTICS”.

Aqui está um exemplo simples que mostra avisos de conversão de dados para `INSERT`. O exemplo assume que o modo SQL rigoroso está desativado. Com o modo rigoroso ativado, os avisos se tornariam erros e terminariam o `INSERT`.

```
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

A variável de sistema `max_error_count` controla o número máximo de mensagens de erro, aviso e nota para as quais o servidor armazena informações, e, portanto, o número de mensagens que o `SHOW WARNINGS` exibe. Para alterar o número de mensagens que o servidor pode armazenar, altere o valor de `max_error_count`.

`max_error_count` controla apenas quantos mensagens são armazenadas, não quantos são contadas. O valor de `warning_count` não é limitado por `max_error_count`, mesmo que o número de mensagens geradas exceda `max_error_count`. O exemplo seguinte demonstra isso. A instrução `ALTER TABLE` produz três mensagens de aviso (o modo SQL rigoroso está desativado para o exemplo para evitar que um erro ocorra após um único problema de conversão). Apenas uma mensagem é armazenada e exibida porque `max_error_count` foi definido para 1, mas todas as três são contadas (como mostrado pelo valor de `warning_count`):

```
mysql> SHOW VARIABLES LIKE 'max_error_count';
+-----------------+-------+
| Variable_name   | Value |
+-----------------+-------+
| max_error_count | 1024  |
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

Para desativar o armazenamento de mensagens, defina `max_error_count` para 0. Neste caso, `warning_count` ainda indica quantos avisos ocorreram, mas as mensagens não são armazenadas e não podem ser exibidas.

A variável de sistema `sql_notes` controla se as mensagens de nota incrementam `warning_count` e se o servidor as armazena. Por padrão, `sql_notes` é 1, mas se definido para 0, as notas não incrementam `warning_count` e o servidor não as armazena:

```
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

O servidor MySQL envia a cada cliente um contador que indica o número total de erros, avisos e notas resultantes da declaração mais recente executada por esse cliente. A partir da API C, esse valor pode ser obtido chamando `mysql_warning_count()`. Veja mysql_warning_count().

No cliente **mysql**, você pode habilitar e desabilitar a exibição automática de avisos usando os comandos `warnings` e `nowarning`, respectivamente, ou seus atalhos, `\W` e `\w` (consulte Seção 6.5.1.2, “Comandos do Cliente mysql”). Por exemplo:

```
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