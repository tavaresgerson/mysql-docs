## 14.23 Funções Diversas

**Tabela 14.33 Funções Diversas**

<table><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>ANY_VALUE()</code></td> <td> Ignorar a rejeição do valor <code>ONLY_FULL_GROUP_BY</code></td> </tr><tr><td><code>BIN_TO_UUID()</code></td> <td> Converter UUID binário em string</td> </tr><tr><td><code>DEFAULT()</code></td> <td> Retornar o valor padrão para uma coluna de tabela</td> </tr><tr><td><code>GROUPING()</code></td> <td> Distinguir as linhas de ROLLUP de superagregados das linhas regulares</td> </tr><tr><td><code>INET_ATON()</code></td> <td> Retornar o valor numérico de um endereço IP</td> </tr><tr><td><code>INET_NTOA()</code></td> <td> Retornar o endereço IP a partir de um valor numérico</td> </tr><tr><td><code>IS_UUID()</code></td> <td> Verificar se o argumento é um UUID válido</td> </tr><tr><td><code>NAME_CONST()</code></td> <td> Tornar a coluna com o nome especificado</td> </tr><tr><td><code>SLEEP()</code></td> <td> Dormir por um número de segundos</td> </tr><tr><td><code>UUID()</code></td> <td> Retornar um identificador único universal (UUID)</td> </tr><tr><td><code>UUID_SHORT()</code></td> <td> Retornar um identificador universal com valor inteiro</td> </tr><tr><td><code>UUID_TO_BIN()</code></td> <td> Converter UUID em binário</td> </tr><tr><td><code>VALUES()</code></td> <td> Definir os valores a serem usados durante um INSERT</td> </tr></tbody></table>

*  `ANY_VALUE(arg)`

  Esta função é útil para consultas `GROUP BY` quando o modo SQL `ONLY_FULL_GROUP_BY` está habilitado, para casos em que o MySQL rejeita uma consulta que você sabe que é válida por razões que o MySQL não consegue determinar. O valor de retorno e o tipo da função são os mesmos do argumento, mas o resultado da função não é verificado para o modo SQL `ONLY_FULL_GROUP_BY`.

  Por exemplo, se `name` for uma coluna não indexada, a seguinte consulta falha com `ONLY_FULL_GROUP_BY` habilitado:

  ```
  mysql> SELECT name, address, MAX(age) FROM t GROUP BY name;
  ERROR 1055 (42000): Expression #2 of SELECT list is not in GROUP
  BY clause and contains nonaggregated column 'mydb.t.address' which
  is not functionally dependent on columns in GROUP BY clause; this
  is incompatible with sql_mode=only_full_group_by
  ```

O erro ocorre porque `address` é uma coluna não agregada que não está nomeada entre as colunas `GROUP BY` nem depende funcionalmente delas. Como resultado, o valor de `address` para as linhas dentro de cada grupo de `name` é não determinístico. Existem várias maneiras de fazer o MySQL aceitar a consulta:

  + Altere a tabela para tornar `name` uma chave primária ou uma coluna `NOT NULL` única. Isso permite que o MySQL determine que `address` depende funcionalmente de `name`; ou seja, `address` é determinado de forma única por `name`. (Essa técnica não é aplicável se `NULL` deve ser permitido como um valor válido de `name`.)
  + Use `ANY_VALUE()` para referenciar `address`:

    ```
    SELECT name, ANY_VALUE(address), MAX(age) FROM t GROUP BY name;
    ```

    Neste caso, o MySQL ignora o não determinismo dos valores de `address` dentro de cada grupo de `name` e aceita a consulta. Isso pode ser útil se você simplesmente não se importar com qual valor de uma coluna não agregada é escolhido para cada grupo. `ANY_VALUE()` não é uma função agregada, ao contrário de funções como `SUM()` ou `COUNT()`. Ela simplesmente atua para suprimir o teste de não determinismo.
  + Desative `ONLY_FULL_GROUP_BY`. Isso é equivalente a usar `ANY_VALUE()` com `ONLY_FULL_GROUP_BY` habilitado, conforme descrito no item anterior.

`ANY_VALUE()` também é útil se existir dependência funcional entre colunas, mas o MySQL não puder determinar isso. A seguinte consulta é válida porque `age` depende funcionalmente da coluna de agrupamento `age-1`, mas o MySQL não consegue dizer isso e rejeita a consulta com `ONLY_FULL_GROUP_BY` habilitado:

  ```
  SELECT age FROM t GROUP BY age-1;
  ```

  Para fazer o MySQL aceitar a consulta, use `ANY_VALUE()`:

  ```
  SELECT ANY_VALUE(age) FROM t GROUP BY age-1;
  ```

`ANY_VALUE()` pode ser usado para consultas que referenciam funções agregadas na ausência de uma cláusula `GROUP BY`:

  ```
  mysql> SELECT name, MAX(age) FROM t;
  ERROR 1140 (42000): In aggregated query without GROUP BY, expression
  #1 of SELECT list contains nonaggregated column 'mydb.t.name'; this
  is incompatible with sql_mode=only_full_group_by
  ```

Sem `GROUP BY`, há um único grupo e ele é não determinístico em relação ao valor de `name` a ser escolhido para o grupo. `ANY_VALUE()` diz ao MySQL para aceitar a consulta:

  ```
  SELECT ANY_VALUE(name), MAX(age) FROM t;
  ```

Pode ser que, devido a alguma propriedade de um conjunto de dados específico, você saiba que uma coluna não agregada selecionada está efetivamente dependente funcionalmente de uma coluna `GROUP BY`. Por exemplo, um aplicativo pode impor a unicidade de uma coluna em relação a outra. Neste caso, usar `ANY_VALUE()` para a coluna efetivamente dependente funcionalmente pode fazer sentido.

Para discussões adicionais, consulte a Seção 14.19.3, “Tratamento do MySQL do GROUP BY”.
*  `BIN_TO_UUID(binary_uuid)`, `BIN_TO_UUID(binary_uuid, swap_flag)`

   `BIN_TO_UUID()` é o inverso de `UUID_TO_BIN()`. Ele converte um UUID binário em um UUID de string e retorna o resultado. O valor binário deve ser um UUID como um valor `VARBINARY(16)`. O valor de retorno é uma string de cinco números hexadecimais separados por travessões. (Para detalhes sobre este formato, consulte a descrição da função `UUID()`. Se o argumento UUID for `NULL`, o valor de retorno é `NULL`. Se qualquer argumento for inválido, ocorre um erro.

   `BIN_TO_UUID()` aceita um ou dois argumentos:

  + A forma de um argumento aceita um valor de UUID binário. O valor UUID é assumido que não tenha suas partes time-low e time-high trocadas. O resultado da string está na mesma ordem que o argumento binário.
  + A forma de dois argumentos aceita um valor de UUID binário e um valor de flag de troca:

    - Se *`swap_flag`* for 0, a forma de dois argumentos é equivalente à forma de um argumento. O resultado da string está na mesma ordem que o argumento binário.
    - Se *`swap_flag`* for 1, o valor UUID é assumido que tenha suas partes time-low e time-high trocadas. Essas partes são trocadas de volta para sua posição original no valor de resultado.

  Para exemplos de uso e informações sobre a troca de partes de tempo, consulte a descrição da função `UUID_TO_BIN()`.
*  `DEFAULT(col_name)`

  Retorna o valor padrão para uma coluna de tabela. Um erro ocorre se a coluna não tiver um valor padrão.

O uso de `DEFAULT(col_name)` para especificar o valor padrão para uma coluna nomeada é permitido apenas para colunas que têm um valor padrão literal, e não para colunas que têm um valor padrão de expressão.

```
  mysql> UPDATE t SET i = DEFAULT(i)+1 WHERE id < 100;
  ```
* `FORMAT(X,D)`

  Formata o número *`X`* para um formato como `'#,###,###.##'`, arredondado a *`D`* casas decimais, e retorna o resultado como uma string. Para detalhes, consulte a Seção 14.8, “Funções e Operadores de String”.
* `GROUPING(expr [, expr] ...)`

  Para consultas `GROUP BY` que incluem um modificador `WITH ROLLUP`, a operação `ROLLUP` produz linhas de saída de agregados super que representam o conjunto de todos os valores. O  `GROUPING()` permite que você distinga os valores `NULL` para as linhas de agregados super dos valores `NULL` nas linhas agrupadas regulares.

  `GROUPING()` é permitido na lista de seleção, na cláusula `HAVING` e na cláusula `ORDER BY`.

  Cada argumento de `GROUPING()` deve ser uma expressão que corresponda exatamente a uma expressão na cláusula `GROUP BY`. A expressão não pode ser um especificador posicional. Para cada expressão, `GROUPING()` produz 1 se o valor da expressão na linha atual for um `NULL` representando um valor de agregado super. Caso contrário, `GROUPING()` produz 0, indicando que o valor da expressão é um `NULL` para uma linha de resultado regular ou não é `NULL`.

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

  O resultado contém valores `NULL`, mas esses não representam linhas de agregados super porque a consulta não inclui `WITH ROLLUP`.

  Adicionar `WITH ROLLUP` produz linhas de resumo de agregados super que contêm valores `NULL` adicionais. No entanto, sem comparar esse resultado com o anterior, não é fácil ver quais valores `NULL` ocorrem em linhas de agregados super e quais ocorrem em linhas agrupadas regulares:

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
  ```

Para distinguir os valores `NULL` em linhas de superagregados de aqueles em linhas agrupadas regulares, use `GROUPING()`, que retorna 1 apenas para valores `NULL` de superagregados:

```
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
  ```

Usos comuns de `GROUPING()`:

+ Substitua uma etiqueta pelos valores `NULL` de superagregados:

```
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
    ```
+ Retorne apenas as linhas de superagregado filtrando as linhas agrupadas regulares:

```
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
    ```

`GROUPING()` permite múltiplos argumentos de expressão. Neste caso, o valor de retorno de `GROUPING()` representa uma máscara de bits combinada dos resultados para cada expressão, onde o bit de menor ordem corresponde ao resultado da expressão mais à direita. Por exemplo, com três argumentos de expressão, `GROUPING(expr1, expr2, expr3)` é avaliado da seguinte forma:

```
    result for GROUPING(expr3)
  + result for GROUPING(expr2) << 1
  + result for GROUPING(expr1) << 2
  ```

A seguinte consulta mostra como os resultados de `GROUPING()` para argumentos individuais se combinam em uma chamada com múltiplos argumentos para produzir um valor de máscara de bits:

```
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
  ```

Com múltiplos argumentos de expressão, o valor de retorno de `GROUPING()` é diferente de zero se qualquer expressão representar um valor de superagregado. Portanto, a sintaxe de `GROUPING()` com múltiplos argumentos fornece uma maneira mais simples de escrever a consulta anterior que retornava apenas linhas de superagregado, usando uma única chamada de `GROUPING()` com múltiplos argumentos em vez de múltiplas chamadas de argumentos individuais:

```
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
  ```

O uso de `GROUPING()` está sujeito a essas limitações:

+ Não use expressões de subconsulta `GROUP BY` como argumentos de `GROUPING()`, pois a correspondência pode falhar. Por exemplo, a correspondência falha para esta consulta:

```
    mysql> SELECT GROUPING((SELECT MAX(name) FROM t1))
           FROM t1
           GROUP BY (SELECT MAX(name) FROM t1) WITH ROLLUP;
    ERROR 3580 (HY000): Argument #1 of GROUPING function is not in GROUP BY
    ```
+ Expressões literais de `GROUP BY` não devem ser usadas dentro de uma cláusula `HAVING` como argumentos de `GROUPING()`. Devido às diferenças entre quando o otimizador avalia `GROUP BY` e `HAVING`, a correspondência pode ser bem-sucedida, mas a avaliação de `GROUPING()` não produz o resultado esperado. Considere esta consulta:

```
    SELECT a AS f1, 'w' AS f2
    FROM t
    GROUP BY f1, f2 WITH ROLLUP
    HAVING GROUPING(f2) = 1;
    ```

`GROUPING()` é avaliado anteriormente para a expressão constante literal do que para a cláusula `HAVING` como um todo e retorna 0. Para verificar se uma consulta como essa é afetada, use `EXPLAIN` e procure por `Impossible having` na coluna `Extra`.

Para obter mais informações sobre `WITH ROLLUP` e `GROUPING()`, consulte a Seção 14.19.2, “Modificadores GROUP BY”.
*  `INET_ATON(expr)`

  Dado a representação em pontos-quadrados de um endereço de rede IPv4 como uma string, retorna um inteiro que representa o valor numérico do endereço em ordem de bytes de rede (big endian). `INET_ATON()` retorna `NULL` se não entender o argumento ou se *`expr`* for `NULL`.

  ```
  mysql> SELECT INET_ATON('10.0.5.9');
          -> 167773449
  ```

  Para este exemplo, o valor de retorno é calculado como 10×2563 + 0×2562 + 5×256 + 9.

   `INET_ATON()` pode ou não retornar um resultado não `NULL` para endereços IP de formato curto (como `'127.1'` como representação de `'127.0.0.1'`). Por isso, `INET_ATON()`a não deve ser usado para tais endereços.

  ::: info Nota

  Para armazenar valores gerados por `INET_ATON()`, use uma coluna `INT UNSIGNED` em vez de `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), que é assinado. Se você usar uma coluna assinada, os valores correspondentes a endereços IP para os quais o primeiro octeto é maior que 127 não podem ser armazenados corretamente. Consulte a Seção 13.1.7, “Tratamento de Saída de Escala e Sobrecarga”.

  :::

Dado um endereço de rede IPv6 ou IPv4 como uma string, retorna uma string binária que representa o valor numérico do endereço em ordem de bytes de rede (big endian). Como os endereços IPv6 numéricos exigem mais bytes do que o maior tipo de inteiro, a representação retornada por essa função tem o tipo de dados `VARBINARY`: `VARBINARY(16)` para endereços IPv6 e `VARBINARY(4)` para endereços IPv4. Se o argumento não for um endereço válido ou for `NULL`, o `INET6_ATON()` retorna `NULL`.

Os seguintes exemplos usam `HEX()` para exibir o resultado do `INET6_ATON()` em formato imprimível:

```
  mysql> SELECT INET_NTOA(167773449);
          -> '10.0.5.9'
  ```

O `INET6_ATON()` observa várias restrições sobre argumentos válidos. Essas são fornecidas na seguinte lista, juntamente com exemplos.

+ Um ID de zona final não é permitido, como em `fe80::3%1` ou `fe80::3%eth0`.
+ Uma máscara de rede final não é permitida, como em `2001:45f:3:ba::/64` ou `198.51.100.0/24`.
+ Para valores que representam endereços IPv4, apenas endereços sem classe são suportados. Endereços classeful, como `198.51.1`, são rejeitados. Um número de porta final não é permitido, como em `198.51.100.2:8080`. Números hexadecimais nos componentes do endereço não são permitidos, como em `198.0xa0.1.2`. Números óctal não são suportados: `198.51.010.1` é tratado como `198.51.10.1`, não como `198.51.8.1`. Essas restrições de IPv4 também se aplicam aos endereços IPv6 que têm partes de endereços IPv4, como endereços compatíveis com IPv4 ou mapeados com IPv4.

Para converter um endereço IPv4 *`expr`* representado em forma numérica como um valor de `INT` (INTEIRO), INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") em um endereço IPv6 representado em forma numérica como um valor `VARBINARY`, use esta expressão:

```
  mysql> SELECT HEX(INET6_ATON('fdfe::5a55:caff:fefa:9089'));
          -> 'FDFE0000000000005A55CAFFFEFA9089'
  mysql> SELECT HEX(INET6_ATON('10.0.5.9'));
          -> '0A000509'
  ```

Por exemplo:

```
  INET6_ATON(INET_NTOA(expr))
  ```

Se o `INET6_ATON()` for invocado dentro do cliente `mysql`, as strings binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.
*  `INET6_NTOA(expr)`

Dado um endereço de rede IPv6 ou IPv4 representado em forma numérica como uma string binária, retorna a representação da string do endereço como uma string no conjunto de caracteres de conexão. Se o argumento não for um endereço válido ou for `NULL`, `INET6_NTOA()` retorna `NULL`.

`INET6_NTOA()` tem essas propriedades:

+ Não usa funções do sistema operacional para realizar conversões, portanto, a string de saída é independente da plataforma.
+ A string de retorno tem um comprimento máximo de 39 (4 x 8 + 7). Considerando a seguinte declaração:

    ```
  mysql> SELECT HEX(INET6_ATON(INET_NTOA(167773449)));
          -> '0A000509'
  ```

    A tabela resultante teria esta definição:

    ```
    CREATE TABLE t AS SELECT INET6_NTOA(expr) AS c1;
    ```
+ A string de retorno usa letras minúsculas para endereços IPv6.

    ```
    CREATE TABLE t (c1 VARCHAR(39) CHARACTER SET utf8mb3 DEFAULT NULL);
    ```

    Se `INET6_NTOA()` for invocado dentro do cliente `mysql`, as strings binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.
*  `IS_IPV4(expr)`

  Retorna 1 se o argumento for um endereço IPv4 válido especificado como uma string, 0 caso contrário. Retorna `NULL` se *`expr`* for `NULL`.

    ```
  mysql> SELECT INET6_NTOA(INET6_ATON('fdfe::5a55:caff:fefa:9089'));
          -> 'fdfe::5a55:caff:fefa:9089'
  mysql> SELECT INET6_NTOA(INET6_ATON('10.0.5.9'));
          -> '10.0.5.9'

  mysql> SELECT INET6_NTOA(UNHEX('FDFE0000000000005A55CAFFFEFA9089'));
          -> 'fdfe::5a55:caff:fefa:9089'
  mysql> SELECT INET6_NTOA(UNHEX('0A000509'));
          -> '10.0.5.9'
  ```

    Para um argumento dado, se `IS_IPV4()` retornar 1, `INET_ATON()` (e `INET6_ATON()`) retorna `NULL`. A declaração inversa não é verdadeira: Em alguns casos, `INET_ATON()` retorna `NULL` quando `IS_IPV4()` retorna 0.

    Como indicado pelas observações anteriores, `IS_IPV4()` é mais rigoroso que `INET_ATON()` sobre o que constitui um endereço IPv4 válido, portanto, pode ser útil para aplicações que precisam realizar verificações fortes contra valores inválidos. Alternativamente, use `INET6_ATON()` para converter endereços IPv4 para a forma interna e verificar se há um resultado `NULL` (o que indica um endereço inválido). `INET6_ATON()` é igualmente forte que `IS_IPV4()` para verificar endereços IPv4.
*  `IS_IPV4_COMPAT(expr)`

Esta função recebe uma endereço IPv6 representado em forma numérica como uma string binária, conforme retornado por `INET6_ATON()`. Ela retorna 1 se o argumento for um endereço IPv6 compatível com IPv4, 0 caso contrário (a menos que *`expr`* seja `NULL`, no qual caso a função retorna `NULL`). Endereços compatíveis com IPv4 têm a forma `::ipv4_address`.

```
  mysql> SELECT IS_IPV4('10.0.5.9'), IS_IPV4('10.0.5.256');
          -> 1, 0
  ```

A parte IPv4 de um endereço compatível com IPv4 também pode ser representada usando notação hexadecimal. Por exemplo, `198.51.100.1` tem esse valor hexadecimal bruto:

```
  mysql> SELECT IS_IPV4_COMPAT(INET6_ATON('::10.0.5.9'));
          -> 1
  mysql> SELECT IS_IPV4_COMPAT(INET6_ATON('::ffff:10.0.5.9'));
          -> 0
  ```

Expresso na forma compatível com IPv4, `::198.51.100.1` é equivalente a `::c0a8:0001` ou (sem zeros no início) `::c0a8:1`

```
  mysql> SELECT HEX(INET6_ATON('198.51.100.1'));
          -> 'C6336401'
  ```
*  `IS_IPV4_MAPPED(expr)`

Esta função recebe um endereço IPv6 representado em forma numérica como uma string binária, conforme retornado por `INET6_ATON()`. Ela retorna 1 se o argumento for um endereço IPv6 mapeado para IPv4, 0 caso contrário, a menos que *`expr`* seja `NULL`, no qual caso a função retorna `NULL`. Endereços mapeados para IPv4 têm a forma `::ffff:ipv4_address`.

```
  mysql> SELECT
      ->   IS_IPV4_COMPAT(INET6_ATON('::198.51.100.1')),
      ->   IS_IPV4_COMPAT(INET6_ATON('::c0a8:0001')),
      ->   IS_IPV4_COMPAT(INET6_ATON('::c0a8:1'));
          -> 1, 1, 1
  ```

Assim como com `IS_IPV4_COMPAT()`, a parte IPv4 de um endereço mapeado para IPv4 também pode ser representada usando notação hexadecimal:

```
  mysql> SELECT IS_IPV4_MAPPED(INET6_ATON('::10.0.5.9'));
          -> 0
  mysql> SELECT IS_IPV4_MAPPED(INET6_ATON('::ffff:10.0.5.9'));
          -> 1
  ```
*  `IS_IPV6(expr)`

Retorna 1 se o argumento for um endereço IPv6 válido especificado como uma string, 0 caso contrário, a menos que *`expr`* seja `NULL`, no qual caso a função retorna `NULL`. Esta função não considera endereços IPv4 como endereços IPv6 válidos.

```
  mysql> SELECT
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:198.51.100.1')),
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:c0a8:0001')),
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:c0a8:1'));
          -> 1, 1, 1
  ```

Para um argumento dado, se `IS_IPV6()` retornar 1, `INET6_ATON()` retorna `NULL`.
*  `IS_UUID(string_uuid)`

Retorna 1 se o argumento for um UUID válido no formato de string, 0 se o argumento não for um UUID válido e `NULL` se o argumento for `NULL`.

“Válido” significa que o valor está em um formato que pode ser analisado. Ou seja, ele tem o comprimento correto e contém apenas os caracteres permitidos (dígitos hexadecimais em qualquer caso de letra e, opcionalmente, travessões e chaves). Esse formato é o mais comum:

```
  mysql> SELECT IS_IPV6('10.0.5.9'), IS_IPV6('::1');
          -> 0, 1
  ```

Esses outros formatos também são permitidos:

```
  aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
  ```

Para os significados dos campos dentro do valor, consulte a descrição da função `UUID()`.

```
  aaaaaaaabbbbccccddddeeeeeeeeeeee
  {aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee}
  ```
*  `NAME_CONST(nome, valor)`

Retorna o valor fornecido. Quando usado para produzir uma coluna de conjunto de resultados, `NAME_CONST()` faz com que a coluna tenha o nome fornecido. Os argumentos devem ser constantes.

```
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
  ```

Esta função é para uso interno apenas. O servidor a usa ao escrever instruções de programas armazenados que contêm referências a variáveis locais do programa, conforme descrito na Seção 27.7, “Registro de Binário de Programa Armazenado”. Você pode ver esta função na saída do   `mysqlbinlog`.

Para suas aplicações, você pode obter exatamente o mesmo resultado que no exemplo mostrado acima usando alias simples, como este:

```
  mysql> SELECT NAME_CONST('myname', 14);
  +--------+
  | myname |
  +--------+
  |     14 |
  +--------+
  ```

Consulte a Seção 15.2.13, “Instrução SELECT”, para obter mais informações sobre aliases de colunas.
*  `SLEEP(duração)`

Faz uma pausa (dorme) por um número de segundos dado pelo argumento *`duração`*, e então retorna 0. A duração pode ter uma parte fracionária. Se o argumento for `NULL` ou negativo, `SLEEP()` produz uma mensagem de aviso ou um erro no modo SQL rigoroso.

Quando o sleep retorna normalmente (sem interrupção), ele retorna 0:

```
  mysql> SELECT 14 AS myname;
  +--------+
  | myname |
  +--------+
  |     14 |
  +--------+
  1 row in set (0.00 sec)
  ```

Quando o `SLEEP()` é a única coisa invocada por uma consulta que é interrompida, ele retorna 1 e a própria consulta não retorna nenhum erro. Isso é verdadeiro se a consulta for interrompida ou se esgotar:

+ Esta instrução é interrompida usando `KILL QUERY` de outra sessão:

    ```
  mysql> SELECT SLEEP(1000);
  +-------------+
  | SLEEP(1000) |
  +-------------+
  |           0 |
  +-------------+
  ```
+ Esta instrução é interrompida por esgotar:

    ```
    mysql> SELECT SLEEP(1000);
    +-------------+
    | SLEEP(1000) |
    +-------------+
    |           1 |
    +-------------+
    ```
Quando o `SLEEP()` é apenas parte de uma consulta que é interrompida, a consulta retorna um erro:

+ Esta instrução é interrompida usando `KILL QUERY` de outra sessão:

    ```
    mysql> SELECT /*+ MAX_EXECUTION_TIME(1) */ SLEEP(1000);
    +-------------+
    | SLEEP(1000) |
    +-------------+
    |           1 |
    +-------------+
    ```
+ Esta instrução é interrompida por esgotar:

    ```
    mysql> SELECT 1 FROM t1 WHERE SLEEP(1000);
    ERROR 1317 (70100): Query execution was interrupted
    ```

Essa função não é segura para a replicação baseada em declarações. Um aviso é registrado se você usar essa função quando o `binlog_format` estiver definido como `STATEMENT`.
*  `UUID()`

Retorna um Identificador Único Universal (UUID) gerado de acordo com o RFC 4122, “URN Namespace de Identificador Único Universal (UUID)” (<http://www.ietf.org/rfc/rfc4122.txt>).

Um UUID é projetado como um número que é globalmente único no espaço e no tempo. Duas chamadas para `UUID()` devem gerar dois valores diferentes, mesmo que essas chamadas sejam realizadas em dois dispositivos separados não conectados entre si.

Aviso

Embora os valores de `UUID()` sejam destinados a serem únicos, eles não são necessariamente adivinhados ou imprevisíveis. Se a imprevisibilidade for necessária, os valores de UUID devem ser gerados de outra maneira.

`UUID()` retorna um valor que está em conformidade com a versão 1 de UUID, conforme descrito no RFC 4122. O valor é um número de 128 bits representado como uma string `utf8mb3` de cinco números hexadecimais no formato `aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`:

+ Os três primeiros números são gerados a partir das partes baixa, média e alta de um timestamp. A parte alta também inclui o número da versão do UUID.
+ O quarto número preserva a unicidade temporal no caso de o valor do timestamp perder monotonicidade (por exemplo, devido ao horário de verão).
+ O quinto número é um número de nó IEEE 802 que fornece unicidade espacial. Um número aleatório é substituído se este último não estiver disponível (por exemplo, porque o dispositivo host não tem uma placa Ethernet ou não se sabe como encontrar o endereço de hardware de uma interface no sistema operacional do host). Nesse caso, a unicidade espacial não pode ser garantida. No entanto, a probabilidade de colisão deve ser *muito* baixa.

O endereço MAC de uma interface é considerado apenas no FreeBSD, Linux e Windows. Em outros sistemas operacionais, o MySQL usa um número aleatório gerado de 48 bits.

```
    mysql> SELECT /*+ MAX_EXECUTION_TIME(1000) */ 1 FROM t1 WHERE SLEEP(1000);
    ERROR 3024 (HY000): Query execution was interrupted, maximum statement
    execution time exceeded
    ```

Para converter valores de UUIDs binários e de string, use as funções `UUID_TO_BIN()` e `BIN_TO_UUID()`. Para verificar se uma string é um valor válido de UUID, use a função `IS_UUID()`.

Esta função não é segura para replicação baseada em declarações. Uma mensagem de aviso é registrada se você usar essa função quando o `binlog_format` estiver definido como `STATEMENT`.
*  `UUID_SHORT()`

Retorna um identificador universal "curto" como um inteiro sem sinal de 64 bits. Os valores retornados por `UUID_SHORT()` diferem dos identificadores de 128 bits no formato de string retornados pela função `UUID()` e têm propriedades de unicidade diferentes. O valor de `UUID_SHORT()` é garantido como único se as seguintes condições forem atendidas:

+ O valor `server_id` do servidor atual estiver entre 0 e 255 e ser único entre seus servidores de origem e replicação
+ Você não redefinir o horário do sistema para o host do seu servidor entre os reinícios do `mysqld`
+ Você invocar `UUID_SHORT()` em média menos de 16 milhões de vezes por segundo entre os reinícios do `mysqld`

O valor de retorno de `UUID_SHORT()` é construído da seguinte maneira:

```
  mysql> SELECT UUID();
          -> '6ccd780c-baba-1026-9564-5b8c656024db'
  ```

```
    (server_id & 255) << 56
  + (server_startup_time_in_seconds << 24)
  + incremented_variable++;
  ```

::: info Nota

`UUID_SHORT()` não funciona com replicação baseada em declarações.


  :::

- Se *`swap_flag`* for 0, a forma de dois argumentos é equivalente à forma de um argumento. O resultado binário está na mesma ordem que o argumento de string.
- Se *`swap_flag`* for 1, o formato do valor de retorno difere: As partes time-low e time-high (os primeiros e terceiros grupos de dígitos hexadecimais, respectivamente) são trocadas. Isso move a parte que varia mais rapidamente para a direita e pode melhorar a eficiência de indexação se o resultado for armazenado em uma coluna indexada.

O troco de partes de tempo assume o uso de valores da versão 1 do UUID, como os gerados pela função `UUID()`. Para valores UUID produzidos por outros meios que não seguem o formato da versão 1, o troco de partes de tempo não oferece benefício. Para detalhes sobre o formato da versão 1, consulte a descrição da função `UUID()`.

Suponha que você tenha o seguinte valor de UUID de string:

```
  mysql> SELECT UUID_SHORT();
          -> 92395783831158784
  ```

Para converter a UUID de string para binária com ou sem troco de partes de tempo, use  `UUID_TO_BIN()`:

```
  mysql> SET @uuid = '6ccd780c-baba-1026-9564-5b8c656024db';
  ```

Para converter uma UUID binária retornada por `UUID_TO_BIN()` para uma UUID de string, use  `BIN_TO_UUID()`. Se você produzir uma UUID binária chamando `UUID_TO_BIN()` com um segundo argumento de 1 para trocar partes de tempo, você também deve passar um segundo argumento de 1 para `BIN_TO_UUID()` para desfazer o troco de partes de tempo ao converter a UUID binária de volta para uma UUID de string:

```
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
  ```

Se o uso do troco de partes de tempo não for o mesmo para a conversão em ambas as direções, o UUID original não é recuperado corretamente:

```
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
  ```

Se `UUID_TO_BIN()` for invocado dentro do cliente `mysql`, as strings binárias são exibidas usando notação hexadecimal, dependendo do valor da opção  `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando MySQL”.
*  `VALUES(col_name)`

Em uma instrução `INSERT ... ON DUPLICATE KEY UPDATE`, você pode usar a função `VALUES(col_name)` na cláusula `UPDATE` para referenciar os valores das colunas da parte `INSERT` da instrução. Em outras palavras, `VALUES(col_name)` na cláusula `UPDATE` refere-se ao valor de *`col_name`* que seria inserido, caso não houvesse conflito de chave duplicada. Essa função é especialmente útil em inserções de múltiplas linhas. A função `VALUES()` só tem significado na cláusula `ON DUPLICATE KEY UPDATE` de instruções `INSERT` e retorna `NULL` caso contrário. Veja a Seção 15.2.7.2, “Instrução INSERT ... ON DUPLICATE KEY UPDATE”.

```
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
  ```

Importante

Esse uso é desatualizado e está sujeito à remoção em uma futura versão do MySQL. Use um alias de linha ou aliases de linha e coluna, em vez disso. Para mais informações e exemplos, veja a Seção 15.2.7.2, “Instrução INSERT ... ON DUPLICATE KEY UPDATE”.