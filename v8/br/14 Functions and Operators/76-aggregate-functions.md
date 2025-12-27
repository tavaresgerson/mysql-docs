### 14.19.1 Descrições de Funções Agregadas

Esta seção descreve as funções agregadas que operam em conjuntos de valores. Elas são frequentemente usadas com uma cláusula `GROUP BY` para agrupar valores em subconjuntos.

**Tabela 14.29 Funções Agregadas**

<table><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>AVG()</code></td> <td> Retorna o valor médio do argumento </td> </tr><tr><td><code>BIT_AND()</code></td> <td> Retorna a operação de E bit a bit </td> </tr><tr><td><code>BIT_OR()</code></td> <td> Retorna a operação de OU bit a bit </td> </tr><tr><td><code>BIT_XOR()</code></td> <td> Retorna a operação de XOR bit a bit </td> </tr><tr><td><code>COUNT()</code></td> <td> Retorna o número de linhas retornadas </td> </tr><tr><td><code>COUNT(DISTINCT)</code></td> <td> Retorna o número de valores diferentes </td> </tr><tr><td><code>GROUP_CONCAT()</code></td> <td> Retorna uma string concatenada </td> </tr><tr><td><code>JSON_ARRAYAGG()</code></td> <td> Retorna o conjunto de resultados como um único array JSON </td> </tr><tr><td><code>JSON_OBJECTAGG()</code></td> <td> Retorna o conjunto de resultados como um único objeto JSON </td> </tr><tr><td><code>MAX()</code></td> <td> Retorna o valor máximo </td> </tr><tr><td><code>MIN()</code></td> <td> Retorna o valor mínimo </td> </tr><tr><td><code>STD()</code></td> <td> Retorna a desvio padrão da população </td> </tr><tr><td><code>STDDEV()</code></td> <td> Retorna a desvio padrão da população </td> </tr><tr><td><code>STDDEV_POP()</code></td> <td> Retorna a desvio padrão da população </td> </tr><tr><td><code>STDDEV_SAMP()</code></td> <td> Retorna a desvio padrão da amostra </td> </tr><tr><td><code>SUM()</code></td> <td> Retorna a soma </td> </tr><tr><td><code>VAR_POP()</code></td> <td> Retorna a variância padrão da população </td> </tr><tr><td><code>VAR_SAMP()</code></td> <td> Retorna a variância da amostra </td> </tr><tr><td><code>VARIANCE()</code></td> <td> Retorna a variância padrão da população </td> </tr></tbody></table>

A menos que especificado de outra forma, as funções agregadas ignoram os valores `NULL`.

Se você usar uma função agregada em uma instrução que não contenha a cláusula `GROUP BY`, ela será equivalente a agrupar todas as linhas. Para obter mais informações, consulte a Seção 14.19.3, “Tratamento do MySQL do GROUP BY”.

A maioria das funções agregadas pode ser usada como funções de janela. Aquelas que podem ser usadas dessa maneira são indicadas na descrição da sintaxe por `[over_clause]`, representando uma cláusula `OVER` opcional. *`over_clause`* é descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”, que também inclui outras informações sobre o uso de funções de janela.

Para argumentos numéricos, as funções de variância e desvio padrão retornam um valor `DOUBLE` - FLOAT, DOUBLE"). As funções `SUM()` e `AVG()` retornam um valor `DECIMAL` - DECIMAL, NUMERIC") para argumentos de valor exato (inteiro ou `DECIMAL` - DECIMAL, NUMERIC")), e um valor `DOUBLE` - FLOAT, DOUBLE") para argumentos de valor aproximado ( `FLOAT` - FLOAT, DOUBLE" ou `DOUBLE` - FLOAT, DOUBLE").

As funções agregadas `SUM()` e `AVG()` não funcionam com valores temporais. (Converter os valores em números, perdendo tudo após o primeiro caractere não numérico.) Para contornar esse problema, converta para unidades numéricas, realize a operação agregada e converta de volta para um valor temporal. Exemplos:

```
SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(time_col))) FROM tbl_name;
SELECT FROM_DAYS(SUM(TO_DAYS(date_col))) FROM tbl_name;
```

Funções como `SUM()` ou `AVG()` que esperam um argumento numérico convertem o argumento para um número, se necessário. Para valores de `SET` ou `ENUM`, a operação de cast faz com que o valor numérico subjacente seja usado.

As funções agregadas `BIT_AND()`, `BIT_OR()` e `BIT_XOR()` realizam operações de bits.

As funções e operadores de bits do MySQL permitem argumentos do tipo string binária ( `BINARY`, `VARBINARY` e os tipos `BLOB`) e retornam um valor de tipo semelhante, o que permite que eles tomem argumentos e produzam valores de retorno maiores que 64 bits. Para discussão sobre a avaliação de argumentos e tipos de resultado para operações de bits, consulte a discussão introdutória na Seção 14.12, “Funções e Operadores de Bits”.

* `AVG([DISTINCT] expr) [over_clause]`

Retorna o valor médio de `expr`. A opção `DISTINCT` pode ser usada para retornar a média dos valores distintos de *`expr`*.

Se não houver linhas correspondentes, `AVG()` retorna `NULL`. A função também retorna `NULL` se *`expr`* for `NULL`.

Esta função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”; não pode ser usada com `DISTINCT`.

```
  mysql> SELECT student_name, AVG(test_score)
         FROM student
         GROUP BY student_name;
  ```XdFdKmbXMR```
  mysql> SELECT student.student_name,COUNT(*)
         FROM student,course
         WHERE student.student_id=course.student_id
         GROUP BY student_name;
  ```aggKtcaaAT```
  mysql> SELECT COUNT(*) FROM student;
  ```FznoIyMtAi```
  mysql> SELECT COUNT(DISTINCT results) FROM student;
  ```H7B2gBnzkC```
  GROUP_CONCAT([DISTINCT] expr [,expr ...]
               [ORDER BY {unsigned_integer | col_name | expr}
                   [ASC | DESC] [,col_name ...]]
               [SEPARATOR str_val])
  ```qDFmMkKdC9```
  mysql> SELECT student_name,
           GROUP_CONCAT(test_score)
         FROM student
         GROUP BY student_name;
  ```Tbn9KrJAnu```
  mysql> SELECT student_name,
           GROUP_CONCAT(DISTINCT test_score
                        ORDER BY test_score DESC SEPARATOR ' ')
         FROM student
         GROUP BY student_name;
  ```59KIhgu0Tz
```
  SET [GLOBAL | SESSION] group_concat_max_len = val;
  ```9ijiXg5sNg
* `JSON_OBJECTAGG(key, value) [over_clause]`

Aceita dois nomes de coluna ou expressões como argumentos, sendo o primeiro usado como chave e o segundo como valor, e retorna um objeto JSON contendo pares chave-valor. Retorna `NULL` se o resultado contiver nenhuma linha ou em caso de erro. Um erro ocorre se qualquer nome de chave for `NULL` ou se o número de argumentos não for igual a 2.

Esta função é executada como uma função de janela se o *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

```
  mysql> SELECT o_id, attribute, value FROM t3;
  +------+-----------+-------+
  | o_id | attribute | value |
  +------+-----------+-------+
  |    2 | color     | red   |
  |    2 | fabric    | silk  |
  |    3 | color     | green |
  |    3 | shape     | square|
  +------+-----------+-------+
  4 rows in set (0.00 sec)

  mysql> SELECT o_id, JSON_ARRAYAGG(attribute) AS attributes
      -> FROM t3 GROUP BY o_id;
  +------+---------------------+
  | o_id | attributes          |
  +------+---------------------+
  |    2 | ["color", "fabric"] |
  |    3 | ["color", "shape"]  |
  +------+---------------------+
  2 rows in set (0.00 sec)
  ```

**Tratamento de chaves duplicadas.** Quando o resultado desta função é normalizado, os valores com chaves duplicadas são descartados. De acordo com a especificação do tipo de dados `JSON` do MySQL, que não permite chaves duplicadas, apenas o último valor encontrado é usado com essa chave no objeto retornado (“a chave com o último valor duplicado vence”). Isso significa que o resultado do uso desta função em colunas de uma `SELECT` pode depender da ordem em que as linhas são retornadas, o que não é garantido.

Quando usada como uma função de janela, se houver chaves duplicadas dentro de uma estrutura, apenas o último valor para a chave está presente no resultado. O valor para a chave da última linha da estrutura é determinístico se a especificação `ORDER BY` garantir que os valores tenham uma ordem específica. Se não, o valor resultante da chave é não determinístico.

Considere o seguinte:

```
  mysql> SELECT o_id, attribute, value FROM t3;
  +------+-----------+-------+
  | o_id | attribute | value |
  +------+-----------+-------+
  |    2 | color     | red   |
  |    2 | fabric    | silk  |
  |    3 | color     | green |
  |    3 | shape     | square|
  +------+-----------+-------+
  4 rows in set (0.00 sec)

  mysql> SELECT o_id, JSON_OBJECTAGG(attribute, value)
      -> FROM t3 GROUP BY o_id;
  +------+---------------------------------------+
  | o_id | JSON_OBJECTAGG(attribute, value)      |
  +------+---------------------------------------+
  |    2 | {"color": "red", "fabric": "silk"}    |
  |    3 | {"color": "green", "shape": "square"} |
  +------+---------------------------------------+
  2 rows in set (0.00 sec)
  ```

A chave escolhida da última consulta é não determinística. Se a consulta não usar `GROUP BY` (que geralmente impõe sua própria ordem independentemente) e você prefere uma ordem específica de chave, pode invocar `JSON_OBJECTAGG()` como uma função de janela incluindo uma cláusula `OVER` com uma especificação `ORDER BY` para impor uma ordem específica nas linhas da estrutura. Os seguintes exemplos mostram o que acontece com e sem `ORDER BY` para algumas especificações de estrutura diferentes.

Sem `ORDER BY`, a estrutura é toda a partição:

```
  mysql> CREATE TABLE t(c VARCHAR(10), i INT);
  Query OK, 0 rows affected (0.33 sec)

  mysql> INSERT INTO t VALUES ('key', 3), ('key', 4), ('key', 5);
  Query OK, 3 rows affected (0.10 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> SELECT c, i FROM t;
  +------+------+
  | c    | i    |
  +------+------+
  | key  |    3 |
  | key  |    4 |
  | key  |    5 |
  +------+------+
  3 rows in set (0.00 sec)

  mysql> SELECT JSON_OBJECTAGG(c, i) FROM t;
  +----------------------+
  | JSON_OBJECTAGG(c, i) |
  +----------------------+
  | {"key": 5}           |
  +----------------------+
  1 row in set (0.00 sec)

  mysql> DELETE FROM t;
  Query OK, 3 rows affected (0.08 sec)

  mysql> INSERT INTO t VALUES ('key', 3), ('key', 5), ('key', 4);
  Query OK, 3 rows affected (0.06 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> SELECT c, i FROM t;
  +------+------+
  | c    | i    |
  +------+------+
  | key  |    3 |
  | key  |    5 |
  | key  |    4 |
  +------+------+
  3 rows in set (0.00 sec)

  mysql> SELECT JSON_OBJECTAGG(c, i) FROM t;
  +----------------------+
  | JSON_OBJECTAGG(c, i) |
  +----------------------+
  | {"key": 4}           |
  +----------------------+
  1 row in set (0.00 sec)
  ```

Com `ORDER BY`, onde o frame é o padrão de `RANGE ENTRE O ROTEIRO ANTERIOR E A ROTA CORRENTE` (em ordem crescente e decrescente):

```
  mysql> SELECT JSON_OBJECTAGG(c, i)
         OVER () AS json_object FROM t;
  +-------------+
  | json_object |
  +-------------+
  | {"key": 4}  |
  | {"key": 4}  |
  | {"key": 4}  |
  +-------------+
  ```

Com `ORDER BY` e um frame explícito de toda a partição:

```
  mysql> SELECT JSON_OBJECTAGG(c, i)
         OVER (ORDER BY i) AS json_object FROM t;
  +-------------+
  | json_object |
  +-------------+
  | {"key": 3}  |
  | {"key": 4}  |
  | {"key": 5}  |
  +-------------+
  mysql> SELECT JSON_OBJECTAGG(c, i)
         OVER (ORDER BY i DESC) AS json_object FROM t;
  +-------------+
  | json_object |
  +-------------+
  | {"key": 5}  |
  | {"key": 4}  |
  | {"key": 3}  |
  +-------------+
  ```

Para retornar um valor de chave específico (como o menor ou maior), inclua uma cláusula `LIMIT` na consulta apropriada. Por exemplo:

```
  mysql> SELECT JSON_OBJECTAGG(c, i)
         OVER (ORDER BY i
              ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
          AS json_object
         FROM t;
  +-------------+
  | json_object |
  +-------------+
  | {"key": 5}  |
  | {"key": 5}  |
  | {"key": 5}  |
  +-------------+
  ```

Consulte  Normalização, Fusão e Autoenrolagem de Valores JSON, para obter informações e exemplos adicionais.
* `MAX([DISTINCT] expr) [over_clause]`

Retorna o valor máximo de *`expr`*. `MAX()` pode aceitar um argumento de string; nesses casos, ele retorna o valor de string máximo. Consulte  Seção 10.3.1, “Como o MySQL Usa Índices”. A palavra-chave `DISTINCT` pode ser usada para encontrar o máximo dos valores distintos de *`expr`*, no entanto, isso produz o mesmo resultado que omitir `DISTINCT`.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, `MAX()` retorna `NULL`.

Esta função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”; não pode ser usado com `DISTINCT`.

```
  mysql> SELECT JSON_OBJECTAGG(c, i)
         OVER (ORDER BY i) AS json_object FROM t LIMIT 1;
  +-------------+
  | json_object |
  +-------------+
  | {"key": 3}  |
  +-------------+
  mysql> SELECT JSON_OBJECTAGG(c, i)
         OVER (ORDER BY i DESC) AS json_object FROM t LIMIT 1;
  +-------------+
  | json_object |
  +-------------+
  | {"key": 5}  |
  +-------------+
  ```

Para `MAX()`, o MySQL atualmente compara colunas `ENUM` e `SET` pelo seu valor de string em vez da posição relativa da string no conjunto. Isso difere da forma como `ORDER BY` as compara.
* `MIN([DISTINCT] expr) [over_clause]`

Retorna o valor mínimo de *`expr`*. `MIN()` pode aceitar um argumento de string; nesses casos, ele retorna o valor de string mínimo. Consulte  Seção 10.3.1, “Como o MySQL Usa Índices”. A palavra-chave `DISTINCT` pode ser usada para encontrar o mínimo dos valores distintos de *`expr`*, no entanto, isso produz o mesmo resultado que omitir `DISTINCT`.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, `MIN()` retorna `NULL`.

Esta função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”; não pode ser usado com `DISTINCT`.

```
  mysql> SELECT student_name, MIN(test_score), MAX(test_score)
         FROM student
         GROUP BY student_name;
  ```

Para `MIN()`, o MySQL atualmente compara colunas `ENUM` e `SET` pelo seu valor de string em vez da posição relativa da string no conjunto. Isso difere da forma como `ORDER BY` as compara.
* `STD(expr) [over_clause]`

Retorna a desvio padrão populacional de *`expr`*. `STD()` é um sinônimo da função SQL padrão `STDDEV_POP()`, fornecida como uma extensão do MySQL.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, `STD()` retorna `NULL`.

Esta função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.
* `STDDEV(expr) [over_clause]`

Retorna a desvio padrão populacional de *`expr`*. `STDDEV()` é um sinônimo da função SQL padrão `STDDEV_POP()`, fornecida para compatibilidade com o Oracle.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, `STDDEV()` retorna `NULL`.

Esta função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.
* `STDDEV_POP(expr) [over_clause]`

Retorna a desvio padrão populacional de *`expr`* (a raiz quadrada de `VAR_POP()`. Você também pode usar `STD()` ou `STDDEV()`, que são equivalentes, mas não são SQL padrão).

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, `STDDEV_POP()` retorna `NULL`.

Esta função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.
* `STDDEV_SAMP(expr) [over_clause]`

Retorna a desvio padrão amostral de *`expr`* (a raiz quadrada de `VAR_SAMP()`.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, `STDDEV_SAMP()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.
* `SUM([DISTINCT] expr) [over_clause]`

Retorna a soma de *`expr`*. Se o conjunto de retorno não tiver linhas, o `SUM()` retorna `NULL`. A palavra-chave `DISTINCT` pode ser usada para somar apenas os valores distintos de *`expr`*.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, o `SUM()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”; não pode ser usada com `DISTINCT`.
* `VAR_POP(expr) [over_clause]`

Retorna a variância padrão da população de *`expr`*. Considera as linhas como a população inteira, não como uma amostra, portanto, tem o número de linhas como denominador. Você também pode usar `VARIANCE()`, que é equivalente, mas não é o padrão do SQL.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, o `VAR_POP()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.
* `VAR_SAMP(expr) [over_clause]`

Retorna a variância da amostra de *`expr`*. Ou seja, o denominador é o número de linhas menos um.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, o `VAR_SAMP()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.
* `VARIANCE(expr) [over_clause]`

Retorna a variância padrão da população de *`expr`*. `VARIANCE()` é um sinônimo da função padrão do SQL `VAR_POP()`, fornecida como uma extensão do MySQL.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, o `VARIANCE()` retorna `NULL`.

Essa função é executada como uma função de janela se o *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, "Conceitos e Sintaxe de Funções de Janela".