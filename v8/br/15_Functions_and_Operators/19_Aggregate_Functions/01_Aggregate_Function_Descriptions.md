### 14.19.1 Descrições de Funções Agregadas

Esta seção descreve funções agregadas que operam em conjuntos de valores. Elas são frequentemente usadas com uma cláusula `GROUP BY` para agrupar valores em subconjuntos.

**Tabela 14.29 Funções agregadas**

<table summary="Uma referência que lista funções agregadas."><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[PH_HTML_CODE_<code>MIN()</code>]</td> <td>Retorne o valor médio do argumento</td> </tr><tr><td>[[PH_HTML_CODE_<code>MIN()</code>]</td> <td>Retorno bit a bit e</td> </tr><tr><td>[[PH_HTML_CODE_<code>STDDEV()</code>]</td> <td>Bitwise OR</td> </tr><tr><td>[[PH_HTML_CODE_<code>STDDEV_POP()</code>]</td> <td>XOR bit a bit</td> </tr><tr><td>[[PH_HTML_CODE_<code>STDDEV_SAMP()</code>]</td> <td>Retorne um contagem do número de linhas retornadas</td> </tr><tr><td>[[PH_HTML_CODE_<code>SUM()</code>]</td> <td>Retorne o número de valores diferentes</td> </tr><tr><td>[[PH_HTML_CODE_<code>VAR_POP()</code>]</td> <td>Retorne uma string concatenada</td> </tr><tr><td>[[PH_HTML_CODE_<code>VAR_SAMP()</code>]</td> <td>Retorne o conjunto de resultados como um único array JSON</td> </tr><tr><td>[[PH_HTML_CODE_<code>VARIANCE()</code>]</td> <td>Retorne o conjunto de resultados como um único objeto JSON</td> </tr><tr><td>[[<code>MAX()</code>]]</td> <td>Retorne o valor máximo</td> </tr><tr><td>[[<code>MIN()</code>]]</td> <td>Retorne o valor mínimo</td> </tr><tr><td>[[<code>BIT_AND()</code><code>MIN()</code>]</td> <td>Retorne a desvio padrão populacional</td> </tr><tr><td>[[<code>STDDEV()</code>]]</td> <td>Retorne a desvio padrão populacional</td> </tr><tr><td>[[<code>STDDEV_POP()</code>]]</td> <td>Retorne a desvio padrão populacional</td> </tr><tr><td>[[<code>STDDEV_SAMP()</code>]]</td> <td>Retorne a desvio padrão da amostra</td> </tr><tr><td>[[<code>SUM()</code>]]</td> <td>Devolva a soma</td> </tr><tr><td>[[<code>VAR_POP()</code>]]</td> <td>Retorne a variância padrão da população</td> </tr><tr><td>[[<code>VAR_SAMP()</code>]]</td> <td>Retorne a variância da amostra</td> </tr><tr><td>[[<code>VARIANCE()</code>]]</td> <td>Retorne a variância padrão da população</td> </tr></tbody></table>

A menos que especificado de outra forma, as funções agregadas ignoram os valores `NULL`.

Se você usar uma função agregada em uma instrução que não contenha nenhuma cláusula `GROUP BY`, ela será equivalente a agrupar todas as linhas. Para mais informações, consulte a Seção 14.19.3, “Tratamento do MySQL do GROUP BY”.

A maioria das funções agregadas pode ser usada como funções de janela. Aquelas que podem ser usadas dessa maneira são indicadas em sua descrição sintática por `[over_clause]`, representando uma cláusula `OVER` opcional. `over_clause` é descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”, que também inclui outras informações sobre o uso de funções de janela.

Para argumentos numéricos, as funções de variância e desvio padrão retornam um valor `DOUBLE` - FLOAT, DOUBLE"). As funções `SUM()` e `AVG()` retornam um valor `DECIMAL` - DECIMAL, NUMERIC") para argumentos de valor exato (inteiro ou `DECIMAL` - DECIMAL, NUMERIC")), e um valor `DOUBLE` - FLOAT, DOUBLE") para argumentos de valor aproximado (`FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE").

As funções agregadas `SUM()` e `AVG()` não funcionam com valores temporais. (Elas convertem os valores em números, perdendo tudo após o primeiro caractere não numérico.) Para contornar esse problema, converta para unidades numéricas, realize a operação agregada e volte a converter para um valor temporal. Exemplos:

```
SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(time_col))) FROM tbl_name;
SELECT FROM_DAYS(SUM(TO_DAYS(date_col))) FROM tbl_name;
```

Funções como `SUM()` ou `AVG()` que esperam um argumento numérico convertem o argumento para um número, se necessário. Para os valores de `SET` ou `ENUM`, a operação de conversão utiliza o valor numérico subjacente.

As funções agregadas `BIT_AND()`, `BIT_OR()` e `BIT_XOR()` realizam operações de bits. Antes do MySQL 8.0, as funções e operadores de bits exigiam argumentos `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e retornavam valores `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") com um alcance máximo de 64 bits. Argumentos que não eram `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") eram convertidos em `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") antes de realizar a operação, e poderia ocorrer uma truncação.

No MySQL 8.0, as funções e operadores de bits permitem argumentos do tipo de string binária (os tipos `BINARY`, `VARBINARY` e `BLOB`) e retornam um valor do mesmo tipo, o que permite que eles recebam argumentos e produzam valores de retorno maiores que 64 bits. Para discussão sobre a avaliação de argumentos e tipos de resultados para operações de bits, consulte a discussão introdutória na Seção 14.12, “Funções e Operadores de Bits”.

- `AVG([DISTINCT] expr) [over_clause]`

  Retorna o valor médio de `expr`. A opção `DISTINCT` pode ser usada para retornar a média dos valores distintos de `expr`.

  Se não houver linhas correspondentes, `AVG()` retorna `NULL`. A função também retorna `NULL` se `expr` for `NULL`.

  Essa função é executada como uma função de janela se `over_clause` estiver presente. `over_clause` é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”; não pode ser usada com `DISTINCT`.

  ```
  mysql> SELECT student_name, AVG(test_score)
         FROM student
         GROUP BY student_name;
  ```

- `BIT_AND(expr) [over_clause]`

  Retorna o código `AND` dos bits em `expr`.

  O tipo de resultado depende se os valores dos argumentos da função são avaliados como strings binárias ou números:

  - A avaliação de cadeias binárias ocorre quando os valores dos argumentos têm um tipo de cadeia binária e o argumento não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão do valor do argumento em inteiros de 64 bits não assinados, conforme necessário.

  - A avaliação de strings binárias produz uma string binária com o mesmo comprimento dos valores dos argumentos. Se os valores dos argumentos tiverem comprimentos diferentes, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. Se o tamanho do argumento exceder 511 bytes, ocorre um erro `ER_INVALID_BITWISE_AGGREGATE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro de 64 bits sem sinal.

  Se não houver linhas correspondentes, `BIT_AND()` retorna um valor neutro (todos os bits configurados para 1) com o mesmo comprimento dos valores do argumento.

  Os valores de `NULL` não afetam o resultado, a menos que todos os valores sejam `NULL`. Nesse caso, o resultado é um valor neutro com o mesmo comprimento que os valores do argumento.

  Para obter mais informações sobre a discussão sobre a avaliação de argumentos e tipos de resultados, consulte a discussão introdutória na Seção 14.12, “Funções e Operadores de Bits”.

  Se `BIT_AND()` for invocado dentro do cliente **mysql**, os resultados da string binária são exibidos usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

  A partir do MySQL 8.0.12, essa função é executada como uma função de janela se `over_clause` estiver presente. `over_clause` é conforme descrito na Seção 14.20.2, “Conceitos e sintaxe de funções de janela”.

- `BIT_OR(expr) [over_clause]`

  Retorna o código `OR` dos bits em `expr`.

  O tipo de resultado depende se os valores dos argumentos da função são avaliados como strings binárias ou números:

  - A avaliação de cadeias binárias ocorre quando os valores dos argumentos têm um tipo de cadeia binária e o argumento não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão do valor do argumento em inteiros de 64 bits não assinados, conforme necessário.

  - A avaliação de strings binárias produz uma string binária com o mesmo comprimento dos valores dos argumentos. Se os valores dos argumentos tiverem comprimentos diferentes, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. Se o tamanho do argumento exceder 511 bytes, ocorre um erro `ER_INVALID_BITWISE_AGGREGATE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro de 64 bits sem sinal.

  Se não houver linhas correspondentes, `BIT_OR()` retorna um valor neutro (todos os bits definidos como 0) com o mesmo comprimento dos valores do argumento.

  Os valores de `NULL` não afetam o resultado, a menos que todos os valores sejam `NULL`. Nesse caso, o resultado é um valor neutro com o mesmo comprimento que os valores do argumento.

  Para obter mais informações sobre a discussão sobre a avaliação de argumentos e tipos de resultados, consulte a discussão introdutória na Seção 14.12, “Funções e Operadores de Bits”.

  Se `BIT_OR()` for invocado dentro do cliente **mysql**, os resultados da string binária são exibidos usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

  A partir do MySQL 8.0.12, essa função é executada como uma função de janela se `over_clause` estiver presente. `over_clause` é conforme descrito na Seção 14.20.2, “Conceitos e sintaxe de funções de janela”.

- `BIT_XOR(expr) [over_clause]`

  Retorna o código `XOR` dos bits em `expr`.

  O tipo de resultado depende se os valores dos argumentos da função são avaliados como strings binárias ou números:

  - A avaliação de cadeias binárias ocorre quando os valores dos argumentos têm um tipo de cadeia binária e o argumento não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão do valor do argumento em inteiros de 64 bits não assinados, conforme necessário.

  - A avaliação de strings binárias produz uma string binária com o mesmo comprimento dos valores dos argumentos. Se os valores dos argumentos tiverem comprimentos diferentes, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. Se o tamanho do argumento exceder 511 bytes, ocorre um erro `ER_INVALID_BITWISE_AGGREGATE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro de 64 bits sem sinal.

  Se não houver linhas correspondentes, `BIT_XOR()` retorna um valor neutro (todos os bits definidos como 0) com o mesmo comprimento dos valores do argumento.

  Os valores de `NULL` não afetam o resultado, a menos que todos os valores sejam `NULL`. Nesse caso, o resultado é um valor neutro com o mesmo comprimento que os valores do argumento.

  Para obter mais informações sobre a discussão sobre a avaliação de argumentos e tipos de resultados, consulte a discussão introdutória na Seção 14.12, “Funções e Operadores de Bits”.

  Se `BIT_XOR()` for invocado dentro do cliente **mysql**, os resultados da string binária são exibidos usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

  A partir do MySQL 8.0.12, essa função é executada como uma função de janela se `over_clause` estiver presente. `over_clause` é conforme descrito na Seção 14.20.2, “Conceitos e sintaxe de funções de janela”.

- `COUNT(expr) [over_clause]`

  Retorna um contador do número de valores não `NULL` de `expr` nas linhas recuperadas por uma instrução `SELECT`. O resultado é um valor `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

  Se não houver linhas correspondentes, `COUNT()` retorna `0`. `COUNT(NULL)` retorna 0.

  Essa função é executada como uma função de janela se `over_clause` estiver presente. `over_clause` é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

  ```
  mysql> SELECT student.student_name,COUNT(*)
         FROM student,course
         WHERE student.student_id=course.student_id
         GROUP BY student_name;
  ```

  `COUNT(*)` é um pouco diferente, pois retorna um contador do número de linhas recuperadas, independentemente de elas conterem ou não valores de `NULL`.

  Para motores de armazenamento transacional, como `InnoDB`, armazenar um número exato de linhas é problemático. Várias transações podem estar ocorrendo ao mesmo tempo, e cada uma delas pode afetar o contagem.

  `InnoDB` não mantém uma contagem interna de linhas em uma tabela porque transações concorrentes podem "ver" números diferentes de linhas ao mesmo tempo. Consequentemente, as instruções `SELECT COUNT(*)` contam apenas as linhas visíveis para a transação atual.

  A partir do MySQL 8.0.13, o desempenho da consulta `SELECT COUNT(*) FROM tbl_name` para as tabelas `InnoDB` foi otimizado para cargas de trabalho monofiladas, desde que não haja cláusulas extras como `WHERE` ou `GROUP BY`.

  O `InnoDB` processa as instruções `SELECT COUNT(*)` ao percorrer o menor índice secundário disponível, a menos que uma dica de índice ou otimizador indique ao otimizador que use um índice diferente. Se um índice secundário não estiver presente, o `InnoDB` processa as instruções `SELECT COUNT(*)` ao percorrer o índice agrupado.

  O processamento das declarações `SELECT COUNT(*)` leva algum tempo se os registros de índice não estiverem inteiramente no pool de buffer. Para uma contagem mais rápida, crie uma tabela de contador e deixe sua aplicação atualizá-la de acordo com as inserções e exclusões que ela realiza. No entanto, esse método pode não escalar bem em situações em que milhares de transações concorrentes estão iniciando atualizações na mesma tabela de contador. Se um número aproximado de linhas for suficiente, use `SHOW TABLE STATUS`.

  O `InnoDB` lida com as operações `SELECT COUNT(*)` e `SELECT COUNT(1)` da mesma maneira. Não há diferença de desempenho.

  Para as tabelas `MyISAM`, `COUNT(*)` é otimizado para retornar muito rapidamente se o `SELECT` recuperar de uma tabela, nenhuma outra coluna é recuperada e não há nenhuma cláusula `WHERE`. Por exemplo:

  ```
  mysql> SELECT COUNT(*) FROM student;
  ```

  Essa otimização só se aplica às tabelas `MyISAM`, porque um número exato de linhas é armazenado para esse mecanismo de armazenamento e pode ser acessado muito rapidamente. `COUNT(1)` está sujeito à mesma otimização apenas se a primeira coluna for definida como `NOT NULL`.

- `COUNT(DISTINCT expr,[expr...])`

  Retorna um contador do número de linhas com valores diferentes de `NULL` `expr`.

  Se não houver linhas correspondentes, `COUNT(DISTINCT)` retorna `0`.

  ```
  mysql> SELECT COUNT(DISTINCT results) FROM student;
  ```

  No MySQL, você pode obter o número de combinações de expressões distintas que não contêm `NULL` fornecendo uma lista de expressões. No SQL padrão, você teria que fazer uma concatenação de todas as expressões dentro de `COUNT(DISTINCT ...)`.

- `GROUP_CONCAT(expr)`

  Essa função retorna um resultado em forma de string com os valores não `NULL` concatenados de um grupo. Ela retorna `NULL` se não houver valores não `NULL`. A sintaxe completa é a seguinte:

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

  No MySQL, você pode obter os valores concatenados de combinações de expressões. Para eliminar valores duplicados, use a cláusula `DISTINCT`. Para ordenar os valores no resultado, use a cláusula `ORDER BY`. Para ordenar em ordem inversa, adicione a palavra-chave `DESC` (decrescente) ao nome da coluna que está sendo ordenada na cláusula `ORDER BY`. O padrão é a ordem crescente; isso pode ser especificado explicitamente usando a palavra-chave `ASC`. O separador padrão entre os valores em um grupo é a vírgula (`,`). Para especificar um separador explicitamente, use `SEPARATOR` seguido do valor literal da string que deve ser inserido entre os valores do grupo. Para eliminar o separador completamente, especifique `SEPARATOR ''`.

  O resultado é truncado para o comprimento máximo definido pela variável de sistema `group_concat_max_len`, que tem um valor padrão de 1024. O valor pode ser ajustado para um valor maior, embora o comprimento máximo efetivo do valor de retorno seja limitado pelo valor de `max_allowed_packet`. A sintaxe para alterar o valor de `group_concat_max_len` em tempo de execução é a seguinte, onde `val` é um inteiro sem sinal:

  ```
  SET [GLOBAL | SESSION] group_concat_max_len = val;
  ```

  O valor de retorno é uma string não binária ou binária, dependendo se os argumentos são strings não binárias ou binárias. O tipo de resultado é `TEXT` ou `BLOB` a menos que `group_concat_max_len` seja menor ou igual a 512, caso em que o tipo de resultado é `VARCHAR` ou `VARBINARY`.

  Se `GROUP_CONCAT()` for invocado dentro do cliente **mysql**, os resultados da string binária são exibidos usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

  Veja também `CONCAT()` e `CONCAT_WS()`: Seção 14.8, “Funções e Operadores de String”.

- `JSON_ARRAYAGG(col_or_expr) [over_clause]`

  Agrupa um conjunto de resultados em um único array `JSON` cujos elementos consistem nas linhas. A ordem dos elementos neste array é indefinida. A função atua sobre uma coluna ou uma expressão que avalia a um único valor. Retorna `NULL` se o resultado não contiver nenhuma linha, ou em caso de erro. Se `col_or_expr` for `NULL`, a função retorna um array de elementos JSON `[null]`.

  A partir do MySQL 8.0.14, essa função é executada como uma função de janela se `over_clause` estiver presente. `over_clause` é conforme descrito na Seção 14.20.2, “Conceitos e sintaxe de funções de janela”.

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

- `JSON_OBJECTAGG(key, value) [over_clause]`

  Aceita dois nomes de coluna ou expressões como argumentos, sendo o primeiro usado como chave e o segundo como valor, e retorna um objeto JSON contendo pares chave-valor. Retorna `NULL` se o resultado não contiver nenhuma linha, ou em caso de erro. Um erro ocorre se qualquer nome de chave for `NULL` ou se o número de argumentos não for igual a 2.

  A partir do MySQL 8.0.14, essa função é executada como uma função de janela se `over_clause` estiver presente. `over_clause` é conforme descrito na Seção 14.20.2, “Conceitos e sintaxe de funções de janela”.

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

  **Tratamento de chaves duplicadas.** Quando o resultado desta função é normalizado, os valores com chaves duplicadas são descartados. De acordo com a especificação do tipo de dados `JSON` do MySQL, que não permite chaves duplicadas, apenas o último valor encontrado é usado com essa chave no objeto retornado (“a chave duplicada mais recente vence”). Isso significa que o resultado do uso desta função em colunas de um `SELECT` pode depender da ordem em que as linhas são retornadas, o que não é garantido.

  Quando usado como uma função de janela, se houver chaves duplicadas dentro de um quadro, apenas o último valor para a chave está presente no resultado. O valor para a chave da última linha do quadro é determinístico se a especificação `ORDER BY` garantir que os valores tenham uma ordem específica. Se não for o caso, o valor resultante da chave é não determinístico.

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

  A chave escolhida na última consulta é não determinística. Se a consulta não usar `GROUP BY` (que geralmente impõe sua própria ordem independentemente) e você prefere uma ordem de chave específica, pode invocar `JSON_OBJECTAGG()` como uma função de janela incluindo uma cláusula `OVER` com uma especificação `ORDER BY` para impor uma ordem específica nas linhas do quadro. Os exemplos seguintes mostram o que acontece com e sem `ORDER BY` para algumas especificações de quadros diferentes.

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

  Com `ORDER BY`, onde o quadro é o padrão de `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` (tanto em ordem crescente quanto decrescente):

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

- `MAX([DISTINCT] expr) [over_clause]`

  Retorna o valor máximo de `expr`. `MAX()` pode receber um argumento de string; nesses casos, ele retorna o valor de string máximo. Veja a Seção 10.3.1, “Como o MySQL Usa Índices”. A palavra-chave `DISTINCT` pode ser usada para encontrar o máximo dos valores distintos de `expr`, no entanto, isso produz o mesmo resultado que omitir `DISTINCT`.

  Se não houver linhas correspondentes, ou se `expr` for `NULL`, `MAX()` retornará `NULL`.

  Essa função é executada como uma função de janela se `over_clause` estiver presente. `over_clause` é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”; não pode ser usada com `DISTINCT`.

  ```
  mysql> SELECT student_name, MIN(test_score), MAX(test_score)
         FROM student
         GROUP BY student_name;
  ```

  Para `MAX()`, o MySQL atualmente compara as colunas `ENUM` e `SET` pelo valor da string em vez da posição relativa da string no conjunto. Isso difere da forma como o `ORDER BY` as compara.

- `MIN([DISTINCT] expr) [over_clause]`

  Retorna o valor mínimo de `expr`. `MIN()` pode receber um argumento de string; nesses casos, ele retorna o valor mínimo da string. Veja a Seção 10.3.1, “Como o MySQL Usa Índices”. A palavra-chave `DISTINCT` pode ser usada para encontrar o mínimo dos valores distintos de `expr`, no entanto, isso produz o mesmo resultado que omitir `DISTINCT`.

  Se não houver linhas correspondentes, ou se `expr` for `NULL`, `MIN()` retornará `NULL`.

  Essa função é executada como uma função de janela se `over_clause` estiver presente. `over_clause` é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”; não pode ser usada com `DISTINCT`.

  ```
  mysql> SELECT student_name, MIN(test_score), MAX(test_score)
         FROM student
         GROUP BY student_name;
  ```

  Para `MIN()`, o MySQL atualmente compara as colunas `ENUM` e `SET` pelo valor da string em vez da posição relativa da string no conjunto. Isso difere da forma como o `ORDER BY` as compara.

- `STD(expr) [over_clause]`

  Retorna a desvio padrão populacional de `expr`. `STD()` é um sinônimo da função padrão SQL `STDDEV_POP()`, fornecida como uma extensão MySQL.

  Se não houver linhas correspondentes, ou se `expr` for `NULL`, `STD()` retornará `NULL`.

  Essa função é executada como uma função de janela se `over_clause` estiver presente. `over_clause` é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

- `STDDEV(expr) [over_clause]`

  Retorna a desvio padrão populacional de `expr`. `STDDEV()` é um sinônimo da função padrão SQL `STDDEV_POP()`, fornecida para compatibilidade com o Oracle.

  Se não houver linhas correspondentes, ou se `expr` for `NULL`, `STDDEV()` retornará `NULL`.

  Essa função é executada como uma função de janela se `over_clause` estiver presente. `over_clause` é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

- `STDDEV_POP(expr) [over_clause]`

  Retorna a desvio padrão populacional de `expr` (a raiz quadrada de `VAR_POP()`). Você também pode usar `STD()` ou `STDDEV()`, que são equivalentes, mas não são SQL padrão.

  Se não houver linhas correspondentes, ou se `expr` for `NULL`, `STDDEV_POP()` retornará `NULL`.

  Essa função é executada como uma função de janela se `over_clause` estiver presente. `over_clause` é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

- `STDDEV_SAMP(expr) [over_clause]`

  Retorna a desvio padrão da amostra de `expr` (a raiz quadrada de `VAR_SAMP()`.

  Se não houver linhas correspondentes, ou se `expr` for `NULL`, `STDDEV_SAMP()` retornará `NULL`.

  Essa função é executada como uma função de janela se `over_clause` estiver presente. `over_clause` é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

- `SUM([DISTINCT] expr) [over_clause]`

  Retorna a soma de `expr`. Se o conjunto de retorno não tiver linhas, `SUM()` retorna `NULL`. A palavra-chave `DISTINCT` pode ser usada para somar apenas os valores distintos de `expr`.

  Se não houver linhas correspondentes, ou se `expr` for `NULL`, `SUM()` retornará `NULL`.

  Essa função é executada como uma função de janela se `over_clause` estiver presente. `over_clause` é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”; não pode ser usada com `DISTINCT`.

- `VAR_POP(expr) [over_clause]`

  Retorna a variância padrão da população de `expr`. Ele considera as linhas como a população inteira, e não como uma amostra, portanto, tem o número de linhas como denominador. Você também pode usar `VARIANCE()`, que é equivalente, mas não é SQL padrão.

  Se não houver linhas correspondentes, ou se `expr` for `NULL`, `VAR_POP()` retornará `NULL`.

  Essa função é executada como uma função de janela se `over_clause` estiver presente. `over_clause` é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

- `VAR_SAMP(expr) [over_clause]`

  Retorna a variância amostral de `expr`. Ou seja, o denominador é o número de linhas menos um.

  Se não houver linhas correspondentes, ou se `expr` for `NULL`, `VAR_SAMP()` retornará `NULL`.

  Essa função é executada como uma função de janela se `over_clause` estiver presente. `over_clause` é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

- `VARIANCE(expr) [over_clause]`

  Retorna a variância padrão da população de `expr`. `VARIANCE()` é um sinônimo da função padrão SQL `VAR_POP()`, fornecida como uma extensão MySQL.

  Se não houver linhas correspondentes, ou se `expr` for `NULL`, `VARIANCE()` retornará `NULL`.

  Essa função é executada como uma função de janela se `over_clause` estiver presente. `over_clause` é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.
