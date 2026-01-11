### 12.19.1 Descrições de Funções Agregadas

Esta seção descreve funções agregadas que operam em conjuntos de valores. Elas são frequentemente usadas com uma cláusula `GROUP BY` para agrupar valores em subconjuntos.

**Tabela 12.25 Funções agregadas**

<table frame="box" rules="all" summary="Uma referência que lista funções agregadas."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Nome</th> <th>Descrição</th> <th>Introduzido</th> </tr></thead><tbody><tr><th>PH_HTML_CODE_<code>MIN()</code>]</th> <td>Retorne o valor médio do argumento</td> <td></td> </tr><tr><th>PH_HTML_CODE_<code>MIN()</code>]</th> <td>Retorno bit a bit e</td> <td></td> </tr><tr><th>PH_HTML_CODE_<code>STDDEV()</code>]</th> <td>Bitwise OR</td> <td></td> </tr><tr><th>PH_HTML_CODE_<code>STDDEV_POP()</code>]</th> <td>XOR bit a bit</td> <td></td> </tr><tr><th>PH_HTML_CODE_<code>STDDEV_SAMP()</code>]</th> <td>Retorne um contagem do número de linhas retornadas</td> <td></td> </tr><tr><th>PH_HTML_CODE_<code>SUM()</code>]</th> <td>Retorne o número de valores diferentes</td> <td></td> </tr><tr><th>PH_HTML_CODE_<code>VAR_POP()</code>]</th> <td>Retorne uma string concatenada</td> <td></td> </tr><tr><th>PH_HTML_CODE_<code>VAR_SAMP()</code>]</th> <td>Retorne o conjunto de resultados como um único array JSON</td> <td>5.7.22</td> </tr><tr><th>PH_HTML_CODE_<code>VARIANCE()</code>]</th> <td>Retorne o conjunto de resultados como um único objeto JSON</td> <td>5.7.22</td> </tr><tr><th><code>MAX()</code></th> <td>Retorne o valor máximo</td> <td></td> </tr><tr><th><code>MIN()</code></th> <td>Retorne o valor mínimo</td> <td></td> </tr><tr><th><code>BIT_AND()</code><code>MIN()</code>]</th> <td>Retorne a desvio padrão populacional</td> <td></td> </tr><tr><th><code>STDDEV()</code></th> <td>Retorne a desvio padrão populacional</td> <td></td> </tr><tr><th><code>STDDEV_POP()</code></th> <td>Retorne a desvio padrão populacional</td> <td></td> </tr><tr><th><code>STDDEV_SAMP()</code></th> <td>Retorne a desvio padrão da amostra</td> <td></td> </tr><tr><th><code>SUM()</code></th> <td>Devolva a soma</td> <td></td> </tr><tr><th><code>VAR_POP()</code></th> <td>Retorne a variância padrão da população</td> <td></td> </tr><tr><th><code>VAR_SAMP()</code></th> <td>Retorne a variância da amostra</td> <td></td> </tr><tr><th><code>VARIANCE()</code></th> <td>Retorne a variância padrão da população</td> <td></td> </tr></tbody></table>

A menos que especificado de outra forma, as funções agregadas ignoram valores `NULL`.

Se você usar uma função agregada em uma instrução que não contém a cláusula `GROUP BY`, ela será equivalente a agrupar todas as linhas. Para obter mais informações, consulte a Seção 12.19.3, “Tratamento do MySQL do GROUP BY”.

Para argumentos numéricos, as funções de variância e desvio padrão retornam um valor `DOUBLE` - FLOAT, DOUBLE"). As funções `SUM()` e `AVG()` retornam um valor `DECIMAL` - DECIMAL, NUMERIC") para argumentos de valor exato (inteiro ou `DECIMAL` - DECIMAL, NUMERIC")), e um valor `DOUBLE` - FLOAT, DOUBLE") para argumentos de valor aproximado (`FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE").

As funções agregadoras `SUM()` e `AVG()` não funcionam com valores temporais. (Elas convertem os valores em números, perdendo tudo após o primeiro caractere não numérico.) Para contornar esse problema, converta para unidades numéricas, realize a operação agregadora e converta de volta para um valor temporal. Exemplos:

```sql
SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(time_col))) FROM tbl_name;
SELECT FROM_DAYS(SUM(TO_DAYS(date_col))) FROM tbl_name;
```

Funções como `SUM()` ou `AVG()` que esperam um argumento numérico convertem o argumento para um número, se necessário. Para valores de `SET` ou `ENUM`, a operação de conversão faz com que o valor numérico subjacente seja usado.

As funções agregadas `BIT_AND()`, `BIT_OR()` e `BIT_XOR()` realizam operações de bits. Elas exigem argumentos `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (inteiro de 64 bits) e retornam valores `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")". Argumentos de outros tipos são convertidos em `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e pode ocorrer truncação. Para obter informações sobre uma mudança no MySQL 8.0 que permite que operações de bits recebam argumentos do tipo string binária (`BINARY`, `VARBINARY` e os tipos `BLOB`), consulte a Seção 12.12, “Funções e Operadores de Bits”.

- `AVG([DISTINCT] expr)`

  Retorna o valor médio de `expr`. A opção `DISTINCT` pode ser usada para retornar a média dos valores distintos de *`expr`*.

  Se não houver linhas correspondentes, o `AVG()` retorna `NULL`.

  ```sql
  mysql> SELECT student_name, AVG(test_score)
         FROM student
         GROUP BY student_name;
  ```

- `BIT_AND(expr)`

  Retorna a operação `E` (bit a bit) de todos os bits em *`expr`*. O cálculo é realizado com precisão de 64 bits (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT\`).

  Se não houver linhas correspondentes, o `BIT_AND()` retorna um valor neutro (todos os bits configurados como 1).

- `BIT_OR(expr)`

  Retorna a operação de `OU` bit a bit de todos os bits em *`expr`*. O cálculo é realizado com precisão de 64 bits (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT\`).

  Se não houver linhas correspondentes, o `BIT_OR()` retorna um valor neutro (todos os bits configurados como 0).

- `BIT_XOR(expr)`

  Retorna o bitwise `XOR` de todos os bits em *`expr`*. O cálculo é realizado com precisão de 64 bits (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT\`).

  Se não houver linhas correspondentes, o `BIT_XOR()` retorna um valor neutro (todos os bits configurados como 0).

- `COUNT(expr)`

  Retorna um contador do número de valores não `NULL` de *`expr`* nas linhas recuperadas por uma instrução `SELECT`. O resultado é um valor `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

  Se não houver linhas correspondentes, o `COUNT()` retornará `0`.

  ```sql
  mysql> SELECT student.student_name,COUNT(*)
         FROM student,course
         WHERE student.student_id=course.student_id
         GROUP BY student_name;
  ```

  `COUNT(*)` é um pouco diferente, pois retorna um contagem do número de linhas recuperadas, independentemente de elas conterem valores `NULL` ou

  Para motores de armazenamento transacional, como o `InnoDB`, armazenar um número exato de linhas é problemático. Várias transações podem estar ocorrendo ao mesmo tempo, e cada uma delas pode afetar o contagem.

  O `InnoDB` não mantém um contagem interna de linhas em uma tabela porque transações concorrentes podem "ver" números diferentes de linhas ao mesmo tempo. Consequentemente, as instruções `SELECT COUNT(*)` contam apenas as linhas visíveis para a transação atual.

  Antes do MySQL 5.7.18, o `InnoDB` processava as instruções `SELECT COUNT(*)` ao percorrer o índice agrupado. A partir do MySQL 5.7.18, o `InnoDB` processa as instruções `SELECT COUNT(*)` ao percorrer o índice secundário menor disponível, a menos que uma dica de índice ou otimizador indique ao otimizador que use um índice diferente. Se um índice secundário não estiver presente, o índice agrupado é percorrido.

  O processamento de instruções `SELECT COUNT(*)` leva algum tempo se os registros do índice não estiverem inteiramente no pool de buffer. Para uma contagem mais rápida, crie uma tabela de contador e deixe sua aplicação atualizá-la de acordo com as inserções e exclusões que ela realiza. No entanto, esse método pode não escalar bem em situações em que milhares de transações concorrentes estão iniciando atualizações na mesma tabela de contador. Se um número aproximado de linhas for suficiente, use `SHOW TABLE STATUS`.

  O `InnoDB` trata as operações `SELECT COUNT(*)` e `SELECT COUNT(1)` da mesma maneira. Não há diferença de desempenho.

  Para tabelas `MyISAM`, o `COUNT(*)` é otimizado para retornar muito rapidamente se o `SELECT` recuperar de uma única tabela, nenhuma outra coluna for recuperada e não houver cláusula `WHERE`. Por exemplo:

  ```sql
  mysql> SELECT COUNT(*) FROM student;
  ```

  Essa otimização só se aplica a tabelas `MyISAM`, porque um contagem exata de linhas é armazenada para esse mecanismo de armazenamento e pode ser acessada muito rapidamente. `COUNT(1)` está sujeito à mesma otimização apenas se a primeira coluna for definida como `NOT NULL`.

- `COUNT(DISTINCT expr,[expr...])`

  Retorna um contador do número de linhas com valores diferentes de *expr* que não são `NULL`.

  Se não houver linhas correspondentes, `COUNT(DISTINCT)` retorna `0`.

  ```sql
  mysql> SELECT COUNT(DISTINCT results) FROM student;
  ```

  No MySQL, você pode obter o número de combinações de expressões distintas que não contêm `NULL` fornecendo uma lista de expressões. No SQL padrão, você teria que fazer uma concatenação de todas as expressões dentro de `COUNT(DISTINCT ...).`

- `GROUP_CONCAT(expr)`

  Essa função retorna um resultado em forma de string com os valores não `NULL` concatenados de um grupo. Ela retorna `NULL` se não houver valores não `NULL`. A sintaxe completa é a seguinte:

  ```sql
  GROUP_CONCAT([DISTINCT] expr [,expr ...]
               [ORDER BY {unsigned_integer | col_name | expr}
                   [ASC | DESC] [,col_name ...
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

  No MySQL, você pode obter os valores concatenados de combinações de expressões. Para eliminar valores duplicados, use a cláusula `DISTINCT`. Para ordenar os valores no resultado, use a cláusula `ORDER BY`. Para ordenar em ordem inversa, adicione a palavra-chave `DESC` (descrescente) ao nome da coluna pela qual você está ordenando na cláusula `ORDER BY`. O padrão é a ordem crescente; isso pode ser especificado explicitamente usando a palavra-chave `ASC`. O separador padrão entre os valores de um grupo é a vírgula (`,`). Para especificar um separador explicitamente, use `SEPARATOR` seguido do valor literal da string que deve ser inserido entre os valores do grupo. Para eliminar o separador completamente, especifique `SEPARATOR ''`.

  O resultado é truncado para o comprimento máximo definido pela variável de sistema `group_concat_max_len`, que tem um valor padrão de 1024. O valor pode ser ajustado para um valor maior, embora o comprimento máximo efetivo do valor de retorno seja limitado pelo valor de `max_allowed_packet`. A sintaxe para alterar o valor de `group_concat_max_len` em tempo de execução é a seguinte, onde *`val`* é um inteiro sem sinal:

  ```sql
  SET [GLOBAL | SESSION] group_concat_max_len = val;
  ```

  O valor de retorno é uma string não binária ou binária, dependendo se os argumentos são strings não binárias ou binárias. O tipo de resultado é `TEXT` ou `BLOB`, a menos que `group_concat_max_len` seja menor ou igual a 512, caso em que o tipo de resultado é `VARCHAR` ou `VARBINARY`.

  Se a função `GROUP_CONCAT()` for invocada dentro do cliente **mysql**, os resultados de string binária são exibidos usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

  Veja também `CONCAT()` e `CONCAT_WS()`: Seção 12.8, “Funções e operadores de string”.

- `JSON_ARRAYAGG(col_or_expr)`

  Agrupa um conjunto de resultados em um único array `JSON` cujos elementos são as linhas. A ordem dos elementos neste array é indefinida. A função atua sobre uma coluna ou uma expressão que avalia a um único valor. Retorna `NULL` se o resultado não contiver nenhuma linha ou em caso de erro.

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

- `JSON_OBJECTAGG(chave, valor)`

  Aceita dois nomes de coluna ou expressões como argumentos, sendo o primeiro usado como chave e o segundo como valor, e retorna um objeto JSON contendo pares chave-valor. Retorna `NULL` se o resultado não contiver nenhuma linha ou em caso de erro. Um erro ocorre se qualquer nome de chave for `NULL` ou se o número de argumentos não for igual a 2.

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

  **Tratamento de chaves duplicadas.** Quando o resultado desta função é normalizado, os valores com chaves duplicadas são descartados. De acordo com a especificação do tipo de dados `JSON` do MySQL, que não permite chaves duplicadas, apenas o último valor encontrado é usado com essa chave no objeto retornado (“a última chave duplicada vence”). Isso significa que o resultado do uso desta função em colunas de um `SELECT` pode depender da ordem em que as linhas são retornadas, o que não é garantido.

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

  Consulte Normalização, Fusão e Autoenrolagem de Valores JSON para obter informações e exemplos adicionais.

  Adicionado no MySQL 5.7.22.

- `MAX([DISTINCT] expr)`

  Retorna o valor máximo de *`expr`*. O `MAX()` pode receber um argumento de string; nesses casos, ele retorna o valor de string máximo. Veja a Seção 8.3.1, “Como o MySQL Usa Índices”. A palavra-chave `DISTINCT` pode ser usada para encontrar o máximo dos valores distintos de *`expr`*, no entanto, isso produz o mesmo resultado que omitir `DISTINCT`.

  Se não houver linhas correspondentes, o `MAX()` retorna `NULL`.

  ```sql
  mysql> SELECT student_name, MIN(test_score), MAX(test_score)
         FROM student
         GROUP BY student_name;
  ```

  Para `MAX()`, o MySQL atualmente compara colunas `ENUM` e `SET` pelo valor da string em vez da posição relativa da string no conjunto. Isso difere da forma como o `ORDER BY` as compara.

- `MIN([DISTINCT] expr)`

  Retorna o valor mínimo de *`expr`*. O `MIN()` pode receber um argumento de string; nesses casos, ele retorna o valor mínimo da string. Veja a Seção 8.3.1, “Como o MySQL Usa Índices”. A palavra-chave `DISTINCT` pode ser usada para encontrar o mínimo dos valores distintos de *`expr`*, no entanto, isso produz o mesmo resultado que omitir `DISTINCT`.

  Se não houver linhas correspondentes, o `MIN()` retorna `NULL`.

  ```sql
  mysql> SELECT student_name, MIN(test_score), MAX(test_score)
         FROM student
         GROUP BY student_name;
  ```

  Para `MIN()`, o MySQL atualmente compara colunas `ENUM` e `SET` pelo valor da string em vez da posição relativa da string no conjunto. Isso difere da forma como o `ORDER BY` as compara.

- `STD(expr)`

  Retorna a desvio padrão populacional de *`expr`*. `STD()` é um sinônimo da função padrão SQL `STDDEV_POP()`, fornecida como uma extensão do MySQL.

  Se não houver linhas correspondentes, o `STD()` retorna `NULL`.

- `STDDEV(expr)`

  Retorna a desvio padrão populacional de *`expr`*. `STDDEV()` é um sinônimo da função padrão SQL `STDDEV_POP()`, fornecida para compatibilidade com o Oracle.

  Se não houver linhas correspondentes, o `STDDEV()` retorna `NULL`.

- `STDDEV_POP(expr)`

  Retorna a desvio padrão populacional de *`expr`* (a raiz quadrada de `VAR_POP()`). Você também pode usar `STD()` ou `STDDEV()`, que são equivalentes, mas não são SQL padrão.

  Se não houver linhas correspondentes, o `STDDEV_POP()` retorna `NULL`.

- `STDDEV_SAMP(expr)`

  Retorna a desvio padrão da amostra de *`expr`* (a raiz quadrada de `VAR_SAMP()`.

  Se não houver linhas correspondentes, o `STDDEV_SAMP()` retorna `NULL`.

- `SUM([DISTINCT] expr)`

  Retorna a soma de *`expr`*. Se o conjunto de retorno não tiver linhas, o `SUM()` retorna `NULL`. A palavra-chave `DISTINCT` pode ser usada para somar apenas os valores distintos de *`expr`*.

  Se não houver linhas correspondentes, o `SUM()` retorna `NULL`.

- `VAR_POP(expr)`

  Retorna a variância padrão da população de *`expr`*. Ele considera as linhas como a população inteira, não como uma amostra, portanto, tem o número de linhas como denominador. Você também pode usar `VARIANCE()`, que é equivalente, mas não é SQL padrão.

  Se não houver linhas correspondentes, o `VAR_POP()` retorna `NULL`.

- `VAR_SAMP(expr)`

  Retorna a variância amostral de *`expr`*. Ou seja, o denominador é o número de linhas menos um.

  Se não houver linhas correspondentes, o `VAR_SAMP()` retorna `NULL`.

- `VARIANCE(expr)`

  Retorna a variância padrão da população de *`expr`*. A função `VARIANCE()` é sinônima da função padrão SQL `VAR_POP()`, fornecida como uma extensão do MySQL.

  Se não houver linhas correspondentes, o `VARIANCE()` retorna `NULL`.
