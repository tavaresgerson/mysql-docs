### 14.6.2 Funções Matemáticas

**Tabela 14.10 Funções Matemáticas**

<table frame="box" rules="all" summary="Uma referência que lista funções matemáticas.">
<tr><th>Nome</th> <th>Descrição</th> </tr>
<tr><td><code>ABS()</code></td> <td> Retorna o valor absoluto </td> </tr>
<tr><td><code>ACOS()</code></td> <td> Retorna o cosseno </td> </tr>
<tr><td><code>ASIN()</code></td> <td> Retorna o seno </td> </tr>
<tr><td><code>ATAN()</code></td> <td> Retorna o tangente </td> </tr>
<tr><td><code>ATAN2()</code>, <code>ATAN()</code></td> <td> Retorna o tangente dos dois argumentos </td> </tr>
<tr><td><code>CEIL()</code></td> <td> Retorna o menor inteiro não menor que o argumento </td> </tr>
<tr><td><code>CEILING()</code></td> <td> Retorna o menor inteiro não menor que o argumento </td> </tr>
<tr><td><code>CONV()</code></td> <td> Converte números entre diferentes bases numéricas </td> </tr>
<tr><td><code>COS()</code></td> <td> Retorna o cosseno </td> </tr>
<tr><td><code>COT()</code></td> <td> Retorna a cotangente </td> </tr>
<tr><td><code>CRC32()</code></td> <td> Calcula um valor de verificação de redundância cíclica </td> </tr>
<tr><td><code>DEGREES()</code></td> <td> Converte radianos para graus </td> </tr>
<tr><td><code>EXP()</code></td> <td> Eleva ao poder </td> </tr>
<tr><td><code>FLOOR()</code></td> <td> Retorna o maior inteiro não maior que o argumento </td> </tr>
<tr><td><code>LN()</code></td> <td> Retorna o logaritmo natural do argumento </td> </tr>
<tr><td><code>LOG()</code></td> <td> Retorna o logaritmo natural do primeiro argumento </td> </tr>
<tr><td><code>LOG10()</code></td> <td> Retorna o logaritmo em base 10 do argumento </td> </tr>
<tr><td><code>LOG2()</code></td> <td> Retorna o logaritmo em base 2 do argumento </td> </tr>
<tr><td><code>MOD()</code></td> <td> Retorna o resto </td> </tr>
<tr><td><code>PI()</code></td> <td> Retorna o valor de pi </td> </tr>
<tr><td><code>POW()</code></td> <td> Retorna o argumento elevado ao poder especificado </td> </tr>
<tr><td><a class="link

Todas as funções matemáticas retornam `NULL` em caso de erro.

* `ABS(X)`

  Retorna o valor absoluto de *`X`*, ou `NULL` se *`X`* for `NULL`.

  O tipo de resultado é derivado do tipo do argumento. Uma implicação disso é que `ABS(-9223372036854775808)` produz um erro porque o resultado não pode ser armazenado em um valor `BIGINT` assinado.

  ```
  mysql> SELECT ABS(2);
          -> 2
  mysql> SELECT ABS(-32);
          -> 32
  ```

  Esta função é segura para uso com valores de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")".

* `ACOS(X)`

  Retorna o cosseno do arco de *`X`*, ou seja, o valor cujo cosseno é *`X`*. Retorna `NULL` se *`X`* não estiver no intervalo de `-1` a `1`, ou se *`X`* for `NULL`.

  ```
  mysql> SELECT ACOS(1);
          -> 0
  mysql> SELECT ACOS(1.0001);
          -> NULL
  mysql> SELECT ACOS(0);
          -> 1.5707963267949
  ```

* `ASIN(X)`

  Retorna o seno do arco de *`X`*, ou seja, o valor cujo seno é *`X`*. Retorna `NULL` se *`X`* não estiver no intervalo de `-1` a `1`, ou se *`X`* for `NULL`.

  ```
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

  Retorna o tangente do arco de *`X`*, ou seja, o valor cujo tangente é *`X`*. Retorna `NULL` se *`X`* for `NULL`

  ```
  mysql> SELECT ATAN(2);
          -> 1.1071487177941
  mysql> SELECT ATAN(-2);
          -> -1.1071487177941
  ```

* `ATAN(Y,X)`, `ATAN2(Y,X)`

  Retorna o tangente do arco das duas variáveis *`X`* e *`Y`*. É semelhante ao cálculo do tangente do arco de `Y / X`, exceto que os sinais de ambos os argumentos são usados para determinar o quadrante do resultado. Retorna `NULL` se *`X`* ou *`Y`* for `NULL`.

  ```
  mysql> SELECT ATAN(-2,2);
          -> -0.78539816339745
  mysql> SELECT ATAN2(PI(),0);
          -> 1.5707963267949
  ```

* `CEIL(X)`

  `CEIL()` é sinônimo de `CEILING()`.

* `CEILING(X)`

  Retorna o menor valor inteiro não menor que *`X`*. Retorna `NULL` se *`X`* for `NULL`.

  ```
  mysql> SELECT CEILING(1.23);
          -> 2
  mysql> SELECT CEILING(-1.23);
          -> -1
  ```

  Para argumentos numéricos de valor exato, o valor de retorno tem um tipo numérico de valor exato. Para argumentos de string ou de ponto flutuante, o valor de retorno tem um tipo de ponto flutuante.

* `CONV(N,from_base,to_base)`

Converte números entre diferentes bases numéricas. Retorna uma representação em string do número *`N`*, convertido da base *`from_base`* para a base *`to_base`*. Retorna `NULL` se qualquer argumento for `NULL`. O argumento *`N`* é interpretado como um inteiro, mas pode ser especificado como um inteiro ou uma string. A base mínima é `2` e a base máxima é `36`. Se *`from_base`* for um número negativo, *`N`* é considerado um número com sinal. Caso contrário, *`N`* é tratado como não sinalizado. A função `CONV()` funciona com precisão de 64 bits.

`CONV()` retorna `NULL` se qualquer um de seus argumentos for `NULL`.

```
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

  Retorna o cosseno de *`X`*, onde *`X`* é dado em radianos. Retorna `NULL` se *`X`* for `NULL`.

  ```
  mysql> SELECT COS(PI());
          -> -1
  ```

* `COT(X)`

  Retorna a cotangente de *`X`*. Retorna `NULL` se *`X`* for `NULL`.

  ```
  mysql> SELECT COT(12);
          -> -1.5726734063977
  mysql> SELECT COT(0);
          -> out-of-range error
  ```

* `CRC32(expr)`

  Calcula um valor de verificação de redundância cíclica e retorna um valor não sinalizado de 32 bits. O resultado é `NULL` se o argumento for `NULL`. O argumento é esperado ser uma string e (se possível) é tratado como uma string se não for.

  ```
  mysql> SELECT CRC32('MySQL');
          -> 3259397556
  mysql> SELECT CRC32('mysql');
          -> 2501908538
  ```

* `DEGREES(X)`

  Retorna o argumento *`X`*, convertido de radianos para graus. Retorna `NULL` se *`X`* for `NULL`.

  ```
  mysql> SELECT DEGREES(PI());
          -> 180
  mysql> SELECT DEGREES(PI() / 2);
          -> 90
  ```

* `EXP(X)`

  Retorna o valor de *e* (a base dos logaritmos naturais) elevado à potência de *`X`*. A função inversa desta função é `LOG()` (usando apenas um argumento) ou `LN()`.

  Se *`X`* for `NULL`, esta função retorna `NULL`.

  ```
  mysql> SELECT EXP(2);
          -> 7.3890560989307
  mysql> SELECT EXP(-2);
          -> 0.13533528323661
  mysql> SELECT EXP(0);
          -> 1
  ```

* `FLOOR(X)`

  Retorna o maior valor inteiro não maior que *`X`*. Retorna `NULL` se *`X`* for `NULL`.

  ```
  mysql> SELECT FLOOR(1.23), FLOOR(-1.23);
          -> 1, -2
  ```

  Para argumentos numéricos de valor exato, o valor de retorno tem um tipo numérico de valor exato. Para argumentos de string ou de ponto flutuante, o valor de retorno tem um tipo de ponto flutuante.

* `FORMAT(X,D)`

Formata o número *`X`* para um formato como `'#,###,###.##'`, arredondado a *`D`* casas decimais, e retorna o resultado como uma string. Para detalhes, consulte a Seção 14.8, “Funções e Operadores de String”.

* `HEX(N_or_S)`

  Esta função pode ser usada para obter uma representação hexadecimal de um número decimal ou uma string; a maneira como ela faz isso varia de acordo com o tipo do argumento. Consulte a descrição desta função na Seção 14.8, “Funções e Operadores de String”, para detalhes.

* `LN(X)`

  Retorna o logaritmo natural de *`X`*; ou seja, o logaritmo com base de *e* de *`X`*. Se *`X`* for menor ou igual a 0.0E0, a função retorna `NULL` e um aviso “Argumento inválido para logaritmo” é relatado. Retorna `NULL` se *`X`* for `NULL`.

  ```
  mysql> SELECT LN(2);
          -> 0.69314718055995
  mysql> SELECT LN(-2);
          -> NULL
  ```

  Esta função é sinônima de `LOG(X)`. O inverso desta função é a função `EXP()`.

* `LOG(X)`, `LOG(B,X)`

  Se chamada com um único parâmetro, esta função retorna o logaritmo natural de *`X`*. Se *`X`* for menor ou igual a 0.0E0, a função retorna `NULL` e um aviso “Argumento inválido para logaritmo” é relatado. Retorna `NULL` se *`X`* ou *`B`* for `NULL`.

  O inverso desta função (quando chamada com um único argumento) é a função `EXP()`.

  ```
  mysql> SELECT LOG(2);
          -> 0.69314718055995
  mysql> SELECT LOG(-2);
          -> NULL
  ```

  Se chamada com dois parâmetros, esta função retorna o logaritmo de *`X`* na base de *`B`*. Se *`X`* for menor ou igual a 0, ou se *`B`* for menor ou igual a 1, então `NULL` é retornado.

  ```
  mysql> SELECT LOG(2,65536);
          -> 16
  mysql> SELECT LOG(10,100);
          -> 2
  mysql> SELECT LOG(1,100);
          -> NULL
  ```

  `LOG(B,X)` é equivalente a `LOG(X) / LOG(B)`.

* `LOG2(X)`

  Retorna o logaritmo base-2 de `X`. Se *`X`* for menor ou igual a 0.0E0, a função retorna `NULL` e um aviso “Argumento inválido para logaritmo” é relatado. Retorna `NULL` se *`X`* for `NULL`.

  ```
  mysql> SELECT LOG2(65536);
          -> 16
  mysql> SELECT LOG2(-100);
          -> NULL
  ```

`LOG2()` é útil para descobrir quantos bits um número requer para armazenamento. Esta função é aproximadamente equivalente à expressão `LOG(X) / LOG(2)`.

* `LOG10(X)`

  Retorna o logaritmo em base 10 de *`X`*. Se *`X`* for menor ou igual a 0,0E0, a função retorna `NULL` e é relatado um aviso “Argumento inválido para logaritmo”. Retorna `NULL` se *`X`* for `NULL`.

  ```
  mysql> SELECT LOG10(2);
          -> 0.30102999566398
  mysql> SELECT LOG10(100);
          -> 2
  mysql> SELECT LOG10(-100);
          -> NULL
  ```

  `LOG10(X)` é aproximadamente equivalente a `LOG(10,X)`.

* `MOD(N,M)`, `N % M`, `N MOD M`

  Operação de módulo. Retorna o resto de *`N`* dividido por *`M`*. Retorna `NULL` se *`M`* ou *`N`* for `NULL`.

  ```
  mysql> SELECT MOD(234, 10);
          -> 4
  mysql> SELECT 253 % 7;
          -> 1
  mysql> SELECT MOD(29,9);
          -> 2
  mysql> SELECT 29 MOD 9;
          -> 2
  ```

  Esta função é segura para uso com valores de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")".

  `MOD()` também funciona com valores que têm uma parte fracionária e retorna o resto exato após a divisão:

  ```
  mysql> SELECT MOD(34.5,3);
          -> 1.5
  ```

  `MOD(N,0)` retorna `NULL`.

* `PI()`

  Retorna o valor de π (pi). O número de casas decimais padrão exibidas é sete, mas o MySQL usa o valor completo de dupla precisão internamente.

  Como o valor de retorno desta função é um valor de dupla precisão, sua representação exata pode variar entre plataformas ou implementações. Isso também se aplica a quaisquer expressões que utilizem `PI()`. Veja a Seção 13.1.4, “Tipos de Ponto Flutuante (Valor Aproximado) - FLOAT, DOUBLE” - FLOAT, DOUBLE").

  ```
  mysql> SELECT PI();
          -> 3.141593
  mysql> SELECT PI()+0.000000000000000000;
          -> 3.141592653589793000
  ```

* `POW(X,Y)`

  Retorna o valor de *`X`* elevado à potência de *`Y`*. Retorna `NULL` se *`X`* ou *`Y`* for `NULL`.

  ```
  mysql> SELECT POW(2,2);
          -> 4
  mysql> SELECT POW(2,-2);
          -> 0.25
  ```

* `POWER(X,Y)`

  Este é um sinônimo de `POW()`.

* `RADIANS(X)`

  Retorna o argumento *`X`*, convertido de graus para radianos. (Observe que π radianos equivale a 180 graus.) Retorna `NULL` se *`X`* for `NULL`.

  ```
  mysql> SELECT RADIANS(90);
          -> 1.5707963267949
  ```

* `RAND([N])`

Retorna um valor aleatório de ponto flutuante *`v`* na faixa `0` <= *`v`* < `1.0`. Para obter um número inteiro aleatório *`R`* na faixa *`i`* <= *`R`* < *`j`*, use a expressão [`FLOOR(i

  + RAND() * (j](funções matemáticas.html#função_floor) − `i))`. Por exemplo, para obter um número inteiro aleatório na faixa `7` <= *`R`* < `12`, use a seguinte declaração:

  ```
  SELECT FLOOR(7 + (RAND() * 5));
  ```

  Se um argumento inteiro *`N`* for especificado, ele é usado como o valor de seed:

  + Com um argumento inicializador constante, o seed é inicializado uma vez quando a declaração é preparada, antes da execução.

  + Com um argumento inicializador não constante (como o nome de uma coluna), o seed é inicializado com o valor para cada invocação de `RAND()`.

  Uma implicação desse comportamento é que, para valores de argumento iguais, `RAND(N)` retorna o mesmo valor cada vez, e, portanto, produz uma sequência de valores de coluna repetiível. No exemplo seguinte, a sequência de valores produzida por `RAND(3)` é a mesma em ambos os lugares em que ocorre.

  ```
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

  `RAND()` em uma cláusula `WHERE` é avaliado para cada linha (ao selecionar de uma única tabela) ou combinação de linhas (ao selecionar de uma junção de múltiplas tabelas). Assim, para fins de otimizador, `RAND()` não é um valor constante e não pode ser usado para otimizações de índice. Para mais informações, consulte a Seção 10.2.1.20, “Otimização de Chamada de Função”.

  O uso de uma coluna com valores de `RAND()` em uma cláusula `ORDER BY` ou `GROUP BY` pode produzir resultados inesperados porque, para qualquer cláusula, uma expressão `RAND()` pode ser avaliada várias vezes para a mesma linha, retornando cada vez um resultado diferente. Se o objetivo é recuperar linhas em ordem aleatória, você pode usar uma declaração como esta:

  ```
  SELECT * FROM tbl_name ORDER BY RAND();
  ```

Para selecionar uma amostra aleatória de um conjunto de linhas, combine `ORDER BY RAND()` com `LIMIT`:

```
  SELECT * FROM table1, table2 WHERE a=b AND c<d ORDER BY RAND() LIMIT 1000;
  ```

`RAND()` não é um gerador de números aleatórios perfeito. É uma maneira rápida de gerar números aleatórios sob demanda que é portátil entre plataformas para a mesma versão do MySQL.

Esta função não é segura para replicação baseada em declarações. Uma mensagem de aviso é registrada se você usar esta função quando `binlog_format` estiver definido como `STATEMENT`.

* `ROUND(X)`, `ROUND(X, D)`

  Arredonda o argumento *`X`* para *`D`* casas decimais. O algoritmo de arredondamento depende do tipo de dados de *`X`*. *`D`* tem o valor padrão de 0 se não for especificado. *`D`* pode ser negativo para fazer com que os dígitos à esquerda da casa decimal do valor *`X`* se tornem zero. O valor máximo absoluto para *`D`* é 30; quaisquer dígitos em excesso de 30 (ou -30) são truncados. Se *`X`* ou *`D`* for `NULL`, a função retorna `NULL`.

  ```
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

  ```
  mysql> SELECT ROUND(150.000,2), ROUND(150,2);
  +------------------+--------------+
  | ROUND(150.000,2) | ROUND(150,2) |
  +------------------+--------------+
  |           150.00 |          150 |
  +------------------+--------------+
  ```

  `ROUND()` usa as seguintes regras, dependendo do tipo do primeiro argumento:

  + Para números de valor exato, `ROUND()` usa a regra "arredonde para longe de zero" ou "arredonde em direção ao mais próximo": Um valor com uma parte fracionária de .5 ou maior é arredondado para o próximo inteiro se positivo ou para o próximo inteiro se negativo. (Em outras palavras, é arredondado para longe de zero.) Um valor com uma parte fracionária menor que .5 é arredondado para o próximo inteiro se positivo ou para o próximo inteiro se negativo.

Para números com valor aproximado, o resultado depende da biblioteca C. Em muitos sistemas, isso significa que o `ROUND()` usa a regra "arredondar para o número par mais próximo": um valor com uma parte fracionária exatamente no meio entre dois inteiros é arredondado para o número inteiro par mais próximo.

O exemplo a seguir mostra como o arredondamento difere para valores exatos e aproximados:

```
  mysql> SELECT ROUND(2.5), ROUND(25E-1);
  +------------+--------------+
  | ROUND(2.5) | ROUND(25E-1) |
  +------------+--------------+
  | 3          |            2 |
  +------------+--------------+
  ```

Para mais informações, consulte a Seção 14.25, "Matemática de Precisão".

O tipo de dados retornado pelo `ROUND()` (e pelo `TRUNCATE()` também) é determinado de acordo com as regras listadas aqui:

+ Quando o primeiro argumento é de qualquer tipo inteiro, o tipo de retorno é sempre `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

+ Quando o primeiro argumento é de qualquer tipo de ponto flutuante ou de qualquer tipo não numérico, o tipo de retorno é sempre `DOUBLE` - FLOAT, DOUBLE").

+ Quando o primeiro argumento é um valor `DECIMAL` - DECIMAL, NUMERIC") o tipo de retorno também é `DECIMAL".

+ Os atributos de tipo para o valor de retorno também são copiados do primeiro argumento, exceto no caso de `DECIMAL`, quando o segundo argumento é um valor constante.

Quando o número desejado de casas decimais é menor que a escala do argumento, a escala e a precisão do resultado são ajustadas conforme necessário.

Além disso, para o `ROUND()` (mas não para a função `TRUNCATE()`), a precisão é estendida em um lugar para acomodar o arredondamento que aumenta o número de dígitos significativos. Se o segundo argumento for negativo, o tipo de retorno é ajustado de modo que sua escala seja 0, com uma precisão correspondente. Por exemplo, `ROUND(99.999, 2)` retorna `100.00` — o primeiro argumento é `DECIMAL(5, 3)` e o tipo de retorno é `DECIMAL(5, 2)`.

Se o segundo argumento for negativo, o tipo de retorno tem escala 0 e uma precisão correspondente; `ROUND(99.999, -1)` retorna `100`, que é `DECIMAL(3, 0)`.

* `SIGN(X)`

  Retorna o sinal do argumento como `-1`, `0` ou `1`, dependendo se *`X`* é negativo, zero ou positivo. Retorna `NULL` se *`X`* for `NULL`.

  ```
  mysql> SELECT SIGN(-32);
          -> -1
  mysql> SELECT SIGN(0);
          -> 0
  mysql> SELECT SIGN(234);
          -> 1
  ```

* `SIN(X)`

  Retorna a senóide de *`X`*, onde *`X`* é dado em radianos. Retorna `NULL` se *`X`* for `NULL`.

  ```
  mysql> SELECT SIN(PI());
          -> 1.2246063538224e-16
  mysql> SELECT ROUND(SIN(PI()));
          -> 0
  ```

* `SQRT(X)`

  Retorna a raiz quadrada de um número não negativo *`X`*. Se *`X`* for `NULL`, a função retorna `NULL`.

  ```
  mysql> SELECT SQRT(4);
          -> 2
  mysql> SELECT SQRT(20);
          -> 4.4721359549996
  mysql> SELECT SQRT(-16);
          -> NULL
  ```

* `TAN(X)`

  Retorna a tangente de *`X`*, onde *`X`* é dado em radianos. Retorna `NULL` se *`X`* for `NULL`.

  ```
  mysql> SELECT TAN(PI());
          -> -1.2246063538224e-16
  mysql> SELECT TAN(PI()+1);
          -> 1.5574077246549
  ```

* `TRUNCATE(X, D)`

  Retorna o número *`X`*, truncado para *`D`* casas decimais. Se *`D`* for `0`, o resultado não tem ponto decimal ou parte fracionária. *`D`* pode ser negativo para fazer com que os *`D`* dígitos à esquerda do ponto decimal do valor *`X`* se tornem zero. Se *`X`* ou *`D`* for `NULL`, a função retorna `NULL`.

  ```
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

  Todos os números são arredondados em direção a zero.

  O tipo de dados retornado por `TRUNCATE()` segue as mesmas regras que determinam o tipo de retorno da função `ROUND()`; para detalhes, consulte a descrição para `ROUND()`.