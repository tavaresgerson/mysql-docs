## 12.6 Funções e operadores numéricos

**Tabela 12.8 Funções e operadores numéricos**

<table frame="box" rules="all" summary="A reference that lists numeric functions and operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>%</code>, <code>MOD</code></td> <td>Operador de módulo</td> </tr><tr><td><code>*</code></td> <td>Operador de multiplicação</td> </tr><tr><td><code>+</code></td> <td>Operador de adição</td> </tr><tr><td><code>-</code></td> <td>Operador negativo</td> </tr><tr><td><code>-</code></td> <td>Troque o sinal do argumento</td> </tr><tr><td><code>/</code></td> <td>Operador de divisão</td> </tr><tr><td><code>ABS()</code></td> <td>Retorne o valor absoluto</td> </tr><tr><td><code>ACOS()</code></td> <td>Retorne o cosseno do arco</td> </tr><tr><td><code>ASIN()</code></td> <td>Retorne o arco seno</td> </tr><tr><td><code>ATAN()</code></td> <td>Retorne a tangente do arco</td> </tr><tr><td><code>ATAN2()</code>, <code>ATAN()</code></td> <td>Retorne a tangente do arco dos dois argumentos</td> </tr><tr><td><code>CEIL()</code></td> <td>Retorne o menor valor inteiro não menor que o argumento</td> </tr><tr><td><code>CEILING()</code></td> <td>Retorne o menor valor inteiro não menor que o argumento</td> </tr><tr><td><code>CONV()</code></td> <td>Converter números entre diferentes bases numéricas</td> </tr><tr><td><code>COS()</code></td> <td>Retorne a cosseno</td> </tr><tr><td><code>COT()</code></td> <td>Retorne a cotangente</td> </tr><tr><td><code>CRC32()</code></td> <td>Calcule um valor de verificação de redundância cíclica</td> </tr><tr><td><code>DEGREES()</code></td> <td>Converta radianos em graus</td> </tr><tr><td><code>DIV</code></td> <td>Divisão inteira</td> </tr><tr><td><code>EXP()</code></td> <td>Eleve à potência de</td> </tr><tr><td><code>FLOOR()</code></td> <td>Retorne o maior valor inteiro que não seja maior que o argumento</td> </tr><tr><td><code>LN()</code></td> <td>Retorne o logaritmo natural do argumento</td> </tr><tr><td><code>LOG()</code></td> <td>Retorne o logaritmo natural do primeiro argumento</td> </tr><tr><td><code>LOG10()</code></td> <td>Retorne o logaritmo decimal do argumento</td> </tr><tr><td><code>LOG2()</code></td> <td>Retorne o logaritmo base-2 do argumento</td> </tr><tr><td><code>MOD()</code></td> <td>Devolva o restante</td> </tr><tr><td><code>PI()</code></td> <td>Retorne o valor de pi</td> </tr><tr><td><code>POW()</code></td> <td>Retorne o argumento elevado à potência especificada</td> </tr><tr><td><code>POWER()</code></td> <td>Retorne o argumento elevado à potência especificada</td> </tr><tr><td><code>RADIANS()</code></td> <td>Argumento de retorno convertido em radianos</td> </tr><tr><td><code>RAND()</code></td> <td>Retorne um valor aleatório de ponto flutuante</td> </tr><tr><td><code>ROUND()</code></td> <td>Em torno do argumento</td> </tr><tr><td><code>SIGN()</code></td> <td>Retorne o sinal do argumento</td> </tr><tr><td><code>SIN()</code></td> <td>Retorne a função seno do argumento</td> </tr><tr><td><code>SQRT()</code></td> <td>Retorne a raiz quadrada do argumento</td> </tr><tr><td><code>TAN()</code></td> <td>Retorne a tangente do argumento</td> </tr><tr><td><code>TRUNCATE()</code></td> <td>Retorne ao número especificado de casas decimais</td> </tr></tbody></table>

### 12.6.1 Operadores aritméticos

**Tabela 12.9 Operadores aritméticos**

<table frame="box" rules="all" summary="A reference that lists arithmetic operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>%</code>, <code>MOD</code></td> <td> Modulo operator </td> </tr><tr><td><code>*</code></td> <td> Multiplication operator </td> </tr><tr><td><code>+</code></td> <td> Addition operator </td> </tr><tr><td><code>-</code></td> <td> Minus operator </td> </tr><tr><td><code>-</code></td> <td> Change the sign of the argument </td> </tr><tr><td><code>/</code></td> <td> Division operator </td> </tr><tr><td><code>DIV</code></td> <td> Integer division </td> </tr></tbody></table>

Os operadores aritméticos usuais estão disponíveis. O resultado é determinado de acordo com as seguintes regras:

* No caso de `-`, `+` e `*`, o resultado é calculado com `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (precisão de 64 bits) se ambos os operandos forem inteiros.

* Se ambos os operandos forem inteiros e algum deles for não assinado, o resultado será um inteiro não assinado. Para a subtração, se o modo SQL `NO_UNSIGNED_SUBTRACTION` estiver habilitado, o resultado será assinado, mesmo que algum dos operandos seja não assinado.

* Se qualquer dos operandos de um `+`, `-`, `/`, `*`, `%` for um valor real ou de cadeia, a precisão do resultado é a precisão do operando com a precisão máxima.

* Na divisão realizada com `/`, a escala do resultado ao usar dois operandos com valor exato é a escala do primeiro operador mais o valor da variável do sistema `div_precision_increment` (que é 4 por padrão). Por exemplo, o resultado da expressão `5.05 / 0.014` tem uma escala de seis casas decimais (`360.714286`).

Essas regras são aplicadas para cada operação, de modo que cálculos aninhados implicam na precisão de cada componente. Portanto, `(14620 / 9432456) / (24250 / 9432456)`, resolve primeiro para `(0.0014) / (0.0026)`, com o resultado final tendo 8 casas decimais (`0.60288653`).

Devido a essas regras e à forma como elas são aplicadas, deve-se ter cuidado para garantir que os componentes e subcomponentes de um cálculo utilizem o nível apropriado de precisão. Consulte a Seção 12.10, “Funções e Operadores de Lançamento”.

Para informações sobre o tratamento de excesso em avaliação de expressões numéricas, consulte a Seção 11.1.7, “Tratamento de fora de faixa e excesso”.

Operadores aritméticos são aplicados a números. Para outros tipos de valores, operações alternativas podem estar disponíveis. Por exemplo, para adicionar valores de data, use `DATE_ADD()`; veja Seção 12.7, “Funções de data e hora”.

* `+`

Observação:

  ```sql
  mysql> SELECT 3+5;
          -> 8
  ```

* `-`

Subtração:

  ```sql
  mysql> SELECT 3-5;
          -> -2
  ```

* `-`

Mínus unário. Esse operador altera o sinal do operando.

  ```sql
  mysql> SELECT - 2;
          -> -2
  ```

Nota

Se este operador for usado com um `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), o valor de retorno também é um `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Isso significa que você deve evitar usar `-` em inteiros que podem ter o valor de −263.

* `*`

Multiplicação:

  ```sql
  mysql> SELECT 3*5;
          -> 15
  mysql> SELECT 18014398509481984*18014398509481984.0;
          -> 324518553658426726783156020576256.0
  mysql> SELECT 18014398509481984*18014398509481984;
          -> out-of-range error
  ```

A última expressão produz um erro porque o resultado da multiplicação de inteiros excede o intervalo de 64 bits de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") cálculos. (Veja a Seção 11.1, "Tipos de dados numéricos").

* `/`

Divisão:

  ```sql
  mysql> SELECT 3/5;
          -> 0.60
  ```

A divisão por zero produz um resultado `NULL`:

  ```sql
  mysql> SELECT 102/(1-1);
          -> NULL
  ```

Uma divisão é calculada com `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") apenas aritmética, se realizada em um contexto onde seu resultado é convertido para um inteiro.

* `DIV`

Divisão inteira. Descarta qualquer parte fracionária à direita do ponto decimal do resultado da divisão.

Se qualquer dos operandos tiver um tipo que não é inteiro, os operandos são convertidos em `DECIMAL` - DECIMAL, NUMERIC") e divididos usando `DECIMAL` - DECIMAL, NUMERIC") aritmética antes de converter o resultado em `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Se o resultado exceder a faixa de `BIGINT`, ocorre um erro.

  ```sql
  mysql> SELECT 5 DIV 2, -5 DIV 2, 5 DIV -2, -5 DIV -2;
          -> 2, -2, -2, 2
  ```

* `N % M`(arithmetic-functions.html#operator_mod), `N MOD M`(arithmetic-functions.html#operator_mod)

Operação de módulo. Retorna o resto de *`N`* dividido por *`M`*. Para mais informações, consulte a descrição da função `MOD()` na Seção 12.6.2, “Funções Matemáticas”.

### 12.6.2 Funções matemáticas

**Tabela 12.10 Funções matemáticas**

<table frame="box" rules="all" summary="A reference that lists mathematical functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>ABS()</code></td> <td>Retorne o valor absoluto</td> </tr><tr><td><code>ACOS()</code></td> <td>Retorne o cosseno do arco</td> </tr><tr><td><code>ASIN()</code></td> <td>Retorne o arco seno</td> </tr><tr><td><code>ATAN()</code></td> <td>Retorne a tangente do arco</td> </tr><tr><td><code>ATAN2()</code>, <code>ATAN()</code></td> <td>Retorne a tangente do arco dos dois argumentos</td> </tr><tr><td><code>CEIL()</code></td> <td>Retorne o menor valor inteiro não menor que o argumento</td> </tr><tr><td><code>CEILING()</code></td> <td>Retorne o menor valor inteiro não menor que o argumento</td> </tr><tr><td><code>CONV()</code></td> <td>Converter números entre diferentes bases numéricas</td> </tr><tr><td><code>COS()</code></td> <td>Retorne a cosseno</td> </tr><tr><td><code>COT()</code></td> <td>Retorne a cotangente</td> </tr><tr><td><code>CRC32()</code></td> <td>Calcule um valor de verificação de redundância cíclica</td> </tr><tr><td><code>DEGREES()</code></td> <td>Converta radianos em graus</td> </tr><tr><td><code>EXP()</code></td> <td>Eleve à potência de</td> </tr><tr><td><code>FLOOR()</code></td> <td>Retorne o maior valor inteiro que não seja maior que o argumento</td> </tr><tr><td><code>LN()</code></td> <td>Retorne o logaritmo natural do argumento</td> </tr><tr><td><code>LOG()</code></td> <td>Retorne o logaritmo natural do primeiro argumento</td> </tr><tr><td><code>LOG10()</code></td> <td>Retorne o logaritmo decimal do argumento</td> </tr><tr><td><code>LOG2()</code></td> <td>Retorne o logaritmo base-2 do argumento</td> </tr><tr><td><code>MOD()</code></td> <td>Devolva o restante</td> </tr><tr><td><code>PI()</code></td> <td>Retorne o valor de pi</td> </tr><tr><td><code>POW()</code></td> <td>Retorne o argumento elevado à potência especificada</td> </tr><tr><td><code>POWER()</code></td> <td>Retorne o argumento elevado à potência especificada</td> </tr><tr><td><code>RADIANS()</code></td> <td>Argumento de retorno convertido em radianos</td> </tr><tr><td><code>RAND()</code></td> <td>Retorne um valor aleatório de ponto flutuante</td> </tr><tr><td><code>ROUND()</code></td> <td>Em torno do argumento</td> </tr><tr><td><code>SIGN()</code></td> <td>Retorne o sinal do argumento</td> </tr><tr><td><code>SIN()</code></td> <td>Retorne a função seno do argumento</td> </tr><tr><td><code>SQRT()</code></td> <td>Retorne a raiz quadrada do argumento</td> </tr><tr><td><code>TAN()</code></td> <td>Retorne a tangente do argumento</td> </tr><tr><td><code>TRUNCATE()</code></td> <td>Retorne ao número especificado de casas decimais</td> </tr></tbody></table>

Todas as funções matemáticas retornam `NULL` em caso de erro.

* `ABS(X)`

Retorna o valor absoluto de *`X`*, ou `NULL` se *`X`* for `NULL`.

O tipo de resultado é derivado do tipo de argumento. Uma implicação disso é que `ABS(-9223372036854775808)` produz um erro porque o resultado não pode ser armazenado em um valor assinado de `BIGINT`.

  ```sql
  mysql> SELECT ABS(2);
          -> 2
  mysql> SELECT ABS(-32);
          -> 32
  ```

Essa função é segura para uso com valores de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

* `ACOS(X)`

Retorna o cosseno do arco de *`X`*, ou seja, o valor cujo cosseno é *`X`*. Retorna `NULL` se *`X`* não estiver no intervalo de `-1` a `1`.

  ```sql
  mysql> SELECT ACOS(1);
          -> 0
  mysql> SELECT ACOS(1.0001);
          -> NULL
  mysql> SELECT ACOS(0);
          -> 1.5707963267949
  ```

* `ASIN(X)`

Retorna o arco seno de *`X`*, ou seja, o valor cujo seno é *`X`*. Retorna `NULL` se *`X`* não estiver no intervalo de *`-1` a *`1`*.

  ```sql
  mysql> SELECT ASIN(0.2);
          -> 0.20135792079033
  mysql> SELECT ASIN('foo');

  +-------------+
  | ASIN('foo') |
  +-------------+
  |           0 |
  +-------------+
  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS;
  +---------+------+-----------------------------------------+
  | Level   | Code | Message                                 |
  +---------+------+-----------------------------------------+
  | Warning | 1292 | Truncated incorrect DOUBLE value: 'foo' |
  +---------+------+-----------------------------------------+
  ```

* `ATAN(X)`

Retorna a tangente do arco de *`X`*, ou seja, o valor cuja tangente é *`X`*.

  ```sql
  mysql> SELECT ATAN(2);
          -> 1.1071487177941
  mysql> SELECT ATAN(-2);
          -> -1.1071487177941
  ```

* `ATAN(Y,X)`, `ATAN2(Y,X)`

Retorna a tangente do arco das duas variáveis *`X`* e *`Y`*. É semelhante ao cálculo da tangente do arco de `Y / X`, exceto que os sinais de ambos os argumentos são usados para determinar o quadrante do resultado.

  ```sql
  mysql> SELECT ATAN(-2,2);
          -> -0.78539816339745
  mysql> SELECT ATAN2(PI(),0);
          -> 1.5707963267949
  ```

* `CEIL(X)`

`CEIL()` é sinônimo de `CEILING()`.

* `CEILING(X)`

Retorna o menor valor inteiro não menor que *`X`*.

  ```sql
  mysql> SELECT CEILING(1.23);
          -> 2
  mysql> SELECT CEILING(-1.23);
          -> -1
  ```

Para argumentos numéricos de valor exato, o valor de retorno tem um tipo numérico de valor exato. Para argumentos de string ou de ponto flutuante, o valor de retorno tem um tipo de ponto flutuante.

* `CONV(N,from_base,to_base)`

Converte números entre diferentes bases numéricas. Retorna uma representação em string do número *`N`*, convertido da base *`from_base`* para a base *`to_base`*. Retorna `NULL` se houver algum argumento `NULL`. O argumento *`N`* é interpretado como um inteiro, mas pode ser especificado como um inteiro ou uma string. A base mínima é *`2`* e a base máxima é *`36`*. Se *`from_base`* é um número negativo, *`N`* é considerado um número assinado. Caso contrário, *`N`* é tratado como não assinado. `CONV()` trabalha com precisão de 64 bits.

  ```sql
  mysql> SELECT CONV('a',16,2);
          -> '1010'
  mysql> SELECT CONV('6E',18,8);
          -> '172'
  mysql> SELECT CONV(-17,10,-18);
          -> '-H'
  mysql> SELECT CONV(10+'10'+'10'+X'0a',10,10);
          -> '40'
  ```

* `COS(X)`

Retorna a cosseno de *`X`*, onde *`X`* é dado em radianos.

  ```sql
  mysql> SELECT COS(PI());
          -> -1
  ```

* `COT(X)`

Retorna a cotangente de *`X`*.

  ```sql
  mysql> SELECT COT(12);
          -> -1.5726734063977
  mysql> SELECT COT(0);
          -> out-of-range error
  ```

* `CRC32(expr)`

Calcula um valor de verificação de redundância cíclica e retorna um valor não assinado de 32 bits. O resultado é `NULL` se o argumento for `NULL`. O argumento é esperado ser uma string e, se possível, é tratado como uma string se não for.

  ```sql
  mysql> SELECT CRC32('MySQL');
          -> 3259397556
  mysql> SELECT CRC32('mysql');
          -> 2501908538
  ```

* `DEGREES(X)`

Retorna o argumento *`X`*, convertido de radianos para graus.

  ```sql
  mysql> SELECT DEGREES(PI());
          -> 180
  mysql> SELECT DEGREES(PI() / 2);
          -> 90
  ```

* `EXP(X)`

Retorna o valor de *e* (a base dos logaritmos naturais) elevado à potência de *`X`*. O inverso desta função é `LOG()` (usando apenas um argumento) ou `LN()`.

  ```sql
  mysql> SELECT EXP(2);
          -> 7.3890560989307
  mysql> SELECT EXP(-2);
          -> 0.13533528323661
  mysql> SELECT EXP(0);
          -> 1
  ```

* `FLOOR(X)`

Retorna o maior valor inteiro que não é maior que *`X`*.

  ```sql
  mysql> SELECT FLOOR(1.23), FLOOR(-1.23);
          -> 1, -2
  ```

Para argumentos numéricos de valor exato, o valor de retorno tem um tipo numérico de valor exato. Para argumentos de string ou de ponto flutuante, o valor de retorno tem um tipo de ponto flutuante.

* `FORMAT(X,D)`

Formata o número *`X`* para um formato como `'#,###,###.##'`, arredondado para *`D`* casas decimais, e retorna o resultado como uma string. Para detalhes, consulte a Seção 12.8, “Funções e Operadores de String”.

* `HEX(N_or_S)`

Essa função pode ser usada para obter uma representação hexadecimal de um número decimal ou uma string; a maneira como ela faz isso varia de acordo com o tipo do argumento. Consulte a descrição dessa função na Seção 12.8, “Funções e Operadores de String”, para obter detalhes.

* `LN(X)`

Retorna o logaritmo natural de *`X`*; ou seja, o logaritmo na base *e* de *`X`*. Se *`X`* for menor ou igual a 0,0E0, a função retorna `NULL` e é relatado um aviso “Argumento inválido para logaritmo”.

  ```sql
  mysql> SELECT LN(2);
          -> 0.69314718055995
  mysql> SELECT LN(-2);
          -> NULL
  ```

Essa função é sinônima de `LOG(X)`. A função inversa dessa função é a função `EXP()`.

* `LOG(X)`, `LOG(B,X)`

Se chamada com um parâmetro, essa função retorna o logaritmo natural de *`X`*. Se *`X`* for menor ou igual a 0,0E0, a função retorna `NULL` e uma mensagem de aviso “Argumento inválido para logaritmo” é relatada.

O inverso dessa função (quando chamado com um único argumento) é a função `EXP()`.

  ```sql
  mysql> SELECT LOG(2);
          -> 0.69314718055995
  mysql> SELECT LOG(-2);
          -> NULL
  ```

Se chamada com dois parâmetros, esta função retorna o logaritmo de *`X`* na base *`B`*. Se *`X`* é menor ou igual a 0, ou se *`B`* é menor ou igual a 1, então `NULL` é retornado.

  ```sql
  mysql> SELECT LOG(2,65536);
          -> 16
  mysql> SELECT LOG(10,100);
          -> 2
  mysql> SELECT LOG(1,100);
          -> NULL
  ```

`LOG(B,X)` é equivalente a [`LOG(X) / LOG(B)`](mathematical-functions.html#function_log).

* `LOG2(X)`

Retorna o logaritmo base-2 de `X`. Se *`X`* for menor ou igual a 0,0E0, a função retorna `NULL` e um aviso “Argumento inválido para logaritmo” é relatado.

  ```sql
  mysql> SELECT LOG2(65536);
          -> 16
  mysql> SELECT LOG2(-100);
          -> NULL
  ```

`LOG2()` é útil para descobrir quantos bits um número requer para armazenamento. Essa função é aproximadamente equivalente à expressão `LOG(X) / LOG(2)`(mathematical-functions.html#function_log).

* `LOG10(X)`

Retorna o logaritmo decimal de *`X`*. Se *`X`* for menor ou igual a 0,0E0, a função retorna `NULL` e é relatado um aviso “Argumento inválido para logaritmo”.

  ```sql
  mysql> SELECT LOG10(2);
          -> 0.30102999566398
  mysql> SELECT LOG10(100);
          -> 2
  mysql> SELECT LOG10(-100);
          -> NULL
  ```

`LOG10(X)` é aproximadamente equivalente a `LOG(10,X)`.

* `MOD(N,M)`, `N % M`[(arithmetic-functions.html#operator_mod)]], `N MOD M`[(arithmetic-functions.html#operator_mod)]

Operação de módulo. Retorna o resto de *`N`* dividido por *`M`*.

  ```sql
  mysql> SELECT MOD(234, 10);
          -> 4
  mysql> SELECT 253 % 7;
          -> 1
  mysql> SELECT MOD(29,9);
          -> 2
  mysql> SELECT 29 MOD 9;
          -> 2
  ```

Essa função é segura para uso com valores de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

`MOD()` também funciona com valores que têm uma parte fracionária e retorna o resto exato após a divisão:

  ```sql
  mysql> SELECT MOD(34.5,3);
          -> 1.5
  ```

`MOD(N,0)` retorna `NULL`.

* `PI()`

Retorna o valor de π (pi). O número padrão de casas decimais exibidas é sete, mas o MySQL usa o valor completo de dupla precisão internamente.

Como o valor de retorno desta função é um valor de dupla precisão, sua representação exata pode variar entre plataformas ou implementações. Isso também se aplica a quaisquer expressões que utilizem `PI()`. Veja a Seção 11.1.4, “Tipos de Ponto Flutuante (Valor Aproximado) - FLOAT, DOUBLE” - FLOAT, DOUBLE).

  ```sql
  mysql> SELECT PI();
          -> 3.141593
  mysql> SELECT PI()+0.000000000000000000;
          -> 3.141592653589793000
  ```

* `POW(X,Y)`

Retorna o valor de *`X`* elevado à potência de *`Y`*.

  ```sql
  mysql> SELECT POW(2,2);
          -> 4
  mysql> SELECT POW(2,-2);
          -> 0.25
  ```

* `POWER(X,Y)`

Este é um sinônimo de `POW()`.

* `RADIANS(X)`

Retorna o argumento *`X`*, convertido de graus para radianos. (Observe que π radianos equivalem a 180 graus.)

  ```sql
  mysql> SELECT RADIANS(90);
          -> 1.5707963267949
  ```

* `RAND([N])`

Retorna um valor aleatório de ponto flutuante *`v`* na faixa `0` <= *`v`* < `1.0`. Para obter um número inteiro aleatório *`R`* na faixa *`i`* <= *`R`* < *`j`*, use a expressão [`FLOOR(i

+ RAND() * (j`](mathematical-functions.html#function_floor) − `i))`. For example, to obtain a random integer in the range the range `7` <= *`R`* < `12`, use the following statement:

  ```sql
  SELECT FLOOR(7 + (RAND() * 5));
  ```

Se um argumento inteiro *`N`* for especificado, ele será usado como o valor de semente:

+ Com um argumento inicializador constante, a semente é inicializada uma vez quando a declaração é preparada, antes da execução.

+ Com um argumento inicializador não constante (como o nome de uma coluna), a semente é inicializada com o valor para cada invocação do `RAND()`.

Uma implicação desse comportamento é que, para valores de argumento iguais, `RAND(N)` retorna o mesmo valor cada vez, e, assim, produz uma sequência repetida de valores de coluna. No exemplo a seguir, a sequência de valores produzida por `RAND(3)` é a mesma em ambos os lugares em que ocorre.

  ```sql
  mysql> CREATE TABLE t (i INT);
  Query OK, 0 rows affected (0.42 sec)

  mysql> INSERT INTO t VALUES(1),(2),(3);
  Query OK, 3 rows affected (0.00 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> SELECT i, RAND() FROM t;
  +------+------------------+
  | i    | RAND()           |
  +------+------------------+
  |    1 | 0.61914388706828 |
  |    2 | 0.93845168309142 |
  |    3 | 0.83482678498591 |
  +------+------------------+
  3 rows in set (0.00 sec)

  mysql> SELECT i, RAND(3) FROM t;
  +------+------------------+
  | i    | RAND(3)          |
  +------+------------------+
  |    1 | 0.90576975597606 |
  |    2 | 0.37307905813035 |
  |    3 | 0.14808605345719 |
  +------+------------------+
  3 rows in set (0.00 sec)

  mysql> SELECT i, RAND() FROM t;
  +------+------------------+
  | i    | RAND()           |
  +------+------------------+
  |    1 | 0.35877890638893 |
  |    2 | 0.28941420772058 |
  |    3 | 0.37073435016976 |
  +------+------------------+
  3 rows in set (0.00 sec)

  mysql> SELECT i, RAND(3) FROM t;
  +------+------------------+
  | i    | RAND(3)          |
  +------+------------------+
  |    1 | 0.90576975597606 |
  |    2 | 0.37307905813035 |
  |    3 | 0.14808605345719 |
  +------+------------------+
  3 rows in set (0.01 sec)
  ```

`RAND()` em uma cláusula `WHERE` é avaliada para cada string (ao selecionar de uma única tabela) ou combinação de strings (ao selecionar de uma junção de múltiplas tabelas). Assim, para fins de otimizador, `RAND()` não é um valor constante e não pode ser usado para otimizações de índice. Para mais informações, consulte a Seção 8.2.1.18, “Otimização de Chamada de Função”.

O uso de uma coluna com valores de `RAND()` em uma cláusula de `ORDER BY` ou `GROUP BY` pode resultar em resultados inesperados, pois, para qualquer uma dessas cláusulas, uma expressão de `RAND()` pode ser avaliada várias vezes para a mesma string, retornando um resultado diferente cada vez. Se o objetivo é recuperar strings em ordem aleatória, você pode usar uma declaração como esta:

  ```sql
  SELECT * FROM tbl_name ORDER BY RAND();
  ```

Para selecionar uma amostra aleatória de um conjunto de strings, combine `ORDER BY RAND()` com `LIMIT`:

  ```sql
  SELECT * FROM table1, table2 WHERE a=b AND c<d ORDER BY RAND() LIMIT 1000;
  ```

`RAND()` não é um gerador aleatório perfeito. É uma maneira rápida de gerar números aleatórios sob demanda que é portátil entre plataformas para a mesma versão do MySQL.

Essa função não é segura para replicação baseada em declarações. Um aviso é registrado se você usar essa função quando `binlog_format` está definido como `STATEMENT`.

* `ROUND(X)`, `ROUND(X,D)`

Arredonda o argumento *`X`* para *`D`* casas decimais. O algoritmo de arredondamento depende do tipo de dados de *`X`*. *`D`* tem o valor padrão de 0, se não for especificado. *`D`* pode ser negativo para fazer com que os dígitos à esquerda da vírgula do valor *`X`* se tornem zero. O valor máximo absoluto para *`D`* é 30; quaisquer dígitos em excesso de 30 (ou -30) são truncados.

  ```sql
  mysql> SELECT ROUND(-1.23);
          -> -1
  mysql> SELECT ROUND(-1.58);
          -> -2
  mysql> SELECT ROUND(1.58);
          -> 2
  mysql> SELECT ROUND(1.298, 1);
          -> 1.3
  mysql> SELECT ROUND(1.298, 0);
          -> 1
  mysql> SELECT ROUND(23.298, -1);
          -> 20
  mysql> SELECT ROUND(.12345678901234567890123456789012345, 35);
          -> 0.123456789012345678901234567890
  ```

O valor de retorno tem o mesmo tipo que o primeiro argumento (assumindo que é inteiro, duplo ou decimal). Isso significa que, para um argumento inteiro, o resultado é um inteiro (sem casas decimais):

  ```sql
  mysql> SELECT ROUND(150.000,2), ROUND(150,2);
  +------------------+--------------+
  | ROUND(150.000,2) | ROUND(150,2) |
  +------------------+--------------+
  |           150.00 |          150 |
  +------------------+--------------+
  ```

`ROUND()` utiliza as seguintes regras, dependendo do tipo do primeiro argumento:

Para números com valor exato, `ROUND()` utiliza a regra de "arredondar metade para longe de zero" ou "arredondar em direção ao número mais próximo": um valor com uma parte fracionária de .5 ou maior é arredondado para o próximo inteiro se positivo ou para baixo para o próximo inteiro se negativo. (Em outras palavras, é arredondado para longe de zero.) Um valor com uma parte fracionária menor que .5 é arredondado para o próximo inteiro se positivo ou para o próximo inteiro se negativo.

+ Para números de valor aproximado, o resultado depende da biblioteca C. Em muitos sistemas, isso significa que `ROUND()` usa a regra de arredondamento para o número par mais próximo: um valor com uma parte fracionária exatamente na metade entre dois inteiros é arredondado para o número par mais próximo.

O exemplo a seguir mostra como a arredondagem difere para valores exatos e aproximados:

  ```sql
  mysql> SELECT ROUND(2.5), ROUND(25E-1);
  +------------+--------------+
  | ROUND(2.5) | ROUND(25E-1) |
  +------------+--------------+
  | 3          |            2 |
  +------------+--------------+
  ```

Para mais informações, consulte a Seção 12.21, “Matemática de Precisão”.

* `SIGN(X)`

Retorna o sinal do argumento como `-1`, `0` ou `1`, dependendo se *`X`* é negativo, zero ou positivo.

  ```sql
  mysql> SELECT SIGN(-32);
          -> -1
  mysql> SELECT SIGN(0);
          -> 0
  mysql> SELECT SIGN(234);
          -> 1
  ```

* `SIN(X)`

Retorna a senos de *`X`*, onde *`X`* é dado em radianos.

  ```sql
  mysql> SELECT SIN(PI());
          -> 1.2246063538224e-16
  mysql> SELECT ROUND(SIN(PI()));
          -> 0
  ```

* `SQRT(X)`

Retorna a raiz quadrada de um número não negativo *`X`*.

  ```sql
  mysql> SELECT SQRT(4);
          -> 2
  mysql> SELECT SQRT(20);
          -> 4.4721359549996
  mysql> SELECT SQRT(-16);
          -> NULL
  ```

* `TAN(X)`

Retorna a tangente de *`X`*, onde *`X`* é dado em radianos.

  ```sql
  mysql> SELECT TAN(PI());
          -> -1.2246063538224e-16
  mysql> SELECT TAN(PI()+1);
          -> 1.5574077246549
  ```

* `TRUNCATE(X,D)`

Retorna o número *`X`*, truncado para *`D`* casas decimais. Se *`D`* é `0`, o resultado não tem ponto decimal ou parte fracionária. *`D`* pode ser negativo para causar *`D`* dígitos à esquerda do ponto decimal do valor *`X`* para se tornarem zero.

  ```sql
  mysql> SELECT TRUNCATE(1.223,1);
          -> 1.2
  mysql> SELECT TRUNCATE(1.999,1);
          -> 1.9
  mysql> SELECT TRUNCATE(1.999,0);
          -> 1
  mysql> SELECT TRUNCATE(-1.999,1);
          -> -1.9
  mysql> SELECT TRUNCATE(122,-2);
         -> 100
  mysql> SELECT TRUNCATE(10.28*100,0);
         -> 1028
  ```

Todos os números são arredondados em direção ao zero.