### 12.4.2 Funções e operadores de comparação

**Tabela 12.4 Operadores de Comparação**

<table frame="box" rules="all" summary="Uma referência que lista operadores de comparação."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="comparison-operators.html#operator_greater-than">[[PH_HTML_CODE_<code>EXISTS()</code>]</a></td> <td>Operador maior que</td> </tr><tr><td><a class="link" href="comparison-operators.html#operator_greater-than-or-equal">[[PH_HTML_CODE_<code>EXISTS()</code>]</a></td> <td>Operador maior que ou igual a</td> </tr><tr><td><a class="link" href="comparison-operators.html#operator_less-than">[[PH_HTML_CODE_<code>IN()</code>]</a></td> <td>Menos que o operador</td> </tr><tr><td><a class="link" href="comparison-operators.html#operator_not-equal">[[PH_HTML_CODE_<code>INTERVAL()</code>], [[PH_HTML_CODE_<code>IS</code>]</a></td> <td>Operador não igual</td> </tr><tr><td><a class="link" href="comparison-operators.html#operator_less-than-or-equal">[[PH_HTML_CODE_<code>IS NOT</code>]</a></td> <td>Operador menor ou igual</td> </tr><tr><td><a class="link" href="comparison-operators.html#operator_equal-to">[[PH_HTML_CODE_<code>IS NOT NULL</code>]</a></td> <td>Igual a operador seguro para valores nulos</td> </tr><tr><td><a class="link" href="comparison-operators.html#operator_equal">[[PH_HTML_CODE_<code>IS NULL</code>]</a></td> <td>Operador igual</td> </tr><tr><td><a class="link" href="comparison-operators.html#operator_between">[[PH_HTML_CODE_<code>ISNULL()</code>]</a></td> <td>Se um valor estiver dentro de uma faixa de valores</td> </tr><tr><td><a class="link" href="comparison-operators.html#function_coalesce">[[PH_HTML_CODE_<code>LEAST()</code>]</a></td> <td>Retorne o primeiro argumento que não é NULL</td> </tr><tr><td><a class="link" href="comparison-operators.html#operator_exists">[[<code>EXISTS()</code>]]</a></td> <td>Se o resultado de uma consulta contiver alguma linha</td> </tr><tr><td><a class="link" href="comparison-operators.html#function_greatest">[[<code>&gt;=</code><code>EXISTS()</code>]</a></td> <td>Retorne o maior argumento</td> </tr><tr><td><a class="link" href="comparison-operators.html#operator_in">[[<code>IN()</code>]]</a></td> <td>Se um valor está dentro de um conjunto de valores</td> </tr><tr><td><a class="link" href="comparison-operators.html#function_interval">[[<code>INTERVAL()</code>]]</a></td> <td>Retorne o índice do argumento que é menor que o primeiro argumento</td> </tr><tr><td><a class="link" href="comparison-operators.html#operator_is">[[<code>IS</code>]]</a></td> <td>Teste um valor contra um booleano</td> </tr><tr><td><a class="link" href="comparison-operators.html#operator_is-not">[[<code>IS NOT</code>]]</a></td> <td>Teste um valor contra um booleano</td> </tr><tr><td><a class="link" href="comparison-operators.html#operator_is-not-null">[[<code>IS NOT NULL</code>]]</a></td> <td>Teste de valor NOT NULL</td> </tr><tr><td><a class="link" href="comparison-operators.html#operator_is-null">[[<code>IS NULL</code>]]</a></td> <td>Teste de valor nulo</td> </tr><tr><td><a class="link" href="comparison-operators.html#function_isnull">[[<code>ISNULL()</code>]]</a></td> <td>Teste se o argumento é NULL</td> </tr><tr><td><a class="link" href="comparison-operators.html#function_least">[[<code>LEAST()</code>]]</a></td> <td>Retorne o menor argumento</td> </tr><tr><td><a class="link" href="string-comparison-functions.html#operator_like">[[<code>&lt;</code><code>EXISTS()</code>]</a></td> <td>Encontre padrões simples</td> </tr><tr><td><a class="link" href="comparison-operators.html#operator_not-between">[[<code>&lt;</code><code>EXISTS()</code>]</a></td> <td>Se um valor não estiver dentro de uma faixa de valores</td> </tr><tr><td><a class="link" href="comparison-operators.html#operator_not-exists">[[<code>&lt;</code><code>IN()</code>]</a></td> <td>Se o resultado de uma consulta não contiver nenhuma linha</td> </tr><tr><td><a class="link" href="comparison-operators.html#operator_not-in">[[<code>&lt;</code><code>INTERVAL()</code>]</a></td> <td>Se um valor não estiver dentro de um conjunto de valores</td> </tr><tr><td><a class="link" href="string-comparison-functions.html#operator_not-like">[[<code>&lt;</code><code>IS</code>]</a></td> <td>Negação de correspondência de padrão simples</td> </tr><tr><td><a class="link" href="string-comparison-functions.html#function_strcmp">[[<code>&lt;</code><code>IS NOT</code>]</a></td> <td>Compare duas strings</td> </tr></tbody></table>

As operações de comparação resultam em um valor de `1` (`TRUE`), `0` (`FALSE`) ou `NULL`. Essas operações funcionam tanto para números quanto para strings. As strings são convertidas automaticamente em números e os números em strings conforme necessário.

Os seguintes operadores de comparação relacional podem ser usados para comparar não apenas operandos escalares, mas também operandos de linha:

```sql
=  >  <  >=  <=  <>  !=
```

As descrições desses operadores mais adiante nesta seção detalham como eles funcionam com operadores de linha. Para exemplos adicionais de comparações de linha no contexto de subconsultas de linha, consulte a Seção 13.2.10.5, “Subconsultas de Linha”.

Algumas das funções nesta seção retornam valores diferentes de `1` (`TRUE`), `0` (`FALSE`) ou `NULL`. `LEAST()` e `GREATEST()` são exemplos de tais funções; a Seção 12.3, “Conversão de Tipo na Avaliação de Expressões”, descreve as regras para operações de comparação realizadas por essas e funções semelhantes para determinar seus valores de retorno.

Para converter um valor para um tipo específico para fins de comparação, você pode usar a função `CAST()`. Valores de string podem ser convertidos para um conjunto de caracteres diferente usando `CONVERT()`. Veja a Seção 12.10, “Funções e Operadores de Cast”.

Por padrão, as comparações de strings não são case-sensitive e usam o conjunto de caracteres atual. O padrão é `latin1` (cp1252 da Europa Ocidental), que também funciona bem para o inglês.

- `=`

  Igual:

  ```sql
  mysql> SELECT 1 = 0;
          -> 0
  mysql> SELECT '0' = 0;
          -> 1
  mysql> SELECT '0.0' = 0;
          -> 1
  mysql> SELECT '0.01' = 0;
          -> 0
  mysql> SELECT '.01' = 0.01;
          -> 1
  ```

  Para comparações de linhas, `(a, b) = (x, y)` é equivalente a:

  ```sql
  (a = x) AND (b = y)
  ```

- `<=>`

  Igualdade segura para `NULL`. Esse operador realiza uma comparação de igualdade como o operador `=` , mas retorna `1` em vez de `NULL` se ambos os operandos forem `NULL` e `0` em vez de `NULL` se um dos operandos for `NULL`.

  O operador `<=>` é equivalente ao operador padrão SQL `IS NOT DISTINCT FROM`.

  ```sql
  mysql> SELECT 1 <=> 1, NULL <=> NULL, 1 <=> NULL;
          -> 1, 1, 0
  mysql> SELECT 1 = 1, NULL = NULL, 1 = NULL;
          -> 1, NULL, NULL
  ```

  Para comparações de linhas, `(a, b) <=> (x, y)` é equivalente a:

  ```sql
  (a <=> x) AND (b <=> y)
  ```

- `<>`, `!=`

  Não é igual:

  ```sql
  mysql> SELECT '.01' <> '0.01';
          -> 1
  mysql> SELECT .01 <> '0.01';
          -> 0
  mysql> SELECT 'zapp' <> 'zappp';
          -> 1
  ```

  Para comparações de linhas, `(a, b) <> (x, y)` e `(a, b) != (x, y)` são equivalentes a:

  ```sql
  (a <> x) OR (b <> y)
  ```

- `<=`

  Menos ou igual a:

  ```sql
  mysql> SELECT 0.1 <= 2;
          -> 1
  ```

  Para comparações de linhas, `(a, b) <= (x, y)` é equivalente a:

  ```sql
  (a < x) OR ((a = x) AND (b <= y))
  ```

- `<`

  Menos que:

  ```sql
  mysql> SELECT 2 < 2;
          -> 0
  ```

  Para comparações de linhas, `(a, b) < (x, y)` é equivalente a:

  ```sql
  (a < x) OR ((a = x) AND (b < y))
  ```

- `>=`

  Maior ou igual a:

  ```sql
  mysql> SELECT 2 >= 2;
          -> 1
  ```

  Para comparações de linhas, `(a, b) >= (x, y)` é equivalente a:

  ```sql
  (a > x) OR ((a = x) AND (b >= y))
  ```

- `>`

  Maior que:

  ```sql
  mysql> SELECT 2 > 2;
          -> 0
  ```

  Para comparações de linhas, `(a, b) > (x, y)` é equivalente a:

  ```sql
  (a > x) OR ((a = x) AND (b > y))
  ```

- `expr BETWEEN min E max`

  Se *`expr`* for maior ou igual a *`min`* e *`expr`* for menor ou igual a *`max`*, o `BETWEEN` retorna `1`, caso contrário, retorna `0`. Isso é equivalente à expressão `(min <= expr AND expr <= max)` se todos os argumentos forem do mesmo tipo. Caso contrário, a conversão de tipo ocorre de acordo com as regras descritas na Seção 12.3, “Conversão de Tipo na Avaliação de Expressões”, mas aplicada a todos os três argumentos.

  ```sql
  mysql> SELECT 2 BETWEEN 1 AND 3, 2 BETWEEN 3 and 1;
          -> 1, 0
  mysql> SELECT 1 BETWEEN 2 AND 3;
          -> 0
  mysql> SELECT 'b' BETWEEN 'a' AND 'c';
          -> 1
  mysql> SELECT 2 BETWEEN 2 AND '3';
          -> 1
  mysql> SELECT 2 BETWEEN 2 AND 'x-3';
          -> 0
  ```

  Para obter os melhores resultados ao usar `BETWEEN` com valores de data ou hora, use `CAST()` para converter explicitamente os valores para o tipo de dado desejado. Exemplos: Se você comparar uma `DATETIME` com dois valores `DATE`, converta os valores `DATE` em valores `DATETIME`. Se você usar uma constante de string como `'2001-1-1'` em uma comparação com uma `DATE`, caste a string em uma `DATE`.

- `expr NÃO ENTRE ENTRE min E max`

  Isso é o mesmo que `NOT (expr BETWEEN min AND max)`.

- `COALESCE(valor,...)`

  Retorna o primeiro valor não `NULL` na lista, ou `NULL` se não houver valores não `NULL`.

  O tipo de retorno de `COALESCE()` é o tipo agregado dos tipos dos argumentos.

  ```sql
  mysql> SELECT COALESCE(NULL,1);
          -> 1
  mysql> SELECT COALESCE(NULL,NULL,NULL);
          -> NULL
  ```

- `EXISTS(consulta)`

  Se o resultado de uma consulta contém alguma linha.

  ```sql
  CREATE TABLE t (col VARCHAR(3));
  INSERT INTO t VALUES ('aaa', 'bbb', 'ccc', 'eee');

  SELECT EXISTS (SELECT * FROM t WHERE col LIKE 'c%');
          -> 1

  SELECT EXISTS (SELECT * FROM t WHERE col LIKE 'd%');
          -> 0
  ```

- `NOT EXISTS(query)`

  Se o resultado de uma consulta não contiver nenhuma linha:

  ```sql
  SELECT NOT EXISTS (SELECT * FROM t WHERE col LIKE 'c%');
          -> 0

  SELECT NOT EXISTS (SELECT * FROM t WHERE col LIKE 'd%');
          -> 1
  ```

- `MAIOR(valor1, valor2,...)`

  Com dois ou mais argumentos, retorna o maior argumento (com o valor máximo). Os argumentos são comparados seguindo as mesmas regras do `LEAST()`.

  ```sql
  mysql> SELECT GREATEST(2,0);
          -> 2
  mysql> SELECT GREATEST(34.0,3.0,5.0,767.0);
          -> 767.0
  mysql> SELECT GREATEST('B','A','C');
          -> 'C'
  ```

  `GREATEST()` retorna `NULL` se qualquer argumento for `NULL`.

- `expr IN (valor,...)`

  Retorna `1` (verdadeiro) se *`expr`* for igual a qualquer um dos valores na lista `IN()`, caso contrário, retorna `0` (falso).

  A conversão de tipo ocorre de acordo com as regras descritas na Seção 12.3, “Conversão de Tipo na Avaliação de Expressões”, aplicada a todos os argumentos. Se nenhuma conversão de tipo for necessária para os valores na lista `IN()`, todos eles são constantes do mesmo tipo, e *`expr`* pode ser comparado a cada um deles como um valor do mesmo tipo (possivelmente após conversão de tipo), uma otimização ocorre. Os valores da lista são ordenados e a busca por *`expr`* é feita usando uma busca binária, o que torna a operação `IN()` muito rápida.

  ```sql
  mysql> SELECT 2 IN (0,3,5,7);
          -> 0
  mysql> SELECT 'wefwf' IN ('wee','wefwf','weg');
          -> 1
  ```

  `IN()` pode ser usado para comparar construtores de linha:

  ```sql
  mysql> SELECT (3,4) IN ((1,2), (3,4));
          -> 1
  mysql> SELECT (3,4) IN ((1,2), (3,5));
          -> 0
  ```

  Você nunca deve misturar valores com e sem aspas em uma lista `IN()`, porque as regras de comparação para valores com aspas (como strings) e valores sem aspas (como números) são diferentes. A mistura de tipos pode, portanto, levar a resultados inconsistentes. Por exemplo, não escreva uma expressão `IN()` assim:

  ```sql
  SELECT val1 FROM tbl1 WHERE val1 IN (1,2,'a');
  ```

  Em vez disso, escreva assim:

  ```sql
  SELECT val1 FROM tbl1 WHERE val1 IN ('1','2','a');
  ```

  A conversão implícita de tipos pode produzir resultados não intuitivos:

  ```sql
  mysql> SELECT 'a' IN (0), 0 IN ('b');
          -> 1, 1
  ```

  Em ambos os casos, os valores de comparação são convertidos em valores de ponto flutuante, resultando em 0,0 em cada caso, e um resultado de comparação de 1 (verdadeiro).

  O número de valores na lista `IN()` é limitado apenas pelo valor `max_allowed_packet`.

  Para cumprir com o padrão SQL, `IN()` retorna `NULL` não apenas se a expressão do lado esquerdo for `NULL`, mas também se não for encontrada nenhuma correspondência na lista e uma das expressões na lista for `NULL`.

  A sintaxe `IN()` também pode ser usada para escrever certos tipos de subconsultas. Veja a Seção 13.2.10.3, “Subconsultas com ANY, IN ou SOME”.

- `expr NOT IN (valor,...)`

  Isso é o mesmo que `NOT (expr IN (valor,...))`.

- `INTERVAL(N, N1, N2, N3,...)`

  Retorna `0` se *`N`* ≤ *`N1`*, `1` se *`N`* ≤ *`N2`* e assim por diante, ou `-1` se *`N`* for `NULL`. Todos os argumentos são tratados como inteiros. É necessário que *`N1`* ≤ *`N2`* ≤ *`N3`* ≤ `...` ≤ *`Nn`* para que essa função funcione corretamente. Isso ocorre porque uma busca binária é usada (muito rápida).

  ```sql
  mysql> SELECT INTERVAL(23, 1, 15, 17, 30, 44, 200);
          -> 3
  mysql> SELECT INTERVAL(10, 1, 10, 100, 1000);
          -> 2
  mysql> SELECT INTERVAL(22, 23, 30, 44, 200);
          -> 0
  ```

- `IS boolean_value`

  Verifica um valor contra um valor booleano, onde *`boolean_value`* pode ser `TRUE`, `FALSE` ou `UNKNOWN`.

  ```sql
  mysql> SELECT 1 IS TRUE, 0 IS FALSE, NULL IS UNKNOWN;
          -> 1, 1, 1
  ```

- `Não é boolean_value`

  Verifica um valor contra um valor booleano, onde *`boolean_value`* pode ser `TRUE`, `FALSE` ou `UNKNOWN`.

  ```sql
  mysql> SELECT 1 IS NOT UNKNOWN, 0 IS NOT UNKNOWN, NULL IS NOT UNKNOWN;
          -> 1, 1, 0
  ```

- `IS NULL`

  Verifica se um valor é `NULL`.

  ```sql
  mysql> SELECT 1 IS NULL, 0 IS NULL, NULL IS NULL;
          -> 0, 0, 1
  ```

  Para funcionar bem com programas ODBC, o MySQL suporta as seguintes funcionalidades extras ao usar `IS NULL`:

  - Se a variável `sql_auto_is_null` estiver definida como 1, após uma instrução que insere com sucesso um valor `AUTO_INCREMENT` gerado automaticamente, você poderá encontrar esse valor executando uma instrução do seguinte formato:

    ```sql
    SELECT * FROM tbl_name WHERE auto_col IS NULL
    ```

    Se a declaração retornar uma linha, o valor retornado será o mesmo se você tivesse invocado a função `LAST_INSERT_ID()`. Para obter detalhes, incluindo o valor de retorno após uma inserção de várias linhas, consulte a Seção 12.15, “Funções de Informação”. Se nenhum valor `AUTO_INCREMENT` foi inserido com sucesso, a declaração `SELECT` não retornará nenhuma linha.

    O comportamento de recuperar um valor `AUTO_INCREMENT` usando uma comparação `IS NULL` pode ser desativado definindo `sql_auto_is_null = 0`. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

    O valor padrão de `sql_auto_is_null` é 0.

  - Para as colunas `DATE` e `DATETIME` declaradas como `NOT NULL`, você pode encontrar a data especial `'0000-00-00'` usando uma declaração como esta:

    ```sql
    SELECT * FROM tbl_name WHERE date_column IS NULL
    ```

    Isso é necessário para que algumas aplicações ODBC funcionem, pois o ODBC não suporta o valor de data `'0000-00-00'`.

    Veja Obter Valores de Autoincremento e a descrição da opção `FLAG_AUTO_IS_NULL` nos Parâmetros de Conexão do Connector/ODBC.

- `NÃO É NULL`

  Verifica se um valor não é `NULL`.

  ```sql
  mysql> SELECT 1 IS NOT NULL, 0 IS NOT NULL, NULL IS NOT NULL;
          -> 1, 1, 0
  ```

- `ISNULL(expr)`

  Se *`expr`* for `NULL`, `ISNULL()` retorna `1`, caso contrário, ele retorna `0`.

  ```sql
  mysql> SELECT ISNULL(1+1);
          -> 0
  mysql> SELECT ISNULL(1/0);
          -> 1
  ```

  `ISNULL()` pode ser usado em vez de `=` para testar se um valor é `NULL`. (Comparar um valor com `NULL` usando `=` sempre resulta em `NULL`.)

  A função `ISNULL()` compartilha alguns comportamentos especiais com o operador de comparação `IS NULL`. Veja a descrição de `IS NULL`.

- `LEAST(valor1, valor2,...)`

  Com dois ou mais argumentos, retorna o menor (com o valor mínimo) argumento. Os argumentos são comparados usando as seguintes regras:

  - Se qualquer argumento for `NULL`, o resultado será `NULL`. Não é necessário realizar nenhuma comparação.

  - Se todos os argumentos forem de valor inteiro, eles serão comparados como inteiros.

  - Se pelo menos um argumento for de ponto duplo, eles são comparados como valores de ponto duplo. Caso contrário, se pelo menos um argumento for um valor de `DECIMAL` - DECIMAL, NUMERIC")", eles são comparados como valores de `DECIMAL` - DECIMAL, NUMERIC")".

  - Se os argumentos contiverem uma mistura de números e strings, eles serão comparados como números.

  - Se qualquer argumento for uma string não binária (caractere), os argumentos são comparados como strings não binárias.

  - Em todos os outros casos, os argumentos são comparados como strings binárias.

  O tipo de retorno de `LEAST()` é o tipo agregado dos tipos dos argumentos de comparação.

  ```sql
  mysql> SELECT LEAST(2,0);
          -> 0
  mysql> SELECT LEAST(34.0,3.0,5.0,767.0);
          -> 3.0
  mysql> SELECT LEAST('B','A','C');
          -> 'A'
  ```
