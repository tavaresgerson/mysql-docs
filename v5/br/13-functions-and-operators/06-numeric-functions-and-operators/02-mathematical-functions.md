### 12.6.2 Funções matemáticas

**Tabela 12.10 Funções Matemáticas**

<table frame="box" rules="all" summary="Uma referência que lista funções matemáticas."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td>PH_HTML_CODE_<code>COT()</code>]</td> <td>Retorne o valor absoluto</td> </tr><tr><td>PH_HTML_CODE_<code>COT()</code>]</td> <td>Retorne o cosseno do arco</td> </tr><tr><td>PH_HTML_CODE_<code>DEGREES()</code>]</td> <td>Retorne o arco seno</td> </tr><tr><td>PH_HTML_CODE_<code>EXP()</code>]</td> <td>Retorne a tangente do arco</td> </tr><tr><td>PH_HTML_CODE_<code>FLOOR()</code>], PH_HTML_CODE_<code>LN()</code>]</td> <td>Retorne o arco tangente dos dois argumentos</td> </tr><tr><td>PH_HTML_CODE_<code>LOG()</code>]</td> <td>Retorne o menor valor inteiro não menor que o argumento</td> </tr><tr><td>PH_HTML_CODE_<code>LOG10()</code>]</td> <td>Retorne o menor valor inteiro não menor que o argumento</td> </tr><tr><td>PH_HTML_CODE_<code>LOG2()</code>]</td> <td>Converter números entre diferentes bases numéricas</td> </tr><tr><td>PH_HTML_CODE_<code>MOD()</code>]</td> <td>Retorne o cosseno</td> </tr><tr><td><code>COT()</code></td> <td>Retorne a co-tangente</td> </tr><tr><td><code>ACOS()</code><code>COT()</code>]</td> <td>Calcule o valor de verificação de redundância cíclica</td> </tr><tr><td><code>DEGREES()</code></td> <td>Converter radianos em graus</td> </tr><tr><td><code>EXP()</code></td> <td>Eleve à potência de</td> </tr><tr><td><code>FLOOR()</code></td> <td>Retorne o maior valor inteiro que não seja maior que o argumento</td> </tr><tr><td><code>LN()</code></td> <td>Retorne o logaritmo natural do argumento</td> </tr><tr><td><code>LOG()</code></td> <td>Retorne o logaritmo natural do primeiro argumento</td> </tr><tr><td><code>LOG10()</code></td> <td>Retorne o logaritmo decimal do argumento</td> </tr><tr><td><code>LOG2()</code></td> <td>Retorne o logaritmo em base 2 do argumento</td> </tr><tr><td><code>MOD()</code></td> <td>Devolva o restante</td> </tr><tr><td><code>ASIN()</code><code>COT()</code>]</td> <td>Retorne o valor de pi</td> </tr><tr><td><code>ASIN()</code><code>COT()</code>]</td> <td>Retorne o argumento elevado à potência especificada</td> </tr><tr><td><code>ASIN()</code><code>DEGREES()</code>]</td> <td>Retorne o argumento elevado à potência especificada</td> </tr><tr><td><code>ASIN()</code><code>EXP()</code>]</td> <td>Argumento de retorno convertido para radianos</td> </tr><tr><td><code>ASIN()</code><code>FLOOR()</code>]</td> <td>Retorne um valor aleatório de ponto flutuante</td> </tr><tr><td><code>ASIN()</code><code>LN()</code>]</td> <td>Em torno do argumento</td> </tr><tr><td><code>ASIN()</code><code>LOG()</code>]</td> <td>Retorne o sinal do argumento</td> </tr><tr><td><code>ASIN()</code><code>LOG10()</code>]</td> <td>Retorne o seno do argumento</td> </tr><tr><td><code>ASIN()</code><code>LOG2()</code>]</td> <td>Retorne a raiz quadrada do argumento</td> </tr><tr><td><code>ASIN()</code><code>MOD()</code>]</td> <td>Retorne a tangente do argumento</td> </tr><tr><td><code>ATAN()</code><code>COT()</code>]</td> <td>Reduzir para o número especificado de casas decimais</td> </tr></tbody></table>

Todas as funções matemáticas retornam `NULL` em caso de erro.

- `ABS(X)`

  Retorna o valor absoluto de *`X`*, ou `NULL` se *`X`* for `NULL`.

  O tipo de resultado é derivado do tipo de argumento. Uma implicação disso é que `ABS(-9223372036854775808)` produz um erro porque o resultado não pode ser armazenado em um valor `BIGINT` assinado.

  ```sql
  mysql> SELECT ABS(2);
          -> 2
  mysql> SELECT ABS(-32);
          -> 32
  ```

  Essa função é segura para uso com valores de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

- `ACOS(X)`

  Retorna o cosseno do arco de *`X`*, ou seja, o valor cujo cosseno é *`X`*. Retorna `NULL` se *`X`* não estiver no intervalo de `-1` a `1`.

  ```sql
  mysql> SELECT ACOS(1);
          -> 0
  mysql> SELECT ACOS(1.0001);
          -> NULL
  mysql> SELECT ACOS(0);
          -> 1.5707963267949
  ```

- `ASIN(X)`

  Retorna o arco-seno de *`X`*, ou seja, o valor cujo seno é *`X`*. Retorna `NULL` se *`X`* não estiver no intervalo de `-1` a `1`.

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

- `ATAN(X)`

  Retorna o arco tangente de *`X`*, ou seja, o valor cujo tangente é *`X`*.

  ```sql
  mysql> SELECT ATAN(2);
          -> 1.1071487177941
  mysql> SELECT ATAN(-2);
          -> -1.1071487177941
  ```

- `ATAN(Y, X)`, `ATAN2(Y, X)`

  Retorna a tangente do arco das duas variáveis *`X`* e *`Y`*. É semelhante ao cálculo da tangente do arco de `Y / X`, exceto que os sinais de ambos os argumentos são usados para determinar o quadrante do resultado.

  ```sql
  mysql> SELECT ATAN(-2,2);
          -> -0.78539816339745
  mysql> SELECT ATAN2(PI(),0);
          -> 1.5707963267949
  ```

- `CEIL(X)`

  `CEIL()` é sinônimo de `CEILING()`.

- `CEILING(X)`

  Retorna o menor valor inteiro não menor que *`X`*.

  ```sql
  mysql> SELECT CEILING(1.23);
          -> 2
  mysql> SELECT CEILING(-1.23);
          -> -1
  ```

  Para argumentos numéricos de valor exato, o valor de retorno tem um tipo numérico de valor exato. Para argumentos de string ou de ponto flutuante, o valor de retorno tem um tipo de ponto flutuante.

- `CONV(N, de_base, para_base)`

  Converte números entre diferentes bases numéricas. Retorna uma representação de string do número *`N`*, convertido da base *`from_base`* para a base *`to_base`*. Retorna `NULL` se algum argumento for `NULL`. O argumento *`N`* é interpretado como um inteiro, mas pode ser especificado como um inteiro ou uma string. A base mínima é `2` e a base máxima é `36`. Se *`from_base`* for um número negativo, *`N`* é considerado um número assinado. Caso contrário, *`N`* é tratado como não assinado. A função `CONV()` funciona com precisão de 64 bits.

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

- `COS(X)`

  Retorna o cosseno de *`X`*, onde *`X`* é dado em radianos.

  ```sql
  mysql> SELECT COS(PI());
          -> -1
  ```

- `COT(X)`

  Retorna a cotangente de *`X`*.

  ```sql
  mysql> SELECT COT(12);
          -> -1.5726734063977
  mysql> SELECT COT(0);
          -> out-of-range error
  ```

- `CRC32(expr)`

  Calcula um valor de verificação de redundância cíclica e retorna um valor não assinado de 32 bits. O resultado é `NULL` se o argumento for `NULL`. O argumento deve ser uma string e, se possível, é tratado como uma string se não for.

  ```sql
  mysql> SELECT CRC32('MySQL');
          -> 3259397556
  mysql> SELECT CRC32('mysql');
          -> 2501908538
  ```

- `DEGREES(X)`

  Retorna o argumento *`X`*, convertido de radianos para graus.

  ```sql
  mysql> SELECT DEGREES(PI());
          -> 180
  mysql> SELECT DEGREES(PI() / 2);
          -> 90
  ```

- `EXP(X)`

  Retorna o valor de *e* (a base dos logaritmos naturais) elevado à potência de *`X`*. O inverso desta função é `LOG()` (usando apenas um argumento) ou `LN()`.

  ```sql
  mysql> SELECT EXP(2);
          -> 7.3890560989307
  mysql> SELECT EXP(-2);
          -> 0.13533528323661
  mysql> SELECT EXP(0);
          -> 1
  ```

- `FLOOR(X)`

  Retorna o maior valor inteiro que não seja maior que *`X`*.

  ```sql
  mysql> SELECT FLOOR(1.23), FLOOR(-1.23);
          -> 1, -2
  ```

  Para argumentos numéricos de valor exato, o valor de retorno tem um tipo numérico de valor exato. Para argumentos de string ou de ponto flutuante, o valor de retorno tem um tipo de ponto flutuante.

- `FORMAT(X, D)`

  Formata o número *`X`* para um formato como `'#,###,###.##'`, arredondado a *`D`* casas decimais, e retorna o resultado como uma string. Para detalhes, consulte a Seção 12.8, “Funções e Operadores de String”.

- `HEX(N_or_S)`

  Essa função pode ser usada para obter uma representação hexadecimal de um número decimal ou uma string; a maneira como ela faz isso varia de acordo com o tipo do argumento. Consulte a descrição dessa função na Seção 12.8, “Funções e Operadores de String”, para obter detalhes.

- `LN(X)`

  Retorna o logaritmo natural de *`X`*; ou seja, o logaritmo na base *e* de *`X`*. Se *`X`* for igual ou menor que 0,0E0, a função retorna `NULL` e uma mensagem de aviso “Argumento inválido para logaritmo” é exibida.

  ```sql
  mysql> SELECT LN(2);
          -> 0.69314718055995
  mysql> SELECT LN(-2);
          -> NULL
  ```

  Essa função é sinônima de `LOG(X)`. O inverso dessa função é a função `EXP()`.

- `LOG(X)`, `LOG(B,X)`

  Se chamada com um parâmetro, essa função retorna o logaritmo natural de *`X`*. Se *`X`* for igual ou menor que 0,0E0, a função retorna `NULL` e uma mensagem de aviso “Argumento inválido para logaritmo” é exibida.

  O inverso dessa função (quando chamado com um único argumento) é a função `EXP()`.

  ```sql
  mysql> SELECT LOG(2);
          -> 0.69314718055995
  mysql> SELECT LOG(-2);
          -> NULL
  ```

  Se chamada com dois parâmetros, essa função retorna o logaritmo de *`X`* na base *`B`*. Se *`X`* for igual ou menor que 0 ou se *`B`* for igual ou menor que 1, então `NULL` é retornado.

  ```sql
  mysql> SELECT LOG(2,65536);
          -> 16
  mysql> SELECT LOG(10,100);
          -> 2
  mysql> SELECT LOG(1,100);
          -> NULL
  ```

  `LOG(B, X)` é equivalente a `LOG(X) / LOG(B)`.

- `LOG2(X)`

  Retorna o logaritmo em base 2 de `X`. Se *`X`* for igual ou menor que 0,0E0, a função retorna `NULL` e uma mensagem de aviso "Argumento inválido para logaritmo" é exibida.

  ```sql
  mysql> SELECT LOG2(65536);
          -> 16
  mysql> SELECT LOG2(-100);
          -> NULL
  ```

  `LOG2()` é útil para descobrir quantos bits um número precisa para armazenamento. Essa função é aproximadamente equivalente à expressão `LOG(X) / LOG(2)`.

- `LOG10(X)`

  Retorna o logaritmo na base 10 de *`X`*. Se *`X`* for igual ou menor que 0,0E0, a função retorna `NULL` e uma mensagem de aviso "Argumento inválido para logaritmo" é exibida.

  ```sql
  mysql> SELECT LOG10(2);
          -> 0.30102999566398
  mysql> SELECT LOG10(100);
          -> 2
  mysql> SELECT LOG10(-100);
          -> NULL
  ```

  `LOG10(X)` é aproximadamente equivalente a `LOG(10,X)`.

- `MOD(N, M)`, `N % M`, `N MOD M`

  Operação do módulo. Retorna o resto de *`N`* dividido por *`M`*.

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

  `MOD(N, 0)` retorna `NULL`.

- `PI()`

  Retorna o valor de π (pi). O número padrão de casas decimais exibidas é sete, mas o MySQL usa o valor completo de dupla precisão internamente.

  Como o valor de retorno dessa função é um valor de ponto duplo, sua representação exata pode variar entre plataformas ou implementações. Isso também se aplica a quaisquer expressões que utilizem `PI()`. Consulte a Seção 11.1.4, “Tipos de Ponto Flutuante (Valor Aproximado) - FLOAT, DOUBLE” - FLOAT, DOUBLE").

  ```sql
  mysql> SELECT PI();
          -> 3.141593
  mysql> SELECT PI()+0.000000000000000000;
          -> 3.141592653589793000
  ```

- `POW(X, Y)`

  Retorna o valor de *`X`* elevado à potência de *`Y`*.

  ```sql
  mysql> SELECT POW(2,2);
          -> 4
  mysql> SELECT POW(2,-2);
          -> 0.25
  ```

- `POWER(X,Y)`

  Este é um sinônimo de `POW()`.

- `RADIANOS(X)`

  Retorna o argumento *`X`*, convertido de graus para radianos. (Observe que π radianos equivalem a 180 graus.)

  ```sql
  mysql> SELECT RADIANS(90);
          -> 1.5707963267949
  ```

- `RAND([N])`

  Retorna um valor aleatório de ponto flutuante *`v`* na faixa `0` <= *`v`* < `1.0`. Para obter um número inteiro aleatório *`R`* na faixa *`i`* <= *`R`* < *`j`*, use a expressão [\`FLOOR(i

  - RAND() \* (j`](funções matemáticas.html#função_piso) − `i))`. Por exemplo, para obter um número inteiro aleatório no intervalo `7` <= *`R`* < `12\`, use a seguinte declaração:

  ```sql
  SELECT FLOOR(7 + (RAND() * 5));
  ```

  Se um argumento inteiro *`N`* for especificado, ele será usado como o valor de seed:

  - Com um argumento inicializador constante, a semente é inicializada uma vez quando a instrução é preparada, antes da execução.

  - Com um argumento inicializador não constante (como o nome de uma coluna), a semente é inicializada com o valor para cada invocação do `RAND()`.

  Uma implicação desse comportamento é que, para valores de argumento iguais, `RAND(N)` retorna o mesmo valor cada vez, e, assim, produz uma sequência de valores de coluna repetiível. No exemplo a seguir, a sequência de valores produzida por `RAND(3)` é a mesma em ambos os lugares em que ocorre.

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

  `RAND()` em uma cláusula `WHERE` é avaliado para cada linha (ao selecionar de uma única tabela) ou combinação de linhas (ao selecionar de uma junção de múltiplas tabelas). Assim, para fins de otimizador, `RAND()` não é um valor constante e não pode ser usado para otimizações de índices. Para mais informações, consulte a Seção 8.2.1.18, “Otimização de Chamada de Função”.

  O uso de uma coluna com valores de `RAND()` em uma cláusula `ORDER BY` ou `GROUP BY` pode gerar resultados inesperados, pois, para qualquer uma dessas cláusulas, uma expressão `RAND()` pode ser avaliada várias vezes para a mesma linha, retornando um resultado diferente cada vez. Se o objetivo for recuperar linhas em ordem aleatória, você pode usar uma declaração como esta:

  ```sql
  SELECT * FROM tbl_name ORDER BY RAND();
  ```

  Para selecionar uma amostra aleatória de um conjunto de linhas, combine `ORDER BY RAND()` com `LIMIT`:

  ```sql
  SELECT * FROM table1, table2 WHERE a=b AND c<d ORDER BY RAND() LIMIT 1000;
  ```

  `RAND()` não é um gerador de números aleatórios perfeito. É uma maneira rápida de gerar números aleatórios sob demanda, que é portátil entre plataformas para a mesma versão do MySQL.

  Essa função não é segura para a replicação baseada em instruções. Um aviso é registrado se você usar essa função quando o `binlog_format` estiver configurado para `STATEMENT`.

- `ROUND(X)`, `ROUND(X, D)`

  Arredonda o argumento *`X`* para *`D`* casas decimais. O algoritmo de arredondamento depende do tipo de dados de *`X`*. *`D`* tem o valor padrão de 0 se não for especificado. *`D`* pode ser negativo para fazer com que os dígitos à esquerda da vírgula do valor *`X`* sejam convertidos em zero. O valor absoluto máximo para *`D`* é 30; quaisquer dígitos que excedam 30 (ou -30) são truncados.

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

  - Para números com valor exato, o `ROUND()` usa a regra "arredondar para a metade mais próxima de zero" ou "arredondar para o número inteiro mais próximo": um valor com uma parte fracionária de 0,5 ou maior é arredondado para o número inteiro seguinte se for positivo ou para o número inteiro anterior se for negativo (ou seja, é arredondado para longe de zero). Um valor com uma parte fracionária menor que 0,5 é arredondado para o número inteiro anterior se for positivo ou para o número inteiro seguinte se for negativo.

  - Para números com valor aproximado, o resultado depende da biblioteca C. Em muitos sistemas, isso significa que o `ROUND()` usa a regra "arredondar para o número inteiro mais próximo": um valor com uma parte fracionária exatamente no meio entre dois inteiros é arredondado para o número inteiro mais próximo.

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

- `SIGN(X)`

  Retorna o sinal do argumento como `-1`, `0` ou `1`, dependendo se *`X`* é negativo, zero ou positivo.

  ```sql
  mysql> SELECT SIGN(-32);
          -> -1
  mysql> SELECT SIGN(0);
          -> 0
  mysql> SELECT SIGN(234);
          -> 1
  ```

- `SIN(X)`

  Retorna a função seno de *`X`*, onde *`X`* é fornecido em radianos.

  ```sql
  mysql> SELECT SIN(PI());
          -> 1.2246063538224e-16
  mysql> SELECT ROUND(SIN(PI()));
          -> 0
  ```

- `SQRT(X)`

  Retorna a raiz quadrada de um número não negativo *`X`*.

  ```sql
  mysql> SELECT SQRT(4);
          -> 2
  mysql> SELECT SQRT(20);
          -> 4.4721359549996
  mysql> SELECT SQRT(-16);
          -> NULL
  ```

- `TAN(X)`

  Retorna o tangente de *`X`*, onde *`X`* é dado em radianos.

  ```sql
  mysql> SELECT TAN(PI());
          -> -1.2246063538224e-16
  mysql> SELECT TAN(PI()+1);
          -> 1.5574077246549
  ```

- `TRUNCATE(X, D)`

  Retorna o número *`X`*, truncado para *`D`* casas decimais. Se *`D`* for `0`, o resultado não terá ponto decimal ou parte fracionária. *`D`* pode ser negativo para fazer com que os *`D`* dígitos à esquerda do ponto decimal do valor *`X`* se tornem zero.

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

  Todos os números são arredondados para zero.
