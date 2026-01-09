### 14.19.1 Descrições de Funções Agregadas

Esta seção descreve as funções agregadas que operam em conjuntos de valores. Elas são frequentemente usadas com uma cláusula `GROUP BY` para agrupar valores em subconjuntos.

**Tabela 14.29 Funções Agregadas**

<table frame="box" rules="all" summary="Uma referência que lista funções agregadas.">
<tr><th>Nome</th> <th>Descrição</th> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_avg"><code>AVG()</code></a></td> <td> Retorna o valor médio do argumento </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_bit-and"><code>BIT_AND()</code></a></td> <td> Retorna a operação de E e </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_bit-or"><code>BIT_OR()</code></a></td> <td> Retorna a operação de OU exclusivo </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_bit-xor"><code>BIT_XOR()</code></a></td> <td> Retorna a operação de OU exclusivo </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_count"><code>COUNT()</code></a></td> <td> Retorna o número de linhas retornadas </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_count-distinct"><code>COUNT(DISTINCT)</code></a></td> <td> Retorna o número de valores diferentes </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_group-concat"><code>GROUP_CONCAT()</code></a></td> <td> Retorna uma string concatenada </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_json-arrayagg"><code>JSON_ARRAYAGG()</code></a></td> <td> Retorna o conjunto de resultados como um único array JSON </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_json-objectagg"><code>JSON_OBJECTAGG()</code></a></td> <td> Retorna o conjunto de resultados como um único objeto JSON </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_max"><code>MAX()</code></a></td> <td> Retorna o valor máximo </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_min"><code>MIN()</code></a></td> <td> Retorna o valor mínimo </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_std"><code>STD()</code></a></td> <td> Retorna a desvio padrão populacional </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_stddev"><code>STDDEV()</code></a></td> <td> Retorna a desvio padrão populacional </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_stddev-pop"><code>STDDEV_POP()</code></a></td> <td> Retorna a desvio padrão populacional </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_stddev-samp"><code>STDDEV_SAMP()</code></a></td> <td> Retorna a desvio padrão amostral </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_sum"><code>SUM()</code></a></td> <td> Retorna a soma </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_var-pop"><code>VAR_POP()</code></a></td> <td> Retorna a variância populacional </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_var-samp"><code>VAR_SAMP()</code></a></td> <td> Retorna a variância amostral </td> </tr>
<tr><td><a class="link" href="funções_agregadas.html#função_variance"><code class="

A menos que especificado de outra forma, as funções agregadas ignoram valores `NULL`.

Se você usar uma função agregada em uma instrução que não contenha uma cláusula `GROUP BY`, ela é equivalente a agrupar todas as linhas. Para obter mais informações, consulte a Seção 14.19.3, “Tratamento do MySQL do GROUP BY”.

A maioria das funções agregadas pode ser usada como funções de janela. Aquelas que podem ser usadas dessa maneira são indicadas na descrição da sintaxe por `[over_clause]`, representando uma cláusula `OVER` opcional. *`over_clause`* é descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”, que também inclui outras informações sobre o uso de funções de janela.

Para argumentos numéricos, as funções de variância e desvio padrão retornam um valor `DOUBLE` - FLOAT, DOUBLE"). As funções `SUM()` e `AVG()` retornam um valor `DECIMAL` - DECIMAL, NUMERIC") para argumentos de valor exato (inteiro ou `DECIMAL` - DECIMAL, NUMERIC")), e um valor `DOUBLE` - FLOAT, DOUBLE") para argumentos de valor aproximado (`FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE")).

As funções agregadas `SUM()` e `AVG()` não funcionam com valores temporais. (Converter os valores em números, perdendo tudo após o primeiro caractere não numérico.) Para contornar esse problema, converta para unidades numéricas, realize a operação agregada e converta de volta para um valor temporal. Exemplos:

```
SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(time_col))) FROM tbl_name;
SELECT FROM_DAYS(SUM(TO_DAYS(date_col))) FROM tbl_name;
```

Funções como `SUM()` ou `AVG()` que esperam um argumento numérico convertem o argumento para um número, se necessário. Para valores de `SET` ou `ENUM`, a operação de cast faz com que o valor numérico subjacente seja usado.

As funções agregadas `BIT_AND()`, `BIT_OR()` e `BIT_XOR()` realizam operações de bits.

As funções e operadores de bits do MySQL permitem argumentos do tipo de string binária (`BINARY`, `VARBINARY` e o tipo `BLOB`) e retornam um valor do mesmo tipo, o que permite que eles recebam argumentos e produzam valores de retorno maiores que 64 bits. Para discussão sobre a avaliação de argumentos e tipos de resultados para operações de bits, consulte a discussão introdutória na Seção 14.12, “Funções e Operadores de Bits”.

* `AVG([DISTINCT] expr) [over_clause]`

  Retorna o valor médio de *`expr`*. A opção `DISTINCT` pode ser usada para retornar a média dos valores distintos de *`expr`*.

  Se não houver linhas correspondentes, `AVG()` retorna `NULL`. A função também retorna `NULL` se *`expr`* for `NULL`.

  Esta função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”; não pode ser usado com `DISTINCT`.

  ```
  mysql> SELECT student_name, AVG(test_score)
         FROM student
         GROUP BY student_name;
  ```

* `BIT_AND(expr) [over_clause]`

  Retorna a operação `AND` bit a bit de todos os bits em *`expr`*.

  O tipo de resultado depende se os valores dos argumentos da função são avaliados como strings binárias ou números:

  + A avaliação de string binária ocorre quando os valores dos argumentos têm um tipo de string binária, e o argumento não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão do valor do argumento para inteiros unsigned de 64 bits, se necessário.

  + A avaliação de string binária produz uma string binária do mesmo comprimento que os valores dos argumentos. Se os valores dos argumentos tiverem comprimentos diferentes, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. Se o tamanho do argumento exceder 511 bytes, ocorre um erro `ER_INVALID_BITWISE_AGGREGATE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro unsigned de 64 bits.

Se não houver linhas correspondentes, o `BIT_AND()` retorna um valor neutro (todos os bits definidos como 1) com o mesmo comprimento dos valores dos argumentos.

Os valores `NULL` não afetam o resultado, a menos que todos os valores sejam `NULL`. Nesse caso, o resultado é um valor neutro com o mesmo comprimento dos valores dos argumentos.

Para obter mais informações sobre a discussão sobre a avaliação dos argumentos e os tipos de resultados, consulte a discussão introdutória na Seção 14.12, “Funções e Operadores de Bits”.

Se o `BIT_AND()` for invocado dentro do cliente **mysql**, os resultados de strings binárias são exibidos usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

Esta função é executada como uma função de janela se o *`over_clause`* estiver presente. *`over_clause`* é descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

* `BIT_OR(expr) [over_clause]`

Retorna a operação `OR` bit a bit de todos os bits em *`expr`*.

O tipo de resultado depende se os valores dos argumentos da função são avaliados como strings binárias ou números:

+ A avaliação de strings binárias ocorre quando os valores dos argumentos têm um tipo de string binária e o argumento não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão do valor do argumento para inteiros unsigned de 64 bits, se necessário.

+ A avaliação de strings binárias produz uma string binária com o mesmo comprimento dos valores dos argumentos. Se os valores dos argumentos tiverem comprimentos diferentes, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. Se o tamanho do argumento exceder 511 bytes, ocorre um erro `ER_INVALID_BITWISE_AGGREGATE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro unsigned de 64 bits.

Se não houver linhas correspondentes, o `BIT_OR()` retorna um valor neutro (todos os bits definidos como 0) com o mesmo comprimento dos valores do argumento.

Os valores `NULL` não afetam o resultado, a menos que todos os valores sejam `NULL`. Nesse caso, o resultado é um valor neutro com o mesmo comprimento dos valores do argumento.

Para obter mais informações sobre a discussão sobre a avaliação dos argumentos e os tipos de resultado, consulte a discussão introdutória na Seção 14.12, “Funções e Operadores de Bits”.

Se o `BIT_OR()` for invocado dentro do cliente **mysql**, os resultados de strings binárias são exibidos usando a notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

Esta função é executada como uma função de janela se o *`over_clause`* estiver presente. *`over_clause`* é descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

* `BIT_XOR(expr) [over_clause]`

Retorna o `XOR` bit a bit de todos os bits em *`expr`*.

O tipo de resultado depende se os valores dos argumentos da função são avaliados como strings binárias ou números:

+ A avaliação de strings binárias ocorre quando os valores dos argumentos têm um tipo de string binária e o argumento não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão do valor do argumento para inteiros unsigned de 64 bits, se necessário.

+ A avaliação de strings binárias produz uma string binária com o mesmo comprimento dos valores do argumento. Se os valores dos argumentos tiverem comprimentos diferentes, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. Se o tamanho do argumento exceder 511 bytes, ocorre um erro `ER_INVALID_BITWISE_AGGREGATE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro unsigned de 64 bits.

Se não houver linhas correspondentes, o `BIT_XOR()` retorna um valor neutro (todos os bits definidos como 0) com o mesmo comprimento dos valores dos argumentos.

Os valores `NULL` não afetam o resultado, a menos que todos os valores sejam `NULL`. Nesse caso, o resultado é um valor neutro com o mesmo comprimento dos valores dos argumentos.

Para obter mais informações sobre a discussão sobre a avaliação dos argumentos e os tipos de resultado, consulte a discussão introdutória na Seção 14.12, “Funções e Operadores de Bits”.

Se o `BIT_XOR()` for invocado dentro do cliente **mysql**, os resultados de strings binárias são exibidos usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

Esta função é executada como uma função de janela se o *`over_clause`* estiver presente. *`over_clause`* é descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

* `COUNT(expr) [over_clause]`

Retorna um contagem do número de valores não `NULL` de *`expr`* nas linhas recuperadas por uma declaração `SELECT`. O resultado é um valor `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

Se não houver linhas correspondentes, o `COUNT()` retorna `0`. `COUNT(NULL)` retorna 0.

Esta função é executada como uma função de janela se o *`over_clause`* estiver presente. *`over_clause`* é descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

```
  mysql> SELECT student.student_name,COUNT(*)
         FROM student,course
         WHERE student.student_id=course.student_id
         GROUP BY student_name;
  ```

`COUNT(*)` é um pouco diferente, pois retorna uma contagem do número de linhas recuperadas, independentemente de elas conterem valores `NULL`.

Para motores de armazenamento transacional, como `InnoDB`, armazenar um contagem exata de linhas é problemático. Múltiplas transações podem estar ocorrendo ao mesmo tempo, cada uma das quais pode afetar a contagem.

`InnoDB` não mantém um contagem interna de linhas em uma tabela porque transações concorrentes podem "ver" números diferentes de linhas ao mesmo tempo. Consequentemente, as instruções `SELECT COUNT(*)` contam apenas as linhas visíveis para a transação atual.

O desempenho da consulta `SELECT COUNT(*) FROM tbl_name` para tabelas `InnoDB` é otimizado para cargas de trabalho monofiladas, desde que não haja cláusulas extras, como `WHERE` ou `GROUP BY`.

`InnoDB` processa as instruções `SELECT COUNT(*)` percorrendo o menor índice secundário disponível, a menos que um índice ou dica do otimizador direcione o otimizador a usar um índice diferente. Se um índice secundário não estiver presente, `InnoDB` processa as instruções `SELECT COUNT(*)` lendo o índice agrupado.

O processamento das instruções `SELECT COUNT(*)` leva algum tempo se os registros do índice não estiverem totalmente no pool de buffers. Para uma contagem mais rápida, crie uma tabela de contador e deixe sua aplicação atualizá-la de acordo com as inserções e exclusões que ela realiza. No entanto, esse método pode não escalar bem em situações em que milhares de transações concorrentes estão iniciando atualizações na mesma tabela de contador. Se um número aproximado de linhas for suficiente, use `SHOW TABLE STATUS`.

`InnoDB` lida com as operações `SELECT COUNT(*)` e `SELECT COUNT(1)` da mesma maneira. Não há diferença de desempenho.

Para tabelas `MyISAM`, `COUNT(*)` é otimizado para retornar muito rapidamente se o `SELECT` recuperar de uma tabela, não são recuperados outros colunas e não há cláusula `WHERE`. Por exemplo:

```
  mysql> SELECT COUNT(*) FROM student;
  ```

Essa otimização só se aplica a tabelas `MyISAM`, porque um número exato de linhas é armazenado para esse mecanismo de armazenamento e pode ser acessado muito rapidamente. `COUNT(1)` está sujeito à mesma otimização apenas se a primeira coluna for definida como `NOT NULL`.

* `COUNT(DISTINCT expr,[expr...])`

Retorna um contador do número de linhas com valores diferentes de *`expr`* que não são `NULL`.

Se não houver linhas correspondentes, `COUNT(DISTINCT)` retorna `0`.

```
  mysql> SELECT COUNT(DISTINCT results) FROM student;
  ```

No MySQL, você pode obter o número de combinações de expressões distintas que não contêm `NULL` fornecendo uma lista de expressões. No SQL padrão, você teria que fazer uma concatenação de todas as expressões dentro de `COUNT(DISTINCT ...)`.

* `GROUP_CONCAT(expr)`

Esta função retorna um resultado em string com os valores concatenados de `expr` que não são `NULL` de um grupo. Ela retorna `NULL` se não houver valores `NULL`. A sintaxe completa é a seguinte:

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

No MySQL, você pode obter os valores concatenados de combinações de expressões. Para eliminar valores duplicados, use a cláusula `DISTINCT`. Para ordenar os valores no resultado, use a cláusula `ORDER BY`. Para ordenar em ordem inversa, adicione a palavra-chave `DESC` (descendente) ao nome da coluna que está sendo ordenada na cláusula `ORDER BY`. O padrão é a ordem ascendente; isso pode ser especificado explicitamente usando a palavra-chave `ASC`. O separador padrão entre os valores em um grupo é a vírgula (`,`). Para especificar um separador explicitamente, use `SEPARATOR` seguido do valor literal da string que deve ser inserido entre os valores do grupo. Para eliminar o separador completamente, especifique `SEPARATOR ''`.

O resultado é truncado para o comprimento máximo fornecido pela variável de sistema `group_concat_max_len`, que tem um valor padrão de 1024. O valor pode ser ajustado para um valor maior, embora o comprimento máximo efetivo do valor de retorno seja limitado pelo valor de `max_allowed_packet`. A sintaxe para alterar o valor de `group_concat_max_len` em tempo de execução é a seguinte, onde *`val`* é um inteiro sem sinal:

```
  SET [GLOBAL | SESSION] group_concat_max_len = val;
  ```

O valor de retorno é uma string não binária ou binária, dependendo se os argumentos são strings não binárias ou binárias. O tipo de resultado é `TEXT` ou `BLOB`, a menos que `group_concat_max_len` seja menor ou igual a 512, caso em que o tipo de resultado é `VARCHAR` ou `VARBINARY`.

Se `GROUP_CONCAT()` for invocado dentro do cliente **mysql**, os resultados de strings binárias são exibidos usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

Veja também `CONCAT()` e `CONCAT_WS()`: Seção 14.8, “Funções e Operadores de String”.

* `JSON_ARRAYAGG(col_or_expr) [over_clause]`

  Agrupa um conjunto de resultados como um único array `JSON` cujos elementos consistem nas linhas. A ordem dos elementos neste array é indefinida. A função atua em uma coluna ou expressão que avalia a um único valor. Retorna `NULL` se o resultado não contiver nenhuma linha, ou em caso de erro. Se *`col_or_expr`* for `NULL`, a função retorna um array de elementos `JSON` [null].

  Esta função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

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

* `JSON_OBJECTAGG(key, value) [over_clause]`

  Toma dois nomes de coluna ou expressões como argumentos, sendo o primeiro usado como uma chave e o segundo como um valor, e retorna um objeto JSON contendo pares chave-valor. Retorna `NULL` se o resultado não contiver nenhuma linha, ou em caso de erro. Um erro ocorre se qualquer nome de chave for `NULL` ou o número de argumentos não for igual a 2.

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

**Tratamento de chaves duplicadas.** Quando o resultado desta função é normalizado, os valores com chaves duplicadas são descartados. De acordo com a especificação do tipo de dados `JSON` do MySQL, que não permite chaves duplicadas, apenas o último valor encontrado é usado com essa chave no objeto retornado (“a chave duplicada mais recente vence”). Isso significa que o resultado do uso desta função em colunas de uma consulta pode depender da ordem em que as linhas são retornadas, o que não é garantido.

Quando usada como uma função de janela, se houver chaves duplicadas dentro de uma estrutura, apenas o último valor para a chave está presente no resultado. O valor para a chave da última linha da estrutura é determinístico se a especificação `ORDER BY` garantir que os valores tenham uma ordem específica. Se não, o valor resultante da chave é não determinístico.

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

A chave escolhida da última consulta é não determinística. Se a consulta não usar `GROUP BY` (que geralmente impõe sua própria ordem independentemente) e você prefere uma ordem específica para a chave, pode invocar `JSON_OBJECTAGG()` como uma função de janela incluindo uma cláusula `OVER` com uma especificação `ORDER BY` para impor uma ordem específica nas linhas da estrutura. Os exemplos seguintes mostram o que acontece com e sem `ORDER BY` para algumas especificações de estrutura diferentes.

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

Com `ORDER BY`, onde a estrutura é o padrão de `RANGE BETWEEN UNBOUNDED PRECEDING E LINHA ACONTECEDENTE` (em ordem ascendente e descendente):

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

Consulte Normalização, Fusão e Autoenrolagem de Valores JSON para obter informações e exemplos adicionais.

* `MAX([DISTINCT] expr) [over_clause]`

Retorna o valor máximo de *`expr`*. `MAX()` pode aceitar um argumento de string; nesses casos, ele retorna o valor de string máximo. Consulte a Seção 10.3.1, “Como o MySQL Usa Índices”. A palavra-chave `DISTINCT` pode ser usada para encontrar o máximo dos valores distintos de *`expr`*, no entanto, isso produz o mesmo resultado que omitir `DISTINCT`.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, `MAX()` retorna `NULL`.

Esta função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”; não pode ser usado com `DISTINCT`.

```
  mysql> SELECT student_name, MIN(test_score), MAX(test_score)
         FROM student
         GROUP BY student_name;
  ```

Para `MAX()`, o MySQL atualmente compara colunas `ENUM` e `SET` pelo seu valor de string em vez da posição relativa da string no conjunto. Isso difere da forma como `ORDER BY` as compara.

* `MIN([DISTINCT] expr) [over_clause]`

Retorna o valor mínimo de *`expr`*. `MIN()` pode aceitar um argumento de string; nesses casos, ele retorna o valor de string mínimo. Consulte a Seção 10.3.1, “Como o MySQL Usa Índices”. A palavra-chave `DISTINCT` pode ser usada para encontrar o mínimo dos valores distintos de *`expr`*, no entanto, isso produz o mesmo resultado que omitir `DISTINCT`.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, `MIN()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”; não pode ser usado com `DISTINCT`.

```
  mysql> SELECT student_name, MIN(test_score), MAX(test_score)
         FROM student
         GROUP BY student_name;
  ```

Para `MIN()`, o MySQL atualmente compara colunas `ENUM` e `SET` pelo seu valor de string em vez da posição relativa da string no conjunto. Isso difere da forma como `ORDER BY` as compara.

* `STD(expr) [over_clause]`

Retorna a desvio padrão populacional de *`expr`*. `STD()` é um sinônimo da função SQL padrão `STDDEV_POP()`, fornecida como uma extensão do MySQL.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, `STD()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

* `STDDEV(expr) [over_clause]`

Retorna a desvio padrão populacional de *`expr`*. `STDDEV()` é um sinônimo da função SQL padrão `STDDEV_POP()`, fornecida para compatibilidade com o Oracle.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, `STDDEV()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

* `STDDEV_POP(expr) [over_clause]`

Retorna a desvio padrão populacional de *`expr`* (a raiz quadrada de `VAR_POP()`). Você também pode usar `STD()` ou `STDDEV()`, que são equivalentes, mas não são SQL padrão.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, `STDDEV_POP()` retorna `NULL`.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

* `STDDEV_SAMP(expr) [over_clause]`

Retorna a desvio padrão da amostra de *`expr`* (a raiz quadrada de `VAR_SAMP()`.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, o `STDDEV_SAMP()` retorna `NULL`.

Esta função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

* `SUM([DISTINCT] expr) [over_clause]`

Retorna a soma de *`expr`*. Se o conjunto de retorno não tiver linhas, o `SUM()` retorna `NULL`. A palavra-chave `DISTINCT` pode ser usada para somar apenas os valores distintos de *`expr`*.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, o `SUM()` retorna `NULL`.

Esta função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”; não pode ser usada com `DISTINCT`.

* `VAR_POP(expr) [over_clause]`

Retorna a variância populacional padrão de *`expr`*. Considera as linhas como a população inteira, não como uma amostra, portanto, tem o número de linhas como denominador. Você também pode usar `VARIANCE()`, que é equivalente, mas não é SQL padrão.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, o `VAR_POP()` retorna `NULL`.

Esta função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

* `VAR_SAMP(expr) [over_clause]`

Retorna a variância da amostra de *`expr`*. Isso é, o denominador é o número de linhas menos um.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, o `VAR_SAMP()` retorna `NULL`.

Essa função é executada como uma função de janela se o *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

* `VARIANCE(expr) [over_clause]`

Retorna a variância populacional de *`expr`*. `VARIANCE()` é um sinônimo da função SQL padrão `VAR_POP()`, fornecida como uma extensão do MySQL.

Se não houver linhas correspondentes ou se *`expr`* for `NULL`, `VARIANCE()` retorna `NULL`.

Essa função é executada como uma função de janela se o *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.