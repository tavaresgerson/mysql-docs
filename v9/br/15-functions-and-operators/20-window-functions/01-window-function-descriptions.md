### 14.20.1 Descrições das Funções de Janela

Esta seção descreve as funções de janela não agregadas que, para cada linha de uma consulta, realizam um cálculo usando linhas relacionadas a essa linha. A maioria das funções agregadas também pode ser usada como funções de janela; consulte a Seção 14.19.1, “Descrições das Funções Agregadas”.

Para informações sobre o uso de funções de janela e exemplos, e definições de termos como a cláusula `OVER`, janela, partição, quadro e parceiro, consulte a Seção 14.20.2, “Conceitos e Sintaxe das Funções de Janela”.

**Tabela 14.30 Funções de Janela**

<table frame="box" rules="all" summary="Uma referência que lista funções de janela.">
<col style="width: 28%"/><col style="width: 71%"/>
<thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="window-function-descriptions.html#function_cume-dist"><code class="literal">CUME_DIST()</code></a></td> <td> Valor da distribuição cumulativa </td> </tr><tr><td><a class="link" href="window-function-descriptions.html#function_dense-rank"><code class="literal">DENSE_RANK()</code></a></td> <td> Rank da linha atual dentro de sua partição, sem lacunas </td> </tr><tr><td><a class="link" href="window-function-descriptions.html#function_first-value"><code class="literal">FIRST_VALUE()</code></a></td> <td> Valor do argumento da primeira linha do quadro de janela </td> </tr><tr><td><a class="link" href="window-function-descriptions.html#function_lag"><code class="literal">LAG()</code></a></td> <td> Valor do argumento da linha que está atrasada em relação à linha atual dentro da partição </td> </tr><tr><td><a class="link" href="window-function-descriptions.html#function_last-value"><code class="literal">LAST_VALUE()</code></a></td> <td> Valor do argumento da última linha do quadro de janela </td> </tr><tr><td><a class="link" href="window-function-descriptions.html#function_lead"><code class="literal">LEAD()</code></a></td> <td> Valor do argumento da linha que está à frente da linha atual dentro da partição </td> </tr><tr><td><a class="link" href="window-function-descriptions.html#function_nth-value"><code class="literal">NTH_VALUE()</code></a></td> <td> Valor do argumento da N-ésima linha do quadro de janela </td> </tr><tr><td><a class="link" href="window-function-descriptions.html#function_ntile"><code class="literal">NTILE()</code></a></td> <td> Número do bucket da linha atual dentro de sua partição. </td> </tr><tr><td><a class="link" href="window-function-descriptions.html#function_percent-rank"><code class="literal">PERCENT_RANK()</code></a></td> <td> Valor de classificação percentual </td> </tr><tr><td><a class="link" href="window-function-descriptions.html#function_rank"><code class="literal">RANK()</code></a></td> <td> Rank da linha atual dentro de sua partição, com lacunas </td> </tr><tr><td><a class="link" href="window-function-descriptions.html#function_row-number"><code class="literal">ROW_NUMBER()</code></a></td> <td> Número da linha atual dentro de sua partição </td> </tr></tbody></table>

Nas seguintes descrições de funções, *`over_clause`* representa a cláusula `OVER`, descrita na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”. Algumas funções de janela permitem uma cláusula *`null_treatment`* que especifica como lidar com valores `NULL` ao calcular os resultados. Esta cláusula é opcional. Faz parte do padrão SQL, mas a implementação do MySQL permite apenas `RESPECT NULLS` (que também é o padrão). Isso significa que os valores `NULL` são considerados ao calcular os resultados. `IGNORE NULLS` é analisado, mas produz um erro.

* `CUME_DIST()` *`over_clause`*

Retorna a distribuição cumulativa de um valor dentro de um grupo de valores; ou seja, a porcentagem de valores de partição menores ou iguais ao valor na linha atual. Isso representa o número de linhas que precedem ou são iguais à linha atual na ordem de partição da janela, dividido pelo número total de linhas na partição da janela. Os valores de retorno variam de 0 a 1.

Esta função deve ser usada com `ORDER BY` para ordenar as linhas de partição na ordem desejada. Sem `ORDER BY`, todas as linhas são iguais e têm o valor *`N`/*`N`* = 1, onde *`N`* é o tamanho da partição.

*`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

A seguinte consulta mostra, para o conjunto de valores na coluna `val`, o valor de `CUME_DIST()` para cada linha, bem como o valor de classificação percentual retornado pela função semelhante `PERCENT_RANK()`. Para referência, a consulta também exibe os números das linhas usando `ROW_NUMBER()`:

```
  mysql> SELECT
           val,
           ROW_NUMBER()   OVER w AS 'row_number',
           CUME_DIST()    OVER w AS 'cume_dist',
           PERCENT_RANK() OVER w AS 'percent_rank'
         FROM numbers
         WINDOW w AS (ORDER BY val);
  +------+------------+--------------------+--------------+
  | val  | row_number | cume_dist          | percent_rank |
  +------+------------+--------------------+--------------+
  |    1 |          1 | 0.2222222222222222 |            0 |
  |    1 |          2 | 0.2222222222222222 |            0 |
  |    2 |          3 | 0.3333333333333333 |         0.25 |
  |    3 |          4 | 0.6666666666666666 |        0.375 |
  |    3 |          5 | 0.6666666666666666 |        0.375 |
  |    3 |          6 | 0.6666666666666666 |        0.375 |
  |    4 |          7 | 0.8888888888888888 |         0.75 |
  |    4 |          8 | 0.8888888888888888 |         0.75 |
  |    5 |          9 |                  1 |            1 |
  +------+------------+--------------------+--------------+
  ```

* `DENSE_RANK()` *`over_clause`*

Retorna o ranking da linha atual dentro de sua partição, sem lacunas. Os pares são considerados em empate e recebem o mesmo ranking. Esta função atribui rankings consecutivos aos grupos de pares; o resultado é que grupos de tamanho maior que um não produzem números de ranking não contínuos. Para um exemplo, veja a descrição da função `RANK()`.

Esta função deve ser usada com `ORDER BY` para ordenar as linhas da partição no pedido desejado. Sem `ORDER BY`, todas as linhas são pares.

*`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

* `FIRST_VALUE(expr)` [*`null_treatment`*] *`over_clause`*

Retorna o valor de *`expr`* da primeira linha do quadro de janela.

*`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”. *`null_treatment`* é conforme descrito na introdução da seção.

A seguinte consulta demonstra `FIRST_VALUE()`, `LAST_VALUE()` e duas instâncias de `NTH_VALUE()`:

  ```
  mysql> SELECT
           time, subject, val,
           FIRST_VALUE(val)  OVER w AS 'first',
           LAST_VALUE(val)   OVER w AS 'last',
           NTH_VALUE(val, 2) OVER w AS 'second',
           NTH_VALUE(val, 4) OVER w AS 'fourth'
         FROM observations
         WINDOW w AS (PARTITION BY subject ORDER BY time
                      ROWS UNBOUNDED PRECEDING);
  +----------+---------+------+-------+------+--------+--------+
  | time     | subject | val  | first | last | second | fourth |
  +----------+---------+------+-------+------+--------+--------+
  | 07:00:00 | st113   |   10 |    10 |   10 |   NULL |   NULL |
  | 07:15:00 | st113   |    9 |    10 |    9 |      9 |   NULL |
  | 07:30:00 | st113   |   25 |    10 |   25 |      9 |   NULL |
  | 07:45:00 | st113   |   20 |    10 |   20 |      9 |     20 |
  | 07:00:00 | xh458   |    0 |     0 |    0 |   NULL |   NULL |
  | 07:15:00 | xh458   |   10 |     0 |   10 |     10 |   NULL |
  | 07:30:00 | xh458   |    5 |     0 |    5 |     10 |   NULL |
  | 07:45:00 | xh458   |   30 |     0 |   30 |     10 |     30 |
  | 08:00:00 | xh458   |   25 |     0 |   25 |     10 |     30 |
  +----------+---------+------+-------+------+--------+--------+
  ```

Cada função usa as linhas no quadro atual, que, conforme a definição da janela mostrada, se estende da primeira linha da partição até a linha atual. Para as chamadas `NTH_VALUE()`, o quadro atual nem sempre inclui a linha solicitada; nesses casos, o valor de retorno é `NULL`.

[`LAG(expr [, N[, default]])`](window-function-descriptions.html#function_lag)

  Retorna o valor de *`expr`* da linha que está atrasada (precede) a linha atual por *`N`* linhas dentro de sua partição. Se não houver tal linha, o valor de retorno é *`default`*. Por exemplo, se *`N`* é 3, o valor de retorno é *`default`* para as três primeiras linhas. Se *`N`* ou *`default`* estiverem ausentes, os valores padrão são 1 e `NULL`, respectivamente.

*`N`* deve ser um inteiro não negativo literal. Se *`N`* for 0, *`expr`* é avaliado para a linha atual.

*`N`* não pode ser `NULL` e deve ser um inteiro no intervalo de `0` a `263`, inclusive, em qualquer uma das seguintes formas:

  + um literal constante de inteiro não assinado
  + um marcador de parâmetro posicional (`?`)
  + uma variável definida pelo usuário
  + uma variável local em uma rotina armazenada

  *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”. *`null_treatment`* é conforme descrito na introdução da seção.

  `LAG()` (e a função semelhante `LEAD()`) são frequentemente usadas para calcular diferenças entre linhas. A seguinte consulta mostra um conjunto de observações ordenadas temporalmente e, para cada uma delas, os valores de `LAG()` e `LEAD()` das linhas adjacentes, bem como as diferenças entre as linhas atuais e as adjacentes:

  ```
  mysql> SELECT
           t, val,
           LAG(val)        OVER w AS 'lag',
           LEAD(val)       OVER w AS 'lead',
           val - LAG(val)  OVER w AS 'lag diff',
           val - LEAD(val) OVER w AS 'lead diff'
         FROM series
         WINDOW w AS (ORDER BY t);
  +----------+------+------+------+----------+-----------+
  | t        | val  | lag  | lead | lag diff | lead diff |
  +----------+------+------+------+----------+-----------+
  | 12:00:00 |  100 | NULL |  125 |     NULL |       -25 |
  | 13:00:00 |  125 |  100 |  132 |       25 |        -7 |
  | 14:00:00 |  132 |  125 |  145 |        7 |       -13 |
  | 15:00:00 |  145 |  132 |  140 |       13 |         5 |
  | 16:00:00 |  140 |  145 |  150 |       -5 |       -10 |
  | 17:00:00 |  150 |  140 |  200 |       10 |       -50 |
  | 18:00:00 |  200 |  150 | NULL |       50 |      NULL |
  +----------+------+------+------+----------+-----------+
  ```

  No exemplo, as chamadas `LAG()` e `LEAD()` usam os valores padrão de *`N`* e *`default`* de 1 e `NULL`, respectivamente.

  A primeira linha mostra o que acontece quando não há uma linha anterior para `LAG()`: A função retorna o valor padrão (neste caso, `NULL`). A última linha mostra a mesma coisa quando não há uma próxima linha para `LEAD()`.

  `LAG()` e `LEAD()` também servem para calcular somas em vez de diferenças. Considere este conjunto de dados, que contém os primeiros números da série de Fibonacci:

  ```
  mysql> SELECT n FROM fib ORDER BY n;
  +------+
  | n    |
  +------+
  |    1 |
  |    1 |
  |    2 |
  |    3 |
  |    5 |
  |    8 |
  +------+
  ```

  A seguinte consulta mostra os valores de `LAG()` e `LEAD()` para as linhas adjacentes à linha atual. Também usa essas funções para adicionar ao valor da linha atual os valores das linhas anteriores e seguintes. O efeito é gerar o próximo número na série de Fibonacci e o número seguinte a ele:

  ```
  mysql> SELECT
           n,
           LAG(n, 1, 0)      OVER w AS 'lag',
           LEAD(n, 1, 0)     OVER w AS 'lead',
           n + LAG(n, 1, 0)  OVER w AS 'next_n',
           n + LEAD(n, 1, 0) OVER w AS 'next_next_n'
         FROM fib
         WINDOW w AS (ORDER BY n);
  +------+------+------+--------+-------------+
  | n    | lag  | lead | next_n | next_next_n |
  +------+------+------+--------+-------------+
  |    1 |    0 |    1 |      1 |           2 |
  |    1 |    1 |    2 |      2 |           3 |
  |    2 |    1 |    3 |      3 |           5 |
  |    3 |    2 |    5 |      5 |           8 |
  |    5 |    3 |    8 |      8 |          13 |
  |    8 |    5 |    0 |     13 |           8 |
  +------+------+------+--------+-------------+
  ```

  Uma maneira de gerar o conjunto inicial de números de Fibonacci é usar uma expressão de tabela comum recursiva. Para um exemplo, veja Geração da Série de Fibonacci.

Você não pode usar um valor negativo para o argumento rows desta função.

* `LAST_VALUE(expr)` [*`null_treatment`*] *`over_clause`*

  Retorna o valor de *`expr`* da última linha do quadro de janela.

  *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”. *`null_treatment`* é conforme descrito na introdução da seção.

  Para um exemplo, veja a descrição da função `FIRST_VALUE()`.

[`LEAD(expr [, N[, default]])`](window-function-descriptions.html#function_lead)

  Retorna o valor de *`expr`* da linha que antecede (segue) a linha atual por *`N`* linhas dentro de sua partição. Se não houver tal linha, o valor de retorno é *`default`*. Por exemplo, se *`N`* for 3, o valor de retorno é *`default`* para as três últimas linhas. Se *`N`* ou *`default`* estiverem ausentes, os valores padrão são 1 e `NULL`, respectivamente.

  *`N`* deve ser um inteiro não negativo literal. Se *`N`* for 0, *`expr`* é avaliado para a linha atual.

  *`N`* não pode ser `NULL` e deve ser um inteiro no intervalo `0` a `263`, inclusive, nas seguintes formas:

  + um literal constante de inteiro sem sinal
  + um marcador de parâmetro posicional (`?`)
  + uma variável definida pelo usuário
  + uma variável local em uma rotina armazenada

  *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”. *`null_treatment`* é conforme descrito na introdução da seção.

  Para um exemplo, veja a descrição da função `LAG()`.

  O uso de um valor negativo para o argumento rows desta função não é permitido.

* `NTH_VALUE(expr, N)` [*`from_first_last`*] [*`null_treatment`*] *`over_clause`*

  Retorna o valor de *`expr`* da *`N`*-ésima linha do quadro de janela. Se não houver tal linha, o valor de retorno é `NULL`.

  *`N`* deve ser um inteiro positivo literal.

*`from_first_last`* faz parte do padrão SQL, mas a implementação do MySQL permite apenas `FROM FIRST` (que também é o padrão). Isso significa que os cálculos começam na primeira linha da janela. `FROM LAST` é analisado, mas gera um erro. Para obter o mesmo efeito que `FROM LAST` (começar os cálculos na última linha da janela), use `ORDER BY` para ordenar em ordem inversa.

*`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”. *`null_treatment`* é conforme descrito na introdução da seção.

Para um exemplo, veja a descrição da função `FIRST_VALUE()`.

Você não pode usar `NULL` como argumento de linha desta função.

* `NTILE(N)` *`over_clause`*

Divide a partição em *`N`* grupos (cilíndros), atribui a cada linha na partição seu número de cilindro e retorna o número de cilindro da linha atual dentro de sua partição. Por exemplo, se *`N`* é 4, `NTILE()` divide as linhas em quatro cilindros. Se *`N`* é 100, `NTILE()` divide as linhas em 100 cilindros.

*`N`* deve ser um inteiro positivo literal. Os valores de retorno do número de cilindro variam de 1 a *`N`*.

*`N`* não pode ser `NULL` e deve ser um inteiro no intervalo `0` a `263`, inclusive, nas seguintes formas:

  + um literal constante de inteiro sem sinal
  + um marcador de parâmetro posicional (`?`)
  + uma variável definida pelo usuário
  + uma variável local em uma rotina armazenada

Esta função deve ser usada com `ORDER BY` para ordenar as linhas da partição no pedido desejado.

*`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

A seguinte consulta mostra, para o conjunto de valores na coluna `val`, os valores percentuais resultantes da divisão das linhas em dois ou quatro grupos. Para referência, a consulta também exibe os números de linha usando `ROW_NUMBER()`:

O construtor `NTILE(NULL)` não é permitido.

* `PERCENT_RANK()` *`over_clause`*

  Retorna a porcentagem de valores de partição menores que o valor na linha atual, excluindo o valor mais alto. Os valores de retorno variam de 0 a 1 e representam o rank relativo da linha, calculado como o resultado dessa fórmula, onde *`rank`* é o rank da linha e *`rows`* é o número de linhas de partição:

  ```
  mysql> SELECT
           val,
           ROW_NUMBER() OVER w AS 'row_number',
           NTILE(2)     OVER w AS 'ntile2',
           NTILE(4)     OVER w AS 'ntile4'
         FROM numbers
         WINDOW w AS (ORDER BY val);
  +------+------------+--------+--------+
  | val  | row_number | ntile2 | ntile4 |
  +------+------------+--------+--------+
  |    1 |          1 |      1 |      1 |
  |    1 |          2 |      1 |      1 |
  |    2 |          3 |      1 |      1 |
  |    3 |          4 |      1 |      2 |
  |    3 |          5 |      1 |      2 |
  |    3 |          6 |      2 |      3 |
  |    4 |          7 |      2 |      3 |
  |    4 |          8 |      2 |      4 |
  |    5 |          9 |      2 |      4 |
  +------+------------+--------+--------+
  ```

  Essa função deve ser usada com `ORDER BY` para ordenar as linhas de partição na ordem desejada. Sem `ORDER BY`, todas as linhas são iguais.

  *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

  Para um exemplo, veja a descrição da função `CUME_DIST()`.

* `RANK()` *`over_clause`*

  Retorna o rank da linha atual dentro de sua partição, com lacunas. Linhas iguais são consideradas com empate e recebem o mesmo rank. Essa função não atribui ranks consecutivos a grupos de pares se houver grupos de tamanho maior que um; o resultado são números de rank não contínuos.

  Essa função deve ser usada com `ORDER BY` para ordenar as linhas de partição na ordem desejada. Sem `ORDER BY`, todas as linhas são iguais.

  *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.

A consulta a seguir mostra a diferença entre `RANK()`, que produz classificações com lacunas, e `DENSE_RANK()`, que produz classificações sem lacunas. A consulta mostra os valores de classificação para cada membro de um conjunto de valores na coluna `val`, que contém alguns duplicados. `RANK()` atribui aos pares (os duplicados) o mesmo valor de classificação, e o próximo valor maior tem uma classificação maior em um número de pares menos um. `DENSE_RANK()` também atribui aos pares o mesmo valor de classificação, mas o próximo valor maior tem uma classificação um valor maior. Para referência, a consulta também exibe os números de linha usando `ROW_NUMBER()`:

  ```NTkIrK8s7u
* `ROW_NUMBER()` *`over_clause`*

  Retorna o número da linha atual dentro de sua partição. Os números de linha variam de 1 a o número de linhas da partição.

  `ORDER BY` afeta a ordem em que as linhas são numeradas. Sem `ORDER BY`, a numeração de linhas é não determinística.

  `ROW_NUMBER()` atribui a pares números de linha diferentes. Para atribuir aos pares o mesmo valor, use `RANK()` ou `DENSE_RANK()`. Para um exemplo, veja a descrição da função `RANK()`.

  *`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”.