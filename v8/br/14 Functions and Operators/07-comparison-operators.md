### 14.4.2 Funções e Operadores de Comparação

**Tabela 14.4 Operadores de Comparação**

<table><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>&gt;</code></td> <td> Operador maior que </td> </tr><tr><td><code>&gt;=</code></td> <td> Operador maior ou igual que </td> </tr><tr><td><code>&lt;</code></td> <td> Operador menor que </td> </tr><tr><td><code>&lt;&gt;</code>, <code>!=</code></td> <td> Operador diferente de </td> </tr><tr><td><code>&lt;=</code></td> <td> Operador menor ou igual que </td> </tr><tr><td><code>&lt;=&gt;</code></td> <td> Operador igual a, seguro de NULL </td> </tr><tr><td><code>=</code></td> <td> Operador igual </td> </tr><tr><td><code>BETWEEN ... AND ...</code></td> <td> Verificar se um valor está dentro de uma faixa de valores </td> </tr><tr><td><code>COALESCE()</code></td> <td> Retornar o primeiro argumento que não é NULL </td> </tr><tr><td><code>EXISTS()</code></td> <td> Verificar se o resultado de uma consulta contém alguma linha </td> </tr><tr><td><code>GREATEST()</code></td> <td> Retornar o maior argumento </td> </tr><tr><td><code>IN()</code></td> <td> Verificar se um valor está dentro de um conjunto de valores </td> </tr><tr><td><code>INTERVAL()</code></td> <td> Retornar o índice do argumento que é menor que o primeiro argumento </td> </tr><tr><td><code>IS</code></td> <td> Testar um valor contra um booleano </td> </tr><tr><td><code>IS NOT</code></td> <td> Testar um valor contra um booleano </td> </tr><tr><td><code>IS NOT NULL</code></td> <td> Testar se o argumento é NULL </td> </tr><tr><td><code>IS NULL</code></td> <td> Testar se o argumento é NULL </td> </tr><tr><td><code>ISNULL()</code></td> <td> Testar se o argumento é NULL </td> </tr><tr><td><code>LEAST()</code></td> <td> Retornar o menor argumento </td> </tr><tr><td><code>LIKE</code></td> <td> Busca simples de padrões </td> </tr><tr><td><code>NOT BETWEEN ... AND ...</code></td> <td> Verificar se um valor não está dentro de uma faixa de valores </td> </tr><tr><td><code>NOT EXISTS()</code></td> <td> Verificar se o resultado de uma consulta não contém nenhuma linha </td> </tr><tr><td><code>NOT IN()</code></td> <td> Verificar se um valor não está dentro de um conjunto de valores </td> </tr><tr><td><code>NOT LIKE</code></td> <td> Negação da busca simples de padrões </td> </tr><tr><td><code>STRCMP()</code></td> <td> Comparar duas strings </td> </tr></tbody></table>

As operações de comparação resultam em um valor de `1` (`TRUE`), `0` (`FALSE`) ou `NULL`. Essas operações funcionam tanto com operandos escalares quanto com operandos de linha:

```
=  >  <  >=  <=  <>  !=
```

As descrições desses operadores mais adiante nesta seção detalham como eles funcionam com operandos de linha. Para exemplos adicionais de comparações de linha no contexto de subconsultas de linha, consulte a Seção 15.2.15.5, “Subconsultas de Linha”.

Algumas das funções nesta seção retornam valores diferentes de `1` (`TRUE`), `0` (`FALSE`) ou `NULL`. `LEAST()` e `GREATEST()` são exemplos de tais funções; a Seção 14.3, “Conversão de Tipo na Avaliação da Expressão”, descreve as regras para operações de comparação realizadas por essas e funções semelhantes para determinar seus valores de retorno.

::: info Nota

Em versões anteriores do MySQL, ao avaliar uma expressão contendo `LEAST()` ou `GREATEST()`, o servidor tentava adivinhar o contexto em que a função foi usada e coacertar os argumentos da função para o tipo de dados do conjunto de expressão como um todo. Por exemplo, os argumentos de `LEAST("11", "45", "2")` são avaliados e ordenados como strings, de modo que essa expressão retorne `"11"`.

A função é executada usando os argumentos fornecidos, realizando conversões de tipo para um ou mais dos argumentos se e somente se eles não forem todos do mesmo tipo. Qualquer coerção de tipo exigida por uma expressão que faz uso do valor de retorno agora é realizada após a execução da função. Isso significa que `LEAST("11", "45", "2") + 0` avalia-se a `"11" + 0` e, portanto, a 11 inteiro.


:::

Para converter um valor para um tipo específico para fins de comparação, você pode usar a função  `CAST()`. Valores de string podem ser convertidos para um conjunto de caracteres diferente usando  `CONVERT()`. Veja a Seção 14.10, “Funções e Operadores de Cast”.

Por padrão, as comparações de strings não são case-sensitive e usam o conjunto de caracteres atual. O padrão é `utf8mb4`.

*  `=`

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
*  `<=>`

  Igual `NULL`-seguro. Esse operador realiza uma comparação de igualdade como o operador `=` , mas retorna `1` em vez de `NULL` se ambos os operandos forem `NULL`, e `0` em vez de `NULL` se um dos operandos for `NULL`.

  O operador `<=>` é equivalente ao operador padrão SQL `IS NOT DISTINCT FROM`.

  ```
  mysql> SELECT 1 <=> 1, NULL <=> NULL, 1 <=> NULL;
          -> 1, 1, 0
  mysql> SELECT 1 = 1, NULL = NULL, 1 = NULL;
          -> 1, NULL, NULL
  ```

  Para comparações de linhas, `(a, b) <=> (x, y)` é equivalente a:

  ```
  (a <=> x) AND (b <=> y)
  ```
*  `<>`, `!=`

  Diferente:

  ```
  mysql> SELECT '.01' <> '0.01';
          -> 1
  mysql> SELECT .01 <> '0.01';
          -> 0
  mysql> SELECT 'zapp' <> 'zappp';
          -> 1
  ```

  Para comparações de linhas, `(a, b) <> (x, y)` e `(a, b) != (x, y)` são equivalentes a:

  ```
  (a <> x) OR (b <> y)
  ```
*  `<=`

  Menor ou igual:

  ```
  mysql> SELECT 0.1 <= 2;
          -> 1
  ```

  Para comparações de linhas, `(a, b) <= (x, y)` é equivalente a:

  ```
  (a < x) OR ((a = x) AND (b <= y))
  ```
*  `<`

  Menor:

  ```
  mysql> SELECT 2 < 2;
          -> 0
  ```

  Para comparações de linhas, `(a, b) < (x, y)` é equivalente a:

  ```
  (a < x) OR ((a = x) AND (b < y))
  ```
*  `>=`

  Maior ou igual:

  ```
  mysql> SELECT 2 >= 2;
          -> 1
  ```

  Para comparações de linhas, `(a, b) >= (x, y)` é equivalente a:

  ```
  (a > x) OR ((a = x) AND (b >= y))
  ```
*  `>`

  Maior:

  ```
  mysql> SELECT 2 > 2;
          -> 0
  ```

  Para comparações de linhas, `(a, b) > (x, y)` é equivalente a:

  ```
  (a > x) OR ((a = x) AND (b > y))
  ```
* `expr BETWEEN min AND max`

  Se *`expr`* for maior ou igual a *`min`* e *`expr`* for menor ou igual a *`max`*, `BETWEEN` retorna `1`, caso contrário retorna `0`. Isso é equivalente à expressão `(min <= expr AND expr <= max)` se todos os argumentos forem do mesmo tipo. Caso contrário, ocorre conversão de tipo de acordo com as regras descritas na Seção 14.3, “Conversão de Tipo na Avaliação de Expressões”, mas aplicada a todos os três argumentos.

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

Para obter os melhores resultados ao usar `BETWEEN` com valores de data ou hora, use `CAST()` para converter explicitamente os valores para o tipo de dados desejado. Exemplos: se você comparar uma `DATETIME` com dois valores `DATE`, converta os valores `DATE` em valores `DATETIME`. Se você usar uma constante de string como `'2001-1-1'` em uma comparação com um `DATE`, caste a string em um `DATE`.
* `expr NOT BETWEEN min AND max`

  Isso é o mesmo que `NOT (expr BETWEEN min AND max)`.
*  `COALESCE(value,...)`

  Retorna o primeiro valor não `NULL` na lista, ou `NULL` se não houver valores não `NULL`.

  O tipo de retorno de `COALESCE()` é o tipo agregado dos tipos dos argumentos.

  ```
  mysql> SELECT COALESCE(NULL,1);
          -> 1
  mysql> SELECT COALESCE(NULL,NULL,NULL);
          -> NULL
  ```
*  `EXISTS(query)`

  Se o resultado de uma consulta contém alguma linha.

  ```
  CREATE TABLE t (col VARCHAR(3));
  INSERT INTO t VALUES ('aaa', 'bbb', 'ccc', 'eee');

  SELECT EXISTS (SELECT * FROM t WHERE col LIKE 'c%');
          -> 1

  SELECT EXISTS (SELECT * FROM t WHERE col LIKE 'd%');
          -> 0
  ```
* `NOT EXISTS(query)`

  Se o resultado de uma consulta não contém nenhuma linha:

  ```
  SELECT NOT EXISTS (SELECT * FROM t WHERE col LIKE 'c%');
          -> 0

  SELECT NOT EXISTS (SELECT * FROM t WHERE col LIKE 'd%');
          -> 1
  ```
*  `GREATEST(value1,value2,...)`

  Com dois ou mais argumentos, retorna o argumento maior (com o valor máximo). Os argumentos são comparados seguindo as mesmas regras que para `LEAST()`.

  ```
  mysql> SELECT GREATEST(2,0);
          -> 2
  mysql> SELECT GREATEST(34.0,3.0,5.0,767.0);
          -> 767.0
  mysql> SELECT GREATEST('B','A','C');
          -> 'C'
  ```

   `GREATEST()` retorna `NULL` se algum argumento for `NULL`.
* `expr IN (value,...)`

  Retorna `1` (verdadeiro) se *`expr`* for igual a qualquer um dos valores na lista `IN()`, caso contrário, retorna `0` (falso).

  A conversão de tipo ocorre de acordo com as regras descritas na Seção 14.3, “Conversão de Tipo na Avaliação da Expressão”, aplicada a todos os argumentos. Se nenhuma conversão de tipo for necessária para os valores na lista `IN()`, eles são todos constantes não `JSON` do mesmo tipo, e *`expr`* pode ser comparado a cada um deles como um valor do mesmo tipo (possivelmente após conversão de tipo), uma otimização ocorre. Os valores da lista são ordenados e a busca por *`expr`* é feita usando uma busca binária, o que torna a operação `IN()` muito rápida.

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

Você nunca deve misturar valores com e sem aspas em uma lista `IN()` porque as regras de comparação para valores com aspas (como strings) e valores sem aspas (como números) diferem. Portanto, a mistura de tipos pode levar a resultados inconsistentes. Por exemplo, não escreva uma expressão `IN()` assim:

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

  Em ambos os casos, os valores de comparação são convertidos para valores de ponto flutuante, resultando em 0,0 em cada caso, e um resultado de comparação de 1 (verdadeiro).

  O número de valores na lista `IN()` é limitado apenas pelo valor `max_allowed_packet`.

  Para cumprir com o padrão SQL, `IN()` retorna `NULL` não apenas se a expressão do lado esquerdo for `NULL`, mas também se não for encontrado nenhum correspondente na lista e um dos valores na lista for `NULL`.

  A sintaxe `IN()` também pode ser usada para escrever certos tipos de subconsultas. Veja a Seção 15.2.15.3, “Subconsultas com ANY, IN ou SOME”.
* `expr NOT IN (value,...)`

  Isto é o mesmo que `NOT (expr IN (value,...))`.
*  `INTERVAL(N,N1,N2,N3,...)`

  Retorna `0` se *`N`* ≤ *`N1`*, `1` se *`N`* ≤ *`N2`* e assim por diante, ou `-1` se *`N`* for `NULL`. Todos os argumentos são tratados como inteiros. É necessário que *`N1`* ≤ *`N2`* ≤ *`N3`* ≤ *`...` ≤ *`Nn`* para que esta função funcione corretamente. Isso ocorre porque uma pesquisa binária é usada (muito rápida).

  ```
  mysql> SELECT INTERVAL(23, 1, 15, 17, 30, 44, 200);
          -> 3
  mysql> SELECT INTERVAL(10, 1, 10, 100, 1000);
          -> 2
  mysql> SELECT INTERVAL(22, 23, 30, 44, 200);
          -> 0
  ```
* `IS boolean_value`

  Testa um valor contra um valor booleano, onde *`boolean_value`* pode ser `TRUE`, `FALSE` ou `UNKNOWN`.

  ```
  mysql> SELECT 1 IS TRUE, 0 IS FALSE, NULL IS UNKNOWN;
          -> 1, 1, 1
  ```
* `IS NOT boolean_value`

  Testa um valor contra um valor booleano, onde *`boolean_value`* pode ser `TRUE`, `FALSE` ou `UNKNOWN`.

  ```
  mysql> SELECT 1 IS NOT UNKNOWN, 0 IS NOT UNKNOWN, NULL IS NOT UNKNOWN;
          -> 1, 1, 0
  ```
*  `IS NULL`

  Testa se um valor é `NULL`.

  ```
  mysql> SELECT 1 IS NULL, 0 IS NULL, NULL IS NULL;
          -> 0, 0, 1
  ```

  Para funcionar bem com programas ODBC, o MySQL suporta as seguintes funcionalidades extras ao usar `IS NULL`:

+ Se a variável `sql_auto_is_null` estiver definida como 1, após uma instrução que insere com sucesso um valor `AUTO_INCREMENT` gerado automaticamente, você poderá encontrar esse valor executando uma instrução na seguinte forma:

    ```
    SELECT * FROM tbl_name WHERE auto_col IS NULL
    ```

    Se a instrução retornar uma linha, o valor retornado é o mesmo que se você tivesse invocado a função `LAST_INSERT_ID()`. Para detalhes, incluindo o valor de retorno após uma inserção de múltiplas linhas, consulte a Seção 14.15, “Funções de Informação”. Se nenhum valor `AUTO_INCREMENT` foi inserido com sucesso, a instrução `SELECT` não retorna nenhuma linha.

    O comportamento de recuperar um valor `AUTO_INCREMENT` usando uma comparação `IS NULL` pode ser desativado definindo `sql_auto_is_null = 0`. Consulte a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

    O valor padrão de `sql_auto_is_null` é 0.
  + Para colunas `DATE` e `DATETIME` declaradas como `NOT NULL`, você pode encontrar a data especial `'0000-00-00'` usando uma instrução como esta:

    ```
    SELECT * FROM tbl_name WHERE date_column IS NULL
    ```

    Isso é necessário para que algumas aplicações ODBC funcionem, pois o ODBC não suporta o valor de data `'0000-00-00'`.

    Consulte Obter Valores de Auto-Incremento e a descrição da opção `FLAG_AUTO_IS_NULL` nos Parâmetros de Conexão do Connector/ODBC.
*  `IS NOT NULL`

  Verifica se um valor não é `NULL`.

  ```
  mysql> SELECT 1 IS NOT NULL, 0 IS NOT NULL, NULL IS NOT NULL;
          -> 1, 1, 0
  ```
*  `ISNULL(expr)`

  Se *`expr`* for `NULL`, o `ISNULL()` retorna `1`, caso contrário, retorna `0`.

  ```
  mysql> SELECT ISNULL(1+1);
          -> 0
  mysql> SELECT ISNULL(1/0);
          -> 1
  ```

   O `ISNULL()` pode ser usado em vez de `=` para testar se um valor é `NULL`. (Comparar um valor com `NULL` usando `=` sempre retorna `NULL`.)

   A função `ISNULL()` compartilha alguns comportamentos especiais com o operador de comparação `IS NULL`. Consulte a descrição de `IS NULL`.
*  `LEAST(value1,value2,...)`

  Com dois ou mais argumentos, retorna o argumento menor (com o valor mínimo). Os argumentos são comparados usando as seguintes regras:


+ Se algum argumento for `NULL`, o resultado será `NULL`. Não é necessária nenhuma comparação.
+ Se todos os argumentos forem de valor inteiro, eles serão comparados como inteiros.
+ Se pelo menos um argumento for de precisão dupla, eles serão comparados como valores de precisão dupla. Caso contrário, se pelo menos um argumento for um valor de `DECIMAL` - DECIMAL, NUMERIC") será comparado como valores `DECIMAL` - DECIMAL, NUMERIC") .
+ Se os argumentos forem uma mistura de números e strings, eles serão comparados como strings.
+ Se algum argumento for uma string não binária (caractere), os argumentos serão comparados como strings não binárias.
+ Em todos os outros casos, os argumentos serão comparados como strings binárias.

O tipo de retorno de `LEAST()` é o tipo agregado dos tipos de argumentos de comparação.

```
  mysql> SELECT LEAST(2,0);
          -> 0
  mysql> SELECT LEAST(34.0,3.0,5.0,767.0);
          -> 3.0
  mysql> SELECT LEAST('B','A','C');
          -> 'A'
  ```