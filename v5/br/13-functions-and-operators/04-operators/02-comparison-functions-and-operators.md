### 12.4.2 Funções e Operadores de Comparação

**Tabela 12.4 Operadores de Comparação**

<table frame="box" rules="all" summary="A reference that lists comparison operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>&gt;</code></td> <td> Operador "Maior que" </td> </tr><tr><td><code>&gt;=</code></td> <td> Operador "Maior ou igual a" </td> </tr><tr><td><code>&lt;</code></td> <td> Operador "Menor que" </td> </tr><tr><td><code>&lt;&gt;</code>, <code>!=</code></td> <td> Operador "Diferente de" </td> </tr><tr><td><code>&lt;=</code></td> <td> Operador "Menor ou igual a" </td> </tr><tr><td><code>&lt;=&gt;</code></td> <td> Operador de igualdade seguro para NULL </td> </tr><tr><td><code>=</code></td> <td> Operador "Igual a" </td> </tr><tr><td><code>BETWEEN ... AND ...</code></td> <td> Se um valor está dentro de um intervalo de valores </td> </tr><tr><td><code>COALESCE()</code></td> <td> Retorna o primeiro argumento não-NULL </td> </tr><tr><td><code>EXISTS()</code></td> <td> Se o resultado de uma Query contém alguma linha (row) </td> </tr><tr><td><code>GREATEST()</code></td> <td> Retorna o maior argumento </td> </tr><tr><td><code>IN()</code></td> <td> Se um valor está dentro de um conjunto de valores </td> </tr><tr><td><code>INTERVAL()</code></td> <td> Retorna o Index do argumento que é menor que o primeiro argumento </td> </tr><tr><td><code>IS</code></td> <td> Testa um valor contra um booleano </td> </tr><tr><td><code>IS NOT</code></td> <td> Testa um valor contra um booleano </td> </tr><tr><td><code>IS NOT NULL</code></td> <td> Teste de valor NOT NULL </td> </tr><tr><td><code>IS NULL</code></td> <td> Teste de valor NULL </td> </tr><tr><td><code>ISNULL()</code></td> <td> Testa se o argumento é NULL </td> </tr><tr><td><code>LEAST()</code></td> <td> Retorna o menor argumento </td> </tr><tr><td><code>LIKE</code></td> <td> Correspondência de padrão simples </td> </tr><tr><td><code>NOT BETWEEN ... AND ...</code></td> <td> Se um valor não está dentro de um intervalo de valores </td> </tr><tr><td><code>NOT EXISTS()</code></td> <td> Se o resultado de uma Query não contém linhas (rows) </td> </tr><tr><td><code>NOT IN()</code></td> <td> Se um valor não está dentro de um conjunto de valores </td> </tr><tr><td><code>NOT LIKE</code></td> <td> Negação da correspondência de padrão simples </td> </tr><tr><td><code>STRCMP()</code></td> <td> Compara duas strings </td> </tr> </tbody></table>

Operações de comparação resultam em um valor de `1` (`TRUE`), `0` (`FALSE`), ou `NULL`. Essas operações funcionam tanto para números quanto para strings. Strings são automaticamente convertidas para números e números para strings conforme necessário.

Os seguintes operadores de comparação relacional podem ser usados para comparar não apenas operandos escalares, mas também operandos de linha (row operands):

```sql
=  >  <  >=  <=  <>  !=
```

As descrições desses operadores mais adiante nesta seção detalham como eles funcionam com operandos de linha. Para exemplos adicionais de comparações de linha no contexto de subqueries de linha, veja a Seção 13.2.10.5, “Subqueries de Linha”.

Algumas das funções nesta seção retornam valores diferentes de `1` (`TRUE`), `0` (`FALSE`), ou `NULL`. `LEAST()` e `GREATEST()` são exemplos dessas funções; a Seção 12.3, “Conversão de Tipo na Avaliação de Expressão”, descreve as regras para operações de comparação realizadas por estas e funções semelhantes para determinar seus valores de retorno.

Para converter um valor para um tipo específico para fins de comparação, você pode usar a função `CAST()`. Valores de string podem ser convertidos para um conjunto de caracteres diferente usando `CONVERT()`. Veja a Seção 12.10, “Funções e Operadores de Cast”.

Por padrão, as comparações de string não diferenciam maiúsculas de minúsculas (case-sensitive) e usam o conjunto de caracteres atual. O padrão é `latin1` (cp1252 West European), que também funciona bem para o inglês.

* `=`

  Igual a:

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

  Para comparações de linha (row comparisons), `(a, b) = (x, y)` é equivalente a:

  ```sql
  (a = x) AND (b = y)
  ```

* `<=>`

  Igualdade segura para `NULL`. Este operador executa uma comparação de igualdade como o operador `=`, mas retorna `1` em vez de `NULL` se ambos os operandos forem `NULL`, e `0` em vez de `NULL` se um operando for `NULL`.

  O operador `<=>` é equivalente ao operador padrão SQL `IS NOT DISTINCT FROM`.

  ```sql
  mysql> SELECT 1 <=> 1, NULL <=> NULL, 1 <=> NULL;
          -> 1, 1, 0
  mysql> SELECT 1 = 1, NULL = NULL, 1 = NULL;
          -> 1, NULL, NULL
  ```

  Para comparações de linha (row comparisons), `(a, b) <=> (x, y)` é equivalente a:

  ```sql
  (a <=> x) AND (b <=> y)
  ```

* `<>`, `!=`

  Diferente de:

  ```sql
  mysql> SELECT '.01' <> '0.01';
          -> 1
  mysql> SELECT .01 <> '0.01';
          -> 0
  mysql> SELECT 'zapp' <> 'zappp';
          -> 1
  ```

  Para comparações de linha (row comparisons), `(a, b) <> (x, y)` e `(a, b) != (x, y)` são equivalentes a:

  ```sql
  (a <> x) OR (b <> y)
  ```

* `<=`

  Menor ou igual a:

  ```sql
  mysql> SELECT 0.1 <= 2;
          -> 1
  ```

  Para comparações de linha (row comparisons), `(a, b) <= (x, y)` é equivalente a:

  ```sql
  (a < x) OR ((a = x) AND (b <= y))
  ```

* `<`

  Menor que:

  ```sql
  mysql> SELECT 2 < 2;
          -> 0
  ```

  Para comparações de linha (row comparisons), `(a, b) < (x, y)` é equivalente a:

  ```sql
  (a < x) OR ((a = x) AND (b < y))
  ```

* `>=`

  Maior ou igual a:

  ```sql
  mysql> SELECT 2 >= 2;
          -> 1
  ```

  Para comparações de linha (row comparisons), `(a, b) >= (x, y)` é equivalente a:

  ```sql
  (a > x) OR ((a = x) AND (b >= y))
  ```

* `>`

  Maior que:

  ```sql
  mysql> SELECT 2 > 2;
          -> 0
  ```

  Para comparações de linha (row comparisons), `(a, b) > (x, y)` é equivalente a:

  ```sql
  (a > x) OR ((a = x) AND (b > y))
  ```

* `expr BETWEEN min AND max`

  Se *`expr`* for maior ou igual a *`min`* e *`expr`* for menor ou igual a *`max`*, `BETWEEN` retorna `1`; caso contrário, retorna `0`. Isso é equivalente à expressão `(min <= expr AND expr <= max)` se todos os argumentos forem do mesmo tipo. Caso contrário, a conversão de tipo ocorre de acordo com as regras descritas na Seção 12.3, “Conversão de Tipo na Avaliação de Expressão”, mas aplicadas a todos os três argumentos.

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

  Para obter melhores resultados ao usar `BETWEEN` com valores de data ou hora, use `CAST()` para converter explicitamente os valores para o tipo de dado desejado. Exemplos: Se você comparar um `DATETIME` com dois valores `DATE`, converta os valores `DATE` para valores `DATETIME`. Se você usar uma string constante como `'2001-1-1'` em uma comparação com um `DATE`, faça o *cast* da string para um `DATE`.

* `expr NOT BETWEEN min AND max`

  Isso é o mesmo que `NOT (expr BETWEEN min AND max)`.

* `COALESCE(value,...)`

  Retorna o primeiro valor não-`NULL` na lista, ou `NULL` se não houver valores não-`NULL`.

  O tipo de retorno de `COALESCE()` é o tipo agregado dos tipos dos argumentos.

  ```sql
  mysql> SELECT COALESCE(NULL,1);
          -> 1
  mysql> SELECT COALESCE(NULL,NULL,NULL);
          -> NULL
  ```

* `EXISTS(query)`

  Se o resultado de uma Query contém alguma linha (row).

  ```sql
  CREATE TABLE t (col VARCHAR(3));
  INSERT INTO t VALUES ('aaa', 'bbb', 'ccc', 'eee');

  SELECT EXISTS (SELECT * FROM t WHERE col LIKE 'c%');
          -> 1

  SELECT EXISTS (SELECT * FROM t WHERE col LIKE 'd%');
          -> 0
  ```

* `NOT EXISTS(query)`

  Se o resultado de uma Query não contém linhas (rows):

  ```sql
  SELECT NOT EXISTS (SELECT * FROM t WHERE col LIKE 'c%');
          -> 0

  SELECT NOT EXISTS (SELECT * FROM t WHERE col LIKE 'd%');
          -> 1
  ```

* `GREATEST(value1,value2,...)`

  Com dois ou mais argumentos, retorna o maior argumento (de valor máximo). Os argumentos são comparados usando as mesmas regras que para `LEAST()`.

  ```sql
  mysql> SELECT GREATEST(2,0);
          -> 2
  mysql> SELECT GREATEST(34.0,3.0,5.0,767.0);
          -> 767.0
  mysql> SELECT GREATEST('B','A','C');
          -> 'C'
  ```

  `GREATEST()` retorna `NULL` se qualquer argumento for `NULL`.

* `expr IN (value,...)`

  Retorna `1` (true) se *`expr`* for igual a qualquer um dos valores na lista `IN()`, caso contrário retorna `0` (false).

  A conversão de tipo ocorre de acordo com as regras descritas na Seção 12.3, “Conversão de Tipo na Avaliação de Expressão”, aplicadas a todos os argumentos. Se nenhuma conversão de tipo for necessária para os valores na lista `IN()`, se todos forem constantes do mesmo tipo, e *`expr`* puder ser comparado a cada um deles como um valor do mesmo tipo (possivelmente após conversão de tipo), uma otimização é realizada. Os valores na lista são ordenados e a busca por *`expr`* é feita usando uma busca binária (binary search), o que torna a operação `IN()` muito rápida.

  ```sql
  mysql> SELECT 2 IN (0,3,5,7);
          -> 0
  mysql> SELECT 'wefwf' IN ('wee','wefwf','weg');
          -> 1
  ```

  `IN()` pode ser usado para comparar construtores de linha (row constructors):

  ```sql
  mysql> SELECT (3,4) IN ((1,2), (3,4));
          -> 1
  mysql> SELECT (3,4) IN ((1,2), (3,5));
          -> 0
  ```

  Você nunca deve misturar valores entre aspas e sem aspas em uma lista `IN()` porque as regras de comparação para valores entre aspas (como strings) e valores sem aspas (como números) diferem. A mistura de tipos pode, portanto, levar a resultados inconsistentes. Por exemplo, não escreva uma expressão `IN()` como esta:

  ```sql
  SELECT val1 FROM tbl1 WHERE val1 IN (1,2,'a');
  ```

  Em vez disso, escreva-a assim:

  ```sql
  SELECT val1 FROM tbl1 WHERE val1 IN ('1','2','a');
  ```

  A conversão implícita de tipos pode produzir resultados não intuitivos:

  ```sql
  mysql> SELECT 'a' IN (0), 0 IN ('b');
          -> 1, 1
  ```

  Em ambos os casos, os valores de comparação são convertidos para valores de ponto flutuante, resultando em 0.0 em cada caso, e um resultado de comparação de 1 (true).

  O número de valores na lista `IN()` é limitado apenas pelo valor `max_allowed_packet`.

  Para cumprir o padrão SQL, `IN()` retorna `NULL` não apenas se a expressão do lado esquerdo for `NULL`, mas também se nenhuma correspondência for encontrada na lista e uma das expressões na lista for `NULL`.

  A sintaxe `IN()` também pode ser usada para escrever certos tipos de subqueries. Veja a Seção 13.2.10.3, “Subqueries com ANY, IN ou SOME”.

* `expr NOT IN (value,...)`

  Isso é o mesmo que `NOT (expr IN (value,...))`.

* `INTERVAL(N,N1,N2,N3,...)`

  Retorna `0` se *`N`* ≤ *`N1`*, `1` se *`N`* ≤ *`N2`* e assim por diante, ou `-1` se *`N`* for `NULL`. Todos os argumentos são tratados como integers. É obrigatório que *`N1`* ≤ *`N2`* ≤ *`N3`* ≤ `...` ≤ *`Nn`* para que esta função funcione corretamente. Isso ocorre porque uma busca binária (binary search) é usada (muito rápida).

  ```sql
  mysql> SELECT INTERVAL(23, 1, 15, 17, 30, 44, 200);
          -> 3
  mysql> SELECT INTERVAL(10, 1, 10, 100, 1000);
          -> 2
  mysql> SELECT INTERVAL(22, 23, 30, 44, 200);
          -> 0
  ```

* `IS boolean_value`

  Testa um valor contra um valor booleano, onde *`boolean_value`* pode ser `TRUE`, `FALSE`, ou `UNKNOWN`.

  ```sql
  mysql> SELECT 1 IS TRUE, 0 IS FALSE, NULL IS UNKNOWN;
          -> 1, 1, 1
  ```

* `IS NOT boolean_value`

  Testa um valor contra um valor booleano, onde *`boolean_value`* pode ser `TRUE`, `FALSE`, ou `UNKNOWN`.

  ```sql
  mysql> SELECT 1 IS NOT UNKNOWN, 0 IS NOT UNKNOWN, NULL IS NOT UNKNOWN;
          -> 1, 1, 0
  ```

* `IS NULL`

  Testa se um valor é `NULL`.

  ```sql
  mysql> SELECT 1 IS NULL, 0 IS NULL, NULL IS NULL;
          -> 0, 0, 1
  ```

  Para funcionar bem com programas ODBC, o MySQL oferece suporte aos seguintes recursos extras ao usar `IS NULL`:

  + Se a variável `sql_auto_is_null` estiver definida como 1, então, após uma instrução que insere com sucesso um valor `AUTO_INCREMENT` gerado automaticamente, você pode encontrar esse valor emitindo uma instrução do seguinte formato:

    ```sql
    SELECT * FROM tbl_name WHERE auto_col IS NULL
    ```

    Se a instrução retornar uma linha (row), o valor retornado é o mesmo que se você tivesse invocado a função `LAST_INSERT_ID()`. Para detalhes, incluindo o valor de retorno após uma inserção de múltiplas linhas, veja a Seção 12.15, “Funções de Informação”. Se nenhum valor `AUTO_INCREMENT` foi inserido com sucesso, a instrução `SELECT` não retorna linha alguma.

    O comportamento de recuperação de um valor `AUTO_INCREMENT` usando uma comparação `IS NULL` pode ser desativado definindo `sql_auto_is_null = 0`. Veja a Seção 5.1.7, “Variáveis de Sistema do Servidor”.

    O valor padrão de `sql_auto_is_null` é 0.

  + Para colunas `DATE` e `DATETIME` que são declaradas como `NOT NULL`, você pode encontrar a data especial `'0000-00-00'` usando uma instrução como esta:

    ```sql
    SELECT * FROM tbl_name WHERE date_column IS NULL
    ```

    Isso é necessário para fazer com que algumas aplicações ODBC funcionem, pois o ODBC não suporta um valor de data `'0000-00-00'`.

    Veja Obtendo Valores Auto-Increment, e a descrição para a opção `FLAG_AUTO_IS_NULL` em Parâmetros de Conexão do Connector/ODBC.

* `IS NOT NULL`

  Testa se um valor não é `NULL`.

  ```sql
  mysql> SELECT 1 IS NOT NULL, 0 IS NOT NULL, NULL IS NOT NULL;
          -> 1, 1, 0
  ```

* `ISNULL(expr)`

  Se *`expr`* for `NULL`, `ISNULL()` retorna `1`, caso contrário retorna `0`.

  ```sql
  mysql> SELECT ISNULL(1+1);
          -> 0
  mysql> SELECT ISNULL(1/0);
          -> 1
  ```

  `ISNULL()` pode ser usado em vez de `=` para testar se um valor é `NULL`. (Comparar um valor com `NULL` usando `=` sempre resulta em `NULL`.)

  A função `ISNULL()` compartilha alguns comportamentos especiais com o operador de comparação `IS NULL`. Veja a descrição de `IS NULL`.

* `LEAST(value1,value2,...)`

  Com dois ou mais argumentos, retorna o menor argumento (de valor mínimo). Os argumentos são comparados usando as seguintes regras:

  + Se qualquer argumento for `NULL`, o resultado é `NULL`. Nenhuma comparação é necessária.

  + Se todos os argumentos forem valores inteiros, eles são comparados como integers.

  + Se pelo menos um argumento for de precisão dupla (double precision), eles são comparados como valores de precisão dupla. Caso contrário, se pelo menos um argumento for um valor `DECIMAL` - DECIMAL, NUMERIC"), eles são comparados como valores `DECIMAL` - DECIMAL, NUMERIC").

  + Se os argumentos compreenderem uma mistura de números e strings, eles são comparados como números.

  + Se qualquer argumento for uma string não binária (caractere), os argumentos são comparados como strings não binárias.

  + Em todos os outros casos, os argumentos são comparados como strings binárias.

  O tipo de retorno de `LEAST()` é o tipo agregado dos tipos dos argumentos de comparação.

  ```sql
  mysql> SELECT LEAST(2,0);
          -> 0
  mysql> SELECT LEAST(34.0,3.0,5.0,767.0);
          -> 3.0
  mysql> SELECT LEAST('B','A','C');
          -> 'A'
  ```
