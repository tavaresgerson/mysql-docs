## 14.10 Funções e Operadores de Castagem

**Tabela 14.15 Funções e Operadores de Castagem**

<table><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Nome</th> <th>Descrição</th> <th>Desatualizado</th> </tr></thead><tbody><tr><th><code>BINARY</code></th> <td> Casta uma string para uma string binária </td> <td>Sim</td> </tr><tr><th><code>CAST()</code></th> <td> Casta um valor como um determinado tipo </td> <td></td> </tr><tr><th><code>CONVERT()</code></th> <td> Casta um valor como um determinado tipo </td> <td></td> </tr></tbody></table>

As funções e operadores de castagem permitem a conversão de valores de um tipo de dados para outro.

*  Descrição das Funções e Operadores de Castagem
*  Conversões de Conjunto de Caracteres
*  Conversões de Conjunto de Caracteres para Comparação de Strings
*  Operações de Castagem em Tipos Espaciais
*  Outros Usos para Operações de Castagem

### Descrição das Funções e Operadores de Castagem

*  `BINARY` *`expr`*

  O operador  `BINARY` converte a expressão para uma string binária (uma string que tem o conjunto de caracteres `binary` e a collation `binary`). Um uso comum para `BINARY` é forçar uma comparação de string a ser feita byte por byte usando valores de byte numéricos em vez de caracteres por caractere. O operador `BINARY` também faz com que os espaços finais nas comparações sejam significativos. Para informações sobre as diferenças entre a collation `binary` do conjunto de caracteres `binary` e as collation `_bin` dos conjuntos de caracteres não binários, consulte  Seção 12.8.5, “A collation binary Comparada às collation \_bin”.

  O operador `BINARY` está desatualizado; você deve esperar sua remoção em uma versão futura do MySQL. Use `CAST(... AS BINARY)` em vez disso.

  ```
  mysql> SET NAMES utf8mb4 COLLATE utf8mb4_general_ci;
          -> OK
  mysql> SELECT 'a' = 'A';
          -> 1
  mysql> SELECT BINARY 'a' = 'A';
          -> 0
  mysql> SELECT 'a' = 'a ';
          -> 1
  mysql> SELECT BINARY 'a' = 'a ';
          -> 0
  ```

  Em uma comparação,  `BINARY` afeta toda a operação; pode ser dado antes de qualquer operando com o mesmo resultado.

  Para converter uma expressão de string para uma string binária, essas construções são equivalentes:

  ```
  CONVERT(expr USING BINARY)
  CAST(expr AS BINARY)
  BINARY expr
  ```YC9lDJ5neS```
  mysql> SELECT 'a' = 'A';
          -> 1
  mysql> SELECT _binary 'a' = 'A';
          -> 0
  ```EN8eLx0NBo```
  CHAR(10) BINARY
  CHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
  ```m5J3BEkBTf```
  CHAR(10) CHARACTER SET binary
  BINARY(10)

  VARCHAR(10) CHARACTER SET binary
  VARBINARY(10)

  TEXT CHARACTER SET binary
  BLOB
  ```zuEGfYBEE9```
      mysql> SELECT CAST("11:35:00" AS YEAR), CAST(TIME "11:35:00" AS YEAR);
      +--------------------------+-------------------------------+
      | CAST("11:35:00" AS YEAR) | CAST(TIME "11:35:00" AS YEAR) |
      +--------------------------+-------------------------------+
      |                     2011 |                          2021 |
      +--------------------------+-------------------------------+
      ```HiephVqFz5```
      mysql> SELECT CAST(1944.35 AS YEAR), CAST(1944.50 AS YEAR);
      +-----------------------+-----------------------+
      | CAST(1944.35 AS YEAR) | CAST(1944.50 AS YEAR) |
      +-----------------------+-----------------------+
      |                  1944 |                  1945 |
      +-----------------------+-----------------------+

      mysql> SELECT CAST(66.35 AS YEAR), CAST(66.50 AS YEAR);
      +---------------------+---------------------+
      | CAST(66.35 AS YEAR) | CAST(66.50 AS YEAR) |
      +---------------------+---------------------+
      |                2066 |                2067 |
      +---------------------+---------------------+
      ```yN8dVrdUrZ```
    mysql> SELECT CAST("1979aaa" AS YEAR);
    +-------------------------+
    | CAST("1979aaa" AS YEAR) |
    +-------------------------+
    |                    1979 |
    +-------------------------+
    1 row in set, 1 warning (0.00 sec)

    mysql> SHOW WARNINGS;
    +---------+------+-------------------------------------------+
    | Level   | Code | Message                                   |
    +---------+------+-------------------------------------------+
    | Warning | 1292 | Truncated incorrect YEAR value: '1979aaa' |
    +---------+------+-------------------------------------------+
    ```KYJPedUBUz```
  mysql> SELECT @@system_time_zone;
  +--------------------+
  | @@system_time_zone |
  +--------------------+
  | EDT                |
  +--------------------+
  1 row in set (0.00 sec)

  mysql> CREATE TABLE tz (c TIMESTAMP);
  Query OK, 0 rows affected (0.41 sec)

  mysql> INSERT INTO tz VALUES
      ->     ROW(CURRENT_TIMESTAMP),
      ->     ROW('2020-07-28 14:50:15+1:00');
  Query OK, 1 row affected (0.08 sec)

  mysql> TABLE tz;
  +---------------------+
  | c                   |
  +---------------------+
  | 2020-07-28 09:22:41 |
  | 2020-07-28 09:50:15 |
  +---------------------+
  2 rows in set (0.00 sec)

  mysql> SELECT CAST(c AT TIME ZONE '+00:00' AS DATETIME) AS u FROM tz;
  +---------------------+
  | u                   |
  +---------------------+
  | 2020-07-28 13:22:41 |
  | 2020-07-28 13:50:15 |
  +---------------------+
  2 rows in set (0.00 sec)

  mysql> SELECT CAST(c AT TIME ZONE 'UTC' AS DATETIME(2)) AS u FROM tz;
  +------------------------+
  | u                      |
  +------------------------+
  | 2020-07-28 13:22:41.00 |
  | 2020-07-28 13:50:15.00 |
  +------------------------+
  2 rows in set (0.00 sec)
  ```FWOW1mVwvV```
  SELECT CONVERT('abc' USING utf8mb4);
  ```xuisHvUCiD```
CONVERT(expr USING transcoding_name)
```Mgydh09pes```
SELECT CONVERT('test' USING utf8mb4);
SELECT CONVERT(_latin1'Müller' USING utf8mb4);
INSERT INTO utf8mb4_table (utf8mb4_column)
    SELECT CONVERT(latin1_column USING utf8mb4) FROM latin1_table;
```OdTCi626XS```
CONVERT(string, CHAR[(N)] CHARACTER SET charset_name)
CAST(string AS CHAR[(N)] CHARACTER SET charset_name)
```rkXlzNYAMW```
SELECT CONVERT('test', CHAR CHARACTER SET utf8mb4);
SELECT CAST('test' AS CHAR CHARACTER SET utf8mb4);
```dVQkUrOQlc```
SELECT CONVERT('test' USING utf8mb4) COLLATE utf8mb4_bin;
SELECT CONVERT('test', CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_bin;
SELECT CAST('test' AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_bin;
```FIjlln2GVS```
SELECT CONVERT('test' USING utf8mb4 COLLATE utf8mb4_bin);
SELECT CONVERT('test', CHAR CHARACTER SET utf8mb4 COLLATE utf8mb4_bin);
SELECT CAST('test' AS CHAR CHARACTER SET utf8mb4 COLLATE utf8mb4_bin);
```0Yj6WgpEzi```
SELECT 'A' LIKE CONVERT(blob_col USING utf8mb4)
  FROM tbl_name;
```5nyHexl9mP```
SELECT 'A' LIKE CONVERT(blob_col USING utf8mb4) COLLATE utf8mb4_unicode_ci
  FROM tbl_name;
```pGWZwtKz0Q```
mysql> SET @s1 = _latin1 'abc', @s2 = _latin2 'abc';
mysql> SELECT @s1 = @s2;
ERROR 1267 (HY000): Illegal mix of collations (latin1_swedish_ci,IMPLICIT)
and (latin2_general_ci,IMPLICIT) for operation '='
```lFLj2cir62```
mysql> SELECT @s1 = CONVERT(@s2 USING latin1);
+---------------------------------+
| @s1 = CONVERT(@s2 USING latin1) |
+---------------------------------+
|                               1 |
+---------------------------------+
```5h8f9Gu7bJ```
mysql> SET @str = BINARY 'New York';
mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING utf8mb4));
+-------------+------------------------------------+
| LOWER(@str) | LOWER(CONVERT(@str USING utf8mb4)) |
+-------------+------------------------------------+
| New York    | new york                           |
+-------------+------------------------------------+
```ilyU99Cl3C```
mysql> CREATE TABLE new_table SELECT CAST('2000-01-01' AS DATE) AS c1;
mysql> SHOW CREATE TABLE new_table\G
*************************** 1. row ***************************
       Table: new_table
Create Table: CREATE TABLE `new_table` (
  `c1` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```KIf5BYCoiq```
SELECT enum_col FROM tbl_name
  ORDER BY CAST(enum_col AS CHAR);
```z6y5UKemkR```
mysql> SELECT 1+'1';
       -> 2
```QgPYubNHvK```
mysql> SELECT X'41', X'41'+0;
        -> 'A', 65
mysql> SELECT b'1100001', b'1100001'+0;
        -> 'a', 97
```uwDzUr76Zd```
mysql> SELECT CONCAT('hello you ',2);
        -> 'hello you 2'
```54gAQkAgEw```
mysql> SELECT 1 - 2;
        -> -1
mysql> SELECT CAST(1 - 2 AS UNSIGNED);
        -> 18446744073709551615
mysql> SELECT CAST(CAST(1 - 2 AS UNSIGNED) AS SIGNED);
        -> -1
```v7CuJ1Vb3D```

O modo SQL afeta o resultado das operações de conversão (veja Seção 7.1.11, “Modos SQL do Servidor”). Exemplos:

* Para a conversão de uma string de data “zero” em uma data, `CONVERT()` e `CAST()` retornam `NULL` e produzem uma mensagem de aviso quando o modo SQL `NO_ZERO_DATE` está habilitado.
* Para a subtração de inteiros, se o modo SQL `NO_UNSIGNED_SUBTRACTION` está habilitado, o resultado da subtração é assinado mesmo que qualquer operando seja não assinado.