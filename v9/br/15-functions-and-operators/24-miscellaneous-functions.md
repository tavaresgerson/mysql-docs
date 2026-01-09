## 14.24 Funções Diversas

**Tabela 14.34 Funções Diversas**

<table frame="box" rules="all" summary="Uma referência que lista funções diversas."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="funções-diversas.html#função_qualquer-valor"><code>ANY_VALUE()</code></a></td> <td> Supressão da rejeição do valor <code>ONLY_FULL_GROUP_BY</code></td> </tr><tr><td><a class="link" href="funções-diversas.html#função_bin-to-uuid"><code>BIN_TO_UUID()</code></a></td> <td> Conversão de UUID binário em string</td> </tr><tr><td><a class="link" href="funções-diversas.html#função_default"><code>DEFAULT()</code></a></td> <td> Retorna o valor padrão para uma coluna de tabela</td> </tr><tr><td><a class="link" href="funções-diversas.html#função_etag"><code>ETAG()</code></a></td> <td> Calcular hash para cada linha, usando uma ou mais colunas ou outros valores</td> </tr><tr><td><a class="link" href="funções-diversas.html#função_grouping"><code>GROUPING()</code></a></td> <td> Distinguir linhas de ROLLUP de superagregados de linhas regulares</td> </tr><tr><td><a class="link" href="funções-diversas.html#função_inet-aton"><code>INET_ATON()</code></a></td> <td> Retornar o valor numérico de um endereço IP</td> </tr><tr><td><a class="link" href="funções-diversas.html#função_inet-ntoa"><code>INET_NTOA()</code></a></td> <td> Retornar o endereço IP a partir de um valor numérico</td> </tr><tr><td><a class="link" href="funções-diversas.html#função_is-uuid"><code>IS_UUID()</code></a></td> <td> Se o argumento é um UUID válido</td> </tr><tr><td><a class="link" href="funções-diversas.html#função_name-const"><code>NAME_CONST()</code></a></td> <td> Tornar a coluna com o nome dado</td> </tr><tr><td><a class="link" href="funções-diversas.html#função_sleep"><code>SLEEP()</code></a></td> <td> Dormir por um número de segundos</td> </tr><tr><td><a class="link" href="funções-diversas.html#função_uuid"><code>UUID()</code></a></td> <td> Retornar um identificador único universal (UUID)</td> </tr><tr><td><a class="link" href="funções-diversas.html#função_uuid-short"><code>UUID_SHORT()</code></a></td> <td> Retornar um identificador universal com valor inteiro</td> </tr><tr><td><a class="link" href="funções-diversas.html#função_uuid-to-bin"><code>UUID_TO_BIN()</code></a></td> <td> Converter UUID em binário</td> </tr><tr><td><a class="link" href="funções-diversas.html#função_values"><code>VALUES()</code></a></td> <td> Definir os valores a serem usados durante um INSERT</td> </tr></tbody></table>

* `ANY_VALUE(arg)`

  Essa função é útil para consultas `GROUP BY` quando o modo SQL `ONLY_FULL_GROUP_BY` está habilitado, para casos em que o MySQL rejeita uma consulta que você sabe que é válida por razões que o MySQL não consegue determinar. O valor de retorno e o tipo da função são os mesmos do argumento, mas o resultado da função não é verificado para o modo SQL `ONLY_FULL_GROUP_BY`.

  Por exemplo, se `nome` for uma coluna não indexada, a seguinte consulta falha com `ONLY_FULL_GROUP_BY` habilitado:

  ```
  mysql> SELECT name, address, MAX(age) FROM t GROUP BY name;
  ERROR 1055 (42000): Expression #2 of SELECT list is not in GROUP
  BY clause and contains nonaggregated column 'mydb.t.address' which
  is not functionally dependent on columns in GROUP BY clause; this
  is incompatible with sql_mode=only_full_group_by
  ```

  O erro ocorre porque `endereço` é uma coluna não agregada que não está nomeada entre as colunas `GROUP BY` nem depende funcionalmente delas. Como resultado, o valor de `endereço` para as linhas dentro de cada grupo de `nome` é não determinístico. Existem várias maneiras de fazer o MySQL aceitar a consulta:

  + Altere a tabela para tornar `nome` uma chave primária ou uma coluna `NOT NULL` única. Isso permite que o MySQL determine que `endereço` depende funcionalmente de `nome`; ou seja, `endereço` é determinado de forma única por `nome`. (Essa técnica não é aplicável se `NULL` deve ser permitido como um valor válido de `nome`.)

  + Use `ANY_VALUE()` para referenciar `endereço`:

    ```
    SELECT name, ANY_VALUE(address), MAX(age) FROM t GROUP BY name;
    ```

    Neste caso, o MySQL ignora o não determinismo dos valores de `endereço` dentro de cada grupo de `nome` e aceita a consulta. Isso pode ser útil se você simplesmente não se importar com qual valor de uma coluna não agregada é escolhido para cada grupo. `ANY_VALUE()` não é uma função agregada, ao contrário de funções como `SUM()` ou `COUNT()`. Ela simplesmente atua para suprimir o teste de não determinismo.

  + Desabilite `ONLY_FULL_GROUP_BY`. Isso é equivalente ao uso de `ANY_VALUE()` com `ONLY_FULL_GROUP_BY` habilitado, conforme descrito no item anterior.

`ANY_VALUE()` também é útil se houver dependência funcional entre as colunas, mas o MySQL não conseguir determinar isso. A seguinte consulta é válida porque `age` é funcionalmente dependente da coluna de agrupamento `age-1`, mas o MySQL não consegue determinar isso e rejeita a consulta com `ONLY_FULL_GROUP_BY` habilitado:

```
  SELECT age FROM t GROUP BY age-1;
  ```

Para fazer o MySQL aceitar a consulta, use `ANY_VALUE()`:

```
  SELECT ANY_VALUE(age) FROM t GROUP BY age-1;
  ```

`ANY_VALUE()` pode ser usado para consultas que fazem referência a funções agregadas na ausência de uma cláusula `GROUP BY`:

```
  mysql> SELECT name, MAX(age) FROM t;
  ERROR 1140 (42000): In aggregated query without GROUP BY, expression
  #1 of SELECT list contains nonaggregated column 'mydb.t.name'; this
  is incompatible with sql_mode=only_full_group_by
  ```

Sem `GROUP BY`, há um único grupo e não é determinado qual valor do `name` deve ser escolhido para o grupo. `ANY_VALUE()` diz ao MySQL para aceitar a consulta:

```
  SELECT ANY_VALUE(name), MAX(age) FROM t;
  ```

Pode ser que, devido a alguma propriedade de um conjunto de dados específico, você saiba que uma coluna não agregada selecionada está efetivamente funcionalmente dependente de uma coluna `GROUP BY`. Por exemplo, um aplicativo pode impor a unicidade de uma coluna em relação a outra. Neste caso, usar `ANY_VALUE()` para a coluna efetivamente funcionalmente dependente pode fazer sentido.

Para uma discussão adicional, consulte a Seção 14.19.3, “Tratamento do MySQL do GROUP BY”.

* `BIN_TO_UUID(binary_uuid)`, `BIN_TO_UUID(binary_uuid, swap_flag)`

`BIN_TO_UUID()` é o inverso de `UUID_TO_BIN()`. Ele converte um UUID binário em um UUID de string e retorna o resultado. O valor binário deve ser um UUID como um valor `VARBINARY(16)`. O valor de retorno é uma string de cinco números hexadecimais separados por hífens. (Para detalhes sobre esse formato, consulte a descrição da função `UUID()`. Se o argumento UUID for `NULL`, o valor de retorno é `NULL`. Se qualquer argumento for inválido, ocorre um erro.

`BIN_TO_UUID()` aceita um ou dois argumentos:

+ A forma de um argumento aceita um valor UUID binário. O valor UUID é assumido como não tendo suas partes time-low e time-high trocadas. O resultado da string está na mesma ordem que o argumento binário.

+ A forma de dois argumentos aceita um valor UUID binário e um valor de sinal de troca:

    - Se *`swap_flag`* for 0, a forma de dois argumentos é equivalente à forma de um argumento. O resultado da string está na mesma ordem que o argumento binário.

    - Se *`swap_flag`* for 1, o valor UUID é assumido como tendo suas partes time-low e time-high trocadas. Essas partes são trocadas de volta para sua posição original no valor de resultado.

  Para exemplos de uso e informações sobre a troca de partes de tempo, consulte a descrição da função `UUID_TO_BIN()`.

* `DEFAULT(col_name)`

  Retorna o valor padrão para uma coluna de tabela. Um erro ocorre se a coluna não tiver um valor padrão.

  O uso de `DEFAULT(col_name)` para especificar o valor padrão para uma coluna nomeada é permitido apenas para colunas que têm um valor padrão literal, não para colunas que têm um valor padrão de expressão.

  ```
  mysql> UPDATE t SET i = DEFAULT(i)+1 WHERE id < 100;
  ```

[`ETAG(col [, col[, ...]])`](https://docs.oracle.com/en/database/sql/t-sql/dev/functions.aspx?c=sql.t.dev.functions.ETAG)

  Calcula um hash de 128 bits para cada linha, dado uma lista de vírgulas separadas por vírgulas de um ou mais valores de coluna. Um item nesta lista pode ser o nome de uma coluna, um valor constante ou uma expressão, e pode ser `NULL`.

  Colunas `VECTOR` e `GEOMETRY` não são suportadas por esta função; tentar referenciar uma coluna de qualquer um desses tipos causa um erro.

  A ordem dos itens na lista de argumentos não afeta o valor de retorno da função.

  Para mais informações, consulte a Seção 27.7, “Visões de Dualidade JSON”.

* `FORMAT(X,D)`

Formata o número *`X`* para um formato como `'#,###,###.##'`, arredondado a *`D`* casas decimais, e retorna o resultado como uma string. Para detalhes, consulte a Seção 14.8, “Funções e Operadores de String”.

* `GROUPING(expr [, expr] ...)`

  Para consultas `GROUP BY` que incluem um modificador `WITH ROLLUP`, a operação `ROLLUP` produz linhas de saída de superagregado onde `NULL` representa o conjunto de todos os valores. A função `GROUPING()` permite que você distinga valores `NULL` para linhas de superagregado de valores `NULL` em linhas agrupadas regulares.

  `GROUPING()` é permitido na lista de seleção, na cláusula `HAVING` e na cláusula `ORDER BY`.

  Cada argumento de `GROUPING()` deve ser uma expressão que corresponda exatamente a uma expressão na cláusula `GROUP BY`. A expressão não pode ser um especificador posicional. Para cada expressão, `GROUPING()` produz 1 se o valor da expressão na linha atual for um `NULL` representando um valor de superagregado. Caso contrário, `GROUPING()` produz 0, indicando que o valor da expressão é um `NULL` para uma linha de resultado regular ou não é `NULL`.

  Suponha que a tabela `t1` contenha essas linhas, onde `NULL` indica algo como “outro” ou “desconhecido”:

  ```
  mysql> SELECT * FROM t1;
  +------+-------+----------+
  | name | size  | quantity |
  +------+-------+----------+
  | ball | small |       10 |
  | ball | large |       20 |
  | ball | NULL  |        5 |
  | hoop | small |       15 |
  | hoop | large |        5 |
  | hoop | NULL  |        3 |
  +------+-------+----------+
  ```

  Um resumo da tabela sem `WITH ROLLUP` parece assim:

  ```
  mysql> SELECT name, size, SUM(quantity) AS quantity
         FROM t1
         GROUP BY name, size;
  +------+-------+----------+
  | name | size  | quantity |
  +------+-------+----------+
  | ball | small |       10 |
  | ball | large |       20 |
  | ball | NULL  |        5 |
  | hoop | small |       15 |
  | hoop | large |        5 |
  | hoop | NULL  |        3 |
  +------+-------+----------+
  ```

  O resultado contém valores `NULL`, mas esses não representam linhas de superagregado porque a consulta não inclui `WITH ROLLUP`.

  Adicionar `WITH ROLLUP` produz linhas de resumo de superagregado contendo valores `NULL` adicionais. No entanto, sem comparar esse resultado com o anterior, não é fácil ver quais valores `NULL` ocorrem em linhas de superagregado e quais ocorrem em linhas agrupadas regulares:

  ```
  mysql> SELECT name, size, SUM(quantity) AS quantity
         FROM t1
         GROUP BY name, size WITH ROLLUP;
  +------+-------+----------+
  | name | size  | quantity |
  +------+-------+----------+
  | ball | NULL  |        5 |
  | ball | large |       20 |
  | ball | small |       10 |
  | ball | NULL  |       35 |
  | hoop | NULL  |        3 |
  | hoop | large |        5 |
  | hoop | small |       15 |
  | hoop | NULL  |       23 |
  | NULL | NULL  |       58 |
  +------+-------+----------+
  ```zRHIILPuCM```
  mysql> SELECT
           name, size, SUM(quantity) AS quantity,
           GROUPING(name) AS grp_name,
           GROUPING(size) AS grp_size
         FROM t1
         GROUP BY name, size WITH ROLLUP;
  +------+-------+----------+----------+----------+
  | name | size  | quantity | grp_name | grp_size |
  +------+-------+----------+----------+----------+
  | ball | NULL  |        5 |        0 |        0 |
  | ball | large |       20 |        0 |        0 |
  | ball | small |       10 |        0 |        0 |
  | ball | NULL  |       35 |        0 |        1 |
  | hoop | NULL  |        3 |        0 |        0 |
  | hoop | large |        5 |        0 |        0 |
  | hoop | small |       15 |        0 |        0 |
  | hoop | NULL  |       23 |        0 |        1 |
  | NULL | NULL  |       58 |        1 |        1 |
  +------+-------+----------+----------+----------+
  ```uU1fkHFEba```
    mysql> SELECT
             IF(GROUPING(name) = 1, 'All items', name) AS name,
             IF(GROUPING(size) = 1, 'All sizes', size) AS size,
             SUM(quantity) AS quantity
           FROM t1
           GROUP BY name, size WITH ROLLUP;
    +-----------+-----------+----------+
    | name      | size      | quantity |
    +-----------+-----------+----------+
    | ball      | NULL      |        5 |
    | ball      | large     |       20 |
    | ball      | small     |       10 |
    | ball      | All sizes |       35 |
    | hoop      | NULL      |        3 |
    | hoop      | large     |        5 |
    | hoop      | small     |       15 |
    | hoop      | All sizes |       23 |
    | All items | All sizes |       58 |
    +-----------+-----------+----------+
    ```wyW6Jxl6oD```
    mysql> SELECT name, size, SUM(quantity) AS quantity
           FROM t1
           GROUP BY name, size WITH ROLLUP
           HAVING GROUPING(name) = 1 OR GROUPING(size) = 1;
    +------+------+----------+
    | name | size | quantity |
    +------+------+----------+
    | ball | NULL |       35 |
    | hoop | NULL |       23 |
    | NULL | NULL |       58 |
    +------+------+----------+
    ```elgQ8VV7TM```
    result for GROUPING(expr3)
  + result for GROUPING(expr2) << 1
  + result for GROUPING(expr1) << 2
  ```C8W48lCeMn```
  mysql> SELECT
           name, size, SUM(quantity) AS quantity,
           GROUPING(name) AS grp_name,
           GROUPING(size) AS grp_size,
         GROUPING(name, size) AS grp_all
         FROM t1
         GROUP BY name, size WITH ROLLUP;
  +------+-------+----------+----------+----------+---------+
  | name | size  | quantity | grp_name | grp_size | grp_all |
  +------+-------+----------+----------+----------+---------+
  | ball | NULL  |        5 |        0 |        0 |       0 |
  | ball | large |       20 |        0 |        0 |       0 |
  | ball | small |       10 |        0 |        0 |       0 |
  | ball | NULL  |       35 |        0 |        1 |       1 |
  | hoop | NULL  |        3 |        0 |        0 |       0 |
  | hoop | large |        5 |        0 |        0 |       0 |
  | hoop | small |       15 |        0 |        0 |       0 |
  | hoop | NULL  |       23 |        0 |        1 |       1 |
  | NULL | NULL  |       58 |        1 |        1 |       3 |
  +------+-------+----------+----------+----------+---------+
  ```PUVmgCtpnN```
  mysql> SELECT name, size, SUM(quantity) AS quantity
         FROM t1
         GROUP BY name, size WITH ROLLUP
         HAVING GROUPING(name, size) <> 0;
  +------+------+----------+
  | name | size | quantity |
  +------+------+----------+
  | ball | NULL |       35 |
  | hoop | NULL |       23 |
  | NULL | NULL |       58 |
  +------+------+----------+
  ```cyHw7AzUzG```
    mysql> SELECT GROUPING((SELECT MAX(name) FROM t1))
           FROM t1
           GROUP BY (SELECT MAX(name) FROM t1) WITH ROLLUP;
    ERROR 3580 (HY000): Argument #1 of GROUPING function is not in GROUP BY
    ```KvCecmV9kL```
    SELECT a AS f1, 'w' AS f2
    FROM t
    GROUP BY f1, f2 WITH ROLLUP
    HAVING GROUPING(f2) = 1;
    ```6tzhB8Jdwe```
  mysql> SELECT INET_ATON('10.0.5.9');
          -> 167773449
  ```zOvfqJgTe3```
  mysql> SELECT INET_NTOA(167773449);
          -> '10.0.5.9'
  ```Vo0krA8qv3```
  mysql> SELECT HEX(INET6_ATON('fdfe::5a55:caff:fefa:9089'));
          -> 'FDFE0000000000005A55CAFFFEFA9089'
  mysql> SELECT HEX(INET6_ATON('10.0.5.9'));
          -> '0A000509'
  ```al60Qn0uPH```
  INET6_ATON(INET_NTOA(expr))
  ```GiBCeREIyo```
  mysql> SELECT HEX(INET6_ATON(INET_NTOA(167773449)));
          -> '0A000509'
  ```fl9Q2bjkFg```
    CREATE TABLE t AS SELECT INET6_NTOA(expr) AS c1;
    ```Kj63Mj1434```
    CREATE TABLE t (c1 VARCHAR(39) CHARACTER SET utf8mb3 DEFAULT NULL);
    ```hRdlYC3Fpz```
  mysql> SELECT INET6_NTOA(INET6_ATON('fdfe::5a55:caff:fefa:9089'));
          -> 'fdfe::5a55:caff:fefa:9089'
  mysql> SELECT INET6_NTOA(INET6_ATON('10.0.5.9'));
          -> '10.0.5.9'

  mysql> SELECT INET6_NTOA(UNHEX('FDFE0000000000005A55CAFFFEFA9089'));
          -> 'fdfe::5a55:caff:fefa:9089'
  mysql> SELECT INET6_NTOA(UNHEX('0A000509'));
          -> '10.0.5.9'
  ```O9czgvhQyk```
  mysql> SELECT IS_IPV4('10.0.5.9'), IS_IPV4('10.0.5.256');
          -> 1, 0
  ```PThBAP9cqC```
  mysql> SELECT IS_IPV4_COMPAT(INET6_ATON('::10.0.5.9'));
          -> 1
  mysql> SELECT IS_IPV4_COMPAT(INET6_ATON('::ffff:10.0.5.9'));
          -> 0
  ```1bqgfaUwi5```
  mysql> SELECT HEX(INET6_ATON('198.51.100.1'));
          -> 'C6336401'
  ```kdABh74D94```
  mysql> SELECT
      ->   IS_IPV4_COMPAT(INET6_ATON('::198.51.100.1')),
      ->   IS_IPV4_COMPAT(INET6_ATON('::c0a8:0001')),
      ->   IS_IPV4_COMPAT(INET6_ATON('::c0a8:1'));
          -> 1, 1, 1
  ```VFxC1GGNfs```
  mysql> SELECT IS_IPV4_MAPPED(INET6_ATON('::10.0.5.9'));
          -> 0
  mysql> SELECT IS_IPV4_MAPPED(INET6_ATON('::ffff:10.0.5.9'));
          -> 1
  ```v2pLHScAml```
  mysql> SELECT
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:198.51.100.1')),
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:c0a8:0001')),
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:c0a8:1'));
          -> 1, 1, 1
  ```TknL5IGAHn```
  mysql> SELECT IS_IPV6('10.0.5.9'), IS_IPV6('::1');
          -> 0, 1
  ```SBVUahSi0C```
  aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
  ```TLSDq8jllI```
  aaaaaaaabbbbccccddddeeeeeeeeeeee
  {aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee}
  ```2qH5xty6ms```
  mysql> SELECT IS_UUID('6ccd780c-baba-1026-9564-5b8c656024db');
  +-------------------------------------------------+
  | IS_UUID('6ccd780c-baba-1026-9564-5b8c656024db') |
  +-------------------------------------------------+
  |                                               1 |
  +-------------------------------------------------+
  mysql> SELECT IS_UUID('6CCD780C-BABA-1026-9564-5B8C656024DB');
  +-------------------------------------------------+
  | IS_UUID('6CCD780C-BABA-1026-9564-5B8C656024DB') |
  +-------------------------------------------------+
  |                                               1 |
  +-------------------------------------------------+
  mysql> SELECT IS_UUID('6ccd780cbaba102695645b8c656024db');
  +---------------------------------------------+
  | IS_UUID('6ccd780cbaba102695645b8c656024db') |
  +---------------------------------------------+
  |                                           1 |
  +---------------------------------------------+
  mysql> SELECT IS_UUID('{6ccd780c-baba-1026-9564-5b8c656024db}');
  +---------------------------------------------------+
  | IS_UUID('{6ccd780c-baba-1026-9564-5b8c656024db}') |
  +---------------------------------------------------+
  |                                                 1 |
  +---------------------------------------------------+
  mysql> SELECT IS_UUID('6ccd780c-baba-1026-9564-5b8c6560');
  +---------------------------------------------+
  | IS_UUID('6ccd780c-baba-1026-9564-5b8c6560') |
  +---------------------------------------------+
  |                                           0 |
  +---------------------------------------------+
  mysql> SELECT IS_UUID(RAND());
  +-----------------+
  | IS_UUID(RAND()) |
  +-----------------+
  |               0 |
  +-----------------+
  ```QKYMEdQyuN```
  mysql> SELECT NAME_CONST('myname', 14);
  +--------+
  | myname |
  +--------+
  |     14 |
  +--------+
  ```3ji74FTxVz```
  mysql> SELECT 14 AS myname;
  +--------+
  | myname |
  +--------+
  |     14 |
  +--------+
  1 row in set (0.00 sec)
  ```bsSM13ixRD```
  mysql> SELECT SLEEP(1000);
  +-------------+
  | SLEEP(1000) |
  +-------------+
  |           0 |
  +-------------+
  ```vubU0pkErq```
    mysql> SELECT SLEEP(1000);
    +-------------+
    | SLEEP(1000) |
    +-------------+
    |           1 |
    +-------------+
    ```CMoZekBUPZ```
    mysql> SELECT /*+ MAX_EXECUTION_TIME(1) */ SLEEP(1000);
    +-------------+
    | SLEEP(1000) |
    +-------------+
    |           1 |
    +-------------+
    ```J3czzfPoq```
    mysql> SELECT 1 FROM t1 WHERE SLEEP(1000);
    ERROR 1317 (70100): Query execution was interrupted
    ```JsYa3qoOC4```
    mysql> SELECT /*+ MAX_EXECUTION_TIME(1000) */ 1 FROM t1 WHERE SLEEP(1000);
    ERROR 3024 (HY000): Query execution was interrupted, maximum statement
    execution time exceeded
    ```wr9Y5rWfcx```
  mysql> SELECT UUID();
          -> '6ccd780c-baba-1026-9564-5b8c656024db'
  ```wPjUby3mHw```
    (server_id & 255) << 56
  + (server_startup_time_in_seconds << 24)
  + incremented_variable++;
  ```yxNkKOI3kr```
  mysql> SELECT UUID_SHORT();
          -> 92395783831158784
  ```45j5hmGPXC```
  mysql> SET @uuid = '6ccd780c-baba-1026-9564-5b8c656024db';
  ```VKjeRso0Tu```
  mysql> SELECT HEX(UUID_TO_BIN(@uuid));
  +----------------------------------+
  | HEX(UUID_TO_BIN(@uuid))          |
  +----------------------------------+
  | 6CCD780CBABA102695645B8C656024DB |
  +----------------------------------+
  mysql> SELECT HEX(UUID_TO_BIN(@uuid, 0));
  +----------------------------------+
  | HEX(UUID_TO_BIN(@uuid, 0))       |
  +----------------------------------+
  | 6CCD780CBABA102695645B8C656024DB |
  +----------------------------------+
  mysql> SELECT HEX(UUID_TO_BIN(@uuid, 1));
  +----------------------------------+
  | HEX(UUID_TO_BIN(@uuid, 1))       |
  +----------------------------------+
  | 1026BABA6CCD780C95645B8C656024DB |
  +----------------------------------+
  ```m4pDEWmqWe```
  mysql> SELECT BIN_TO_UUID(UUID_TO_BIN(@uuid));
  +--------------------------------------+
  | BIN_TO_UUID(UUID_TO_BIN(@uuid))      |
  +--------------------------------------+
  | 6ccd780c-baba-1026-9564-5b8c656024db |
  +--------------------------------------+
  mysql> SELECT BIN_TO_UUID(UUID_TO_BIN(@uuid,0),0);
  +--------------------------------------+
  | BIN_TO_UUID(UUID_TO_BIN(@uuid,0),0)  |
  +--------------------------------------+
  | 6ccd780c-baba-1026-9564-5b8c656024db |
  +--------------------------------------+
  mysql> SELECT BIN_TO_UUID(UUID_TO_BIN(@uuid,1),1);
  +--------------------------------------+
  | BIN_TO_UUID(UUID_TO_BIN(@uuid,1),1)  |
  +--------------------------------------+
  | 6ccd780c-baba-1026-9564-5b8c656024db |
  +--------------------------------------+
  ```2WIqTKZJC4```
  mysql> SELECT BIN_TO_UUID(UUID_TO_BIN(@uuid,0),1);
  +--------------------------------------+
  | BIN_TO_UUID(UUID_TO_BIN(@uuid,0),1)  |
  +--------------------------------------+
  | baba1026-780c-6ccd-9564-5b8c656024db |
  +--------------------------------------+
  mysql> SELECT BIN_TO_UUID(UUID_TO_BIN(@uuid,1),0);
  +--------------------------------------+
  | BIN_TO_UUID(UUID_TO_BIN(@uuid,1),0)  |
  +--------------------------------------+
  | 1026baba-6ccd-780c-9564-5b8c656024db |
  +--------------------------------------+
  ```qkZOnihn8a
Importante
Este uso está desatualizado e sujeito à remoção em uma futura versão do MySQL. Use um alias de linha ou aliases de linha e coluna, em vez disso. Para mais informações e exemplos, consulte a Seção 15.2.7.2, “Instrução INSERT ... ON DUPLICATE KEY UPDATE”.
```