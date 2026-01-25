### 12.19.1 Descrições de Funções de Agregação

Esta seção descreve as funções de agregação que operam em conjuntos de valores. Elas são frequentemente usadas com uma cláusula `GROUP BY` para agrupar valores em subconjuntos.

**Table 12.25 Funções de Agregação**

<table frame="box" rules="all" summary="Uma referência que lista funções de agregação."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Nome</th> <th>Descrição</th> <th>Introduzido</th> </tr></thead><tbody><tr><th><code>AVG()</code></th> <td> Retorna o valor médio do argumento </td> <td></td> </tr><tr><th><code>BIT_AND()</code></th> <td> Retorna AND bit a bit </td> <td></td> </tr><tr><th><code>BIT_OR()</code></th> <td> Retorna OR bit a bit </td> <td></td> </tr><tr><th><code>BIT_XOR()</code></th> <td> Retorna XOR bit a bit </td> <td></td> </tr><tr><th><code>COUNT()</code></th> <td> Retorna uma contagem do número de linhas retornadas </td> <td></td> </tr><tr><th><code>COUNT(DISTINCT)</code></th> <td> Retorna a contagem de um número de valores diferentes </td> <td></td> </tr><tr><th><code>GROUP_CONCAT()</code></th> <td> Retorna uma string concatenada </td> <td></td> </tr><tr><th><code>JSON_ARRAYAGG()</code></th> <td> Retorna o conjunto de resultados como um único array JSON </td> <td>5.7.22</td> </tr><tr><th><code>JSON_OBJECTAGG()</code></th> <td> Retorna o conjunto de resultados como um único objeto JSON </td> <td>5.7.22</td> </tr><tr><th><code>MAX()</code></th> <td> Retorna o valor máximo </td> <td></td> </tr><tr><th><code>MIN()</code></th> <td> Retorna o valor mínimo </td> <td></td> </tr><tr><th><code>STD()</code></th> <td> Retorna o desvio padrão populacional </td> <td></td> </tr><tr><th><code>STDDEV()</code></th> <td> Retorna o desvio padrão populacional </td> <td></td> </tr><tr><th><code>STDDEV_POP()</code></th> <td> Retorna o desvio padrão populacional </td> <td></td> </tr><tr><th><code>STDDEV_SAMP()</code></th> <td> Retorna o desvio padrão da amostra </td> <td></td> </tr><tr><th><code>SUM()</code></th> <td> Retorna a soma </td> <td></td> </tr><tr><th><code>VAR_POP()</code></th> <td> Retorna a variância padrão populacional </td> <td></td> </tr><tr><th><code>VAR_SAMP()</code></th> <td> Retorna a variância da amostra </td> <td></td> </tr><tr><th><code>VARIANCE()</code></th> <td> Retorna a variância padrão populacional </td> <td></td> </tr> </tbody></table>

A menos que seja indicado de outra forma, as funções de agregação ignoram valores `NULL`.

Se você usar uma função de agregação em uma instrução que não contenha uma cláusula `GROUP BY`, isso é equivalente a agrupar todas as linhas. Para mais informações, consulte a Seção 12.19.3, “Tratamento de GROUP BY no MySQL”.

Para argumentos numéricos, as funções de variância e desvio padrão retornam um valor `DOUBLE`. As funções `SUM()` e `AVG()` retornam um valor `DECIMAL` para argumentos de valor exato (integer ou `DECIMAL`), e um valor `DOUBLE` para argumentos de valor aproximado (`FLOAT` ou `DOUBLE`).

As funções de agregação `SUM()` e `AVG()` não funcionam com valores temporais. (Elas convertem os valores em números, perdendo tudo após o primeiro caractere não numérico.) Para contornar esse problema, converta para unidades numéricas, realize a operação de agregação e converta de volta para um valor temporal. Exemplos:

```sql
SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(time_col))) FROM tbl_name;
SELECT FROM_DAYS(SUM(TO_DAYS(date_col))) FROM tbl_name;
```

Funções como `SUM()` ou `AVG()` que esperam um argumento numérico fazem o cast do argumento para um número, se necessário. Para valores `SET` ou `ENUM`, a operação de cast faz com que o valor numérico subjacente seja usado.

As funções de agregação `BIT_AND()`, `BIT_OR()` e `BIT_XOR()` realizam operações de bit. Elas requerem argumentos `BIGINT` (inteiro de 64 bits) e retornam valores `BIGINT`. Argumentos de outros tipos são convertidos para `BIGINT`, e pode ocorrer truncamento. Para obter informações sobre uma alteração no MySQL 8.0 que permite que operações de bit aceitem argumentos do tipo string binária (`BINARY`, `VARBINARY` e os tipos `BLOB`), consulte a Seção 12.12, “Funções e Operadores de Bit”.

* `AVG([DISTINCT] expr)`

  Retorna o valor médio de *`expr`*. A opção `DISTINCT` pode ser usada para retornar a média dos valores distintos de *`expr`*.

  Se não houver linhas correspondentes, `AVG()` retorna `NULL`.

  ```sql
  mysql> SELECT student_name, AVG(test_score)
         FROM student
         GROUP BY student_name;
  ```

* `BIT_AND(expr)`

  Retorna o `AND` bit a bit de todos os bits em *`expr`*. O cálculo é realizado com precisão de 64 bits (`BIGINT`).

  Se não houver linhas correspondentes, `BIT_AND()` retorna um valor neutro (todos os bits definidos como 1).

* `BIT_OR(expr)`

  Retorna o `OR` bit a bit de todos os bits em *`expr`*. O cálculo é realizado com precisão de 64 bits (`BIGINT`).

  Se não houver linhas correspondentes, `BIT_OR()` retorna um valor neutro (todos os bits definidos como 0).

* `BIT_XOR(expr)`

  Retorna o `XOR` bit a bit de todos os bits em *`expr`*. O cálculo é realizado com precisão de 64 bits (`BIGINT`).

  Se não houver linhas correspondentes, `BIT_XOR()` retorna um valor neutro (todos os bits definidos como 0).

* `COUNT(expr)`

  Retorna uma contagem do número de valores não-`NULL` de *`expr`* nas linhas recuperadas por uma instrução `SELECT`. O resultado é um valor `BIGINT`.

  Se não houver linhas correspondentes, `COUNT()` retorna `0`.

  ```sql
  mysql> SELECT student.student_name,COUNT(*)
         FROM student,course
         WHERE student.student_id=course.student_id
         GROUP BY student_name;
  ```

  `COUNT(*)` é um pouco diferente, pois retorna a contagem do número de linhas recuperadas, independentemente de elas conterem valores `NULL`.

  Para storage engines transacionais como o `InnoDB`, armazenar uma contagem exata de linhas é problemático. Múltiplas transações podem estar ocorrendo ao mesmo tempo, e cada uma delas pode afetar a contagem.

  O `InnoDB` não mantém uma contagem interna de linhas em uma tabela porque transações concorrentes podem “ver” diferentes números de linhas ao mesmo tempo. Consequentemente, as instruções `SELECT COUNT(*)` contam apenas as linhas visíveis para a transação atual.

  Antes do MySQL 5.7.18, o `InnoDB` processava as instruções `SELECT COUNT(*)` ao escanear o clustered index. A partir do MySQL 5.7.18, o `InnoDB` processa as instruções `SELECT COUNT(*)` ao percorrer o menor secondary index disponível, a menos que uma dica de index ou do optimizer direcione o optimizer a usar um index diferente. Se um secondary index não estiver presente, o clustered index é escaneado.

  O processamento de instruções `SELECT COUNT(*)` leva algum tempo se os registros de index não estiverem inteiramente no buffer pool. Para uma contagem mais rápida, crie uma tabela de contador e permita que seu aplicativo a atualize de acordo com as inserções e exclusões que ele realiza. No entanto, este método pode não ser escalável em situações onde milhares de transações concorrentes estão iniciando atualizações na mesma tabela de contador. Se uma contagem aproximada de linhas for suficiente, use `SHOW TABLE STATUS`.

  O `InnoDB` lida com as operações `SELECT COUNT(*)` e `SELECT COUNT(1)` da mesma maneira. Não há diferença de performance.

  Para tabelas `MyISAM`, `COUNT(*)` é otimizado para retornar muito rapidamente se o `SELECT` recuperar dados de uma única tabela, nenhuma outra coluna for recuperada e não houver cláusula `WHERE`. Por exemplo:

  ```sql
  mysql> SELECT COUNT(*) FROM student;
  ```

  Esta otimização se aplica apenas a tabelas `MyISAM`, porque uma contagem exata de linhas é armazenada para este storage engine e pode ser acessada muito rapidamente. `COUNT(1)` está sujeito à mesma otimização apenas se a primeira coluna for definida como `NOT NULL`.

* `COUNT(DISTINCT expr,[expr...])`

  Retorna uma contagem do número de linhas com valores *`expr`* não-`NULL` diferentes.

  Se não houver linhas correspondentes, `COUNT(DISTINCT)` retorna `0`.

  ```sql
  mysql> SELECT COUNT(DISTINCT results) FROM student;
  ```

  No MySQL, você pode obter o número de combinações de expressões distintas que não contenham `NULL` fornecendo uma lista de expressões. No SQL padrão, você teria que fazer uma concatenação de todas as expressões dentro de `COUNT(DISTINCT ...)`.

* `GROUP_CONCAT(expr)`

  Esta função retorna um resultado string com os valores não-`NULL` concatenados de um grupo. Ela retorna `NULL` se não houver valores não-`NULL`. A sintaxe completa é a seguinte:

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

  No MySQL, você pode obter os valores concatenados de combinações de expressões. Para eliminar valores duplicados, use a cláusula `DISTINCT`. Para ordenar valores no resultado, use a cláusula `ORDER BY`. Para ordenar em ordem inversa, adicione a palavra-chave `DESC` (decrescente) ao nome da coluna pela qual você está ordenando na cláusula `ORDER BY`. O padrão é ordem ascendente; isso pode ser especificado explicitamente usando a palavra-chave `ASC`. O separador padrão entre valores em um grupo é a vírgula (`,`). Para especificar um separador explicitamente, use `SEPARATOR` seguido pelo valor literal string que deve ser inserido entre os valores do grupo. Para eliminar o separador completamente, especifique `SEPARATOR ''`.

  O resultado é truncado para o comprimento máximo dado pela variável de sistema `group_concat_max_len`, que tem um valor padrão de 1024. O valor pode ser definido mais alto, embora o comprimento máximo efetivo do valor de retorno seja limitado pelo valor de `max_allowed_packet`. A sintaxe para alterar o valor de `group_concat_max_len` em tempo de execução é a seguinte, onde *`val`* é um inteiro sem sinal:

  ```sql
  SET [GLOBAL | SESSION] group_concat_max_len = val;
  ```

  O valor de retorno é uma string não binária ou binária, dependendo se os argumentos são strings não binárias ou binárias. O tipo de resultado é `TEXT` ou `BLOB`, a menos que `group_concat_max_len` seja menor ou igual a 512, caso em que o tipo de resultado é `VARCHAR` ou `VARBINARY`.

  Se `GROUP_CONCAT()` for invocada de dentro do cliente **mysql**, os resultados de string binária são exibidos usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

  Consulte também `CONCAT()` e `CONCAT_WS()`: Seção 12.8, “Funções e Operadores de String”.

* `JSON_ARRAYAGG(col_or_expr)`

  Agrega um conjunto de resultados como um único array `JSON` cujos elementos consistem nas linhas. A ordem dos elementos neste array é indefinida. A função atua em uma coluna ou em uma expressão que avalia um único valor. Retorna `NULL` se o resultado não contiver linhas ou em caso de erro.

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

* `JSON_OBJECTAGG(key, value)`

  Aceita dois nomes de coluna ou expressões como argumentos, sendo o primeiro usado como *key* e o segundo como *value*, e retorna um objeto JSON contendo pares *key-value*. Retorna `NULL` se o resultado não contiver linhas ou em caso de erro. Ocorre um erro se qualquer nome de *key* for `NULL` ou se o número de argumentos não for igual a 2.

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

  **Tratamento de keys duplicadas.** Quando o resultado desta função é normalizado, valores com *keys* duplicadas são descartados. De acordo com a especificação do tipo de dado `JSON` do MySQL, que não permite *keys* duplicadas, apenas o último *value* encontrado é usado com aquela *key* no objeto retornado (“a última *key* duplicada vence”). Isso significa que o resultado do uso desta função em colunas de um `SELECT` pode depender da ordem em que as linhas são retornadas, o que não é garantido.

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

  Consulte Normalization, Merging, and Autowrapping of JSON Values, para informações adicionais e exemplos.

  Adicionado no MySQL 5.7.22.

* `MAX([DISTINCT] expr)`

  Retorna o valor máximo de *`expr`*. `MAX()` pode aceitar um argumento string; nesses casos, ele retorna o valor máximo da string. Consulte a Seção 8.3.1, “Como o MySQL Usa Indexes”. A palavra-chave `DISTINCT` pode ser usada para encontrar o máximo dos valores distintos de *`expr`*, no entanto, isso produz o mesmo resultado que omitir `DISTINCT`.

  Se não houver linhas correspondentes, `MAX()` retorna `NULL`.

  ```sql
  mysql> SELECT student_name, MIN(test_score), MAX(test_score)
         FROM student
         GROUP BY student_name;
  ```

  Para `MAX()`, o MySQL atualmente compara colunas `ENUM` e `SET` por seu valor string em vez de pela posição relativa da string no conjunto. Isso difere da forma como `ORDER BY` as compara.

* `MIN([DISTINCT] expr)`

  Retorna o valor mínimo de *`expr`*. `MIN()` pode aceitar um argumento string; nesses casos, ele retorna o valor mínimo da string. Consulte a Seção 8.3.1, “Como o MySQL Usa Indexes”. A palavra-chave `DISTINCT` pode ser usada para encontrar o mínimo dos valores distintos de *`expr`*, no entanto, isso produz o mesmo resultado que omitir `DISTINCT`.

  Se não houver linhas correspondentes, `MIN()` retorna `NULL`.

  ```sql
  mysql> SELECT student_name, MIN(test_score), MAX(test_score)
         FROM student
         GROUP BY student_name;
  ```

  Para `MIN()`, o MySQL atualmente compara colunas `ENUM` e `SET` por seu valor string em vez de pela posição relativa da string no conjunto. Isso difere da forma como `ORDER BY` as compara.

* `STD(expr)`

  Retorna o desvio padrão populacional de *`expr`*. `STD()` é um sinônimo para a função SQL padrão `STDDEV_POP()`, fornecido como uma extensão do MySQL.

  Se não houver linhas correspondentes, `STD()` retorna `NULL`.

* `STDDEV(expr)`

  Retorna o desvio padrão populacional de *`expr`*. `STDDEV()` é um sinônimo para a função SQL padrão `STDDEV_POP()`, fornecido para compatibilidade com Oracle.

  Se não houver linhas correspondentes, `STDDEV()` retorna `NULL`.

* `STDDEV_POP(expr)`

  Retorna o desvio padrão populacional de *`expr`* (a raiz quadrada de `VAR_POP()`). Você também pode usar `STD()` ou `STDDEV()`, que são equivalentes, mas não são SQL padrão.

  Se não houver linhas correspondentes, `STDDEV_POP()` retorna `NULL`.

* `STDDEV_SAMP(expr)`

  Retorna o desvio padrão da amostra de *`expr`* (a raiz quadrada de `VAR_SAMP()`).

  Se não houver linhas correspondentes, `STDDEV_SAMP()` retorna `NULL`.

* `SUM([DISTINCT] expr)`

  Retorna a soma de *`expr`*. Se o conjunto de retorno não tiver linhas, `SUM()` retorna `NULL`. A palavra-chave `DISTINCT` pode ser usada para somar apenas os valores distintos de *`expr`*.

  Se não houver linhas correspondentes, `SUM()` retorna `NULL`.

* `VAR_POP(expr)`

  Retorna a variância padrão populacional de *`expr`*. Ela considera as linhas como a população inteira, não como uma amostra, portanto, tem o número de linhas como denominador. Você também pode usar `VARIANCE()`, que é equivalente, mas não é SQL padrão.

  Se não houver linhas correspondentes, `VAR_POP()` retorna `NULL`.

* `VAR_SAMP(expr)`

  Retorna a variância da amostra de *`expr`*. Ou seja, o denominador é o número de linhas menos um.

  Se não houver linhas correspondentes, `VAR_SAMP()` retorna `NULL`.

* `VARIANCE(expr)`

  Retorna a variância padrão populacional de *`expr`*. `VARIANCE()` é um sinônimo para a função SQL padrão `VAR_POP()`, fornecido como uma extensão do MySQL.

  Se não houver linhas correspondentes, `VARIANCE()` retorna `NULL`.