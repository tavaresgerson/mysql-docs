## 12.19 Funções agregadas

As funções agregadas operam em conjuntos de valores. Elas são frequentemente usadas com uma cláusula `GROUP BY` para agrupar os valores em subconjuntos.

### 12.19.1 Descrição das funções agregadas

Esta seção descreve funções agregadas que operam em conjuntos de valores. Elas são frequentemente usadas com uma cláusula `GROUP BY` para agrupar valores em subconjuntos.

**Tabela 12.25 Funções agregadas**

<table frame="box" rules="all" summary="A reference that lists aggregate functions."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th><code>AVG()</code></th> <td>Retorne o valor médio do argumento</td> <td></td> </tr><tr><th><code>BIT_AND()</code></th> <td> Return bitwise AND </td> <td></td> </tr><tr><th><code>BIT_OR()</code></th> <td> Return bitwise OR </td> <td></td> </tr><tr><th><code>BIT_XOR()</code></th> <td> Return bitwise XOR </td> <td></td> </tr><tr><th><code>COUNT()</code></th> <td>Retorne um contador do número de strings retornadas</td> <td></td> </tr><tr><th><code>COUNT(DISTINCT)</code></th> <td>Retorne o contagem de um número de valores diferentes</td> <td></td> </tr><tr><th><code>GROUP_CONCAT()</code></th> <td>Retorne uma string concatenada</td> <td></td> </tr><tr><th><code>JSON_ARRAYAGG()</code></th> <td>Retorne o conjunto de resultados como um único array JSON</td> <td>5.7.22</td> </tr><tr><th><code>JSON_OBJECTAGG()</code></th> <td>Retorne o conjunto de resultados como um único objeto JSON</td> <td>5.7.22</td> </tr><tr><th><code>MAX()</code></th> <td>Retorne o valor máximo</td> <td></td> </tr><tr><th><code>MIN()</code></th> <td>Retorne o valor mínimo</td> <td></td> </tr><tr><th><code>STD()</code></th> <td>Retorne a desvio padrão da população</td> <td></td> </tr><tr><th><code>STDDEV()</code></th> <td>Retorne a desvio padrão da população</td> <td></td> </tr><tr><th><code>STDDEV_POP()</code></th> <td>Retorne a desvio padrão da população</td> <td></td> </tr><tr><th><code>STDDEV_SAMP()</code></th> <td>Retorne a desvio padrão da amostra</td> <td></td> </tr><tr><th><code>SUM()</code></th> <td> Return the sum </td> <td></td> </tr><tr><th><code>VAR_POP()</code></th> <td>Retorne a variância padrão da população</td> <td></td> </tr><tr><th><code>VAR_SAMP()</code></th> <td>Retorne a variância da amostra</td> <td></td> </tr><tr><th><code>VARIANCE()</code></th> <td>Retorne a variância padrão da população</td> <td></td> </tr></tbody></table>

A menos que haja indicação em contrário, as funções agregadas ignoram os valores de `NULL`.

Se você usar uma função agregada em uma declaração que não contém nenhuma cláusula `GROUP BY`, ela é equivalente a agrupar todas as strings. Para mais informações, consulte a Seção 12.19.3, “Tratamento do MySQL do GROUP BY”.

Para argumentos numéricos, as funções de variância e desvio padrão retornam um valor `DOUBLE` - FLOAT, DOUBLE"). As funções `SUM()` e `AVG()` retornam um valor `DECIMAL` - DECIMAL, NUMERIC") para argumentos de valor exato (inteiro ou `DECIMAL` - DECIMAL, NUMERIC")), e um valor `DOUBLE` - FLOAT, DOUBLE") para argumentos de valor aproximado (`FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE")).

As funções agregadoras `SUM()` e `AVG()` não funcionam com valores temporais. (Elas convertem os valores em números, perdendo tudo após o primeiro caractere não numérico.) Para contornar esse problema, converta para unidades numéricas, realize a operação agregadora e converta de volta para um valor temporal. Exemplos:

```sql
SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(time_col))) FROM tbl_name;
SELECT FROM_DAYS(SUM(TO_DAYS(date_col))) FROM tbl_name;
```

Funções como `SUM()` ou `AVG()` que esperam um argumento numérico convertem o argumento em um número, se necessário. Para os valores de `SET` ou `ENUM`, a operação de conversão faz com que o valor numérico subjacente seja usado.

As funções agregadoras `BIT_AND()`, `BIT_OR()` e `BIT_XOR()` realizam operações de bits. Elas exigem argumentos `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (inteiro de 64 bits) e retornam valores `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") Os argumentos de outros tipos são convertidos em `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e pode ocorrer truncação. Para informações sobre uma mudança no MySQL 8.0 que permite que os argumentos do tipo de string binária de operações de bits (os tipos `BINARY`, `VARBINARY` e `BLOB`), consulte a Seção 12.12, “Funções e Operadores de Bits”.

* `AVG([DISTINCT] expr)`](aggregate-functions.html#function_avg)

Retorna o valor médio de `expr`. A opção `DISTINCT` pode ser usada para retornar a média dos valores distintos de *`expr`*.

Se não houver strings correspondentes, `AVG()` retorna `NULL`.

  ```sql
  mysql> SELECT student_name, AVG(test_score)
         FROM student
         GROUP BY student_name;
  ```

* `BIT_AND(expr)`

Retorna o bitwise `AND` de todos os bits em *`expr`*. O cálculo é realizado com precisão de 64 bits (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)).

Se não houver strings correspondentes, `BIT_AND()` retorna um valor neutro (todos os bits definidos como 1).

* `BIT_OR(expr)`

Retorna o bitwise `OR` de todos os bits em *`expr`*. O cálculo é realizado com precisão de 64 bits (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)).

Se não houver strings correspondentes, `BIT_OR()` retorna um valor neutro (todos os bits configurados como 0).

* `BIT_XOR(expr)`

Retorna o bitwise `XOR` de todos os bits em *`expr`*. O cálculo é realizado com precisão de 64 bits (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)).

Se não houver strings correspondentes, `BIT_XOR()` retorna um valor neutro (todos os bits configurados como 0).

* `COUNT(expr)`

Retorna um contador do número de valores não `NULL` de *`expr`* nas strings recuperadas por uma declaração `SELECT`. O resultado é um valor `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

Se não houver strings correspondentes, `COUNT()` retorna `0`.

  ```sql
  mysql> SELECT student.student_name,COUNT(*)
         FROM student,course
         WHERE student.student_id=course.student_id
         GROUP BY student_name;
  ```

`COUNT(*)` é um pouco diferente, pois retorna um contador do número de strings recuperadas, independentemente de elas conterem ou não os valores de `NULL`.

Para motores de armazenamento transacional, como `InnoDB`, armazenar um número exato de strings é problemático. Múltiplas transações podem estar ocorrendo ao mesmo tempo, e cada uma delas pode afetar o contagem.

`InnoDB` não mantém um contador interno de strings em uma tabela, porque transações concorrentes podem "ver" diferentes números de strings ao mesmo tempo. Consequentemente, as declarações `SELECT COUNT(*)` contam apenas as strings visíveis para a transação atual.

Antes do MySQL 5.7.18, `InnoDB` processa as instruções `SELECT COUNT(*)` ao analisar o índice agrupado. A partir do MySQL 5.7.18, `InnoDB` processa as instruções `SELECT COUNT(*)` ao percorrer o menor índice secundário disponível, a menos que uma dica de índice ou do otimizador indique ao otimizador que use um índice diferente. Se um índice secundário não estiver presente, o índice agrupado é analisado.

O processamento das declarações `SELECT COUNT(*)` leva algum tempo se os registros do índice não estiverem totalmente no buffer pool. Para uma contagem mais rápida, crie uma tabela de contagem e deixe sua aplicação atualizá-la de acordo com as inserções e exclusões que ela realiza. No entanto, esse método pode não escalar bem em situações em que milhares de transações concorrentes estão iniciando atualizações na mesma tabela de contagem. Se um número aproximado de strings for suficiente, use `SHOW TABLE STATUS`.

`InnoDB` lida com as operações de `SELECT COUNT(*)` e `SELECT COUNT(1)` da mesma maneira. Não há diferença de desempenho.

Para as tabelas `MyISAM`, `COUNT(*)` é otimizado para retornar muito rapidamente se o `SELECT` recuperar de uma tabela, sem que outras colunas sejam recuperadas e não há cláusula `WHERE`. Por exemplo:

  ```sql
  mysql> SELECT COUNT(*) FROM student;
  ```

Essa otimização só se aplica às tabelas `MyISAM`, porque um número exato de strings é armazenado para esse mecanismo de armazenamento e pode ser acessado muito rapidamente. `COUNT(1)` está sujeito à mesma otimização apenas se a primeira coluna for definida como `NOT NULL`.

* `COUNT(DISTINCT expr,[expr...])`(aggregate-functions.html#function_count)

Retorna um contador do número de strings com valores diferentes de `NULL` *`expr`*.

Se não houver strings correspondentes, `COUNT(DISTINCT)` retorna `0`.

  ```sql
  mysql> SELECT COUNT(DISTINCT results) FROM student;
  ```

Em MySQL, você pode obter o número de combinações de expressões distintas que não contenham `NULL` fornecendo uma lista de expressões. Em SQL padrão, você teria que fazer uma concatenação de todas as expressões dentro de `COUNT(DISTINCT ...)`.

* `GROUP_CONCAT(expr)`

Essa função retorna um resultado em forma de string com os valores concatenados que não são `NULL` de um grupo. Ela retorna `NULL` se não houver valores que não são `NULL`. A sintaxe completa é a seguinte:

  ```sql
  GROUP_CONCAT([DISTINCT] expr [,expr ...]
               [ORDER BY {unsigned_integer | col_name | expr}
                   [ASC | DESC] [,col_name ...]]
               [SEPARATOR str_val])
  ```

  ```sql
  mysql> SELECT student_name,
           GROUP_CONCAT(test_score)
         FROM student
         GROUP BY student_name;
  ```

Ou:

  ```sql
  mysql> SELECT student_name,
           GROUP_CONCAT(DISTINCT test_score
                        ORDER BY test_score DESC SEPARATOR ' ')
         FROM student
         GROUP BY student_name;
  ```

Em MySQL, você pode obter os valores concatenados das combinações de expressão. Para eliminar valores duplicados, use a cláusula `DISTINCT`. Para ordenar os valores no resultado, use a cláusula `ORDER BY`. Para ordenar em ordem inversa, adicione a palavra-chave `DESC` (descrescente) ao nome da coluna que você está ordenando na cláusula `ORDER BY`. O padrão é a ordem ascendente; isso pode ser especificado explicitamente usando a palavra-chave `ASC`. O separador padrão entre os valores em um grupo é a vírgula (`,`). Para especificar um separador explicitamente, use `SEPARATOR` seguido pelo valor literal da string que deve ser inserido entre os valores do grupo. Para eliminar o separador completamente, especifique `SEPARATOR ''`.

O resultado é truncado para o comprimento máximo que é dado pela variável de sistema `group_concat_max_len`, que tem um valor padrão de 1024. O valor pode ser ajustado para um valor maior, embora o comprimento máximo efetivo do valor de retorno seja limitado pelo valor de `max_allowed_packet`. A sintaxe para alterar o valor de `group_concat_max_len` em tempo de execução é a seguinte, onde *`val`* é um inteiro sem sinal:

  ```sql
  SET [GLOBAL | SESSION] group_concat_max_len = val;
  ```

O valor de retorno é uma string não binária ou binária, dependendo se os argumentos são strings não binárias ou binárias. O tipo de resultado é `TEXT` ou `BLOB`, a menos que `group_concat_max_len` seja menor ou igual a 512, caso em que o tipo de resultado é `VARCHAR` ou `VARBINARY`.

Se `GROUP_CONCAT()` for invocado dentro do cliente **mysql**, os resultados de cadeia binária são exibidos usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando MySQL”.

Veja também `CONCAT()` e `CONCAT_WS()`: Seção 12.8, “Funções e operadores de cadeia”.

* `JSON_ARRAYAGG(col_or_expr)`

Agrupa um conjunto de resultados como um único array `JSON` cujos elementos consistem nas strings. A ordem dos elementos neste array é indefinida. A função atua em uma coluna ou em uma expressão que avalia um único valor. Retorna `NULL` se o resultado não contiver nenhuma string, ou em caso de erro.

  ```sql
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

Adicionado no MySQL 5.7.22.

* `JSON_OBJECTAGG(key, value)`(aggregate-functions.html#function_json-objectagg)

Pede dois nomes de coluna ou expressões como argumentos, sendo o primeiro usado como chave e o segundo como valor, e retorna um objeto JSON contendo pares chave-valor. Retorna `NULL` se o resultado não contiver nenhuma string, ou em caso de erro. Um erro ocorre se qualquer nome de chave for `NULL` ou se o número de argumentos não for igual a 2.

  ```sql
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

**Tratamento de chaves duplicadas.** Quando o resultado desta função é normalizado, os valores com chaves duplicadas são descartados. De acordo com a especificação do tipo de dados `JSON` do MySQL, que não permite chaves duplicadas, apenas o último valor encontrado é usado com essa chave no objeto retornado (“a chave duplicada ganha”). Isso significa que o resultado do uso desta função em colunas de um `SELECT` pode depender da ordem em que as strings são retornadas, o que não é garantido.

Considere o seguinte:

  ```sql
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

Veja Normalização, Fusão e Autoenrolado de Valores JSON, para obter informações adicionais e exemplos.

Adicionado no MySQL 5.7.22.

* `MAX([DISTINCT] expr)`(aggregate-functions.html#function_max)

Retorna o valor máximo de *`expr`*. `MAX()` pode receber um argumento de string; nesses casos, ele retorna o valor máximo da string. Veja a Seção 8.3.1, “Como o MySQL usa índices”. A palavra-chave `DISTINCT` pode ser usada para encontrar o máximo dos valores distintos de *`expr`*, no entanto, isso produz o mesmo resultado que omitir `DISTINCT`.

Se não houver strings correspondentes, `MAX()` retorna `NULL`.

  ```sql
  mysql> SELECT student_name, MIN(test_score), MAX(test_score)
         FROM student
         GROUP BY student_name;
  ```

Para `MAX()`, o MySQL atualmente compara as colunas `ENUM` e `SET` pelo seu valor de string em vez da posição relativa da string no conjunto. Isso difere da forma como o `ORDER BY` as compara.

* `MIN([DISTINCT] expr)`(aggregate-functions.html#function_min)

Retorna o valor mínimo de *`expr`*. `MIN()` pode receber um argumento de string; nesses casos, ele retorna o valor mínimo da string. Veja a Seção 8.3.1, “Como o MySQL usa índices”. A palavra-chave `DISTINCT` pode ser usada para encontrar o mínimo dos valores distintos de *`expr`*, no entanto, isso produz o mesmo resultado que omitir `DISTINCT`.

Se não houver strings correspondentes, `MIN()` retorna `NULL`.

  ```sql
  mysql> SELECT student_name, MIN(test_score), MAX(test_score)
         FROM student
         GROUP BY student_name;
  ```

Para `MIN()`, o MySQL atualmente compara as colunas `ENUM` e `SET` por seu valor de string em vez da posição relativa da string no conjunto. Isso difere da forma como o `ORDER BY` as compara.

* `STD(expr)`

Retorna a desvio padrão populacional de *`expr`*. `STD()` é sinônimo da função padrão SQL `STDDEV_POP()`, fornecida como uma extensão MySQL.

Se não houver strings correspondentes, `STD()` retorna `NULL`.

* `STDDEV(expr)`

Retorna a desvio padrão populacional de *`expr`*. `STDDEV()` é sinônimo da função padrão SQL `STDDEV_POP()`, fornecida para compatibilidade com Oracle.

Se não houver strings correspondentes, `STDDEV()` retorna `NULL`.

* `STDDEV_POP(expr)`

Retorna a desvio padrão populacional de *`expr`* (a raiz quadrada de `VAR_POP()`). Você também pode usar `STD()` ou `STDDEV()`, que são equivalentes, mas não são SQL padrão.

Se não houver strings correspondentes, `STDDEV_POP()` retorna `NULL`.

* `STDDEV_SAMP(expr)`

Retorna a desvio padrão amostral de *`expr`* (a raiz quadrada de `VAR_SAMP()`.

Se não houver strings correspondentes, `STDDEV_SAMP()` retorna `NULL`.

* `SUM([DISTINCT] expr)`(aggregate-functions.html#function_sum)

Retorna a soma de *`expr`*. Se o conjunto de retorno não tiver strings, `SUM()` retorna `NULL`. A palavra-chave `DISTINCT` pode ser usada para somar apenas os valores distintos de *`expr`*.

Se não houver strings correspondentes, `SUM()` retorna `NULL`.

* `VAR_POP(expr)`

Retorna a variância padrão da população de *`expr`*. Considera as strings como a população inteira, não como uma amostra, portanto, tem o número de strings como denominador. Você também pode usar `VARIANCE()`, que é equivalente, mas não é SQL padrão.

Se não houver strings correspondentes, `VAR_POP()` retorna `NULL`.

* `VAR_SAMP(expr)`

Retorna a variância amostral de *`expr`*. Ou seja, o denominador é o número de strings menos um.

Se não houver strings correspondentes, `VAR_SAMP()` retorna `NULL`.

* `VARIANCE(expr)`

Retorna a variância padrão da população de *`expr`*. `VARIANCE()` é sinônimo da função padrão SQL `VAR_POP()`, fornecida como uma extensão MySQL.

Se não houver strings correspondentes, `VARIANCE()` retorna `NULL`.

### 12.19.2 Modificadores de GROUP BY

A cláusula `GROUP BY` permite um modificador `WITH ROLLUP` que faz com que a saída resumida inclua strings extras que representam operações resumidas de nível superior (ou seja, super-agregadas). `ROLLUP` permite, assim, responder a perguntas em vários níveis de análise com uma única consulta. Por exemplo, `ROLLUP` pode ser usado para fornecer suporte a operações OLAP (Processamento Analítico Online).

Suponha que uma tabela `sales` tenha as colunas `year`, `country`, `product` e `profit` para registrar a rentabilidade das vendas:

```sql
CREATE TABLE sales
(
    year    INT,
    country VARCHAR(20),
    product VARCHAR(32),
    profit  INT
);
```

Para resumir o conteúdo da tabela por ano, use um simples `GROUP BY` assim:

```sql
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

A saída mostra o lucro total (agregado) para cada ano. Para determinar também o lucro total somando todos os anos, você deve somar os valores individuais você mesmo ou executar uma consulta adicional. Ou você pode usar `ROLLUP`, que fornece ambos os níveis de análise com uma única consulta. Adicionando um modificador `WITH ROLLUP` à cláusula `GROUP BY`, a consulta produz outra string (super-agregado) que mostra o total geral sobre todos os valores do ano:

```sql
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

O valor `NULL` na coluna `year` identifica a string do superagregado de total geral.

`ROLLUP` tem um efeito mais complexo quando há várias colunas `GROUP BY`. Neste caso, cada vez que há uma mudança no valor em qualquer coluna, exceto a última coluna de agrupamento, a consulta produz uma string de resumo superagregado extra.

Por exemplo, sem `ROLLUP`, um resumo da tabela `sales` com base em `year`, `country` e `product` pode parecer assim, onde a saída indica valores resumidos apenas no nível de análise ano/país/produto:

```sql
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

Com `ROLLUP` adicionado, a consulta produz várias strings extras:

```sql
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

* Após cada conjunto de strings de produtos para um ano e país específico, uma string de resumo superagregado adicional aparece, mostrando o total para todos os produtos. Essas strings têm a coluna `product` definida como `NULL`.

* Após cada conjunto de strings para um ano dado, uma string de resumo superagregado adicional aparece, mostrando o total para todos os países e produtos. Essas strings têm as colunas `country` e `products` definidas como `NULL`.

* Por fim, após todas as outras strings, uma string de resumo superagregado extra aparece, mostrando o total geral para todos os anos, países e produtos. Essa string tem as colunas `year`, `country` e `products` definidas como `NULL`.

Os indicadores `NULL` em cada string de superagregado são produzidos quando a string é enviada ao cliente. O servidor analisa as colunas nomeadas na cláusula `GROUP BY` seguindo a coluna mais à esquerda que tem o valor alterado. Para qualquer coluna no conjunto de resultados com um nome que corresponda a qualquer um desses nomes, seu valor é definido como `NULL`. (Se você especificar a agrupamento de colunas por posição da coluna, o servidor identifica quais colunas devem ser definidas como `NULL` por posição.)

Como os valores do `NULL` nas strings do superagregado são colocados no conjunto de resultados em uma etapa tão tardia no processamento da consulta, você pode testá-los como valores do `NULL` apenas na lista de seleção ou na cláusula `HAVING`. Você não pode testá-los como valores do `NULL` em condições de junção ou na cláusula `WHERE` para determinar quais strings selecionar. Por exemplo, você não pode adicionar `WHERE product IS NULL` à consulta para eliminar todas as strings, exceto as do superagregado, do resultado.

Os valores do `NULL` aparecem como `NULL` no lado do cliente e podem ser testados como tal usando qualquer interface de programação de cliente MySQL. No entanto, neste ponto, você não pode distinguir se um `NULL` representa um valor agrupado regular ou um valor superagregado. No MySQL 8.0, você pode usar a função `GROUPING()` para testar a distinção.

#### Outras considerações ao usar o ROLLUP

A discussão a seguir lista alguns comportamentos específicos da implementação do `ROLLUP` no MySQL.

Quando você usa `ROLLUP`, não pode também usar uma cláusula `ORDER BY` para ordenar os resultados. Em outras palavras, `ROLLUP` e `ORDER BY` são mutuamente exclusivos no MySQL. No entanto, você ainda tem algum controle sobre a ordem de classificação. Para contornar a restrição que impede o uso de `ROLLUP` com `ORDER BY` e alcançar uma ordem de classificação específica dos resultados agrupados, gere o conjunto de resultados agrupados como uma tabela derivada e aplique `ORDER BY` a ele. Por exemplo:

```sql
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

Neste caso, as strings de resumo do superagregado são ordenadas com as strings das quais são calculadas, e seu posicionamento depende do tipo de ordenação (no início para uma ordenação ascendente, no final para uma ordenação descendente).

`LIMIT` pode ser usado para restringir o número de strings devolvidas ao cliente. `LIMIT` é aplicado após `ROLLUP`, portanto, o limite se aplica contra as strings extras adicionadas por `ROLLUP`. Por exemplo:

```sql
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

Usar `LIMIT` com `ROLLUP` pode produzir resultados mais difíceis de interpretar, pois há menos contexto para entender as strings superagregadas.

Uma extensão do MySQL permite que uma coluna que não aparece na lista `GROUP BY` seja nomeada na lista de seleção. (Para informações sobre colunas não agregadas e `GROUP BY`, consulte a Seção 12.19.3, “Tratamento do MySQL do GROUP BY”.) Neste caso, o servidor é livre para escolher qualquer valor desta coluna não agregada em strings de resumo, e isso inclui as strings extras adicionadas por `WITH ROLLUP`. Por exemplo, na seguinte consulta, `country` é uma coluna não agregada que não aparece na lista `GROUP BY` e os valores escolhidos para esta coluna são não determinísticos:

```sql
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

```sql
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

### 12.19.3 Tratamento do MySQL do GROUP BY

SQL-92 e versões anteriores não permitem consultas nas quais a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` se referem a colunas não agregadas que não são nomeadas na cláusula `GROUP BY`. Por exemplo, esta consulta é ilegal no SQL-92 padrão porque a coluna não agregada `name` na lista de seleção não aparece no `GROUP BY`:

```sql
SELECT o.custid, c.name, MAX(o.payment)
  FROM orders AS o, customers AS c
  WHERE o.custid = c.custid
  GROUP BY o.custid;
```

Para que a consulta seja legal no SQL-92, a coluna `name` deve ser omitida da lista de seleção ou nomeada na cláusula `GROUP BY`.

SQL:1999 e versões posteriores permitem tais não agregados por característica opcional T301, se estiverem funcionalmente dependentes das colunas `GROUP BY`: Se tal relação existir entre `name` e `custid`, a consulta é legal. Este seria o caso, por exemplo, se `custid` fosse uma chave primária de `customers`.

O MySQL 5.7.5 e versões posteriores implementam a detecção de dependência funcional. Se o modo SQL `ONLY_FULL_GROUP_BY` estiver habilitado (o que é o padrão), o MySQL rejeita consultas para as quais a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` se referem a colunas não agregadas que não estão nomeadas na cláusula `GROUP BY` e não são funcionalmente dependentes delas. (Antes de 5.7.5, o MySQL não detecta a dependência funcional e `ONLY_FULL_GROUP_BY` não é habilitado por padrão.)

O MySQL 5.7.5 e versões posteriores também permitem uma coluna não agregada que não é nomeada em uma cláusula `GROUP BY` quando o modo SQL `ONLY_FULL_GROUP_BY` é habilitado, desde que essa coluna seja limitada a um único valor, conforme mostrado no exemplo a seguir:

```sql
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

É também possível ter mais de uma coluna não agregada na lista `SELECT` ao empregar `ONLY_FULL_GROUP_BY`. Nesse caso, cada coluna desse tipo deve ser limitada a um único valor, e todas as condições de limitação desse tipo devem ser unidas por `AND` lógico, como mostrado aqui:

```sql
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

Você pode obter o mesmo efeito sem desabilitar `ONLY_FULL_GROUP_BY` usando `ANY_VALUE()` para referenciar a coluna não agregada.

A discussão a seguir demonstra a dependência funcional, a mensagem de erro que o MySQL produz quando a dependência funcional está ausente, e as maneiras de fazer o MySQL aceitar uma consulta na ausência de dependência funcional.

Essa consulta pode ser inválida com `ONLY_FULL_GROUP_BY` habilitado porque a coluna não agregada `address` na lista de seleção não está nomeada na cláusula `GROUP BY`:

```sql
SELECT name, address, MAX(age) FROM t GROUP BY name;
```

A consulta é válida se `name` for uma chave primária de `t` ou se for uma coluna única de `NOT NULL`. Nesses casos, o MySQL reconhece que a coluna selecionada é funcionalmente dependente de uma coluna de agrupamento. Por exemplo, se `name` for uma chave primária, seu valor determina o valor de `address`, pois cada grupo tem apenas um valor da chave primária e, portanto, apenas uma string. Como resultado, não há aleatoriedade na escolha do valor de `address` em um grupo e não há necessidade de rejeitar a consulta.

A consulta é inválida se `name` não for uma chave primária de `t` ou uma coluna única de `NOT NULL`. Nesse caso, nenhuma dependência funcional pode ser inferida e ocorre um erro:

```sql
mysql> SELECT name, address, MAX(age) FROM t GROUP BY name;
ERROR 1055 (42000): Expression #2 of SELECT list is not in GROUP
BY clause and contains nonaggregated column 'mydb.t.address' which
is not functionally dependent on columns in GROUP BY clause; this
is incompatible with sql_mode=only_full_group_by
```

Se você sabe que, para um conjunto de dados específico, cada valor de `name` de fato determina de forma única o valor de `address`, `address` depende funcionalmente efetivamente de `name`. Para dizer ao MySQL que aceite a consulta, você pode usar a função `ANY_VALUE()`:

```sql
SELECT name, ANY_VALUE(address), MAX(age) FROM t GROUP BY name;
```

Alternativamente, desative `ONLY_FULL_GROUP_BY`.

O exemplo anterior, no entanto, é bastante simples. Em particular, é improvável que você agrupe em uma única coluna de chave primária, porque cada grupo conterá apenas uma string. Para exemplos adicionais que demonstram a dependência funcional em consultas mais complexas, consulte a Seção 12.19.4, “Detecção de Dependência Funcional”.

Se uma consulta tiver funções agregadas e nenhuma cláusula `GROUP BY`, ela não pode ter colunas não agregadas na lista de seleção, na condição `HAVING` ou na lista `ORDER BY` com `ONLY_FULL_GROUP_BY` habilitado:

```sql
mysql> SELECT name, MAX(age) FROM t;
ERROR 1140 (42000): In aggregated query without GROUP BY, expression
#1 of SELECT list contains nonaggregated column 'mydb.t.name'; this
is incompatible with sql_mode=only_full_group_by
```

Sem `GROUP BY`, há um único grupo e não é determinado qual valor de `name` escolher para o grupo. Aqui, também pode ser usado `ANY_VALUE()`, se não for importante qual valor de `name` o MySQL escolhe:

```sql
SELECT ANY_VALUE(name), MAX(age) FROM t;
```

Em MySQL 5.7.5 e versões posteriores, `ONLY_FULL_GROUP_BY` também afeta o tratamento de consultas que utilizam `DISTINCT` e `ORDER BY`. Considere o caso de uma tabela `t` com três colunas `c1`, `c2` e `c3` que contém essas strings:

```sql
c1 c2 c3
1  2  A
3  4  B
1  2  C
```

Suponha que execute a seguinte consulta, esperando que os resultados sejam ordenados por `c3`:

```sql
SELECT DISTINCT c1, c2 FROM t ORDER BY c3;
```

Para ordenar o resultado, os duplicados devem ser eliminados primeiro. Mas para isso, devemos manter a primeira string ou a terceira? Essa escolha arbitrária influencia o valor retido de `c3`, que por sua vez influencia a ordenação e a torna arbitrária também. Para evitar esse problema, uma consulta que tem `DISTINCT` e `ORDER BY` é rejeitada como inválida se qualquer expressão `ORDER BY` não satisfazer pelo menos uma dessas condições:

* A expressão é igual a uma na lista de seleção * Todas as colunas referenciadas pela expressão e pertencentes às tabelas selecionadas da consulta são elementos da lista de seleção

Outra extensão do MySQL ao SQL padrão permite referências na cláusula `HAVING` a expressões aliadas na lista de seleção. Por exemplo, a seguinte consulta retorna valores `name` que ocorrem apenas uma vez na tabela `orders`:

```sql
SELECT name, COUNT(name) FROM orders
  GROUP BY name
  HAVING COUNT(name) = 1;
```

A extensão MySQL permite o uso de um alias na cláusula `HAVING` para a coluna agregada:

```sql
SELECT name, COUNT(name) AS c FROM orders
  GROUP BY name
  HAVING c = 1;
```

Nota

Antes do MySQL 5.7.5, habilitar `ONLY_FULL_GROUP_BY` desativa essa extensão, exigindo, portanto, que a cláusula `HAVING` seja escrita usando expressões não aliadas.

O SQL padrão permite apenas expressões de coluna nas cláusulas de `GROUP BY`, portanto, uma declaração como esta é inválida porque `FLOOR(value/100)` é uma expressão não-coluna:

```sql
SELECT id, FLOOR(value/100)
  FROM tbl_name
  GROUP BY id, FLOOR(value/100);
```

O MySQL estende o SQL padrão para permitir expressões não colunas em cláusulas de `GROUP BY` e considera a declaração anterior válida.

O SQL padrão também não permite aliases em cláusulas de `GROUP BY`. O MySQL estende o SQL padrão para permitir aliases, então outra maneira de escrever a consulta é a seguinte:

```sql
SELECT id, FLOOR(value/100) AS val
  FROM tbl_name
  GROUP BY id, val;
```

O alias `val` é considerado uma expressão de coluna na cláusula `GROUP BY`.

Na presença de uma expressão não-colunar na cláusula `GROUP BY`, o MySQL reconhece a igualdade entre essa expressão e as expressões na lista de seleção. Isso significa que, com o modo SQL `ONLY_FULL_GROUP_BY` habilitado, a consulta que contém `GROUP BY id, FLOOR(value/100)` é válida, porque essa mesma expressão `FLOOR()` ocorre na lista de seleção. No entanto, o MySQL não tenta reconhecer a dependência funcional em expressões não-colunares de `GROUP BY`, portanto, a consulta a seguir é inválida com `ONLY_FULL_GROUP_BY` habilitado, mesmo que a terceira expressão selecionada seja uma fórmula simples da coluna `id` e a expressão `FLOOR()` na cláusula `GROUP BY`:

```sql
SELECT id, FLOOR(value/100), id+FLOOR(value/100)
  FROM tbl_name
  GROUP BY id, FLOOR(value/100);
```

Uma solução é usar uma tabela derivada:

```sql
SELECT id, F, id+F
  FROM
    (SELECT id, FLOOR(value/100) AS F
     FROM tbl_name
     GROUP BY id, FLOOR(value/100)) AS dt;
```

### 12.19.4 Detecção de dependência funcional

A discussão a seguir fornece vários exemplos das maneiras pelas quais o MySQL detecta dependências funcionais. Os exemplos utilizam essa notação:

```sql
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

```sql
SELECT co.Name, COUNT(*)
FROM countrylanguage cl, country co
WHERE cl.CountryCode = co.Code
GROUP BY co.Code;
```

`co.Code` é uma chave primária de `co`, portanto, todas as colunas de `co` dependem funcionalmente dela, conforme expresso usando essa notação:

```sql
{co.Code} -> {co.*}
```

Assim, `co.name` é funcionalmente dependente das colunas `GROUP BY` e a consulta é válida.

Um índice `UNIQUE` sobre uma coluna `NOT NULL` poderia ser usado em vez de uma chave primária e a mesma dependência funcional se aplicaria. (Isso não é verdade para um índice `UNIQUE` que permite valores `NULL` porque permite múltiplos valores `NULL` e, nesse caso, a singularidade é perdida.)

#### Dependências Funcionais Derivadas de Chaves de Múltiplos Coluna e de Igualdades

Essa consulta seleciona, para cada país, uma lista de todas as línguas faladas e quantas pessoas as falam:

```sql
SELECT co.Name, cl.Language,
cl.Percentage * co.Population / 100.0 AS SpokenBy
FROM countryLanguage cl, country co
WHERE cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

O par (`cl.CountryCode`, `cl.Language`) é uma chave primária composta de duas colunas de `cl`, de modo que o par de colunas determina de forma única todas as colunas de `cl`:

```sql
{cl.CountryCode, cl.Language} -> {cl.*}
```

Além disso, devido à igualdade na cláusula `WHERE`:

```sql
{cl.CountryCode} -> {co.Code}
```

E, porque `co.Code` é chave primária de `co`:

```sql
{co.Code} -> {co.*}
```

As relações que são “determinadas de forma exclusiva” são transitivas, portanto:

```sql
{cl.CountryCode, cl.Language} -> {cl.*,co.*}
```

Como resultado, a consulta é válida.

Assim como no exemplo anterior, uma chave `UNIQUE` sobre as colunas `NOT NULL` pode ser usada em vez de uma chave primária.

Uma condição `INNER JOIN` pode ser usada em vez de `WHERE`. As mesmas dependências funcionais se aplicam:

```sql
SELECT co.Name, cl.Language,
cl.Percentage * co.Population/100.0 AS SpokenBy
FROM countrylanguage cl INNER JOIN country co
ON cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

#### Casos Especiais de Dependência Funcional

Enquanto um teste de igualdade em uma condição de `WHERE` ou `INNER JOIN` é simétrico, um teste de igualdade em uma condição de junção externa não é, porque as tabelas desempenham papéis diferentes.

Suponha que a integridade referencial tenha sido acidentalmente quebrada e exista uma string de `countrylanguage` sem uma string correspondente em `country`. Considere a mesma consulta do exemplo anterior, mas com uma `LEFT JOIN`:

```sql
SELECT co.Name, cl.Language,
cl.Percentage * co.Population/100.0 AS SpokenBy
FROM countrylanguage cl LEFT JOIN country co
ON cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

Para um valor dado de `cl.CountryCode`, o valor de `co.Code` no resultado da junção é encontrado em uma string correspondente (determinada por `cl.CountryCode`) ou é complementado com `NULL` se não houver correspondência (também determinado por `cl.CountryCode`). Em cada caso, essa relação se aplica:

```sql
{cl.CountryCode} -> {co.Code}
```

`cl.CountryCode` é funcionalmente dependente de {`cl.CountryCode`, `cl.Language`}, que é uma chave primária.

Se, no resultado da junção `co.Code`, estiver `NULL` complementado, `co.Name` também estará. Se `co.Code` não estiver `NULL` complementado, então, como `co.Code` é uma chave primária, determina `co.Name`. Portanto, em todos os casos:

```sql
{co.Code} -> {co.Name}
```

Que produzem:

```sql
{cl.CountryCode, cl.Language} -> {cl.*,co.*}
```

Como resultado, a consulta é válida.

No entanto, suponha que as tabelas sejam trocadas, como nesta consulta:

```sql
SELECT co.Name, cl.Language,
cl.Percentage * co.Population/100.0 AS SpokenBy
FROM country co LEFT JOIN countrylanguage cl
ON cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

Agora, essa relação *não* se aplica:

```sql
{cl.CountryCode, cl.Language} -> {cl.*,co.*}
```

Todas as strings `NULL` complementadas feitas para `cl` são colocadas em um único grupo (elas têm ambas as colunas `GROUP BY` iguais a `NULL`, e dentro deste grupo o valor de `co.Name` pode variar. A consulta é inválida e o MySQL a rejeita.

A dependência funcional em junções externas está, portanto, relacionada à questão de se as colunas determinantes pertencem ao lado esquerdo ou direito do `LEFT JOIN`. A determinação da dependência funcional se torna mais complexa se houver junções externas aninhadas ou se a condição de junção não consistir inteiramente em comparações de igualdade.

#### Dependências Funcionais e Visualizações

Suponha que uma visão sobre os países produza seu código, seu nome em maiúsculas e quantos idiomas oficiais diferentes eles têm:

```sql
CREATE VIEW country2 AS
SELECT co.Code, UPPER(co.Name) AS UpperName,
COUNT(cl.Language) AS OfficialLanguages
FROM country AS co JOIN countrylanguage AS cl
ON cl.CountryCode = co.Code
WHERE cl.isOfficial = 'T'
GROUP BY co.Code;
```

Essa definição é válida porque:

```sql
{co.Code} -> {co.*}
```

No resultado da visualização, a primeira coluna selecionada é `co.Code`, que também é a coluna do grupo e, portanto, determina todas as outras expressões selecionadas:

```sql
{country2.Code} -> {country2.*}
```

O MySQL entende isso e usa essas informações, conforme descrito a seguir.

Essa consulta exibe os países, quantas línguas oficiais diferentes eles têm e quantas cidades eles têm, ao unir a visualização com a tabela `city`:

```sql
SELECT co2.Code, co2.UpperName, co2.OfficialLanguages,
COUNT(*) AS Cities
FROM country2 AS co2 JOIN city ci
ON ci.CountryCode = co2.Code
GROUP BY co2.Code;
```

Essa consulta é válida porque, como visto anteriormente:

```sql
{co2.Code} -> {co2.*}
```

O MySQL é capaz de descobrir uma dependência funcional no resultado de uma visão e usar isso para validar uma consulta que utiliza a visão. O mesmo aconteceria se `country2` fosse uma tabela derivada, como em:

```sql
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