## 14.4 Operadores

**Tabela 14.3 Operadores

<table frame="box" rules="all" summary="A reference that lists all operators."><col style="width: 22%"/><col style="width: 55%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> <th>Deprecated</th> </tr></thead><tbody><tr><th scope="row"><code>&amp;</code></th> <td> Bitwise AND </td> <td></td> <td></td> </tr><tr><th scope="row"><code>&gt;</code></th> <td> Greater than operator </td> <td></td> <td></td> </tr><tr><th scope="row"><code>&gt;&gt;</code></th> <td> Right shift </td> <td></td> <td></td> </tr><tr><th scope="row"><code>&gt;=</code></th> <td>Operador maior que ou igual a</td> <td></td> <td></td> </tr><tr><th scope="row"><code>&lt;</code></th> <td> Less than operator </td> <td></td> <td></td> </tr><tr><th scope="row"><code>&lt;&gt;</code>,<code>!=</code></th> <td>Operador não igual</td> <td></td> <td></td> </tr><tr><th scope="row"><code>&lt;&lt;</code></th> <td> Left shift </td> <td></td> <td></td> </tr><tr><th scope="row"><code>&lt;=</code></th> <td>Operador menor ou igual</td> <td></td> <td></td> </tr><tr><th scope="row"><code>&lt;=&gt;</code></th> <td>Igual a operador seguro para NULL</td> <td></td> <td></td> </tr><tr><th scope="row"><code>%</code>,<code>MOD</code></th> <td>Operador de módulo</td> <td></td> <td></td> </tr><tr><th scope="row"><code>*</code></th> <td> Multiplication operator </td> <td></td> <td></td> </tr><tr><th scope="row"><code>+</code></th> <td> Addition operator </td> <td></td> <td></td> </tr><tr><th scope="row"><code>-</code></th> <td> Minus operator </td> <td></td> <td></td> </tr><tr><th scope="row"><code>-</code></th> <td>Troque o sinal do argumento</td> <td></td> <td></td> </tr><tr><th scope="row"><code>-&gt;</code></th> <td> Return value from JSON column after evaluating path; equivalent to JSON_EXTRACT(). </td> <td></td> <td></td> </tr><tr><th scope="row"><code>-&gt;&gt;</code></th> <td> Return value from JSON column after evaluating path and unquoting the result; equivalent to JSON_UNQUOTE(JSON_EXTRACT()). </td> <td></td> <td></td> </tr><tr><th scope="row"><code>/</code></th> <td> Division operator </td> <td></td> <td></td> </tr><tr><th scope="row"><code>:=</code></th> <td> Assign a value </td> <td></td> <td></td> </tr><tr><th scope="row"><code>=</code></th> <td>Atribua um valor (como parte de<code>SET</code>declaração, ou como parte da<code>SET</code>cláusula em<code>UPDATE</code>declaração)</td> <td></td> <td></td> </tr><tr><th scope="row"><code>=</code></th> <td> Equal operator </td> <td></td> <td></td> </tr><tr><th scope="row"><code>^</code></th> <td> Bitwise XOR </td> <td></td> <td></td> </tr><tr><th scope="row"><code>AND</code>,<code>&amp;&amp;</code></th> <td>E lógico e</td> <td></td> <td></td> </tr><tr><th scope="row"><code>BETWEEN ... AND ...</code></th> <td>Se um valor está dentro de uma faixa de valores</td> <td></td> <td></td> </tr><tr><th scope="row"><code>BINARY</code></th> <td>Arremessar uma cadeia para uma cadeia binária</td> <td></td> <td>8.0.27</td> </tr><tr><th scope="row"><code>CASE</code></th> <td> Case operator </td> <td></td> <td></td> </tr><tr><th scope="row"><code>DIV</code></th> <td> Integer division </td> <td></td> <td></td> </tr><tr><th scope="row"><code>EXISTS()</code></th> <td>Se o resultado de uma consulta contém quaisquer linhas</td> <td></td> <td></td> </tr><tr><th scope="row"><code>IN()</code></th> <td>Se um valor está dentro de um conjunto de valores</td> <td></td> <td></td> </tr><tr><th scope="row"><code>IS</code></th> <td>Teste um valor contra um booleano</td> <td></td> <td></td> </tr><tr><th scope="row"><code>IS NOT</code></th> <td>Teste um valor contra um booleano</td> <td></td> <td></td> </tr><tr><th scope="row"><code>IS NOT NULL</code></th> <td>Teste de valor NOT NULL</td> <td></td> <td></td> </tr><tr><th scope="row"><code>IS NULL</code></th> <td>Teste de valor nulo</td> <td></td> <td></td> </tr><tr><th scope="row"><code>LIKE</code></th> <td> Simple pattern matching </td> <td></td> <td></td> </tr><tr><th scope="row"><code>MEMBER OF()</code></th> <td>Retorna verdadeiro (1) se o primeiro operando corresponder a qualquer elemento do array JSON passado como segundo operando, caso contrário, retorna falso (0)</td> <td>8.0.17</td> <td></td> </tr><tr><th scope="row"><code>NOT</code>,<code>!</code></th> <td>Nega o valor</td> <td></td> <td></td> </tr><tr><th scope="row"><code>NOT BETWEEN ... AND ...</code></th> <td>Se um valor não estiver dentro de uma faixa de valores</td> <td></td> <td></td> </tr><tr><th scope="row"><code>NOT EXISTS()</code></th> <td>Se o resultado de uma consulta não contiver nenhuma linha</td> <td></td> <td></td> </tr><tr><th scope="row"><code>NOT IN()</code></th> <td>Se um valor não estiver dentro de um conjunto de valores</td> <td></td> <td></td> </tr><tr><th scope="row"><code>NOT LIKE</code></th> <td>Negação de correspondência de padrão simples</td> <td></td> <td></td> </tr><tr><th scope="row"><code>NOT REGEXP</code></th> <td>Negación de REGEXP</td> <td></td> <td></td> </tr><tr><th scope="row"><code>OR</code>,<code>||</code></th> <td>OU lógico</td> <td></td> <td></td> </tr><tr><th scope="row"><code>REGEXP</code></th> <td>Se a cadeia corresponde à expressão regular</td> <td></td> <td></td> </tr><tr><th scope="row"><code>RLIKE</code></th> <td>Se a cadeia corresponde à expressão regular</td> <td></td> <td></td> </tr><tr><th scope="row"><code>SOUNDS LIKE</code></th> <td> Compare sounds </td> <td></td> <td></td> </tr><tr><th scope="row"><code>XOR</code></th> <td> Logical XOR </td> <td></td> <td></td> </tr><tr><th scope="row"><code>|</code></th> <td> Bitwise OR </td> <td></td> <td></td> </tr><tr><th scope="row"><code>~</code></th> <td> Bitwise inversion </td> <td></td> <td></td> </tr></tbody></table>

### 14.4.1 Prioridade do Operador

As precedências dos operadores são mostradas na lista a seguir, da precedência mais alta para a mais baixa. Os operadores que são mostrados juntos em uma linha têm a mesma precedência.

```
INTERVAL
BINARY, COLLATE
!
- (unary minus), ~ (unary bit inversion)
^
*, /, DIV, %, MOD
-, +
<<, >>
&
|
= (comparison), <=>, >=, >, <=, <, <>, !=, IS, LIKE, REGEXP, IN, MEMBER OF
BETWEEN, CASE, WHEN, THEN, ELSE
NOT
AND, &&
XOR
OR, ||
= (assignment), :=
```

A precedência de `=` depende de ser usado como operador de comparação (`=`) ou como operador de atribuição (`=`). Quando usado como operador de comparação, tem a mesma precedência que `<=>`, `>=`, `>`, `<=`, `<`, `<>`, `!=`, `IS`, `LIKE`, `REGEXP` e `IN()`. Quando usado como operador de atribuição, tem a mesma precedência que `:=`. A Seção 15.7.6.1, “Sintaxe de definição de variáveis”, e a Seção 11.4, “Variáveis definidas pelo usuário”, explicam como o MySQL determina qual interpretação de `=` deve ser aplicada.

Para operadores que ocorrem no mesmo nível de precedência dentro de uma expressão, a avaliação prossegue da esquerda para a direita, com exceção de que as atribuições são avaliadas da direita para a esquerda.

A precedência e o significado de alguns operadores dependem do modo SQL:

* Por padrão, `||` é um operador lógico `OR`. Com `PIPES_AS_CONCAT` habilitado, `||` é concatenação de strings, com uma precedência entre `^` e os operadores unários.

* Por padrão, `!` tem uma precedência maior do que `NOT`. Com `HIGH_NOT_PRECEDENCE` habilitado, `!` e `NOT` têm a mesma precedência.

Veja a Seção 7.1.11, “Modos SQL do servidor”.

A precedência dos operadores determina a ordem de avaliação dos termos em uma expressão. Para sobrescrever essa ordem e agrupar os termos explicitamente, use parênteses. Por exemplo:

```
mysql> SELECT 1+2*3;
        -> 7
mysql> SELECT (1+2)*3;
        -> 9
```

### 14.4.2 Funções e operadores de comparação

**Tabela 14.4 Operadores de comparação**

<table frame="box" rules="all" summary="A reference that lists comparison operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>&gt;</code></td> <td>Operador maior que</td> </tr><tr><td><code>&gt;=</code></td> <td>Operador maior que ou igual a</td> </tr><tr><td><code>&lt;</code></td> <td>Menos que operador</td> </tr><tr><td><code>&lt;&gt;</code>, <code>!=</code></td> <td>Operador não igual</td> </tr><tr><td><code>&lt;=</code></td> <td>Operador menor ou igual</td> </tr><tr><td><code>&lt;=&gt;</code></td> <td>Igual a operador seguro para NULL</td> </tr><tr><td><code>=</code></td> <td>Operador igual</td> </tr><tr><td><code>BETWEEN ... AND ...</code></td> <td>Se um valor está dentro de uma faixa de valores</td> </tr><tr><td><code>COALESCE()</code></td> <td>Retorne o primeiro argumento que não é NULL</td> </tr><tr><td><code>EXISTS()</code></td> <td>Se o resultado de uma consulta contém quaisquer linhas</td> </tr><tr><td><code>GREATEST()</code></td> <td>Retorne o maior argumento</td> </tr><tr><td><code>IN()</code></td> <td>Se um valor está dentro de um conjunto de valores</td> </tr><tr><td><code>INTERVAL()</code></td> <td>Retorne o índice do argumento que é menor que o primeiro argumento</td> </tr><tr><td><code>IS</code></td> <td>Teste um valor contra um booleano</td> </tr><tr><td><code>IS NOT</code></td> <td>Teste um valor contra um booleano</td> </tr><tr><td><code>IS NOT NULL</code></td> <td>Teste de valor NOT NULL</td> </tr><tr><td><code>IS NULL</code></td> <td>Teste de valor nulo</td> </tr><tr><td><code>ISNULL()</code></td> <td>Teste se o argumento é NULL</td> </tr><tr><td><code>LEAST()</code></td> <td>Retorne o menor argumento</td> </tr><tr><td><code>LIKE</code></td> <td>Encontre padrões simples</td> </tr><tr><td><code>NOT BETWEEN ... AND ...</code></td> <td>Se um valor não estiver dentro de uma faixa de valores</td> </tr><tr><td><code>NOT EXISTS()</code></td> <td>Se o resultado de uma consulta não contiver nenhuma linha</td> </tr><tr><td><code>NOT IN()</code></td> <td>Se um valor não estiver dentro de um conjunto de valores</td> </tr><tr><td><code>NOT LIKE</code></td> <td>Negação de correspondência de padrão simples</td> </tr><tr><td><code>STRCMP()</code></td> <td>Compare duas strings</td> </tr></tbody></table>

As operações de comparação resultam em um valor de `1` (`TRUE`), `0` (`FALSE`), ou `NULL`. Essas operações funcionam tanto para números quanto para strings. As strings são automaticamente convertidas em números e os números em strings conforme necessário.

Os seguintes operadores de comparação relacional podem ser usados para comparar não apenas operandos escalares, mas também operandos de linha:

```
=  >  <  >=  <=  <>  !=
```

As descrições para esses operadores mais adiante nesta seção detalham como eles funcionam com operadores de linha. Para exemplos adicionais de comparações de linha no contexto de subconsultas de linha, consulte a Seção 15.2.15.5, “Subconsultas de linha”.

Algumas das funções desta seção retornam valores diferentes de `1` (`TRUE`), `0` (`FALSE`), ou `NULL`. `LEAST()` e `GREATEST()` são exemplos de tais funções; a Seção 14.3, “Conversão de Tipo na Avaliação de Expressões”, descreve as regras para operações de comparação realizadas por essas e funções semelhantes para determinar seus valores de retorno.

Nota

Em versões anteriores do MySQL, ao avaliar uma expressão que continha `LEAST()` ou `GREATEST()`, o servidor tentava adivinhar o contexto em que a função era usada e forçar os argumentos da função para o tipo de dados da expressão como um todo. Por exemplo, os argumentos de `LEAST("11", "45", "2")` são avaliados e ordenados como strings, de modo que essa expressão retorne `"11"`. Em MySQL 8.0.3 e versões anteriores, ao avaliar a expressão `LEAST("11", "45", "2") + 0`, o servidor converteu os argumentos em inteiros (anticipando a adição do número inteiro 0 ao resultado) antes de os ordenar, retornando assim 2.

A partir do MySQL 8.0.4, o servidor não tenta mais inferir o contexto dessa maneira. Em vez disso, a função é executada usando os argumentos fornecidos, realizando conversões de tipo de dados para um ou mais dos argumentos, se e somente se eles não forem todos do mesmo tipo. Qualquer coerção de tipo exigida por uma expressão que faça uso do valor de retorno é agora realizada após a execução da função. Isso significa que, no MySQL 8.0.4 e versões posteriores, `LEAST("11", "45", "2") + 0` é avaliado como `"11" + 0` e, portanto, para o inteiro 11. (Bug #83895, Bug #25123839)

Para converter um valor em um tipo específico para fins de comparação, você pode usar a função `CAST()`. Os valores de string podem ser convertidos para um conjunto de caracteres diferente usando `CONVERT()`. Veja a Seção 14.10, “Funções e Operadores de Conversão”.

Por padrão, as comparações de strings não são sensíveis ao caso e utilizam o conjunto de caracteres atual. O padrão é `utf8mb4`.

* `=`

Igual:

  ```
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

  ```
  (a = x) AND (b = y)
  ```

* `<=>`

igual. Este operador realiza uma comparação de igualdade como o operador `=`, mas retorna `1` em vez de `NULL` se ambos os operandos forem `NULL`, e `0` em vez de `NULL` se um dos operandos for `NULL`.

O operador `<=>` é equivalente ao operador padrão SQL `IS NOT DISTINCT FROM`.

  ```
  mysql> SELECT 1 <=> 1, NULL <=> NULL, 1 <=> NULL;
          -> 1, 1, 0
  mysql> SELECT 1 = 1, NULL = NULL, 1 = NULL;
          -> 1, NULL, NULL
  ```

Para comparações de linha, `(a, b) <=> (x, y)` é equivalente a:

  ```
  (a <=> x) AND (b <=> y)
  ```

* `<>`, `!=`

Não igual:

  ```
  mysql> SELECT '.01' <> '0.01';
          -> 1
  mysql> SELECT .01 <> '0.01';
          -> 0
  mysql> SELECT 'zapp' <> 'zappp';
          -> 1
  ```

Para comparações de linha, `(a, b) <> (x, y)` e `(a, b) != (x, y)` são equivalentes a:

  ```
  (a <> x) OR (b <> y)
  ```

* `<=`

Menos ou igual a:

  ```
  mysql> SELECT 0.1 <= 2;
          -> 1
  ```

Para comparações de linha, `(a, b) <= (x, y)` é equivalente a:

  ```
  (a < x) OR ((a = x) AND (b <= y))
  ```

* `<`

Menos de:

  ```
  mysql> SELECT 2 < 2;
          -> 0
  ```

Para comparações de linha, `(a, b) < (x, y)` é equivalente a:

  ```
  (a < x) OR ((a = x) AND (b < y))
  ```

* `>=`

Maior que ou igual a:

  ```
  mysql> SELECT 2 >= 2;
          -> 1
  ```

Para comparações de linha, `(a, b) >= (x, y)` é equivalente a:

  ```
  (a > x) OR ((a = x) AND (b >= y))
  ```

* `>`

Superior a:

  ```
  mysql> SELECT 2 > 2;
          -> 0
  ```

Para comparações de linha, `(a, b) > (x, y)` é equivalente a:

  ```
  (a > x) OR ((a = x) AND (b > y))
  ```

* `expr BETWEEN min AND max`(comparison-operators.html#operator_between)

Se *`expr`* for igual ou maior que *`min`* e *`expr`* for menor ou igual a *`max`*, `BETWEEN` retorna `1`, caso contrário, retorna `0`. Isso é equivalente à expressão `(min <= expr AND expr <= max)` se todos os argumentos forem do mesmo tipo. Caso contrário, a conversão de tipo ocorre de acordo com as regras descritas na Seção 14.3, “Conversão de Tipo na Avaliação da Expressão”, mas aplicada a todos os três argumentos.

  ```
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

Para obter os melhores resultados ao usar `BETWEEN` com valores de data ou hora, use `CAST()` para converter explicitamente os valores para o tipo de dados desejado. Exemplos: Se você comparar um `DATETIME` com dois valores de `DATE`, converta os valores de `DATE` para valores de `DATETIME`. Se você usar uma constante de string, como `'2001-1-1'` em uma comparação com um `DATE`, codifique a string para um `DATE`.

* `expr NOT BETWEEN min AND max`(comparison-operators.html#operator_not-between)

Isto é o mesmo que `NOT (expr BETWEEN min AND max)`.

* `COALESCE(value,...)`

Retorna o primeiro valor não `NULL` na lista, ou `NULL`, se não houver valores não `NULL`.

O tipo de retorno de `COALESCE()` é o tipo agregado dos tipos de argumento.

  ```
  mysql> SELECT COALESCE(NULL,1);
          -> 1
  mysql> SELECT COALESCE(NULL,NULL,NULL);
          -> NULL
  ```

* `EXISTS(query)`

Se o resultado de uma consulta contém alguma linha.

  ```
  CREATE TABLE t (col VARCHAR(3));
  INSERT INTO t VALUES ('aaa', 'bbb', 'ccc', 'eee');

  SELECT EXISTS (SELECT * FROM t WHERE col LIKE 'c%');
          -> 1

  SELECT EXISTS (SELECT * FROM t WHERE col LIKE 'd%');
          -> 0
  ```

* `NOT EXISTS(query)`(comparison-operators.html#operator_not-exists)

Se o resultado de uma consulta não contiver nenhuma linha:

  ```
  SELECT NOT EXISTS (SELECT * FROM t WHERE col LIKE 'c%');
          -> 0

  SELECT NOT EXISTS (SELECT * FROM t WHERE col LIKE 'd%');
          -> 1
  ```

* `GREATEST(value1,value2,...)`

Com dois ou mais argumentos, retorna o maior argumento (com o valor máximo). Os argumentos são comparados usando as mesmas regras que para `LEAST()`.

  ```
  mysql> SELECT GREATEST(2,0);
          -> 2
  mysql> SELECT GREATEST(34.0,3.0,5.0,767.0);
          -> 767.0
  mysql> SELECT GREATEST('B','A','C');
          -> 'C'
  ```

`GREATEST()` retorna `NULL` se houver algum argumento em `NULL`.

* `expr IN (value,...)`(comparison-operators.html#operator_in)

Retorna `1` (verdadeiro) se *`expr`* for igual a qualquer um dos valores na lista de `IN()`, caso contrário, retorna `0` (falso).

A conversão de tipo ocorre de acordo com as regras descritas na Seção 14.3, “Conversão de Tipo na Avaliação da Expressão”, aplicada a todos os argumentos. Se não for necessária nenhuma conversão de tipo para os valores na lista `IN()`, todos eles são constantes não `JSON` do mesmo tipo, e *`expr`* pode ser comparado a cada um deles como um valor do mesmo tipo (possivelmente após conversão de tipo), uma otimização ocorre. Os valores da lista são ordenados e a busca por *`expr`* é feita usando uma busca binária, o que torna a operação `IN()` muito rápida.

  ```
  mysql> SELECT 2 IN (0,3,5,7);
          -> 0
  mysql> SELECT 'wefwf' IN ('wee','wefwf','weg');
          -> 1
  ```

`IN()` pode ser usado para comparar construtores de linha:

  ```
  mysql> SELECT (3,4) IN ((1,2), (3,4));
          -> 1
  mysql> SELECT (3,4) IN ((1,2), (3,5));
          -> 0
  ```

Você nunca deve misturar valores citados e não citados em uma lista `IN()`, porque as regras de comparação para valores citados (como strings) e valores não citados (como números) diferem. Portanto, a mistura de tipos pode levar a resultados inconsistentes. Por exemplo, não escreva uma expressão `IN()` assim:

  ```
  SELECT val1 FROM tbl1 WHERE val1 IN (1,2,'a');
  ```

Em vez disso, escreva assim:

  ```
  SELECT val1 FROM tbl1 WHERE val1 IN ('1','2','a');
  ```

A conversão implícita de tipo pode produzir resultados não intuitivos:

  ```
  mysql> SELECT 'a' IN (0), 0 IN ('b');
          -> 1, 1
  ```

Em ambos os casos, os valores de comparação são convertidos em valores de ponto flutuante, resultando em 0,0 em cada caso, e um resultado de comparação de 1 (verdadeiro).

O número de valores na lista `IN()` é limitado apenas pelo valor `max_allowed_packet`.

Para cumprir com o padrão SQL, `IN()` retorna `NULL` não apenas se a expressão do lado esquerdo for `NULL`, mas também se não for encontrada nenhuma correspondência na lista e uma das expressões na lista for `NULL`.

A sintaxe do `IN()` também pode ser usada para escrever certos tipos de subconsultas. Veja a Seção 15.2.15.3, “Subconsultas com ANY, IN ou SOME”.

* `expr NOT IN (value,...)`(comparison-operators.html#operator_not-in)

Isto é o mesmo que `NOT (expr IN (value,...))`.

* `INTERVAL(N,N1,N2,N3,...)`

Retorna `0` se *`N`* ≤ *`N1`*, `1` se *`N`* ≤ *`N2`* e assim por diante, ou `-1` se *`N`* é `NULL`. Todos os argumentos são tratados como inteiros. É necessário que *`N1`* ≤ *`N2`* ≤ *`N3`* ≤ `...` ≤ *`Nn`* para que esta função funcione corretamente. Isso ocorre porque uma busca binária é usada (muito rápida).

  ```
  mysql> SELECT INTERVAL(23, 1, 15, 17, 30, 44, 200);
          -> 3
  mysql> SELECT INTERVAL(10, 1, 10, 100, 1000);
          -> 2
  mysql> SELECT INTERVAL(22, 23, 30, 44, 200);
          -> 0
  ```

* `IS boolean_value`(comparison-operators.html#operator_is)

Testa um valor contra um valor booleano, onde *`boolean_value`* pode ser `TRUE`, `FALSE` ou `UNKNOWN`.

  ```
  mysql> SELECT 1 IS TRUE, 0 IS FALSE, NULL IS UNKNOWN;
          -> 1, 1, 1
  ```

* `IS NOT boolean_value`(comparison-operators.html#operator_is-not)

Testa um valor contra um valor booleano, onde *`boolean_value`* pode ser `TRUE`, `FALSE` ou `UNKNOWN`.

  ```
  mysql> SELECT 1 IS NOT UNKNOWN, 0 IS NOT UNKNOWN, NULL IS NOT UNKNOWN;
          -> 1, 1, 0
  ```

* `IS NULL`

Verifica se um valor é `NULL`.

  ```
  mysql> SELECT 1 IS NULL, 0 IS NULL, NULL IS NULL;
          -> 0, 0, 1
  ```

Para funcionar bem com programas ODBC, o MySQL suporta as seguintes funcionalidades adicionais ao usar `IS NULL`(comparison-operators.html#operator_is-null):

+ Se a variável `sql_auto_is_null` estiver definida como 1, após uma declaração que insere com sucesso um valor gerado automaticamente `AUTO_INCREMENT`, você pode encontrar esse valor emitindo uma declaração do seguinte formato:

    ```
    SELECT * FROM tbl_name WHERE auto_col IS NULL
    ```

Se a declaração retornar uma linha, o valor retornado é o mesmo se você tivesse invocado a função `LAST_INSERT_ID()`. Para detalhes, incluindo o valor de retorno após uma inserção de várias linhas, consulte a Seção 14.15, “Funções de Informação”. Se nenhum valor de `AUTO_INCREMENT` foi inserido com sucesso, a declaração `SELECT` não retorna nenhuma linha.

O comportamento de recuperar um valor de `AUTO_INCREMENT` usando uma comparação de `IS NULL` pode ser desativado definindo `sql_auto_is_null = 0`. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

O valor padrão de `sql_auto_is_null` é 0.

+ Para as colunas `DATE` e `DATETIME` que são declaradas como `NOT NULL`, você pode encontrar a data especial `'0000-00-00'` usando uma declaração como esta:

    ```
    SELECT * FROM tbl_name WHERE date_column IS NULL
    ```

Isso é necessário para que algumas aplicações ODBC funcionem, pois o ODBC não suporta um valor de data `'0000-00-00'`.

Veja Obter valores de autoincremento e a descrição para a opção `FLAG_AUTO_IS_NULL` nos Parâmetros de conexão do Connector/ODBC.

* `IS NOT NULL`

Verifica se um valor não é `NULL`.

  ```
  mysql> SELECT 1 IS NOT NULL, 0 IS NOT NULL, NULL IS NOT NULL;
          -> 1, 1, 0
  ```

* `ISNULL(expr)`

Se *`expr`* é `NULL`, `ISNULL()` retorna `1`, caso contrário, ele retorna `0`.

  ```
  mysql> SELECT ISNULL(1+1);
          -> 0
  mysql> SELECT ISNULL(1/0);
          -> 1
  ```

`ISNULL()` pode ser usado em vez de `=` para testar se um valor é `NULL`. (Comparar um valor com `NULL` usando `=` sempre resulta em `NULL`.

A função `ISNULL()` compartilha alguns comportamentos especiais com o operador de comparação `IS NULL`. Veja a descrição de `IS NULL`.

* `LEAST(value1,value2,...)`

Com dois ou mais argumentos, retorna o menor (com o valor mínimo) argumento. Os argumentos são comparados usando as seguintes regras:

+ Se qualquer argumento for `NULL`, o resultado é `NULL`. Não é necessária nenhuma comparação.

+ Se todos os argumentos forem de valor inteiro, eles serão comparados como inteiros.

+ Se pelo menos um argumento for de dupla precisão, eles são comparados como valores de dupla precisão. Caso contrário, se pelo menos um argumento for um valor de `DECIMAL` - DECIMAL, NUMERIC"), eles são comparados como valores de `DECIMAL` - DECIMAL, NUMERIC").

+ Se os argumentos forem uma mistura de números e strings, eles serão comparados como strings.

+ Se qualquer argumento for uma string não binária (caractere), os argumentos são comparados como strings não binárias.

+ Em todos os outros casos, os argumentos são comparados como strings binárias.

O tipo de retorno de `LEAST()` é o tipo agregado dos tipos dos argumentos de comparação.

  ```
  mysql> SELECT LEAST(2,0);
          -> 0
  mysql> SELECT LEAST(34.0,3.0,5.0,767.0);
          -> 3.0
  mysql> SELECT LEAST('B','A','C');
          -> 'A'
  ```

### 14.4.3 Operadores lógicos

**Tabela 14.5 Operadores lógicos**

<table frame="box" rules="all" summary="A reference that lists logical operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>AND</code>, <code>&amp;&amp;</code></td> <td> Logical AND </td> </tr><tr><td><code>NOT</code>, <code>!</code></td> <td> Negates value </td> </tr><tr><td><code>OR</code>, <code>||</code></td> <td> Logical OR </td> </tr><tr><td><code>XOR</code></td> <td> Logical XOR </td> </tr></tbody></table>

Em SQL, todos os operadores lógicos são avaliados como `TRUE`, `FALSE` ou `NULL` (`UNKNOWN`). Em MySQL, esses são implementados como 1 (`TRUE`), 0 (`FALSE`), e `NULL`. A maior parte disso é comum a diferentes servidores de banco de dados SQL, embora alguns servidores possam retornar qualquer valor não nulo para `TRUE`.

O MySQL avalia qualquer valor não nulo, não `NULL`, para `TRUE`. Por exemplo, as seguintes declarações todas são avaliadas como `TRUE`:

```
mysql> SELECT 10 IS TRUE;
-> 1
mysql> SELECT -10 IS TRUE;
-> 1
mysql> SELECT 'string' IS NOT NULL;
-> 1
```

* `NOT`, `!`

NOT lógico. Avalia `1` se o operando for `0`, a `0` se o operando for não nulo, e retorna `NOT NULL` `NULL`.

  ```
  mysql> SELECT NOT 10;
          -> 0
  mysql> SELECT NOT 0;
          -> 1
  mysql> SELECT NOT NULL;
          -> NULL
  mysql> SELECT ! (1+1);
          -> 0
  mysql> SELECT ! 1+1;
          -> 1
  ```

O último exemplo produz `1` porque a expressão avalia da mesma maneira que `(!1)+1`.

O operador `!`, operador não padrão do MySQL. A partir do MySQL 8.0.17, este operador é desaconselhado; espera-se que ele seja removido em uma versão futura do MySQL. As aplicações devem ser ajustadas para usar o operador padrão SQL `NOT`.

* `AND`, `&&`

E lógico. Avalia para `1` se todos os operandos forem não nulos e não `NULL`, para `0` se um ou mais operandos forem `0`, caso contrário, `NULL` é retornado.

  ```
  mysql> SELECT 1 AND 1;
          -> 1
  mysql> SELECT 1 AND 0;
          -> 0
  mysql> SELECT 1 AND NULL;
          -> NULL
  mysql> SELECT 0 AND NULL;
          -> 0
  mysql> SELECT NULL AND 0;
          -> 0
  ```

O operador `&&`, operador não padrão do MySQL. A partir do MySQL 8.0.17, este operador é desaconselhado; espera-se que o suporte para ele seja removido em uma versão futura do MySQL. As aplicações devem ser ajustadas para usar o operador padrão SQL `AND`.

* `OR`, `||`

OU lógico. Quando ambos os operandos são não `NULL`, o resultado é `1` se algum dos operandos for não nulo, e `0` caso contrário. Com um operando `NULL`, o resultado é `1` se o outro operando for não nulo, e `NULL` caso contrário. Se ambos os operandos são `NULL`, o resultado é `NULL`.

  ```
  mysql> SELECT 1 OR 1;
          -> 1
  mysql> SELECT 1 OR 0;
          -> 1
  mysql> SELECT 0 OR 0;
          -> 0
  mysql> SELECT 0 OR NULL;
          -> NULL
  mysql> SELECT 1 OR NULL;
          -> 1
  ```

Nota

Se o modo SQL `PIPES_AS_CONCAT` estiver habilitado, `||` indica o operador de concatenação de strings padrão SQL (como `CONCAT()`).

O operador `||`, operador não padrão, é uma extensão não padrão do MySQL. A partir do MySQL 8.0.17, este operador é descontinuado; espera-se que o suporte a ele seja removido em uma versão futura do MySQL. As aplicações devem ser ajustadas para usar o operador SQL padrão `OR`. Exceção: A depreciação não se aplica se `PIPES_AS_CONCAT` estiver habilitado, porque, nesse caso, `||` significa concatenação de strings.

* `XOR`

XOR lógico. Retorna `NULL` se qualquer dos operandos for `NULL`. Para operandos que não são `NULL`, avalia-se como `1` se houver um número ímpar de operandos não nulos, caso contrário, é retornado `0`.

  ```
  mysql> SELECT 1 XOR 1;
          -> 0
  mysql> SELECT 1 XOR 0;
          -> 1
  mysql> SELECT 1 XOR NULL;
          -> NULL
  mysql> SELECT 1 XOR 1 XOR 1;
          -> 1
  ```

`a XOR b` é matematicamente igual a `(a AND (NOT b)) OR ((NOT a) and b)`.

### 14.4.4 Operadores de Atribuição

**Tabela 14.6 Operadores de Atribuição**

<table frame="box" rules="all" summary="A reference that lists assignment operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>:=</code></td> <td>Atribua um valor</td> </tr><tr><td><code>=</code></td> <td>Atribua um valor (como parte de<code>SET</code>declaração, ou como parte da<code>SET</code>cláusula em<code>UPDATE</code>declaração)</td> </tr></tbody></table>

* `:=`

Operador de atribuição. Faz com que a variável do usuário do lado esquerdo do operador assuma o valor do lado direito. O valor do lado direito pode ser um valor literal, outra variável que armazena um valor ou qualquer expressão legal que produza um valor escalar, incluindo o resultado de uma consulta (desde que esse valor seja um valor escalar). Você pode realizar múltiplas atribuições na mesma declaração `SET`. Você pode realizar múltiplas atribuições na mesma declaração.

Ao contrário de `=`, o operador `:=` nunca é interpretado como um operador de comparação. Isso significa que você pode usar `:=` em qualquer declaração válida de SQL (não apenas em declarações de `SET`) para atribuir um valor a uma variável.

  ```
  mysql> SELECT @var1, @var2;
          -> NULL, NULL
  mysql> SELECT @var1 := 1, @var2;
          -> 1, NULL
  mysql> SELECT @var1, @var2;
          -> 1, NULL
  mysql> SELECT @var1, @var2 := @var1;
          -> 1, 1
  mysql> SELECT @var1, @var2;
          -> 1, 1

  mysql> SELECT @var1:=COUNT(*) FROM t1;
          -> 4
  mysql> SELECT @var1;
          -> 4
  ```

Você pode fazer atribuições de valor usando `:=` em outras declarações além de `SELECT`, como `UPDATE`, conforme mostrado aqui:

  ```
  mysql> SELECT @var1;
          -> 4
  mysql> SELECT * FROM t1;
          -> 1, 3, 5, 7

  mysql> UPDATE t1 SET c1 = 2 WHERE c1 = @var1:= 1;
  Query OK, 1 row affected (0.00 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT @var1;
          -> 1
  mysql> SELECT * FROM t1;
          -> 2, 3, 5, 7
  ```

Embora seja também possível definir e ler o valor da mesma variável em uma única declaração SQL usando o operador `:=`, isso não é recomendado. A Seção 11.4, “Variáveis Definidas pelo Usuário”, explica por que você deve evitar fazer isso.

* `=`

Este operador é usado para realizar atribuições de valor em dois casos, descritos nos dois parágrafos seguintes.

Dentro de uma declaração `SET`, `=` é tratado como um operador de atribuição que faz com que a variável do usuário à esquerda do operador adquira o valor à direita. (Em outras palavras, quando usado em uma declaração `SET`, `=` é tratado de forma idêntica a `:=`.). O valor do lado direito pode ser um valor literal, outra variável que armazena um valor, ou qualquer expressão legal que produza um valor escalar, incluindo o resultado de uma consulta (desde que esse valor seja um valor escalar). Você pode realizar múltiplas atribuições na mesma declaração `SET`.

Na cláusula `SET` de uma declaração `UPDATE`, `=` também atua como operador de atribuição; nesse caso, no entanto, ele faz com que a coluna nomeada do lado esquerdo do operador assuma o valor dado do lado direito, desde que quaisquer condições `WHERE` que fazem parte do `UPDATE` sejam atendidas. Você pode fazer múltiplas atribuições na mesma cláusula `SET` de uma declaração `UPDATE`.

Em qualquer outro contexto, `=` é tratado como um operador de comparação.

  ```
  mysql> SELECT @var1, @var2;
          -> NULL, NULL
  mysql> SELECT @var1 := 1, @var2;
          -> 1, NULL
  mysql> SELECT @var1, @var2;
          -> 1, NULL
  mysql> SELECT @var1, @var2 := @var1;
          -> 1, 1
  mysql> SELECT @var1, @var2;
          -> 1, 1
  ```

Para mais informações, consulte a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”, a Seção 15.2.17, “Instrução UPDATE”, e a Seção 15.2.15, “Subconsultas”.