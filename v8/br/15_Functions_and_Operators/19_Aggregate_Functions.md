## 14.19 Funções agregadas

As funções agregadas operam em conjuntos de valores. Elas são frequentemente usadas com uma cláusula `GROUP BY` para agrupar valores em subconjuntos. Esta seção descreve a maioria das funções agregadas. Para informações sobre funções agregadas que operam em valores de geometria, consulte a Seção 14.16.12, “Funções Agregadas Espaciais”.

### 14.19.1 Descrição das Funções Agregadas

Esta seção descreve funções agregadas que operam em conjuntos de valores. Elas são frequentemente usadas com uma cláusula `GROUP BY` para agrupar valores em subconjuntos.

**Tabela 14.29 Funções agregadas**

<table frame="box" rules="all" summary="A reference that lists aggregate functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>AVG()</code></td> <td>Retorne o valor médio do argumento</td> </tr><tr><td><code>BIT_AND()</code></td> <td>Bit a bit e AND</td> </tr><tr><td><code>BIT_OR()</code></td> <td>Bitwise OR</td> </tr><tr><td><code>BIT_XOR()</code></td> <td>Bitwise XOR</td> </tr><tr><td><code>COUNT()</code></td> <td>Retorne um contador do número de linhas retornadas</td> </tr><tr><td><code>COUNT(DISTINCT)</code></td> <td>Retorne o contagem de um número de valores diferentes</td> </tr><tr><td><code>GROUP_CONCAT()</code></td> <td>Retorne uma string concatenada</td> </tr><tr><td><code>JSON_ARRAYAGG()</code></td> <td>Retorne o conjunto de resultados como um único array JSON</td> </tr><tr><td><code>JSON_OBJECTAGG()</code></td> <td>Retorne o conjunto de resultados como um único objeto JSON</td> </tr><tr><td><code>MAX()</code></td> <td>Retorne o valor máximo</td> </tr><tr><td><code>MIN()</code></td> <td>Retorne o valor mínimo</td> </tr><tr><td><code>STD()</code></td> <td>Retorne a desvio padrão da população</td> </tr><tr><td><code>STDDEV()</code></td> <td>Retorne a desvio padrão da população</td> </tr><tr><td><code>STDDEV_POP()</code></td> <td>Retorne a desvio padrão da população</td> </tr><tr><td><code>STDDEV_SAMP()</code></td> <td>Retorne a desvio padrão da amostra</td> </tr><tr><td><code>SUM()</code></td> <td>Devolva a soma</td> </tr><tr><td><code>VAR_POP()</code></td> <td>Retorne a variância padrão da população</td> </tr><tr><td><code>VAR_SAMP()</code></td> <td>Retorne a variância da amostra</td> </tr><tr><td><code>VARIANCE()</code></td> <td>Retorne a variância padrão da população</td> </tr></tbody></table>

A menos que haja indicação em contrário, as funções agregadas ignoram os valores de `NULL`.

Se você usar uma função agregada em uma declaração que não contém nenhuma cláusula `GROUP BY`, ela é equivalente a agrupar todas as linhas. Para mais informações, consulte a Seção 14.19.3, “Tratamento do MySQL do GROUP BY”.

A maioria das funções agregadas pode ser usada como funções de janela. Aquelas que podem ser usadas dessa maneira são indicadas em sua descrição sintática por `[over_clause]`, representando uma cláusula opcional `OVER`. *`over_clause`* é descrito na Seção 14.20.2, “Conceitos e Sintaxe de Função de Janela”, que também inclui outras informações sobre o uso de funções de janela.

Para argumentos numéricos, as funções de variância e desvio padrão retornam um valor `DOUBLE` - FLOAT, DOUBLE"). As funções `SUM()` e `AVG()` retornam um valor `DECIMAL` - DECIMAL, NUMERIC") para argumentos de valor exato (inteiro ou `DECIMAL` - DECIMAL, NUMERIC")), e um valor `DOUBLE` - FLOAT, DOUBLE") para argumentos de valor aproximado (`FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE")).

As funções agregadas `SUM()` e `AVG()` não funcionam com valores temporais. (Elas convertem os valores em números, perdendo tudo após o primeiro caractere não numérico.) Para contornar esse problema, converta para unidades numéricas, realize a operação agregada e converta de volta a um valor temporal. Exemplos:

```
SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(time_col))) FROM tbl_name;
SELECT FROM_DAYS(SUM(TO_DAYS(date_col))) FROM tbl_name;
```

Funções como `SUM()` ou `AVG()` que esperam um argumento numérico convertem o argumento em um número, se necessário. Para os valores de `SET` ou `ENUM`, a operação de conversão faz com que o valor numérico subjacente seja usado.

As funções agregadas `BIT_AND()`, `BIT_OR()` e `BIT_XOR()` realizam operações de bits. Antes do MySQL 8.0, as funções e operadores de bits exigiam `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (inteiro de 64 bits) e retornavam valores de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e, portanto, tinham um alcance máximo de 64 bits. Os argumentos que não eram `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") eram convertidos em `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") antes de realizar a operação e poderia ocorrer a truncagem.

No MySQL 8.0, as funções e operadores de bits permitem argumentos do tipo de string binária (os tipos `BINARY`, `VARBINARY` e `BLOB`) e retornam um valor do mesmo tipo, o que permite que eles recebam argumentos e produzam valores de retorno maiores que 64 bits. Para discussão sobre a avaliação de argumentos e tipos de resultado para operações de bits, consulte a discussão introdutória na Seção 14.12, “Funções e Operadores de Bits”.

* `AVG([DISTINCT] expr) [over_clause]`(aggregate-functions.html#function_avg)

Retorna o valor médio de `expr`. A opção `DISTINCT` pode ser usada para retornar a média dos valores distintos de *`expr`*.

Se não houver linhas correspondentes, `AVG()` retorna `NULL`. A função também retorna `NULL` se *`expr`* é `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e sintaxe de função de janela”; não pode ser usada com `DISTINCT`.

  ```
  mysql> SELECT student_name, AVG(test_score)
         FROM student
         GROUP BY student_name;
  ```

* `BIT_AND(expr) [over_clause]`(aggregate-functions.html#function_bit-and)

Retorna o bitwise `AND` de todos os bits em *`expr`*.

O tipo de resultado depende de se os valores dos argumentos da função são avaliados como strings binárias ou números:

A avaliação de cadeia binária ocorre quando os valores dos argumentos têm um tipo de cadeia binária e o argumento não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com conversão do valor do argumento em inteiros de 64 bits não assinados, conforme necessário.

A avaliação de string binária produz uma string binária da mesma extensão que os valores dos argumentos. Se os valores dos argumentos tiverem extensões desiguais, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. Se o tamanho do argumento exceder 511 bytes, ocorre um erro [[`ER_INVALID_BITWISE_AGGREGATE_OPERANDS_SIZE`]. A avaliação numérica produz um inteiro não assinado de 64 bits.

Se não houver linhas correspondentes, `BIT_AND()` retorna um valor neutro (todos os bits definidos como 1) com o mesmo comprimento que os valores dos argumentos.

Os valores de `NULL` não afetam o resultado, a menos que todos os valores sejam `NULL`. Nesse caso, o resultado é um valor neutro com o mesmo comprimento que os valores dos argumentos.

Para mais informações sobre discussão sobre avaliação de argumentos e tipos de resultado, consulte a discussão introdutória na Seção 14.12, “Funções e Operadores de Bit”.

Se `BIT_AND()` for invocado dentro do cliente **mysql**, os resultados de cadeia binária são exibidos usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.

A partir do MySQL 8.0.12, essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e sintaxe de função de janela”.

* `BIT_OR(expr) [over_clause]`(aggregate-functions.html#function_bit-or)

Retorna o bitwise `OR` de todos os bits em *`expr`*.

O tipo de resultado depende de se os valores dos argumentos da função são avaliados como strings binárias ou números:

A avaliação de cadeia binária ocorre quando os valores dos argumentos têm um tipo de cadeia binária e o argumento não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com conversão do valor do argumento em inteiros de 64 bits não assinados, conforme necessário.

+ A avaliação de string binária produz uma string binária da mesma extensão que os valores dos argumentos. Se os valores dos argumentos tiverem extensões desiguais, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. Se o tamanho do argumento exceder 511 bytes, ocorre um erro [[`ER_INVALID_BITWISE_AGGREGATE_OPERANDS_SIZE`]. A avaliação numérica produz um inteiro de 64 bits não assinado.

Se não houver linhas correspondentes, `BIT_OR()` retorna um valor neutro (todos os bits definidos como 0) com o mesmo comprimento que os valores dos argumentos.

Os valores de `NULL` não afetam o resultado, a menos que todos os valores sejam `NULL`. Nesse caso, o resultado é um valor neutro com o mesmo comprimento que os valores dos argumentos.

Para mais informações sobre discussão sobre avaliação de argumentos e tipos de resultado, consulte a discussão introdutória na Seção 14.12, “Funções e Operadores de Bit”.

Se `BIT_OR()` for invocado dentro do cliente **mysql**, os resultados de cadeia binária são exibidos usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.

A partir do MySQL 8.0.12, essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e sintaxe de função de janela”.

* `BIT_XOR(expr) [over_clause]`(aggregate-functions.html#function_bit-xor)

Retorna o bitwise `XOR` de todos os bits em *`expr`*.

O tipo de resultado depende de se os valores dos argumentos da função são avaliados como strings binárias ou números:

A avaliação de cadeia binária ocorre quando os valores dos argumentos têm um tipo de cadeia binária e o argumento não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com conversão do valor do argumento em inteiros de 64 bits não assinados, conforme necessário.

+ A avaliação de string binária produz uma string binária da mesma extensão que os valores dos argumentos. Se os valores dos argumentos tiverem extensões desiguais, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. Se o tamanho do argumento exceder 511 bytes, ocorre um erro `ER_INVALID_BITWISE_AGGREGATE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro não assinado de 64 bits.

Se não houver linhas correspondentes, `BIT_XOR()` retorna um valor neutro (todos os bits definidos como 0) com o mesmo comprimento que os valores dos argumentos.

Os valores de `NULL` não afetam o resultado, a menos que todos os valores sejam `NULL`. Nesse caso, o resultado é um valor neutro com o mesmo comprimento que os valores dos argumentos.

Para mais informações sobre discussão sobre avaliação de argumentos e tipos de resultado, consulte a discussão introdutória na Seção 14.12, “Funções e Operadores de Bit”.

Se `BIT_XOR()` for invocado dentro do cliente **mysql**, os resultados de cadeia binária são exibidos usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.

A partir do MySQL 8.0.12, essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e sintaxe de função de janela”.

* `COUNT(expr) [over_clause]`(aggregate-functions.html#function_count)

Retorna um contador do número de valores não de *`NULL`* de *`expr`* nas linhas recuperadas por uma declaração `SELECT`. O resultado é um valor de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

Se não houver linhas correspondentes, `COUNT()` retorna `0`. `COUNT(NULL)` retorna 0.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, "Conceitos e sintaxe de função de janela".

  ```
  mysql> SELECT student.student_name,COUNT(*)
         FROM student,course
         WHERE student.student_id=course.student_id
         GROUP BY student_name;
  ```

`COUNT(*)` é um pouco diferente, pois retorna um contador do número de linhas recuperadas, independentemente de elas conterem ou não valores de `NULL`.

Para motores de armazenamento transacional, como `InnoDB`, armazenar um número exato de linhas é problemático. Múltiplas transações podem estar ocorrendo ao mesmo tempo, e cada uma delas pode afetar o contagem.

`InnoDB` não mantém um contador interno de linhas em uma tabela, porque transações concorrentes podem "ver" diferentes números de linhas ao mesmo tempo. Consequentemente, as declarações `SELECT COUNT(*)` contam apenas as linhas visíveis para a transação atual.

A partir do MySQL 8.0.13, o desempenho da consulta `SELECT COUNT(*) FROM tbl_name` para as tabelas `InnoDB` é otimizado para cargas de trabalho monofiladas, desde que não haja cláusulas adicionais, como `WHERE` ou `GROUP BY`.

`InnoDB` processa as declarações `SELECT COUNT(*)` ao percorrer o menor índice secundário disponível, a menos que uma dica de índice ou otimizador indique ao otimizador que use um índice diferente. Se um índice secundário não estiver presente, `InnoDB` processa as declarações `SELECT COUNT(*)` ao digitalizar o índice agrupado.

O processamento das declarações `SELECT COUNT(*)` leva algum tempo se os registros do índice não estiverem totalmente no buffer pool. Para uma contagem mais rápida, crie uma tabela de contagem e deixe sua aplicação atualizá-la de acordo com as inserções e exclusões que ela realiza. No entanto, esse método pode não escalar bem em situações em que milhares de transações concorrentes estão iniciando atualizações na mesma tabela de contagem. Se um número aproximado de linhas for suficiente, use `SHOW TABLE STATUS`.

`InnoDB` lida com as operações de `SELECT COUNT(*)` e `SELECT COUNT(1)` da mesma maneira. Não há diferença de desempenho.

Para as tabelas `MyISAM`, `COUNT(*)` é otimizado para retornar muito rapidamente se o `SELECT` recuperar de uma tabela, sem que outras colunas sejam recuperadas e não há cláusula `WHERE`. Por exemplo:

  ```
  mysql> SELECT COUNT(*) FROM student;
  ```

Essa otimização só se aplica às tabelas `MyISAM`, porque um número exato de linhas é armazenado para esse mecanismo de armazenamento e pode ser acessado muito rapidamente. `COUNT(1)` está sujeito à mesma otimização apenas se a primeira coluna for definida como `NOT NULL`.

* `COUNT(DISTINCT expr,[expr...])`(aggregate-functions.html#function_count)

Retorna um contador do número de linhas com valores diferentes de `NULL` *`expr`*.

Se não houver linhas correspondentes, `COUNT(DISTINCT)` retorna `0`.

  ```
  mysql> SELECT COUNT(DISTINCT results) FROM student;
  ```

Em MySQL, você pode obter o número de combinações de expressões distintas que não contenham `NULL` fornecendo uma lista de expressões. Em SQL padrão, você teria que fazer uma concatenação de todas as expressões dentro de `COUNT(DISTINCT ...)`.

* `GROUP_CONCAT(expr)`

Essa função retorna um resultado em forma de string com os valores concatenados que não são `NULL` de um grupo. Ela retorna `NULL` se não houver valores que não são `NULL`. A sintaxe completa é a seguinte:

  ```
  GROUP_CONCAT([DISTINCT] expr [,expr ...]
               [ORDER BY {unsigned_integer | col_name | expr}
                   [ASC | DESC] [,col_name ...]]
               [SEPARATOR str_val])
  ```

  ```
  mysql> SELECT student_name,
           GROUP_CONCAT(test_score)
         FROM student
         GROUP BY student_name;
  ```

Ou:

  ```
  mysql> SELECT student_name,
           GROUP_CONCAT(DISTINCT test_score
                        ORDER BY test_score DESC SEPARATOR ' ')
         FROM student
         GROUP BY student_name;
  ```

Em MySQL, você pode obter os valores concatenados das combinações de expressão. Para eliminar valores duplicados, use a cláusula `DISTINCT`. Para ordenar os valores no resultado, use a cláusula `ORDER BY`. Para ordenar em ordem inversa, adicione a palavra-chave `DESC` (descrescente) ao nome da coluna que você está ordenando na cláusula `ORDER BY`. O padrão é a ordem ascendente; isso pode ser especificado explicitamente usando a palavra-chave `ASC`. O separador padrão entre os valores em um grupo é a vírgula (`,`). Para especificar um separador explicitamente, use `SEPARATOR` seguido pelo valor literal da string que deve ser inserido entre os valores do grupo. Para eliminar o separador completamente, especifique `SEPARATOR ''`.

O resultado é truncado para o comprimento máximo que é dado pela variável de sistema `group_concat_max_len`, que tem um valor padrão de 1024. O valor pode ser ajustado para um valor maior, embora o comprimento máximo efetivo do valor de retorno seja limitado pelo valor de `max_allowed_packet`. A sintaxe para alterar o valor de `group_concat_max_len` em tempo de execução é a seguinte, onde *`val`* é um inteiro sem sinal:

  ```
  SET [GLOBAL | SESSION] group_concat_max_len = val;
  ```

O valor de retorno é uma string não binária ou binária, dependendo se os argumentos são strings não binárias ou binárias. O tipo de resultado é `TEXT` ou `BLOB`, a menos que `group_concat_max_len` seja menor ou igual a 512, caso em que o tipo de resultado é `VARCHAR` ou `VARBINARY`.

Se `GROUP_CONCAT()` for invocado dentro do cliente **mysql**, os resultados de cadeia binária são exibidos usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.

Veja também `CONCAT()` e `CONCAT_WS()`: Seção 14.8, “Funções e operadores de cadeia”.

* `JSON_ARRAYAGG(col_or_expr) [over_clause]`(aggregate-functions.html#function_json-arrayagg)

Agrupa um conjunto de resultados como um único array `JSON` cujos elementos consistem nas linhas. A ordem dos elementos neste array é indefinida. A função atua em uma coluna ou em uma expressão que avalia a um único valor. Retorna `NULL` se o resultado não contiver nenhuma linha, ou em caso de erro. Se *`col_or_expr`* é `NULL`, a função retorna um array de elementos JSON `[null]`.

A partir do MySQL 8.0.14, essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e sintaxe de função de janela”.

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

* `JSON_OBJECTAGG(key, value) [over_clause]`(aggregate-functions.html#function_json-objectagg)

Pede dois nomes de coluna ou expressões como argumentos, sendo o primeiro usado como chave e o segundo como valor, e retorna um objeto JSON contendo pares chave-valor. Retorna `NULL` se o resultado não contiver nenhuma linha, ou em caso de erro. Um erro ocorre se qualquer nome de chave for `NULL` ou se o número de argumentos não for igual a 2.

A partir do MySQL 8.0.14, essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e sintaxe de função de janela”.

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

**Tratamento de chaves duplicadas.** Quando o resultado desta função é normalizado, os valores com chaves duplicadas são descartados. De acordo com a especificação do tipo de dados `JSON` do MySQL, que não permite chaves duplicadas, apenas o último valor encontrado é usado com essa chave no objeto retornado (“a chave duplicada ganha”). Isso significa que o resultado do uso desta função em colunas de um `SELECT` pode depender da ordem em que as linhas são retornadas, o que não é garantido.

Quando usado como uma função de janela, se houver chaves duplicadas dentro de um quadro, apenas o último valor para a chave está presente no resultado. O valor para a chave da última linha do quadro é determinístico se a especificação `ORDER BY` garantir que os valores tenham uma ordem específica. Se não, o valor resultante da chave é não determinístico.

Considere o seguinte:

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

A chave escolhida na última consulta é não determinística. Se a consulta não usar `GROUP BY` (que geralmente impõe sua própria ordem) e você prefere uma ordem de chave específica, pode invocar `JSON_OBJECTAGG()` como uma função de janela, incluindo uma cláusula `OVER` com uma especificação `ORDER BY` para impor uma ordem específica nas linhas do quadro. Os exemplos seguintes mostram o que acontece com e sem `ORDER BY` para algumas especificações de quadro diferentes.

Sem `ORDER BY`, a estrutura é toda a partição:

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

Com `ORDER BY`, onde o quadro é a opção padrão de `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` (tanto em ordem crescente quanto decrescente):

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

Com `ORDER BY` e um quadro explícito de toda a partição:

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

Para retornar um valor de chave específico (como o menor ou maior), inclua uma cláusula `LIMIT` na consulta apropriada. Por exemplo:

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

Veja Normalização, Fusão e Autoenrolado de Valores JSON, para obter informações adicionais e exemplos.

* `MAX([DISTINCT] expr) [over_clause]`(aggregate-functions.html#function_max)

Retorna o valor máximo de *`expr`*. `MAX()` pode receber um argumento de string; nesses casos, ele retorna o valor máximo da string. Veja a Seção 10.3.1, “Como o MySQL usa índices”. A palavra-chave `DISTINCT` pode ser usada para encontrar o máximo dos valores distintos de *`expr`*, no entanto, isso produz o mesmo resultado que omitir `DISTINCT`.

Se não houver linhas correspondentes, ou se *`expr`* for `NULL`, `MAX()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, "Conceitos e sintaxe de função de janela"; não pode ser usada com `DISTINCT`.

  ```
  mysql> SELECT student_name, MIN(test_score), MAX(test_score)
         FROM student
         GROUP BY student_name;
  ```

Para `MAX()`, o MySQL atualmente compara as colunas `ENUM` e `SET` por seu valor de string em vez da posição relativa da string no conjunto. Isso difere da forma como `ORDER BY` as compara.

* `MIN([DISTINCT] expr) [over_clause]`(aggregate-functions.html#function_min)

Retorna o valor mínimo de *`expr`*. `MIN()` pode receber um argumento de string; nesses casos, ele retorna o valor mínimo da string. Veja a Seção 10.3.1, “Como o MySQL usa índices”. A palavra-chave `DISTINCT` pode ser usada para encontrar o mínimo dos valores distintos de *`expr`*, no entanto, isso produz o mesmo resultado que omitir `DISTINCT`.

Se não houver linhas correspondentes, ou se *`expr`* for `NULL`, `MIN()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, "Conceitos e sintaxe de função de janela"; não pode ser usada com `DISTINCT`.

  ```
  mysql> SELECT student_name, MIN(test_score), MAX(test_score)
         FROM student
         GROUP BY student_name;
  ```

Para `MIN()`, o MySQL atualmente compara as colunas `ENUM` e `SET` por seu valor de string em vez da posição relativa da string no conjunto. Isso difere da forma como `ORDER BY` as compara.

* `STD(expr) [over_clause]`(aggregate-functions.html#function_std)

Retorna a desvio padrão populacional de *`expr`*. `STD()` é sinônimo da função padrão SQL `STDDEV_POP()`, fornecida como uma extensão MySQL.

Se não houver linhas correspondentes, ou se *`expr`* for `NULL`, `STD()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, "Conceitos e sintaxe de função de janela".

* `STDDEV(expr) [over_clause]`(aggregate-functions.html#function_stddev)

Retorna a desvio padrão populacional de *`expr`*. `STDDEV()` é sinônimo da função padrão SQL `STDDEV_POP()`, fornecida para compatibilidade com o Oracle.

Se não houver linhas correspondentes, ou se *`expr`* é `NULL`, `STDDEV()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, "Conceitos e sintaxe de função de janela".

* `STDDEV_POP(expr) [over_clause]`(aggregate-functions.html#function_stddev-pop)

Retorna a desvio padrão populacional de *`expr`* (a raiz quadrada de `VAR_POP()`). Você também pode usar `STD()` ou `STDDEV()`, que são equivalentes, mas não são SQL padrão.

Se não houver linhas correspondentes, ou se *`expr`* é `NULL`, `STDDEV_POP()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, "Conceitos e sintaxe de função de janela".

* `STDDEV_SAMP(expr) [over_clause]`(aggregate-functions.html#function_stddev-samp)

Retorna a desvio padrão amostral de *`expr`* (a raiz quadrada de `VAR_SAMP()`.

Se não houver linhas correspondentes, ou se *`expr`* é `NULL`, `STDDEV_SAMP()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, "Conceitos e sintaxe de função de janela".

* `SUM([DISTINCT] expr) [over_clause]`(aggregate-functions.html#function_sum)

Retorna a soma de *`expr`*. Se o conjunto de retorno não tiver linhas, `SUM()` retorna `NULL`. A palavra-chave `DISTINCT` pode ser usada para somar apenas os valores distintos de *`expr`*.

Se não houver linhas correspondentes, ou se *`expr`* for `NULL`, `SUM()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, "Conceitos e sintaxe de função de janela"; não pode ser usada com `DISTINCT`.

* `VAR_POP(expr) [over_clause]`(aggregate-functions.html#function_var-pop)

Retorna a variância padrão da população de *`expr`*. Considera as linhas como a população inteira, não como uma amostra, portanto, tem o número de linhas como denominador. Você também pode usar `VARIANCE()`, que é equivalente, mas não é SQL padrão.

Se não houver linhas correspondentes, ou se *`expr`* é `NULL`, `VAR_POP()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, "Conceitos e sintaxe de função de janela".

* `VAR_SAMP(expr) [over_clause]`(aggregate-functions.html#function_var-samp)

Retorna a variância amostral de *`expr`*. Ou seja, o denominador é o número de linhas menos um.

Se não houver linhas correspondentes, ou se *`expr`* for `NULL`, `VAR_SAMP()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, "Conceitos e sintaxe de função de janela".

* `VARIANCE(expr) [over_clause]`(aggregate-functions.html#function_variance)

Retorna a variância padrão da população de *`expr`*. `VARIANCE()` é sinônimo da função padrão SQL `VAR_POP()`, fornecida como uma extensão MySQL.

Se não houver linhas correspondentes, ou se *`expr`* é `NULL`, `VARIANCE()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, "Conceitos e sintaxe de função de janela".

### 14.19.2 Modificadores de GROUP BY

A cláusula `GROUP BY` permite um modificador `WITH ROLLUP` que faz com que a saída resumida inclua linhas extras que representam operações resumidas de nível superior (ou seja, super-agregadas). `ROLLUP` permite, assim, responder a perguntas em vários níveis de análise com uma única consulta. Por exemplo, `ROLLUP` pode ser usado para fornecer suporte a operações OLAP (Processamento Analítico Online).

Suponha que uma tabela `sales` tenha as colunas `year`, `country`, `product` e `profit` para registrar a rentabilidade das vendas:

```
CREATE TABLE sales
(
    year    INT,
    country VARCHAR(20),
    product VARCHAR(32),
    profit  INT
);
```

Para resumir o conteúdo da tabela por ano, use um simples `GROUP BY` assim:

```
mysql> SELECT year, SUM(profit) AS profit
       FROM sales
       GROUP BY year;
+------+--------+
| year | profit |
+------+--------+
| 2000 |   4525 |
| 2001 |   3010 |
+------+--------+
```

A saída mostra o lucro total (agregado) para cada ano. Para determinar também o lucro total somando todos os anos, você deve somar os valores individuais você mesmo ou executar uma consulta adicional. Ou você pode usar `ROLLUP`, que fornece ambos os níveis de análise com uma única consulta. Adicionando um modificador `WITH ROLLUP` à cláusula `GROUP BY`, a consulta produz outra linha (super-agregado) que mostra o total geral sobre todos os valores do ano:

```
mysql> SELECT year, SUM(profit) AS profit
       FROM sales
       GROUP BY year WITH ROLLUP;
+------+--------+
| year | profit |
+------+--------+
| 2000 |   4525 |
| 2001 |   3010 |
| NULL |   7535 |
+------+--------+
```

O valor `NULL` na coluna `year` identifica a linha do superagregado de total geral.

`ROLLUP` tem um efeito mais complexo quando há várias colunas `GROUP BY`. Neste caso, cada vez que há uma mudança no valor em qualquer coluna, exceto a última coluna de agrupamento, a consulta produz uma linha de resumo superagregado extra.

Por exemplo, sem `ROLLUP`, um resumo da tabela `sales` com base em `year`, `country` e `product` pode parecer assim, onde a saída indica valores resumidos apenas no nível de análise ano/país/produto:

```
mysql> SELECT year, country, product, SUM(profit) AS profit
       FROM sales
       GROUP BY year, country, product;
+------+---------+------------+--------+
| year | country | product    | profit |
+------+---------+------------+--------+
| 2000 | Finland | Computer   |   1500 |
| 2000 | Finland | Phone      |    100 |
| 2000 | India   | Calculator |    150 |
| 2000 | India   | Computer   |   1200 |
| 2000 | USA     | Calculator |     75 |
| 2000 | USA     | Computer   |   1500 |
| 2001 | Finland | Phone      |     10 |
| 2001 | USA     | Calculator |     50 |
| 2001 | USA     | Computer   |   2700 |
| 2001 | USA     | TV         |    250 |
+------+---------+------------+--------+
```

Com `ROLLUP` adicionado, a consulta produz várias linhas extras:

```
mysql> SELECT year, country, product, SUM(profit) AS profit
       FROM sales
       GROUP BY year, country, product WITH ROLLUP;
+------+---------+------------+--------+
| year | country | product    | profit |
+------+---------+------------+--------+
| 2000 | Finland | Computer   |   1500 |
| 2000 | Finland | Phone      |    100 |
| 2000 | Finland | NULL       |   1600 |
| 2000 | India   | Calculator |    150 |
| 2000 | India   | Computer   |   1200 |
| 2000 | India   | NULL       |   1350 |
| 2000 | USA     | Calculator |     75 |
| 2000 | USA     | Computer   |   1500 |
| 2000 | USA     | NULL       |   1575 |
| 2000 | NULL    | NULL       |   4525 |
| 2001 | Finland | Phone      |     10 |
| 2001 | Finland | NULL       |     10 |
| 2001 | USA     | Calculator |     50 |
| 2001 | USA     | Computer   |   2700 |
| 2001 | USA     | TV         |    250 |
| 2001 | USA     | NULL       |   3000 |
| 2001 | NULL    | NULL       |   3010 |
| NULL | NULL    | NULL       |   7535 |
+------+---------+------------+--------+
```

Agora, a saída inclui informações resumidas em quatro níveis de análise, e não apenas em um:

* Após cada conjunto de linhas de produtos para um ano e país específico, uma linha de resumo superagregado adicional aparece, mostrando o total para todos os produtos. Essas linhas têm a coluna `product` definida como `NULL`.

* Após cada conjunto de linhas para um ano dado, uma linha de resumo superagregado adicional aparece, mostrando o total para todos os países e produtos. Essas linhas têm as colunas `country` e `products` definidas como `NULL`.

* Por fim, após todas as outras linhas, uma linha de resumo superagregado extra aparece, mostrando o total geral para todos os anos, países e produtos. Essa linha tem as colunas `year`, `country` e `products` definidas como `NULL`.

Os indicadores `NULL` em cada linha de superagregado são produzidos quando a linha é enviada ao cliente. O servidor analisa as colunas nomeadas na cláusula `GROUP BY` seguindo a coluna mais à esquerda que tem o valor alterado. Para qualquer coluna no conjunto de resultados com um nome que corresponda a qualquer um desses nomes, seu valor é definido como `NULL`. (Se você especificar a agrupamento de colunas por posição da coluna, o servidor identifica quais colunas devem ser definidas como `NULL` por posição.)

Como os valores do `NULL` nas linhas do superagregado são colocados no conjunto de resultados em uma etapa tão tardia no processamento da consulta, você pode testá-los como valores do `NULL` apenas na lista de seleção ou na cláusula `HAVING`. Você não pode testá-los como valores do `NULL` em condições de junção ou na cláusula `WHERE` para determinar quais linhas selecionar. Por exemplo, você não pode adicionar `WHERE product IS NULL` à consulta para eliminar todas as linhas, exceto as do superagregado, do resultado.

Os valores `NULL` aparecem como `NULL` no lado do cliente e podem ser testados como tal usando qualquer interface de programação de cliente MySQL. No entanto, neste ponto, você não pode distinguir se um `NULL` representa um valor agrupado regular ou um valor superagregado. Para testar a distinção, use a função `GROUPING()`, descrita mais adiante.

Anteriormente, o MySQL não permitia o uso de `DISTINCT` ou `ORDER BY` em uma consulta que tivesse uma opção `WITH ROLLUP`. Essa restrição é levantada no MySQL 8.0.12 e versões posteriores. (Bug #87450, Bug #86311, Bug #26640100, Bug #26073513)

Para as consultas de `GROUP BY ... WITH ROLLUP`, para testar se os valores de `NULL` no resultado representam valores de superagregado, a função `GROUPING()` está disponível para uso na lista de seleção, na cláusula `HAVING` e (a partir do MySQL 8.0.12) na cláusula `ORDER BY`. Por exemplo, `GROUPING(year)` retorna 1 quando `NULL` na coluna `year` ocorre em uma linha de superagregado, e 0 de outra forma. Da mesma forma, `GROUPING(country)` e `GROUPING(product)` retornam 1 para valores de superagregado de `NULL` na coluna `country` e `product`, respectivamente:

```
mysql> SELECT
         year, country, product, SUM(profit) AS profit,
         GROUPING(year) AS grp_year,
         GROUPING(country) AS grp_country,
         GROUPING(product) AS grp_product
       FROM sales
       GROUP BY year, country, product WITH ROLLUP;
+------+---------+------------+--------+----------+-------------+-------------+
| year | country | product    | profit | grp_year | grp_country | grp_product |
+------+---------+------------+--------+----------+-------------+-------------+
| 2000 | Finland | Computer   |   1500 |        0 |           0 |           0 |
| 2000 | Finland | Phone      |    100 |        0 |           0 |           0 |
| 2000 | Finland | NULL       |   1600 |        0 |           0 |           1 |
| 2000 | India   | Calculator |    150 |        0 |           0 |           0 |
| 2000 | India   | Computer   |   1200 |        0 |           0 |           0 |
| 2000 | India   | NULL       |   1350 |        0 |           0 |           1 |
| 2000 | USA     | Calculator |     75 |        0 |           0 |           0 |
| 2000 | USA     | Computer   |   1500 |        0 |           0 |           0 |
| 2000 | USA     | NULL       |   1575 |        0 |           0 |           1 |
| 2000 | NULL    | NULL       |   4525 |        0 |           1 |           1 |
| 2001 | Finland | Phone      |     10 |        0 |           0 |           0 |
| 2001 | Finland | NULL       |     10 |        0 |           0 |           1 |
| 2001 | USA     | Calculator |     50 |        0 |           0 |           0 |
| 2001 | USA     | Computer   |   2700 |        0 |           0 |           0 |
| 2001 | USA     | TV         |    250 |        0 |           0 |           0 |
| 2001 | USA     | NULL       |   3000 |        0 |           0 |           1 |
| 2001 | NULL    | NULL       |   3010 |        0 |           1 |           1 |
| NULL | NULL    | NULL       |   7535 |        1 |           1 |           1 |
+------+---------+------------+--------+----------+-------------+-------------+
```

Em vez de exibir os resultados do `GROUPING()` diretamente, você pode usar o `GROUPING()` para substituir rótulos para valores de super-agregado do `NULL`:

```
mysql> SELECT
         IF(GROUPING(year), 'All years', year) AS year,
         IF(GROUPING(country), 'All countries', country) AS country,
         IF(GROUPING(product), 'All products', product) AS product,
         SUM(profit) AS profit
       FROM sales
       GROUP BY year, country, product WITH ROLLUP;
+-----------+---------------+--------------+--------+
| year      | country       | product      | profit |
+-----------+---------------+--------------+--------+
| 2000      | Finland       | Computer     |   1500 |
| 2000      | Finland       | Phone        |    100 |
| 2000      | Finland       | All products |   1600 |
| 2000      | India         | Calculator   |    150 |
| 2000      | India         | Computer     |   1200 |
| 2000      | India         | All products |   1350 |
| 2000      | USA           | Calculator   |     75 |
| 2000      | USA           | Computer     |   1500 |
| 2000      | USA           | All products |   1575 |
| 2000      | All countries | All products |   4525 |
| 2001      | Finland       | Phone        |     10 |
| 2001      | Finland       | All products |     10 |
| 2001      | USA           | Calculator   |     50 |
| 2001      | USA           | Computer     |   2700 |
| 2001      | USA           | TV           |    250 |
| 2001      | USA           | All products |   3000 |
| 2001      | All countries | All products |   3010 |
| All years | All countries | All products |   7535 |
+-----------+---------------+--------------+--------+
```

Com vários argumentos de expressão, `GROUPING()` retorna um resultado que representa uma máscara de bits que combina os resultados de cada expressão, com o bit de menor ordem correspondendo ao resultado da expressão mais à direita. Por exemplo, `GROUPING(year, country, product)` é avaliado da seguinte forma:

```
  result for GROUPING(product)
+ result for GROUPING(country) << 1
+ result for GROUPING(year) << 2
```

O resultado de tal `GROUPING()` é nulo se qualquer uma das expressões representar um superagregado `NULL`, então você pode retornar apenas as linhas do superagregado e filtrar as linhas agrupadas regulares assim:

```
mysql> SELECT year, country, product, SUM(profit) AS profit
       FROM sales
       GROUP BY year, country, product WITH ROLLUP
       HAVING GROUPING(year, country, product) <> 0;
+------+---------+---------+--------+
| year | country | product | profit |
+------+---------+---------+--------+
| 2000 | Finland | NULL    |   1600 |
| 2000 | India   | NULL    |   1350 |
| 2000 | USA     | NULL    |   1575 |
| 2000 | NULL    | NULL    |   4525 |
| 2001 | Finland | NULL    |     10 |
| 2001 | USA     | NULL    |   3000 |
| 2001 | NULL    | NULL    |   3010 |
| NULL | NULL    | NULL    |   7535 |
+------+---------+---------+--------+
```

A tabela `sales` não contém valores de `NULL`, portanto, todos os valores de `NULL` em um resultado de `ROLLUP` representam valores de superagregado. Quando o conjunto de dados contém valores de `NULL`, os resumos de `ROLLUP` podem conter valores de `NULL` não apenas em linhas de superagregado, mas também em linhas agrupadas regulares. `GROUPING()` permite que essas sejam distinguidas. Suponha que a tabela `t1` contenha um conjunto de dados simples com dois fatores de agrupamento para um conjunto de valores de quantidade, onde `NULL` indica algo como “outro” ou “desconhecido”:

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

Uma operação simples `ROLLUP` produz esses resultados, na qual não é tão fácil distinguir os valores de `NULL` nas linhas superagregadas dos valores de `NULL` nas linhas agrupadas regulares:

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

Usar `GROUPING()` para substituir rótulos pelos valores do superagregado `NULL` torna o resultado mais fácil de interpretar:

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

#### Outras considerações ao usar o ROLLUP

A discussão a seguir lista alguns comportamentos específicos da implementação do `ROLLUP` no MySQL.

Antes do MySQL 8.0.12, quando você usa `ROLLUP`, não pode também usar uma cláusula `ORDER BY` para ordenar os resultados. Em outras palavras, `ROLLUP` e `ORDER BY` eram mutuamente exclusivos no MySQL. No entanto, você ainda tem algum controle sobre a ordem de classificação. Para contornar a restrição que impede o uso de `ROLLUP` com `ORDER BY` e alcançar uma ordem de classificação específica dos resultados agrupados, gere o conjunto de resultados agrupados como uma tabela derivada e aplique `ORDER BY` a ele. Por exemplo:

```
mysql> SELECT * FROM
         (SELECT year, SUM(profit) AS profit
         FROM sales GROUP BY year WITH ROLLUP) AS dt
       ORDER BY year DESC;
+------+--------+
| year | profit |
+------+--------+
| 2001 |   3010 |
| 2000 |   4525 |
| NULL |   7535 |
+------+--------+
```

A partir do MySQL 8.0.12, `ORDER BY` e `ROLLUP` podem ser usados juntos, o que permite o uso de `ORDER BY` e `GROUPING()` para obter uma ordem específica de classificação de resultados agrupados. Por exemplo:

```
mysql> SELECT year, SUM(profit) AS profit
       FROM sales
       GROUP BY year WITH ROLLUP
       ORDER BY GROUPING(year) DESC;
+------+--------+
| year | profit |
+------+--------+
| NULL |   7535 |
| 2000 |   4525 |
| 2001 |   3010 |
+------+--------+
```

Em ambos os casos, as linhas de resumo do superagregado são ordenadas com as linhas das quais são calculadas, e seu posicionamento depende do pedido de ordenação (no final para uma ordenação ascendente, no início para uma ordenação descendente).

`LIMIT` pode ser usado para restringir o número de linhas devolvidas ao cliente. `LIMIT` é aplicado após `ROLLUP`, portanto, o limite se aplica contra as linhas extras adicionadas por `ROLLUP`. Por exemplo:

```
mysql> SELECT year, country, product, SUM(profit) AS profit
       FROM sales
       GROUP BY year, country, product WITH ROLLUP
       LIMIT 5;
+------+---------+------------+--------+
| year | country | product    | profit |
+------+---------+------------+--------+
| 2000 | Finland | Computer   |   1500 |
| 2000 | Finland | Phone      |    100 |
| 2000 | Finland | NULL       |   1600 |
| 2000 | India   | Calculator |    150 |
| 2000 | India   | Computer   |   1200 |
+------+---------+------------+--------+
```

Usar `LIMIT` com `ROLLUP` pode produzir resultados mais difíceis de interpretar, pois há menos contexto para entender as linhas superagregadas.

Uma extensão do MySQL permite que uma coluna que não aparece na lista `GROUP BY` seja nomeada na lista de seleção. (Para informações sobre colunas não agregadas e `GROUP BY`, consulte a Seção 14.19.3, “Tratamento do MySQL do GROUP BY”.) Neste caso, o servidor é livre para escolher qualquer valor desta coluna não agregada em linhas de resumo, e isso inclui as linhas extras adicionadas por `WITH ROLLUP`. Por exemplo, na seguinte consulta, `country` é uma coluna não agregada que não aparece na lista [[`GROUP BY`] e os valores escolhidos para esta coluna são não determinísticos:

```
mysql> SELECT year, country, SUM(profit) AS profit
       FROM sales
       GROUP BY year WITH ROLLUP;
+------+---------+--------+
| year | country | profit |
+------+---------+--------+
| 2000 | India   |   4525 |
| 2001 | USA     |   3010 |
| NULL | USA     |   7535 |
+------+---------+--------+
```

Esse comportamento é permitido quando o modo SQL `ONLY_FULL_GROUP_BY` não está habilitado. Se esse modo estiver habilitado, o servidor rejeita a consulta como ilegal porque `country` não está listado na cláusula `GROUP BY`. Com `ONLY_FULL_GROUP_BY` habilitado, você ainda pode executar a consulta usando a função `ANY_VALUE()` para colunas de valor não determinado:

```
mysql> SELECT year, ANY_VALUE(country) AS country, SUM(profit) AS profit
       FROM sales
       GROUP BY year WITH ROLLUP;
+------+---------+--------+
| year | country | profit |
+------+---------+--------+
| 2000 | India   |   4525 |
| 2001 | USA     |   3010 |
| NULL | USA     |   7535 |
+------+---------+--------+
```

Em MySQL 8.0.28 e versões posteriores, uma coluna de rollup não pode ser usada como argumento para `MATCH()` (e é rejeitada com um erro), exceto quando chamada em uma cláusula `WHERE`. Consulte a Seção 14.9, “Funções de Pesquisa de Texto Completo”, para obter mais informações.

### 14.19.3 Tratamento do MySQL do GROUP BY

SQL-92 e versões anteriores não permitem consultas nas quais a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` se referem a colunas não agregadas que não são nomeadas na cláusula `GROUP BY`. Por exemplo, esta consulta é ilegal no SQL-92 padrão porque a coluna não agregada `name` na lista de seleção não aparece no `GROUP BY`:

```
SELECT o.custid, c.name, MAX(o.payment)
  FROM orders AS o, customers AS c
  WHERE o.custid = c.custid
  GROUP BY o.custid;
```

Para que a consulta seja legal no SQL-92, a coluna `name` deve ser omitida da lista de seleção ou nomeada na cláusula `GROUP BY`.

SQL:1999 e versões posteriores permitem tais não agregados por característica opcional T301, se estiverem funcionalmente dependentes das colunas `GROUP BY`: Se tal relação existir entre `name` e `custid`, a consulta é legal. Este seria o caso, por exemplo, se `custid` fosse uma chave primária de `customers`.

O MySQL implementa a detecção de dependência funcional. Se o modo SQL `ONLY_FULL_GROUP_BY` estiver habilitado (o que é o padrão), o MySQL rejeita consultas nas quais a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` se referem a colunas não agregadas que não estão nomeadas na cláusula `GROUP BY` e que não são funcionalmente dependentes delas.

O MySQL também permite uma coluna não agregada que não é nomeada em uma cláusula `GROUP BY` quando o modo SQL `ONLY_FULL_GROUP_BY` está habilitado, desde que essa coluna seja limitada a um único valor, conforme mostrado no exemplo a seguir:

```
mysql> CREATE TABLE mytable (
    ->    id INT UNSIGNED NOT NULL PRIMARY KEY,
    ->    a VARCHAR(10),
    ->    b INT
    -> );

mysql> INSERT INTO mytable
    -> VALUES (1, 'abc', 1000),
    ->        (2, 'abc', 2000),
    ->        (3, 'def', 4000);

mysql> SET SESSION sql_mode = sys.list_add(@@session.sql_mode, 'ONLY_FULL_GROUP_BY');

mysql> SELECT a, SUM(b) FROM mytable WHERE a = 'abc';
+------+--------+
| a    | SUM(b) |
+------+--------+
| abc  |   3000 |
+------+--------+
```

É também possível ter mais de uma coluna não agregada na lista `SELECT` ao empregar `ONLY_FULL_GROUP_BY`. Neste caso, cada coluna desse tipo deve ser limitada a um único valor na cláusula `WHERE`, e todas essas condições de limitação devem ser unidas por `AND` lógico, como mostrado aqui:

```
mysql> DROP TABLE IF EXISTS mytable;

mysql> CREATE TABLE mytable (
    ->    id INT UNSIGNED NOT NULL PRIMARY KEY,
    ->    a VARCHAR(10),
    ->    b VARCHAR(10),
    ->    c INT
    -> );

mysql> INSERT INTO mytable
    -> VALUES (1, 'abc', 'qrs', 1000),
    ->        (2, 'abc', 'tuv', 2000),
    ->        (3, 'def', 'qrs', 4000),
    ->        (4, 'def', 'tuv', 8000),
    ->        (5, 'abc', 'qrs', 16000),
    ->        (6, 'def', 'tuv', 32000);

mysql> SELECT @@session.sql_mode;
+---------------------------------------------------------------+
| @@session.sql_mode                                            |
+---------------------------------------------------------------+
| ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION |
+---------------------------------------------------------------+

mysql> SELECT a, b, SUM(c) FROM mytable
    ->     WHERE a = 'abc' AND b = 'qrs';
+------+------+--------+
| a    | b    | SUM(c) |
+------+------+--------+
| abc  | qrs  |  17000 |
+------+------+--------+
```

Se `ONLY_FULL_GROUP_BY` estiver desativado, uma extensão MySQL ao uso padrão do SQL `GROUP BY` permite que a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` se refira a colunas não agregadas, mesmo que as colunas não dependam funcionalmente das colunas `GROUP BY`. Isso faz com que o MySQL aceite a consulta anterior. Neste caso, o servidor é livre para escolher qualquer valor de cada grupo, portanto, a menos que sejam os mesmos, os valores escolhidos são não determinísticos, o que provavelmente não é o que você deseja. Além disso, a seleção de valores de cada grupo não pode ser influenciada pela adição de uma cláusula `ORDER BY`. A ordenação do conjunto de resultados ocorre após os valores terem sido escolhidos, e `ORDER BY` não afeta qual valor dentro de cada grupo o servidor escolhe. Desativar `ONLY_FULL_GROUP_BY` é útil principalmente quando você sabe que, devido a alguma propriedade dos dados, todos os valores em cada coluna não agregada não nomeada no `GROUP BY` são os mesmos para cada grupo.

Você pode obter o mesmo efeito sem desabilitar `ONLY_FULL_GROUP_BY` usando `ANY_VALUE()` para se referir à coluna não agregada.

A discussão a seguir demonstra a dependência funcional, a mensagem de erro que o MySQL produz quando a dependência funcional está ausente, e as maneiras de fazer o MySQL aceitar uma consulta na ausência de dependência funcional.

Essa consulta pode ser inválida com `ONLY_FULL_GROUP_BY` habilitada porque a coluna não agregada `address` na lista de seleção não é nomeada na cláusula `GROUP BY`:

```
SELECT name, address, MAX(age) FROM t GROUP BY name;
```

A consulta é válida se `name` for uma chave primária de `t` ou se for uma coluna única de `NOT NULL`. Nesses casos, o MySQL reconhece que a coluna selecionada depende funcionalmente de uma coluna de agrupamento. Por exemplo, se `name` for uma chave primária, seu valor determina o valor de `address`, pois cada grupo tem apenas um valor da chave primária e, portanto, apenas uma linha. Como resultado, não há aleatoriedade na escolha do valor de `address` em um grupo e não há necessidade de rejeitar a consulta.

A consulta é inválida se `name` não for uma chave primária de `t` ou uma coluna única de `NOT NULL`. Nesse caso, nenhuma dependência funcional pode ser inferida e ocorre um erro:

```
mysql> SELECT name, address, MAX(age) FROM t GROUP BY name;
ERROR 1055 (42000): Expression #2 of SELECT list is not in GROUP
BY clause and contains nonaggregated column 'mydb.t.address' which
is not functionally dependent on columns in GROUP BY clause; this
is incompatible with sql_mode=only_full_group_by
```

Se você sabe que, para um conjunto de dados específico, cada valor de `name` de fato determina de forma única o valor de `address`, `address` depende funcionalmente efetivamente de `name`. Para dizer ao MySQL que aceite a consulta, você pode usar a função `ANY_VALUE()`:

```
SELECT name, ANY_VALUE(address), MAX(age) FROM t GROUP BY name;
```

Alternativamente, desative `ONLY_FULL_GROUP_BY`.

O exemplo anterior, no entanto, é bastante simples. Em particular, é improvável que você agrupe em uma única coluna de chave primária, porque cada grupo conterá apenas uma linha. Para exemplos adicionais que demonstram a dependência funcional em consultas mais complexas, consulte a Seção 14.19.4, “Detecção de Dependência Funcional”.

Se uma consulta tiver funções agregadas e nenhuma cláusula `GROUP BY`, ela não pode ter colunas não agregadas na lista de seleção, na condição `HAVING` ou na lista `ORDER BY` com `ONLY_FULL_GROUP_BY` habilitado:

```
mysql> SELECT name, MAX(age) FROM t;
ERROR 1140 (42000): In aggregated query without GROUP BY, expression
#1 of SELECT list contains nonaggregated column 'mydb.t.name'; this
is incompatible with sql_mode=only_full_group_by
```

Sem `GROUP BY`, há um único grupo e não é determinado qual valor de `name` escolher para o grupo. Aqui, também pode ser usado `ANY_VALUE()`, se não for importante qual valor de `name` o MySQL escolhe:

```
SELECT ANY_VALUE(name), MAX(age) FROM t;
```

`ONLY_FULL_GROUP_BY` também afeta o tratamento de consultas que utilizam `DISTINCT` e `ORDER BY`. Considere o caso de uma tabela `t` com três colunas `c1`, `c2` e `c3` que contém essas linhas:

```
c1 c2 c3
1  2  A
3  4  B
1  2  C
```

Suponha que execute a seguinte consulta, esperando que os resultados sejam ordenados por `c3`:

```
SELECT DISTINCT c1, c2 FROM t ORDER BY c3;
```

Para ordenar o resultado, os duplicados devem ser eliminados primeiro. Mas para isso, devemos manter a primeira linha ou a terceira? Essa escolha arbitrária influencia o valor retido de `c3`, que por sua vez influencia a ordenação e a torna arbitrária também. Para evitar esse problema, uma consulta que tem `DISTINCT` e `ORDER BY` é rejeitada como inválida se qualquer expressão `ORDER BY` não satisfazer pelo menos uma dessas condições:

* A expressão é igual a uma na lista de seleção * Todas as colunas referenciadas pela expressão e pertencentes às tabelas selecionadas da consulta são elementos da lista de seleção

Outra extensão do MySQL ao SQL padrão permite referências na cláusula `HAVING` a expressões aliadas na lista de seleção. Por exemplo, a seguinte consulta retorna valores `name` que ocorrem apenas uma vez na tabela `orders`:

```
SELECT name, COUNT(name) FROM orders
  GROUP BY name
  HAVING COUNT(name) = 1;
```

A extensão MySQL permite o uso de um alias na cláusula `HAVING` para a coluna agregada:

```
SELECT name, COUNT(name) AS c FROM orders
  GROUP BY name
  HAVING c = 1;
```

O SQL padrão permite apenas expressões de coluna nas cláusulas de `GROUP BY`, portanto, uma declaração como esta é inválida porque `FLOOR(value/100)` é uma expressão não-coluna:

```
SELECT id, FLOOR(value/100)
  FROM tbl_name
  GROUP BY id, FLOOR(value/100);
```

O MySQL estende o SQL padrão para permitir expressões não colunas em cláusulas de `GROUP BY` e considera a declaração anterior válida.

O SQL padrão também não permite aliases em cláusulas de `GROUP BY`. O MySQL estende o SQL padrão para permitir aliases, então outra maneira de escrever a consulta é a seguinte:

```
SELECT id, FLOOR(value/100) AS val
  FROM tbl_name
  GROUP BY id, val;
```

O alias `val` é considerado uma expressão de coluna na cláusula `GROUP BY`.

Na presença de uma expressão não-colunar na cláusula `GROUP BY`, o MySQL reconhece a igualdade entre essa expressão e as expressões na lista de seleção. Isso significa que, com o modo SQL `ONLY_FULL_GROUP_BY` habilitado, a consulta que contém `GROUP BY id, FLOOR(value/100)` é válida, porque essa mesma expressão `FLOOR()` ocorre na lista de seleção. No entanto, o MySQL não tenta reconhecer a dependência funcional em expressões não-colunares de `GROUP BY`, portanto, a consulta a seguir é inválida com `ONLY_FULL_GROUP_BY` habilitado, mesmo que a terceira expressão selecionada seja uma fórmula simples da coluna `id` e a expressão `FLOOR()` na cláusula `GROUP BY`:

```
SELECT id, FLOOR(value/100), id+FLOOR(value/100)
  FROM tbl_name
  GROUP BY id, FLOOR(value/100);
```

Uma solução é usar uma tabela derivada:

```
SELECT id, F, id+F
  FROM
    (SELECT id, FLOOR(value/100) AS F
     FROM tbl_name
     GROUP BY id, FLOOR(value/100)) AS dt;
```

### 14.19.4 Detecção de dependência funcional

A discussão a seguir fornece vários exemplos das maneiras pelas quais o MySQL detecta dependências funcionais. Os exemplos utilizam essa notação:

```
{X} -> {Y}
```

Entenda isso como “*`X`* determina exclusivamente *`Y`*”, o que também significa que *`Y`* é funcionalmente dependente de *`X`*.

Os exemplos utilizam o banco de dados `world`, que pode ser baixado em https://dev.mysql.com/doc/index-other.html. Você pode encontrar detalhes sobre como instalar o banco de dados na mesma página.

* Dependências Funcionais Derivadas de Chaves
* [Dependências Funcionais Derivadas de Chaves de Múltiplos Campos e de Igualdades](group-by-functional-dependence.html#functional-dependence-multiple-column-keys "Functional Dependencies Derived from Multiple-Column Keys and from Equalities")

* Casos especiais de dependência funcional
* Dependências funcionais e visualizações
* Combinações de dependências funcionais

#### Dependências Funcionais Derivadas de Chaves

A consulta a seguir seleciona, para cada país, um número de idiomas falados:

```
SELECT co.Name, COUNT(*)
FROM countrylanguage cl, country co
WHERE cl.CountryCode = co.Code
GROUP BY co.Code;
```

`co.Code` é uma chave primária de `co`, portanto, todas as colunas de `co` dependem funcionalmente dela, conforme expresso usando essa notação:

```
{co.Code} -> {co.*}
```

Assim, `co.name` é funcionalmente dependente das colunas `GROUP BY` e a consulta é válida.

Um índice `UNIQUE` sobre uma coluna `NOT NULL` poderia ser usado em vez de uma chave primária e a mesma dependência funcional se aplicaria. (Isso não é verdade para um índice `UNIQUE` que permite valores `NULL` porque permite múltiplos valores `NULL` e, nesse caso, a singularidade é perdida.)

#### Dependências Funcionais Derivadas de Chaves de Múltiplos Coluna e de Igualdades

Essa consulta seleciona, para cada país, uma lista de todas as línguas faladas e quantas pessoas as falam:

```
SELECT co.Name, cl.Language,
cl.Percentage * co.Population / 100.0 AS SpokenBy
FROM countrylanguage cl, country co
WHERE cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

O par (`cl.CountryCode`, `cl.Language`) é uma chave primária composta de duas colunas de `cl`, de modo que o par de colunas determina de forma única todas as colunas de `cl`:

```
{cl.CountryCode, cl.Language} -> {cl.*}
```

Além disso, devido à igualdade na cláusula `WHERE`:

```
{cl.CountryCode} -> {co.Code}
```

E, porque `co.Code` é chave primária de `co`:

```
{co.Code} -> {co.*}
```

As relações que são “determinadas de forma exclusiva” são transitivas, portanto:

```
{cl.CountryCode, cl.Language} -> {cl.*,co.*}
```

Como resultado, a consulta é válida.

Assim como no exemplo anterior, uma chave `UNIQUE` sobre as colunas `NOT NULL` pode ser usada em vez de uma chave primária.

Uma condição `INNER JOIN` pode ser usada em vez de `WHERE`. As mesmas dependências funcionais se aplicam:

```
SELECT co.Name, cl.Language,
cl.Percentage * co.Population/100.0 AS SpokenBy
FROM countrylanguage cl INNER JOIN country co
ON cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

#### Casos Especiais de Dependência Funcional

Enquanto um teste de igualdade em uma condição de `WHERE` ou condição de `INNER JOIN` é simétrico, um teste de igualdade em uma condição de junção externa não é, porque as tabelas desempenham papéis diferentes.

Suponha que a integridade referencial tenha sido acidentalmente quebrada e exista uma linha de `countrylanguage` sem uma linha correspondente em `country`. Considere a mesma consulta do exemplo anterior, mas com uma `LEFT JOIN`:

```
SELECT co.Name, cl.Language,
cl.Percentage * co.Population/100.0 AS SpokenBy
FROM countrylanguage cl LEFT JOIN country co
ON cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

Para um valor dado de `cl.CountryCode`, o valor de `co.Code` no resultado da junção é encontrado em uma linha correspondente (determinada por `cl.CountryCode`) ou é complementado com `NULL` se não houver correspondência (também determinado por `cl.CountryCode`). Em cada caso, essa relação se aplica:

```
{cl.CountryCode} -> {co.Code}
```

`cl.CountryCode` é, por si só, funcionalmente dependente de {`cl.CountryCode`, `cl.Language`}, que é uma chave primária.

Se, no resultado da junção `co.Code`, `NULL` estiver complementado, `co.Name` também estará. Se `co.Code` não estiver complementado com `NULL`, então, como `co.Code` é uma chave primária, ele determina `co.Name`. Portanto, em todos os casos:

```
{co.Code} -> {co.Name}
```

Que produzem:

```
{cl.CountryCode, cl.Language} -> {cl.*,co.*}
```

Como resultado, a consulta é válida.

No entanto, suponha que as tabelas sejam trocadas, como nesta consulta:

```
SELECT co.Name, cl.Language,
cl.Percentage * co.Population/100.0 AS SpokenBy
FROM country co LEFT JOIN countrylanguage cl
ON cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

Agora, essa relação *não* se aplica:

```
{cl.CountryCode, cl.Language} -> {cl.*,co.*}
```

De fato, todas as linhas `NULL` complementadas feitas para `cl` são colocadas em um único grupo (elas têm ambas as colunas `GROUP BY` iguais a `NULL`), e dentro deste grupo o valor de `co.Name` pode variar. A consulta é inválida e o MySQL a rejeita.

A dependência funcional em junções externas está, portanto, relacionada à questão de se as colunas determinantes pertencem ao lado esquerdo ou direito do `LEFT JOIN`. A determinação da dependência funcional se torna mais complexa se houver junções externas aninhadas ou se a condição de junção não consistir inteiramente em comparações de igualdade.

#### Dependências Funcionais e Visualizações

Suponha que uma visão sobre os países produza seu código, seu nome em maiúsculas e quantos idiomas oficiais diferentes eles têm:

```
CREATE VIEW country2 AS
SELECT co.Code, UPPER(co.Name) AS UpperName,
COUNT(cl.Language) AS OfficialLanguages
FROM country AS co JOIN countrylanguage AS cl
ON cl.CountryCode = co.Code
WHERE cl.isOfficial = 'T'
GROUP BY co.Code;
```

Essa definição é válida porque:

```
{co.Code} -> {co.*}
```

No resultado da visualização, a primeira coluna selecionada é `co.Code`, que também é a coluna do grupo e, portanto, determina todas as outras expressões selecionadas:

```
{country2.Code} -> {country2.*}
```

O MySQL entende isso e usa essas informações, conforme descrito a seguir.

Essa consulta exibe os países, quantas línguas oficiais diferentes eles têm e quantas cidades eles têm, ao unir a visualização com a tabela `city`:

```
SELECT co2.Code, co2.UpperName, co2.OfficialLanguages,
COUNT(*) AS Cities
FROM country2 AS co2 JOIN city ci
ON ci.CountryCode = co2.Code
GROUP BY co2.Code;
```

Essa consulta é válida porque, como visto anteriormente:

```
{co2.Code} -> {co2.*}
```

O MySQL é capaz de descobrir uma dependência funcional no resultado de uma visão e usar isso para validar uma consulta que utiliza a visão. O mesmo aconteceria se `country2` fosse uma tabela derivada (ou expressão de tabela comum), como em:

```
SELECT co2.Code, co2.UpperName, co2.OfficialLanguages,
COUNT(*) AS Cities
FROM
(
 SELECT co.Code, UPPER(co.Name) AS UpperName,
 COUNT(cl.Language) AS OfficialLanguages
 FROM country AS co JOIN countrylanguage AS cl
 ON cl.CountryCode=co.Code
 WHERE cl.isOfficial='T'
 GROUP BY co.Code
) AS co2
JOIN city ci ON ci.CountryCode = co2.Code
GROUP BY co2.Code;
```

#### Combinações de Dependências Funcionais

O MySQL é capaz de combinar todos os tipos de dependências funcionais anteriores (baseada em chave, baseada em igualdade, baseada em visão) para validar consultas mais complexas.