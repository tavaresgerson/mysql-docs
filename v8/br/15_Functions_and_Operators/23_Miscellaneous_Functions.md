## 14.23 Funções Diversas

**Tabela 14.33 Funções Diversas**

<table summary="Uma referência que lista funções diversas."><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[PH_HTML_CODE_<code>IS_IPV4_MAPPED()</code>]</td> <td>Suprima a rejeição do valor ONLY_FULL_GROUP_BY</td> </tr><tr><td>[[PH_HTML_CODE_<code>IS_IPV4_MAPPED()</code>]</td> <td>Converter UUID binário para string</td> </tr><tr><td>[[PH_HTML_CODE_<code>IS_UUID()</code>]</td> <td>Retorne o valor padrão para uma coluna de tabela</td> </tr><tr><td>[[PH_HTML_CODE_<code>NAME_CONST()</code>]</td> <td>Distinguir as linhas de superagregado ROLLUP das linhas regulares</td> </tr><tr><td>[[PH_HTML_CODE_<code>SLEEP()</code>]</td> <td>Retorne o valor numérico de um endereço IP</td> </tr><tr><td>[[PH_HTML_CODE_<code>UUID()</code>]</td> <td>Retorne o endereço IP a partir de um valor numérico</td> </tr><tr><td>[[PH_HTML_CODE_<code>UUID_SHORT()</code>]</td> <td>Retorne o valor numérico de um endereço IPv6</td> </tr><tr><td>[[PH_HTML_CODE_<code>UUID_TO_BIN()</code>]</td> <td>Retorne o endereço IPv6 a partir de um valor numérico</td> </tr><tr><td>[[PH_HTML_CODE_<code>VALUES()</code>]</td> <td>Se o argumento é um endereço IPv4</td> </tr><tr><td>[[<code>IS_IPV4_COMPAT()</code>]]</td> <td>Se o argumento é um endereço compatível com IPv4</td> </tr><tr><td>[[<code>IS_IPV4_MAPPED()</code>]]</td> <td>Se o argumento é um endereço mapeado IPv4</td> </tr><tr><td>[[<code>BIN_TO_UUID()</code><code>IS_IPV4_MAPPED()</code>]</td> <td>Se o argumento é um endereço IPv6</td> </tr><tr><td>[[<code>IS_UUID()</code>]]</td> <td>Se o argumento é um UUID válido</td> </tr><tr><td>[[<code>NAME_CONST()</code>]]</td> <td>Faça com que a coluna tenha o nome dado</td> </tr><tr><td>[[<code>SLEEP()</code>]]</td> <td>Durma por alguns segundos</td> </tr><tr><td>[[<code>UUID()</code>]]</td> <td>Retorne um Identificador Único Universal (UUID)</td> </tr><tr><td>[[<code>UUID_SHORT()</code>]]</td> <td>Retorne um identificador universal com valor inteiro</td> </tr><tr><td>[[<code>UUID_TO_BIN()</code>]]</td> <td>Converter uma string UUID para binário</td> </tr><tr><td>[[<code>VALUES()</code>]]</td> <td>Defina os valores a serem usados durante um INSERT</td> </tr></tbody></table>

- `ANY_VALUE(arg)`

  Essa função é útil para consultas `GROUP BY` quando o modo SQL `ONLY_FULL_GROUP_BY` está habilitado, para casos em que o MySQL rejeita uma consulta que você sabe que é válida por razões que o MySQL não pode determinar. O valor de retorno e o tipo da função são os mesmos do valor de retorno e do tipo de seu argumento, mas o resultado da função não é verificado no modo SQL `ONLY_FULL_GROUP_BY`.

  Por exemplo, se `name` for uma coluna não indexada, a seguinte consulta falha com `ONLY_FULL_GROUP_BY` habilitado:

  ```
  mysql> SELECT name, address, MAX(age) FROM t GROUP BY name;
  ERROR 1055 (42000): Expression #2 of SELECT list is not in GROUP
  BY clause and contains nonaggregated column 'mydb.t.address' which
  is not functionally dependent on columns in GROUP BY clause; this
  is incompatible with sql_mode=only_full_group_by
  ```

  O erro ocorre porque `address` é uma coluna não agregada que não está nomeada entre as colunas `GROUP BY` nem depende funcionalmente delas. Como resultado, o valor `address` para as linhas dentro de cada grupo `name` é não determinístico. Existem várias maneiras de fazer com que o MySQL aceite a consulta:

  - Altere a tabela para tornar `name` uma chave primária ou uma coluna única `NOT NULL`. Isso permite que o MySQL determine que `address` é funcionalmente dependente de `name`; ou seja, `address` é determinado de forma única por `name`. (Essa técnica não é aplicável se `NULL` deve ser permitido como um valor válido `name`.)

  - Use `ANY_VALUE()` para se referir a `address`:

    ```
    SELECT name, ANY_VALUE(address), MAX(age) FROM t GROUP BY name;
    ```

    Nesse caso, o MySQL ignora o não determinismo dos valores de `address` dentro de cada grupo `name` e aceita a consulta. Isso pode ser útil se você simplesmente não se importar com qual valor de uma coluna não agregada será escolhido para cada grupo. `ANY_VALUE()` não é uma função agregada, ao contrário de funções como `SUM()` ou `COUNT()`. Ele simplesmente atua para suprimir o teste de não determinismo.

  - Desative `ONLY_FULL_GROUP_BY`. Isso é equivalente ao uso de `ANY_VALUE()` com `ONLY_FULL_GROUP_BY` habilitado, conforme descrito no item anterior.

  `ANY_VALUE()` também é útil se houver dependência funcional entre as colunas, mas o MySQL não puder determinar isso. A seguinte consulta é válida porque `age` é funcionalmente dependente da coluna de agrupamento `age-1`, mas o MySQL não consegue determinar isso e rejeita a consulta com `ONLY_FULL_GROUP_BY` habilitado:

  ```
  SELECT age FROM t GROUP BY age-1;
  ```

  Para fazer com que o MySQL aceite a consulta, use `ANY_VALUE()`:

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

  Sem `GROUP BY`, há um único grupo e não é determinado qual valor `name` deve ser escolhido para o grupo. `ANY_VALUE()` informa ao MySQL para aceitar a consulta:

  ```
  SELECT ANY_VALUE(name), MAX(age) FROM t;
  ```

  Pode ser que, devido a alguma propriedade de um conjunto de dados específico, você saiba que uma coluna não agregada selecionada depende funcionalmente de uma coluna `GROUP BY`. Por exemplo, um aplicativo pode impor a unicidade de uma coluna em relação a outra. Nesse caso, usar `ANY_VALUE()` para a coluna dependente funcionalmente pode fazer sentido.

  Para uma discussão adicional, consulte a Seção 14.19.3, “Manejo do MySQL do GROUP BY”.

- `BIN_TO_UUID(binary_uuid)`, `BIN_TO_UUID(binary_uuid, swap_flag)`

  `BIN_TO_UUID()` é o inverso de `UUID_TO_BIN()`. Ele converte um UUID binário em um UUID de string e retorna o resultado. O valor binário deve ser um UUID como um valor `VARBINARY(16)`. O valor de retorno é uma string de cinco números hexadecimais separados por travessões. (Para detalhes sobre esse formato, consulte a descrição da função `UUID()`. Se o argumento UUID for `NULL`, o valor de retorno é `NULL`. Se qualquer argumento for inválido, ocorrerá um erro.

  `BIN_TO_UUID()` aceita um ou dois argumentos:

  - A forma de um argumento aceita um valor UUID binário. O valor UUID é assumido como não tendo suas partes time-low e time-high trocadas. O resultado da string está na mesma ordem que o argumento binário.

  - A forma de dois argumentos recebe um valor UUID binário e um valor de sinalizador de troca:

    - Se `swap_flag` for 0, a forma de dois argumentos é equivalente à forma de um argumento. A string resultante está na mesma ordem que o argumento binário.

    - Se `swap_flag` for 1, o valor UUID é suposto ter suas partes time-low e time-high invertidas. Essas partes são revertidas para sua posição original no valor do resultado.

  Para exemplos de uso e informações sobre a troca de partes de tempo, consulte a descrição da função `UUID_TO_BIN()`.

- `DEFAULT(col_name)`

  Retorna o valor padrão para uma coluna de tabela. Um erro ocorre se a coluna não tiver um valor padrão.

  O uso de `DEFAULT(col_name)` para especificar o valor padrão para uma coluna com nome é permitido apenas para colunas que têm um valor padrão literal, e não para colunas que têm um valor padrão de expressão.

  ```
  mysql> UPDATE t SET i = DEFAULT(i)+1 WHERE id < 100;
  ```

- `FORMAT(X,D)`

  Formata o número `X` para um formato como `'#,###,###.##'`, arredondado para `D` casas decimais, e retorna o resultado como uma string. Para detalhes, consulte a Seção 14.8, “Funções e Operadores de String”.

- `GROUPING(expr [, expr] ...)`

  Para consultas `GROUP BY` que incluem um modificador `WITH ROLLUP`, a operação `ROLLUP` produz linhas de saída de superagregado onde `NULL` representa o conjunto de todos os valores. A função `GROUPING()` permite distinguir os valores de `NULL` para as linhas de superagregado dos valores de `NULL` nas linhas agrupadas regulares.

  `GROUPING()` é permitido na lista de seleção, na cláusula `HAVING` e (a partir do MySQL 8.0.12) na cláusula `ORDER BY`.

  Cada argumento para `GROUPING()` deve ser uma expressão que corresponda exatamente a uma expressão na cláusula `GROUP BY`. A expressão não pode ser um especificador posicional. Para cada expressão, `GROUPING()` produz 1 se o valor da expressão na linha atual for um `NULL` representando um valor de superagregado. Caso contrário, `GROUPING()` produz 0, indicando que o valor da expressão é um `NULL` para uma linha de resultado regular ou não é `NULL`.

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

  A adição de `WITH ROLLUP` produz linhas de resumo de superagregados que contêm valores adicionais de `NULL`. No entanto, sem comparar esse resultado com o anterior, não é fácil ver quais valores de `NULL` ocorrem em linhas de superagregados e quais ocorrem em linhas agrupadas regulares:

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

  Para distinguir os valores `NULL` nas linhas de superagregado de aqueles nas linhas agrupadas regulares, use `GROUPING()`, que retorna 1 apenas para os valores `NULL` de superagregado:

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

  Usos comuns para `GROUPING()`:

  - Substitua um rótulo pelos valores de super-agregado `NULL`:

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

  - Retorne apenas as linhas de superagregado, filtrando as linhas agrupadas regulares:

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

  `GROUPING()` permite múltiplos argumentos de expressão. Neste caso, o valor de retorno `GROUPING()` representa uma máscara de bits combinada dos resultados de cada expressão, onde o bit de menor ordem corresponde ao resultado da expressão mais à direita. Por exemplo, com três argumentos de expressão, `GROUPING(expr1, expr2, expr3)` é avaliado da seguinte forma:

  ```
    result for GROUPING(expr3)
  + result for GROUPING(expr2) << 1
  + result for GROUPING(expr1) << 2
  ```

  A consulta a seguir mostra como os resultados de `GROUPING()` para argumentos individuais se combinam em uma chamada com múltiplos argumentos para produzir um valor de máscara de bits:

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

  Com múltiplos argumentos de expressão, o valor de retorno `GROUPING()` não é nulo se qualquer expressão representar um valor de superagregado. A sintaxe de múltiplos argumentos `GROUPING()` fornece, assim, uma maneira mais simples de escrever a consulta anterior que retornava apenas linhas de superagregado, usando uma única chamada de múltiplos argumentos `GROUPING()` em vez de múltiplas chamadas de um único argumento:

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

  - Não use expressões de subconsulta `GROUP BY` como argumentos de `GROUPING()` porque a correspondência pode falhar. Por exemplo, a correspondência falha para esta consulta:

    ```
    mysql> SELECT GROUPING((SELECT MAX(name) FROM t1))
           FROM t1
           GROUP BY (SELECT MAX(name) FROM t1) WITH ROLLUP;
    ERROR 3580 (HY000): Argument #1 of GROUPING function is not in GROUP BY
    ```

  - As expressões literais `GROUP BY` não devem ser usadas dentro de uma cláusula `HAVING` como argumentos `GROUPING()`. Devido às diferenças entre quando o otimizador avalia `GROUP BY` e `HAVING`, a correspondência pode ser bem-sucedida, mas a avaliação de `GROUPING()` não produz o resultado esperado. Considere esta consulta:

    ```
    SELECT a AS f1, 'w' AS f2
    FROM t
    GROUP BY f1, f2 WITH ROLLUP
    HAVING GROUPING(f2) = 1;
    ```

    `GROUPING()` é avaliado anteriormente para a expressão constante literal do que para a cláusula `HAVING` como um todo e retorna 0. Para verificar se uma consulta como essa é afetada, use `EXPLAIN` e procure por `Impossible having` na coluna `Extra`.

  Para obter mais informações sobre `WITH ROLLUP` e `GROUPING()`, consulte a Seção 14.19.2, “Modificadores GROUP BY”.

- `INET_ATON(expr)`

  Dado a representação de um endereço de rede IPv4 como uma string na forma de quadrados pontilhados, retorna um inteiro que representa o valor numérico do endereço na ordem de bytes da rede (big endian). `INET_ATON()` retorna `NULL` se não entender o argumento ou se `expr` for `NULL`.

  ```
  mysql> SELECT INET_ATON('10.0.5.9');
          -> 167773449
  ```

  Para este exemplo, o valor de retorno é calculado como 10 × 2563 + 0 × 2562 + 5 × 256 + 9.

  `INET_ATON()` pode ou não retornar um resultado não `NULL` para endereços IP de curta forma (como `'127.1'` como representação de `'127.0.0.1'`). Por isso, `INET_ATON()`a não deve ser usada para tais endereços.

  Nota

  Para armazenar valores gerados por `INET_ATON()`, use uma coluna `INT UNSIGNED` em vez de `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), que é assinado. Se você usar uma coluna assíncrona, os valores correspondentes a endereços IP para os quais o primeiro octeto é maior que 127 não podem ser armazenados corretamente. Veja a Seção 13.1.7, “Tratamento de Saída de Faixa e Transbordamento”.

- `INET_NTOA(expr)`

  Dado um endereço de rede IPv4 numérico em ordem de bytes de rede, retorna a representação em formato de quadrímetro pontilhado do endereço como uma string no conjunto de caracteres de conexão. `INET_NTOA()` retorna `NULL` se não entender o argumento.

  ```
  mysql> SELECT INET_NTOA(167773449);
          -> '10.0.5.9'
  ```

- `INET6_ATON(expr)`

  Dado um endereço de rede IPv6 ou IPv4 como uma string, retorna uma string binária que representa o valor numérico do endereço na ordem de bytes da rede (big endian). Como os endereços IPv6 numéricos exigem mais bytes do que o maior tipo de inteiro, a representação retornada por essa função tem o tipo de dados `VARBINARY` para endereços IPv6 e `VARBINARY(4)` para endereços IPv4. Se o argumento não for um endereço válido ou se for `NULL`, `INET6_ATON()`, `NULL` é retornado.

  Os exemplos a seguir usam `HEX()` para exibir o resultado `INET6_ATON()` em formato imprimível:

  ```
  mysql> SELECT HEX(INET6_ATON('fdfe::5a55:caff:fefa:9089'));
          -> 'FDFE0000000000005A55CAFFFEFA9089'
  mysql> SELECT HEX(INET6_ATON('10.0.5.9'));
          -> '0A000509'
  ```

  `INET6_ATON()` observa várias restrições sobre argumentos válidos. Essas restrições estão listadas abaixo, juntamente com exemplos.

  - Não é permitido um ID de zona de rastreamento, como em `fe80::3%1` ou `fe80::3%eth0`.

  - Uma máscara de rede de deslocamento não é permitida, como em `2001:45f:3:ba::/64` ou `198.51.100.0/24`.

  - Para valores que representam endereços IPv4, apenas endereços sem classe são suportados. Endereços classe-ful, como `198.51.1`, são rejeitados. Um número de porta final não é permitido, como em `198.51.100.2:8080`. Números hexadecimais em componentes de endereço não são permitidos, como em `198.0xa0.1.2`. Números octal não são suportados: `198.51.010.1` é tratado como `198.51.10.1`, não como `198.51.8.1`. Essas restrições do IPv4 também se aplicam aos endereços IPv6 que têm partes de endereço IPv4, como endereços compatíveis com IPv4 ou mapeados para IPv4.

  Para converter um endereço IPv4 `expr` representado em forma numérica como um valor `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") para um endereço IPv6 representado em forma numérica como um valor `VARBINARY`, use esta expressão:

  ```
  INET6_ATON(INET_NTOA(expr))
  ```

  Por exemplo:

  ```
  mysql> SELECT HEX(INET6_ATON(INET_NTOA(167773449)));
          -> '0A000509'
  ```

  Se `INET6_ATON()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando do MySQL”.

- `INET6_NTOA(expr)`

  Dado um endereço de rede IPv6 ou IPv4 representado em forma numérica como uma string binária, retorna a representação da string do endereço como uma string no conjunto de caracteres de conexão. Se o argumento não for um endereço válido ou se for `NULL`, `INET6_NTOA()` retorna `NULL`.

  `INET6_NTOA()` tem essas propriedades:

  - Ele não utiliza as funções do sistema operacional para realizar conversões, portanto, a string de saída é independente da plataforma.

  - A string de retorno tem um comprimento máximo de 39 (4 x 8 + 7). Dadas essas informações:

    ```
    CREATE TABLE t AS SELECT INET6_NTOA(expr) AS c1;
    ```

    A tabela resultante teria esta definição:

    ```
    CREATE TABLE t (c1 VARCHAR(39) CHARACTER SET utf8mb3 DEFAULT NULL);
    ```

  - A string de retorno usa letras minúsculas para endereços IPv6.

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

  Se `INET6_NTOA()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando do MySQL”.

- `IS_IPV4(expr)`

  Retorna 1 se o argumento for um endereço IPv4 válido especificado como uma string, caso contrário, retorna 0. Retorna `NULL` se `expr` for `NULL`.

  ```
  mysql> SELECT IS_IPV4('10.0.5.9'), IS_IPV4('10.0.5.256');
          -> 1, 0
  ```

  Para um argumento dado, se `IS_IPV4()` retorna 1, `INET_ATON()` (e `INET6_ATON()`) retorna não `NULL`. A afirmação inversa não é verdadeira: em alguns casos, `INET_ATON()` retorna não `NULL` quando `IS_IPV4()` retorna 0.

  Como indicado pelas observações anteriores, `IS_IPV4()` é mais rigoroso do que `INET_ATON()` em relação ao que constitui um endereço IPv4 válido, portanto, pode ser útil para aplicações que precisam realizar verificações rigorosas contra valores inválidos. Alternativamente, use `INET6_ATON()` para converter endereços IPv4 para a forma interna e verificar se há um resultado `NULL` (que indica um endereço inválido). `INET6_ATON()` é igualmente forte quanto a `IS_IPV4()` em relação à verificação de endereços IPv4.

- `IS_IPV4_COMPAT(expr)`

  Essa função recebe uma endereço IPv6 representado em forma numérica como uma string binária, conforme retornado por `INET6_ATON()`. Ela retorna 1 se o argumento for um endereço IPv6 compatível com IPv4, 0 caso contrário (a menos que `expr` seja `NULL`, no qual caso a função retorna `NULL`). Endereços compatíveis com IPv4 têm a forma `::ipv4_address`.

  ```
  mysql> SELECT IS_IPV4_COMPAT(INET6_ATON('::10.0.5.9'));
          -> 1
  mysql> SELECT IS_IPV4_COMPAT(INET6_ATON('::ffff:10.0.5.9'));
          -> 0
  ```

  A parte IPv4 de um endereço compatível com IPv4 também pode ser representada usando notação hexadecimal. Por exemplo, `198.51.100.1` tem esse valor hexadecimal bruto:

  ```
  mysql> SELECT HEX(INET6_ATON('198.51.100.1'));
          -> 'C6336401'
  ```

  Expresso na forma compatível com IPv4, `::198.51.100.1` é equivalente a `::c0a8:0001` ou (sem zeros no início) `::c0a8:1`

  ```
  mysql> SELECT
      ->   IS_IPV4_COMPAT(INET6_ATON('::198.51.100.1')),
      ->   IS_IPV4_COMPAT(INET6_ATON('::c0a8:0001')),
      ->   IS_IPV4_COMPAT(INET6_ATON('::c0a8:1'));
          -> 1, 1, 1
  ```

- `IS_IPV4_MAPPED(expr)`

  Essa função recebe uma endereço IPv6 representado em forma numérica como uma string binária, conforme retornado por `INET6_ATON()`. Ela retorna 1 se o argumento for um endereço IPv6 mapeado para IPv4 válido, 0 caso contrário, a menos que `expr` seja `NULL`, no qual caso a função retorna `NULL`. Endereços mapeados para IPv4 têm a forma `::ffff:ipv4_address`.

  ```
  mysql> SELECT IS_IPV4_MAPPED(INET6_ATON('::10.0.5.9'));
          -> 0
  mysql> SELECT IS_IPV4_MAPPED(INET6_ATON('::ffff:10.0.5.9'));
          -> 1
  ```

  Assim como no caso de `IS_IPV4_COMPAT()`, a parte IPv4 de um endereço mapeado para IPv4 também pode ser representada usando notação hexadecimal:

  ```
  mysql> SELECT
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:198.51.100.1')),
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:c0a8:0001')),
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:c0a8:1'));
          -> 1, 1, 1
  ```

- `IS_IPV6(expr)`

  Retorna 1 se o argumento for uma endereço IPv6 válido especificado como uma string, 0 caso contrário, a menos que `expr` seja `NULL`, caso em que a função retorna `NULL`. Esta função não considera endereços IPv4 como endereços IPv6 válidos.

  ```
  mysql> SELECT IS_IPV6('10.0.5.9'), IS_IPV6('::1');
          -> 0, 1
  ```

  Para um argumento dado, se `IS_IPV6()` retorna 1, `INET6_ATON()` retorna não `NULL`.

- `IS_UUID(string_uuid)`

  Retorna 1 se o argumento for um UUID válido na formatação de string, 0 se o argumento não for um UUID válido e `NULL` se o argumento for `NULL`.

  “Válido” significa que o valor está em um formato que pode ser analisado. Isso significa que ele tem a extensão correta e contém apenas os caracteres permitidos (dígitos hexadecimais em qualquer caso de letra e, opcionalmente, travessões e chaves). Esse formato é o mais comum:

  ```
  aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
  ```

  Esses outros formatos também são permitidos:

  ```
  aaaaaaaabbbbccccddddeeeeeeeeeeee
  {aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee}
  ```

  Para os significados dos campos dentro do valor, consulte a descrição da função `UUID()`.

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

- `NAME_CONST(name,value)`

  Retorna o valor fornecido. Quando usado para produzir uma coluna de conjunto de resultados, `NAME_CONST()` faz com que a coluna tenha o nome fornecido. Os argumentos devem ser constantes.

  ```
  mysql> SELECT NAME_CONST('myname', 14);
  +--------+
  | myname |
  +--------+
  |     14 |
  +--------+
  ```

  Essa função é para uso interno apenas. O servidor a utiliza ao escrever instruções de programas armazenados que contêm referências a variáveis locais de programas, conforme descrito na Seção 27.7, “Registro binário de programas armazenados”. Você pode ver essa função na saída do **mysqlbinlog**.

  Para suas aplicações, você pode obter exatamente o mesmo resultado que no exemplo mostrado acima usando alias simples, assim:

  ```
  mysql> SELECT 14 AS myname;
  +--------+
  | myname |
  +--------+
  |     14 |
  +--------+
  1 row in set (0.00 sec)
  ```

  Consulte a Seção 15.2.13, “Instrução SELECT”, para obter mais informações sobre aliases de colunas.

- `SLEEP(duration)`

  Descansará (pausa) por um número de segundos fornecido pelo argumento `duration`, e então retornará 0. A duração pode ter uma parte fracionária. Se o argumento for `NULL` ou negativo, `SLEEP()` produzirá uma mensagem de aviso ou um erro no modo SQL rigoroso.

  Quando o sono retorna normalmente (sem interrupção), ele retorna 0:

  ```
  mysql> SELECT SLEEP(1000);
  +-------------+
  | SLEEP(1000) |
  +-------------+
  |           0 |
  +-------------+
  ```

  Quando `SLEEP()` é a única coisa invocada por uma consulta interrompida, ele retorna 1 e a própria consulta não retorna nenhum erro. Isso é verdadeiro, independentemente de a consulta ser interrompida ou ficar sem resposta:

  - Esta declaração é interrompida usando `KILL QUERY` de outra sessão:

    ```
    mysql> SELECT SLEEP(1000);
    +-------------+
    | SLEEP(1000) |
    +-------------+
    |           1 |
    +-------------+
    ```

  - Esta declaração é interrompida pelo tempo de espera:

    ```
    mysql> SELECT /*+ MAX_EXECUTION_TIME(1) */ SLEEP(1000);
    +-------------+
    | SLEEP(1000) |
    +-------------+
    |           1 |
    +-------------+
    ```

  Quando `SLEEP()` é apenas parte de uma consulta que é interrompida, a consulta retorna um erro:

  - Esta declaração é interrompida usando `KILL QUERY` de outra sessão:

    ```
    mysql> SELECT 1 FROM t1 WHERE SLEEP(1000);
    ERROR 1317 (70100): Query execution was interrupted
    ```

  - Esta declaração é interrompida pelo tempo de espera:

    ```
    mysql> SELECT /*+ MAX_EXECUTION_TIME(1000) */ 1 FROM t1 WHERE SLEEP(1000);
    ERROR 3024 (HY000): Query execution was interrupted, maximum statement
    execution time exceeded
    ```

  Essa função não é segura para a replicação baseada em declarações. Um aviso é registrado se você usar essa função quando `binlog_format` estiver definido como `STATEMENT`.

- `UUID()`

  Retorna um identificador único universal (UUID) gerado de acordo com o RFC 4122, “Um namespace de URN (UUID) Uunique Identificador (UUID)” (<http://www.ietf.org/rfc/rfc4122.txt>).

  Um UUID é projetado como um número que é globalmente único no espaço e no tempo. Duas chamadas para `UUID()` devem gerar dois valores diferentes, mesmo que essas chamadas sejam realizadas em dois dispositivos separados e não conectados entre si.

  Aviso

  Embora os valores `UUID()` sejam destinados a serem únicos, eles não são necessariamente adivinhados ou imprevisíveis. Se a imprevisibilidade for necessária, os valores UUID devem ser gerados de outra maneira.

  `UUID()` retorna um valor que está em conformidade com a versão 1 do UUID, conforme descrito no RFC 4122. O valor é um número de 128 bits representado como uma string `utf8mb3` de cinco números hexadecimais no formato `aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`:

  - Os três primeiros números são gerados a partir das partes baixa, média e alta de um timestamp. A parte alta também inclui o número de versão do UUID.

  - O quarto número preserva a unicidade temporal caso o valor do timestamp perca a monotonia (por exemplo, devido ao horário de verão).

  - O quinto número é um número de nó IEEE 802 que fornece unicidade espacial. Um número aleatório é substituído se este não estiver disponível (por exemplo, porque o dispositivo hospedeiro não tem cartão Ethernet ou não se sabe como encontrar o endereço de hardware de uma interface no sistema operacional do hospedeiro). Nesse caso, a unicidade espacial não pode ser garantida. No entanto, a probabilidade de colisão deve ser *muito* baixa.

    O endereço MAC de uma interface é considerado apenas no FreeBSD, no Linux e no Windows. Em outros sistemas operacionais, o MySQL utiliza um número gerado aleatoriamente de 48 bits.

  ```
  mysql> SELECT UUID();
          -> '6ccd780c-baba-1026-9564-5b8c656024db'
  ```

  Para converter valores de UUID de string para binários e vice-versa, use as funções `UUID_TO_BIN()` e `BIN_TO_UUID()`. Para verificar se uma string é um valor válido de UUID, use a função `IS_UUID()`.

  Essa função não é segura para a replicação baseada em declarações. Um aviso é registrado se você usar essa função quando `binlog_format` estiver definido como `STATEMENT`.

- `UUID_SHORT()`

  Retorna um identificador universal “curto” como um inteiro sem sinal de 64 bits. Os valores retornados por `UUID_SHORT()` diferem dos identificadores de 128 bits no formato de string retornados pela função `UUID()` e têm propriedades de unicidade diferentes. O valor de `UUID_SHORT()` é garantido como único se as seguintes condições forem atendidas:

  - O valor `server_id` do servidor atual está entre 0 e 255 e é único entre o conjunto de servidores de origem e replica.

  - Você não deve atrasar o horário do sistema do seu servidor hospedeiro entre os reinicializações do **mysqld**

  - Você invoca `UUID_SHORT()` em média menos de 16 milhões de vezes por segundo entre os reinicializações do **mysqld**

  O valor de retorno `UUID_SHORT()` é construído da seguinte maneira:

  ```
    (server_id & 255) << 56
  + (server_startup_time_in_seconds << 24)
  + incremented_variable++;
  ```

  ```
  mysql> SELECT UUID_SHORT();
          -> 92395783831158784
  ```

  Nota

  `UUID_SHORT()` não funciona com a replicação baseada em declarações.

- `UUID_TO_BIN(string_uuid)`, `UUID_TO_BIN(string_uuid, swap_flag)`

  Converte uma string UUID em um UUID binário e retorna o resultado. (A descrição da função `IS_UUID()` lista os formatos de UUID de string permitidos.) O UUID binário de retorno é um valor `VARBINARY(16)`. Se o argumento UUID for `NULL`, o valor de retorno é `NULL`. Se qualquer argumento for inválido, ocorrerá um erro.

  `UUID_TO_BIN()` aceita um ou dois argumentos:

  - A forma de um argumento aceita um valor de UUID em string. O resultado binário está na mesma ordem que o argumento em string.

  - A forma de dois argumentos aceita um valor de UUID de string e um valor de sinalizador:

    - Se `swap_flag` for 0, a forma de dois argumentos é equivalente à forma de um argumento. O resultado binário está na mesma ordem que o argumento de string.

    - Se `swap_flag` for 1, o formato do valor de retorno difere: as partes time-low e time-high (os primeiros e terceiros grupos de dígitos hexadecimais, respectivamente) são trocadas. Isso move a parte que varia mais rapidamente para a direita e pode melhorar a eficiência da indexação se o resultado for armazenado em uma coluna indexada.

  O intercâmbio de partes de tempo assume o uso de valores da versão 1 do UUID, como os gerados pela função `UUID()`. Para valores de UUID produzidos por outros meios que não seguem o formato da versão 1, o intercâmbio de partes de tempo não oferece nenhum benefício. Para detalhes sobre o formato da versão 1, consulte a descrição da função `UUID()`.

  Suponha que você tenha o seguinte valor de UUID da string:

  ```
  mysql> SET @uuid = '6ccd780c-baba-1026-9564-5b8c656024db';
  ```

  Para converter a string UUID para binário com ou sem troca da parte de tempo, use `UUID_TO_BIN()`:

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

  Para converter um UUID binário retornado por `UUID_TO_BIN()` para um UUID de string, use `BIN_TO_UUID()`. Se você gerar um UUID binário chamando `UUID_TO_BIN()` com um segundo argumento de 1 para trocar partes de tempo, você também deve passar um segundo argumento de 1 para `BIN_TO_UUID()` para desfazer a troca das partes de tempo ao converter o UUID binário de volta para um UUID de string:

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

  Se o uso do intercâmbio de partes de tempo não for o mesmo para a conversão em ambas as direções, o UUID original não é recuperado corretamente:

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

  Se `UUID_TO_BIN()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando do MySQL”.

- `VALUES(col_name)`

  Em uma declaração `INSERT ... ON DUPLICATE KEY UPDATE`, você pode usar a função `VALUES(col_name)` na cláusula `UPDATE` para referenciar os valores das colunas da parte `INSERT` da declaração. Em outras palavras, `VALUES(col_name)` na cláusula `UPDATE` refere-se ao valor de `col_name` que seria inserido, caso não houvesse conflito de chave duplicada. Essa função é especialmente útil em inserções de múltiplas linhas. A função `VALUES()` só tem significado na cláusula `ON DUPLICATE KEY UPDATE` das declarações `INSERT` e retorna `NULL` caso contrário. Veja a Seção 15.2.7.2, “Declaração INSERT ... ON DUPLICATE KEY UPDATE”.

  ```
  mysql> INSERT INTO table (a,b,c) VALUES (1,2,3),(4,5,6)
      -> ON DUPLICATE KEY UPDATE c=VALUES(a)+VALUES(b);
  ```

  Importante

  Esse uso é desaconselhável no MySQL 8.0.20 e está sujeito à remoção em uma futura versão do MySQL. Use um alias de linha ou aliases de linha e coluna, em vez disso. Consulte a Seção 15.2.7.2, “Instrução INSERT ... ON DUPLICATE KEY UPDATE”, para obter mais informações e exemplos.
