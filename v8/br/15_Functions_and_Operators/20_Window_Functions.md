## 14.20 Funções de janela

O MySQL suporta funções de janela que, para cada linha de uma consulta, realizam um cálculo usando linhas relacionadas a essa linha. As seções seguintes discutem como usar funções de janela, incluindo descrições das cláusulas `OVER` e `WINDOW`. A primeira seção fornece descrições das funções de janela não agregadas. Para descrições das funções de janela agregadas, consulte a Seção 14.19.1, “Descrições de Função Agregada”.

Para informações sobre otimização e funções de janela, consulte a Seção 10.2.1.21, “Otimização da Função de Janela”.

### 14.20.1 Descrição das funções de janela

Esta seção descreve funções de janela não agregadas que, para cada linha de uma consulta, realizam um cálculo usando linhas relacionadas a essa linha. A maioria das funções agregadas também pode ser usada como funções de janela; veja Seção 14.19.1, "Descritores de Função Agregada".

Para informações sobre o uso da função de janela e exemplos, bem como definições de termos como a cláusula `OVER`, janela, partição, quadro e parceiro, consulte a Seção 14.20.2, “Conceitos e sintaxe da função de janela”.

**Tabela 14.30 Funções de janela**

<table frame="box" rules="all" summary="A reference that lists window functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>CUME_DIST()</code></td> <td>Valor da distribuição cumulativa</td> </tr><tr><td><code>DENSE_RANK()</code></td> <td>Classificação da linha atual dentro de sua partição, sem lacunas</td> </tr><tr><td><code>FIRST_VALUE()</code></td> <td>Valor do argumento da primeira linha da moldura da janela</td> </tr><tr><td><code>LAG()</code></td> <td>Valor do argumento de atraso de linha em relação à linha atual dentro da partição</td> </tr><tr><td><code>LAST_VALUE()</code></td> <td>Valor do argumento da última linha da moldura da janela</td> </tr><tr><td><code>LEAD()</code></td> <td>Valor do argumento da linha que precede a linha atual dentro da partição</td> </tr><tr><td><code>NTH_VALUE()</code></td> <td>Valor do argumento da N-ésima linha do quadro de janela</td> </tr><tr><td><code>NTILE()</code></td> <td>Número de balde da linha atual dentro de sua partição.</td> </tr><tr><td><code>PERCENT_RANK()</code></td> <td>Valor de classificação percentual</td> </tr><tr><td><code>RANK()</code></td> <td>Classificação da linha atual dentro de sua partição, com lacunas</td> </tr><tr><td><code>ROW_NUMBER()</code></td> <td>Número da linha atual dentro de sua partição</td> </tr></tbody></table>

Nas seguintes descrições de funções, *`over_clause`* representa a cláusula *`OVER`*, descrita na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”. Algumas funções de janela permitem uma cláusula *`null_treatment`* que especifica como lidar com os valores de *`NULL`* ao calcular os resultados. Esta cláusula é opcional. Faz parte do padrão SQL, mas a implementação do MySQL permite apenas *`RESPECT NULLS`* (que também é o padrão). Isso significa que os valores de *`NULL`* são considerados ao calcular os resultados. *`IGNORE NULLS`* é analisado, mas produz um erro.

* `CUME_DIST()` *`over_clause`*

Retorna a distribuição cumulativa de um valor dentro de um grupo de valores; ou seja, a porcentagem de valores de partição menores ou iguais ao valor na linha atual. Isso representa o número de linhas que precedem ou são iguais à linha atual na ordem de janela da partição da janela, dividido pelo número total de linhas na partição da janela. Os valores de retorno variam de 0 a 1.

Essa função deve ser usada com `ORDER BY` para ordenar as linhas da partição no pedido desejado. Sem `ORDER BY`, todas as linhas são iguais e têm o valor *`N`*/*`N`* = 1, onde *`N`* é o tamanho da partição.

*`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe da Função de Janela”.

A consulta a seguir mostra, para o conjunto de valores na coluna `val`, o valor `CUME_DIST()` para cada linha, bem como o valor da classificação percentual retornado pela função semelhante `PERCENT_RANK()`. Para referência, a consulta também exibe os números de linha usando `ROW_NUMBER()`:

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

Retorna o rank da linha atual dentro de sua partição, sem lacunas. Os pares são considerados em empate e recebem o mesmo rank. Esta função atribui ranks consecutivos aos grupos de pares; o resultado é que grupos de tamanho maior que um não produzem números de rank não contínuos. Para um exemplo, veja a descrição da função `RANK()`.

Essa função deve ser usada com `ORDER BY` para ordenar as linhas da partição no pedido desejado. Sem `ORDER BY`, todas as linhas são iguais.

*`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe da Função de Janela”.

* `FIRST_VALUE(expr)` [*`null_treatment`*] *`over_clause`*

Retorna o valor de *`expr`* da primeira linha do quadro de janela.

*`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe da Função de Janela”. *`null_treatment`* é conforme descrito na introdução da seção.

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

Cada função utiliza as linhas do quadro atual, que, conforme a definição da janela mostrada, se estende da primeira linha de partição até a linha atual. Para as chamadas `NTH_VALUE()`, o quadro atual nem sempre inclui a linha solicitada; nesses casos, o valor de retorno é `NULL`.

* `LAG(expr [, N[, default]])`](window-function-descriptions.html#function_lag) [*`null_treatment`*] *`over_clause`*

Retorna o valor de *`expr`* da linha que está atrasada (antecipada) pela *`N`* linhas dentro de sua partição. Se não houver tal linha, o valor de retorno é *`default`*. Por exemplo, se *`N`* é 3, o valor de retorno é *`default`* para as três primeiras linhas. Se *`N`* ou *`default`* estiverem ausentes, os valores padrão são 1 e `NULL`, respectivamente.

*`N`* deve ser um inteiro não negativo literal. Se *`N`* for 0, *`expr`* é avaliado para a linha atual.

Começando com o MySQL 8.0.22, *`N`* não pode ser `NULL`. Além disso, ele deve agora ser um número inteiro na faixa de `0` a `263`, inclusive, em qualquer uma das seguintes formas:

+ um literal constante de número inteiro não assinado  + um marcador de parâmetro posicional (`?`)  + uma variável definida pelo usuário  + uma variável local em uma rotina armazenada

*`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe da Função de Janela”. *`null_treatment`* é conforme descrito na introdução da seção.

`LAG()` (e a função semelhante `LEAD()` são frequentemente usadas para calcular diferenças entre linhas. A consulta a seguir mostra um conjunto de observações ordenadas temporalmente e, para cada uma delas, os valores `LAG()` e `LEAD()` das linhas adjacentes, bem como as diferenças entre as linhas atuais e as adjacentes:

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

No exemplo, as chamadas de `LAG()` e `LEAD()` utilizam os valores padrão *`N`* e *`default`*, respectivamente, e `NULL` para *`N`* e *`default`*, respectivamente.

A primeira linha mostra o que acontece quando não há uma linha anterior para `LAG()`: A função retorna o valor *`default`* (neste caso, `NULL`). A última linha mostra a mesma coisa quando não há uma próxima linha para `LEAD()`.

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

A seguinte consulta mostra os valores `LAG()` e `LEAD()` das linhas adjacentes à linha atual. Também utiliza essas funções para adicionar ao valor da linha atual os valores das linhas anteriores e seguintes. O efeito é gerar o próximo número da série de Fibonacci e o próximo número após esse:

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

A partir do MySQL 8.0.22, você não pode usar um valor negativo para o argumento linhas desta função.

* `LAST_VALUE(expr)` [*`null_treatment`*] *`over_clause`*

Retorna o valor de *`expr`* da última linha do quadro de janela.

*`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe da Função de Janela”. *`null_treatment`* é conforme descrito na introdução da seção.

Para um exemplo, veja a descrição da função `FIRST_VALUE()`.

* `LEAD(expr [, N[, default]])`](window-function-descriptions.html#function_lead) [*`null_treatment`*] *`over_clause`*

Retorna o valor de *`expr`* da linha que precede (segui) a linha atual por *`N`* linhas dentro de sua partição. Se não houver tal linha, o valor de retorno é *`default`*. Por exemplo, se *`N`* é 3, o valor de retorno é *`default`* para as três últimas linhas. Se *`N`* ou *`default`* estiverem ausentes, os valores padrão são 1 e `NULL`, respectivamente.

*`N`* deve ser um inteiro não negativo literal. Se *`N`* for 0, *`expr`* é avaliado para a linha atual.

Começando com o MySQL 8.0.22, *`N`* não pode ser `NULL`. Além disso, ele deve agora ser um número inteiro na faixa de `0` a `263`, inclusive, em qualquer uma das seguintes formas:

+ um literal constante de número inteiro não assinado  + um marcador de parâmetro posicional (`?`)  + uma variável definida pelo usuário  + uma variável local em uma rotina armazenada

*`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe da Função de Janela”. *`null_treatment`* é conforme descrito na introdução da seção.

Para um exemplo, veja a descrição da função `LAG()`.

Em MySQL 8.0.22 e versões posteriores, o uso de um valor negativo para o argumento linhas desta função não é permitido.

* `NTH_VALUE(expr, N)`](window-function-descriptions.html#function_nth-value) [*`from_first_last`*] [*`null_treatment`*] *`over_clause`*

Retorna o valor de *`expr`* da *`N`*-ª linha do quadro de janela. Se não houver tal linha, o valor de retorno é `NULL`.

*`N`* deve ser um número inteiro positivo literal.

*`from_first_last`* faz parte do padrão SQL, mas a implementação do MySQL permite apenas `FROM FIRST` (que também é o padrão). Isso significa que os cálculos começam na primeira linha da janela. `FROM LAST` é analisado, mas produz um erro. Para obter o mesmo efeito que `FROM LAST` (começar os cálculos na última linha da janela), use `ORDER BY` para ordenar em ordem inversa.

*`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe da Função de Janela”. *`null_treatment`* é conforme descrito na introdução da seção.

Para um exemplo, veja a descrição da função `FIRST_VALUE()`.

Em MySQL 8.0.22 e versões posteriores, você não pode usar `NULL` como argumento da linha desta função.

* `NTILE(N)` *`over_clause`*

Divide uma partição em grupos *`N`* (caixas), atribui a cada linha na partição seu número de caixa e retorna o número de caixa da linha atual dentro de sua partição. Por exemplo, se *`N`* é 4, `NTILE()` divide as linhas em quatro caixas. Se *`N`* é 100, `NTILE()` divide as linhas em 100 caixas.

*`N`* deve ser um número inteiro positivo literal. Os valores de número de bucket variam de 1 a *`N`*.

Começando com o MySQL 8.0.22, *`N`* não pode ser `NULL`, e deve ser um número inteiro na faixa de `0` a `263`, inclusive, em qualquer uma das seguintes formas:

+ um literal constante de número inteiro não assinado  + um marcador de parâmetro posicional (`?`)  + uma variável definida pelo usuário  + uma variável local em uma rotina armazenada

Essa função deve ser usada com `ORDER BY` para ordenar as linhas da partição no pedido desejado.

*`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe da Função de Janela”.

A consulta a seguir mostra, para o conjunto de valores na coluna `val`, os valores percentuais resultantes da divisão das linhas em dois ou quatro grupos. Para referência, a consulta também exibe os números de linha usando `ROW_NUMBER()`:

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

A partir do MySQL 8.0.22, o construtor `NTILE(NULL)` não é mais permitido.

* `PERCENT_RANK()` *`over_clause`*

Retorna a porcentagem de valores de partição menores que o valor da linha atual, excluindo o valor mais alto. Os valores de retorno variam de 0 a 1 e representam o rank relativo da linha, calculado como resultado dessa fórmula, onde *`rank`* é o rank da linha e *`rows`* é o número de linhas de partição:

  ```
  (rank - 1) / (rows - 1)
  ```

Essa função deve ser usada com `ORDER BY` para ordenar as linhas da partição no pedido desejado. Sem `ORDER BY`, todas as linhas são iguais.

*`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe da Função de Janela”.

Para um exemplo, veja a descrição da função `CUME_DIST()`.

* `RANK()` *`over_clause`*

Retorna o rank da linha atual dentro de sua partição, com lacunas. Os pares são considerados em empate e recebem o mesmo rank. Esta função não atribui ranks consecutivos a grupos de pares se houver grupos de tamanho maior que um; o resultado são números de rank não contínuos.

Essa função deve ser usada com `ORDER BY` para ordenar as linhas da partição no pedido desejado. Sem `ORDER BY`, todas as linhas são iguais.

*`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe da Função de Janela”.

A seguinte consulta mostra a diferença entre `RANK()`, que produz classificações com lacunas, e `DENSE_RANK()`, que produz classificações sem lacunas. A consulta mostra os valores de classificação para cada membro de um conjunto de valores na coluna `val`, que contém alguns duplicados. `RANK()` atribui aos pares (os duplicados) o mesmo valor de classificação, e o próximo valor maior tem um rank maior em um número de pares menos um. `DENSE_RANK()` também atribui aos pares o mesmo valor de classificação, mas o próximo valor maior tem um rank um maior. Para referência, a consulta também exibe os números de linha usando `ROW_NUMBER()`:

  ```
  mysql> SELECT
           val,
           ROW_NUMBER() OVER w AS 'row_number',
           RANK()       OVER w AS 'rank',
           DENSE_RANK() OVER w AS 'dense_rank'
         FROM numbers
         WINDOW w AS (ORDER BY val);
  +------+------------+------+------------+
  | val  | row_number | rank | dense_rank |
  +------+------------+------+------------+
  |    1 |          1 |    1 |          1 |
  |    1 |          2 |    1 |          1 |
  |    2 |          3 |    3 |          2 |
  |    3 |          4 |    4 |          3 |
  |    3 |          5 |    4 |          3 |
  |    3 |          6 |    4 |          3 |
  |    4 |          7 |    7 |          4 |
  |    4 |          8 |    7 |          4 |
  |    5 |          9 |    9 |          5 |
  +------+------------+------+------------+
  ```

* `ROW_NUMBER()` *`over_clause`*

Retorna o número da linha atual dentro de sua partição. Os números das linhas variam de 1 até o número de linhas da partição.

`ORDER BY` afeta a ordem em que as linhas são numeradas. Sem `ORDER BY`, a numeração das linhas é não determinística.

`ROW_NUMBER()` atribui números de linha diferentes aos pares. Para atribuir aos pares o mesmo valor, use `RANK()` ou `DENSE_RANK()`. Para um exemplo, veja a descrição da função `RANK()`.

*`over_clause`* é conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe da Função de Janela”.

### 14.20.2 Conceitos e Sintaxe de Funções de Janela

Esta seção descreve como usar funções de janela. Os exemplos utilizam o mesmo conjunto de dados de informações de vendas encontrado na discussão da função `GROUPING()` na Seção 14.19.2, “Modificadores GROUP BY”:

```
mysql> SELECT * FROM sales ORDER BY country, year, product;
+------+---------+------------+--------+
| year | country | product    | profit |
+------+---------+------------+--------+
| 2000 | Finland | Computer   |   1500 |
| 2000 | Finland | Phone      |    100 |
| 2001 | Finland | Phone      |     10 |
| 2000 | India   | Calculator |     75 |
| 2000 | India   | Calculator |     75 |
| 2000 | India   | Computer   |   1200 |
| 2000 | USA     | Calculator |     75 |
| 2000 | USA     | Computer   |   1500 |
| 2001 | USA     | Calculator |     50 |
| 2001 | USA     | Computer   |   1500 |
| 2001 | USA     | Computer   |   1200 |
| 2001 | USA     | TV         |    150 |
| 2001 | USA     | TV         |    100 |
+------+---------+------------+--------+
```

Uma função de janela realiza uma operação semelhante a agregada em um conjunto de linhas de consulta. No entanto, enquanto uma operação agregada agrupa as linhas de consulta em uma única linha de resultado, uma função de janela produz um resultado para cada linha de consulta:

A linha para a qual ocorre a avaliação da função é chamada de linha atual.

* As linhas de consulta relacionadas à linha atual sobre a qual ocorre a avaliação da função compõem a janela da linha atual.

Por exemplo, usando a tabela de informações de vendas, essas duas consultas realizam operações agregadas que produzem uma soma global única para todas as linhas tomadas como um grupo, e somas agrupadas por país:

```
mysql> SELECT SUM(profit) AS total_profit
       FROM sales;
+--------------+
| total_profit |
+--------------+
|         7535 |
+--------------+
mysql> SELECT country, SUM(profit) AS country_profit
       FROM sales
       GROUP BY country
       ORDER BY country;
+---------+----------------+
| country | country_profit |
+---------+----------------+
| Finland |           1610 |
| India   |           1350 |
| USA     |           4575 |
+---------+----------------+
```

Em contraste, as operações de janela não reduzem grupos de linhas de consulta a uma única linha de saída. Em vez disso, elas produzem um resultado para cada linha. Assim como as consultas anteriores, a seguinte consulta usa `SUM()`, mas desta vez como uma função de janela:

```
mysql> SELECT
         year, country, product, profit,
         SUM(profit) OVER() AS total_profit,
         SUM(profit) OVER(PARTITION BY country) AS country_profit
       FROM sales
       ORDER BY country, year, product, profit;
+------+---------+------------+--------+--------------+----------------+
| year | country | product    | profit | total_profit | country_profit |
+------+---------+------------+--------+--------------+----------------+
| 2000 | Finland | Computer   |   1500 |         7535 |           1610 |
| 2000 | Finland | Phone      |    100 |         7535 |           1610 |
| 2001 | Finland | Phone      |     10 |         7535 |           1610 |
| 2000 | India   | Calculator |     75 |         7535 |           1350 |
| 2000 | India   | Calculator |     75 |         7535 |           1350 |
| 2000 | India   | Computer   |   1200 |         7535 |           1350 |
| 2000 | USA     | Calculator |     75 |         7535 |           4575 |
| 2000 | USA     | Computer   |   1500 |         7535 |           4575 |
| 2001 | USA     | Calculator |     50 |         7535 |           4575 |
| 2001 | USA     | Computer   |   1200 |         7535 |           4575 |
| 2001 | USA     | Computer   |   1500 |         7535 |           4575 |
| 2001 | USA     | TV         |    100 |         7535 |           4575 |
| 2001 | USA     | TV         |    150 |         7535 |           4575 |
+------+---------+------------+--------+--------------+----------------+
```

Cada operação de janela na consulta é indicada pela inclusão de uma cláusula `OVER`, que especifica como particionar as linhas da consulta em grupos para processamento pela função de janela:

* A primeira cláusula `OVER` está vazia, o que trata todo o conjunto de linhas de consulta como uma única partição. A função de janela, portanto, produz uma soma global, mas faz isso para cada linha.

* A segunda cláusula `OVER` particiona as linhas por país, produzindo uma soma por partição (por país). A função produz essa soma para cada linha da partição.

As funções de janela são permitidas apenas na lista de seleção e na cláusula `ORDER BY`. As linhas do resultado da consulta são determinadas a partir da cláusula `FROM`, após o processamento de `WHERE`, `GROUP BY` e `HAVING`, e a execução da janela ocorre antes de `ORDER BY`, `LIMIT` e `SELECT DISTINCT`.

A cláusula `OVER` é permitida para muitas funções agregadas, que, portanto, podem ser usadas como funções de janela ou não de janela, dependendo se a cláusula `OVER` está presente ou ausente:

```
AVG()
BIT_AND()
BIT_OR()
BIT_XOR()
COUNT()
JSON_ARRAYAGG()
JSON_OBJECTAGG()
MAX()
MIN()
STDDEV_POP(), STDDEV(), STD()
STDDEV_SAMP()
SUM()
VAR_POP(), VARIANCE()
VAR_SAMP()
```

Para obter detalhes sobre cada função agregada, consulte a Seção 14.19.1, “Descrição das funções agregadas”.

O MySQL também suporta funções não agregadas que são usadas apenas como funções de janela. Para essas funções, a cláusula `OVER` é obrigatória:

```
CUME_DIST()
DENSE_RANK()
FIRST_VALUE()
LAG()
LAST_VALUE()
LEAD()
NTH_VALUE()
NTILE()
PERCENT_RANK()
RANK()
ROW_NUMBER()
```

Para obter detalhes sobre cada função não agregada, consulte a Seção 14.20.1, “Descrição das funções de janela”.

Como exemplo de uma dessas funções de janela não agregadas, esta consulta usa `ROW_NUMBER()`, que produz o número da linha de cada linha dentro de sua partição. Neste caso, as linhas são numeradas por país. Por padrão, as linhas da partição não estão ordenadas e a numeração de linhas não é determinada. Para ordenar as linhas da partição, inclua uma cláusula `ORDER BY` na definição da janela. A consulta usa partições não ordenadas e ordenadas (as colunas `row_num1` e `row_num2`) para ilustrar a diferença entre omitir e incluir `ORDER BY`:

```
mysql> SELECT
         year, country, product, profit,
         ROW_NUMBER() OVER(PARTITION BY country) AS row_num1,
         ROW_NUMBER() OVER(PARTITION BY country ORDER BY year, product) AS row_num2
       FROM sales;
+------+---------+------------+--------+----------+----------+
| year | country | product    | profit | row_num1 | row_num2 |
+------+---------+------------+--------+----------+----------+
| 2000 | Finland | Computer   |   1500 |        2 |        1 |
| 2000 | Finland | Phone      |    100 |        1 |        2 |
| 2001 | Finland | Phone      |     10 |        3 |        3 |
| 2000 | India   | Calculator |     75 |        2 |        1 |
| 2000 | India   | Calculator |     75 |        3 |        2 |
| 2000 | India   | Computer   |   1200 |        1 |        3 |
| 2000 | USA     | Calculator |     75 |        5 |        1 |
| 2000 | USA     | Computer   |   1500 |        4 |        2 |
| 2001 | USA     | Calculator |     50 |        2 |        3 |
| 2001 | USA     | Computer   |   1500 |        3 |        4 |
| 2001 | USA     | Computer   |   1200 |        7 |        5 |
| 2001 | USA     | TV         |    150 |        1 |        6 |
| 2001 | USA     | TV         |    100 |        6 |        7 |
+------+---------+------------+--------+----------+----------+
```

Como mencionado anteriormente, para usar uma função de janela (ou tratar uma função agregada como uma função de janela), inclua uma cláusula `OVER` após a chamada de função. A cláusula `OVER` tem duas formas:

```
over_clause:
    {OVER (window_spec) | OVER window_name}
```

Ambas as formas definem como a função de janela deve processar as linhas da consulta. Elas diferem em se a janela é definida diretamente na cláusula `OVER` ou fornecida por uma referência a uma janela nomeada definida em outro lugar na consulta:

* No primeiro caso, a especificação da janela aparece diretamente na cláusula `OVER`, entre parênteses.

* No segundo caso, *`window_name`* é o nome de uma especificação de janela definida por uma cláusula `WINDOW` em outra parte da consulta. Para detalhes, consulte a Seção 14.20.4, “Janelas Nomeadas”.

Para a sintaxe de `OVER (window_spec)`, a especificação da janela tem várias partes, todas opcionais:

```
window_spec:
    [window_name] [partition_clause] [order_clause] [frame_clause]
```

Se `OVER()` estiver vazio, a janela consiste em todas as linhas da consulta e a função de janela calcula um resultado usando todas as linhas. Caso contrário, as cláusulas presentes entre parênteses determinam quais linhas da consulta são usadas para calcular o resultado da função e como elas são divididas e ordenadas:

* *`window_name`*: O nome de uma janela definida por uma cláusula `WINDOW` em outra parte da consulta. Se *`window_name`* aparecer sozinho dentro da cláusula `OVER`, ela define completamente a janela. Se cláusulas de particionamento, ordenação ou enquadramento também forem fornecidas, elas modificam a interpretação da janela nomeada. Para detalhes, consulte a Seção 14.20.4, “Janelas Nomeadas”.

* *`partition_clause`*: Uma cláusula `PARTITION BY` indica como dividir as linhas da consulta em grupos. O resultado da função de janela para uma determinada linha é baseado nas linhas da partição que contém a linha. Se `PARTITION BY` for omitido, há uma única partição composta por todas as linhas da consulta.

Nota

A partição para funções de janela difere da partição de tabela. Para informações sobre partição de tabela, consulte o Capítulo 26, *Partição*.

*`partition_clause`* tem esta sintaxe:

  ```
  partition_clause:
      PARTITION BY expr [, expr] ...
  ```

O SQL padrão exige que `PARTITION BY` seja seguido apenas por nomes de colunas. Uma extensão do MySQL deve permitir expressões, não apenas nomes de colunas. Por exemplo, se uma tabela contém uma coluna `TIMESTAMP` com o nome `ts`, o SQL padrão permite `PARTITION BY ts`, mas não `PARTITION BY HOUR(ts)`, enquanto o MySQL permite ambos.

* *`order_clause`*: Uma cláusula `ORDER BY` indica como ordenar as linhas em cada partição. As linhas que são iguais de acordo com a cláusula `ORDER BY` são consideradas iguais. Se `ORDER BY` for omitido, as linhas da partição não são ordenadas, sem ordem de processamento implícita, e todas as linhas da partição são iguais.

*`order_clause`* tem esta sintaxe:

  ```
  order_clause:
      ORDER BY expr [ASC|DESC] [, expr [ASC|DESC]] ...
  ```

Cada expressão `ORDER BY` pode ser seguida opcionalmente por `ASC` ou `DESC` para indicar a direção de classificação. O padrão é `ASC` se nenhuma direção for especificada. Os valores `NULL` são classificados primeiro em classificações ascendentes, e por último em classificações descendentes.

Um `ORDER BY` em uma definição de janela é aplicado dentro de partições individuais. Para ordenar o conjunto de resultados como um todo, inclua um `ORDER BY` no nível superior da consulta.

* *`frame_clause`*: Uma estrutura é um subconjunto da partição atual e a cláusula de estrutura especifica como definir o subconjunto. A cláusula de estrutura tem muitas subcláusulas próprias. Para detalhes, consulte a Seção 14.20.3, “Especificação de estrutura da função de janela”.

### 14.20.3 Especificação do Quadro da Função de Janela

A definição de uma janela usada com uma função de janela pode incluir uma cláusula de quadro. Um quadro é um subconjunto da partição atual e a cláusula de quadro especifica como definir o subconjunto.

Os quadros são determinados em relação à linha atual, o que permite que um quadro se mova dentro de uma partição, dependendo da localização da linha atual dentro de sua partição. Exemplos:

* Ao definir um quadro para ser todas as linhas da partição do início até a linha atual, você pode calcular os totais em execução para cada linha.

* Ao definir um quadro que se estenda com *`N`* linhas em ambos os lados da linha atual, você pode calcular médias móveis.

A consulta a seguir demonstra o uso de quadros móveis para calcular totalizações em andamento dentro de cada grupo de valores `level` ordenados cronologicamente, bem como médias móveis calculadas a partir da linha atual e das linhas que a precedem e a seguem imediatamente:

```
mysql> SELECT
         time, subject, val,
         SUM(val) OVER (PARTITION BY subject ORDER BY time
                        ROWS UNBOUNDED PRECEDING)
           AS running_total,
         AVG(val) OVER (PARTITION BY subject ORDER BY time
                        ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING)
           AS running_average
       FROM observations;
+----------+---------+------+---------------+-----------------+
| time     | subject | val  | running_total | running_average |
+----------+---------+------+---------------+-----------------+
| 07:00:00 | st113   |   10 |            10 |          9.5000 |
| 07:15:00 | st113   |    9 |            19 |         14.6667 |
| 07:30:00 | st113   |   25 |            44 |         18.0000 |
| 07:45:00 | st113   |   20 |            64 |         22.5000 |
| 07:00:00 | xh458   |    0 |             0 |          5.0000 |
| 07:15:00 | xh458   |   10 |            10 |          5.0000 |
| 07:30:00 | xh458   |    5 |            15 |         15.0000 |
| 07:45:00 | xh458   |   30 |            45 |         20.0000 |
| 08:00:00 | xh458   |   25 |            70 |         27.5000 |
+----------+---------+------+---------------+-----------------+
```

Para a coluna `running_average`, não há uma linha de quadro antes da primeira ou após a última. Nesses casos, `AVG()` calcula a média das linhas disponíveis.

As funções agregadas usadas como funções de janela operam em linhas no quadro de linha atual, assim como essas funções de janela não agregadas:

```
FIRST_VALUE()
LAST_VALUE()
NTH_VALUE()
```

O SQL padrão especifica que as funções de janela que operam em toda a partição não devem ter uma cláusula de frame. O MySQL permite uma cláusula de frame para tais funções, mas ignora-a. Essas funções usam toda a partição, mesmo que um frame seja especificado:

```
CUME_DIST()
DENSE_RANK()
LAG()
LEAD()
NTILE()
PERCENT_RANK()
RANK()
ROW_NUMBER()
```

A cláusula de enquadramento, se houver, tem esta sintaxe:

```
frame_clause:
    frame_units frame_extent

frame_units:
    {ROWS | RANGE}
```

Na ausência de uma cláusula de quadro, o quadro padrão depende de a presença de uma cláusula `ORDER BY`, conforme descrito mais adiante nesta seção.

O valor *`frame_units`* indica o tipo de relação entre a linha atual e as linhas do quadro:

* `ROWS`: O quadro é definido pelas posições iniciais e finais das linhas. Os deslocamentos são as diferenças nos números das linhas em relação ao número atual da linha.

* `RANGE`: O quadro é definido por linhas dentro de um intervalo de valores. Os deslocamentos são diferenças nos valores das linhas em relação ao valor atual da linha.

O valor *`frame_extent`* indica os pontos de início e fim do quadro. Você pode especificar apenas o início do quadro (neste caso, a linha atual é implicitamente o fim) ou usar `BETWEEN` para especificar ambos os pontos finais do quadro:

```
frame_extent:
    {frame_start | frame_between}

frame_between:
    BETWEEN frame_start AND frame_end

frame_start, frame_end: {
    CURRENT ROW
  | UNBOUNDED PRECEDING
  | UNBOUNDED FOLLOWING
  | expr PRECEDING
  | expr FOLLOWING
}
```

Com a sintaxe `BETWEEN`, *`frame_start`* não deve ocorrer mais tarde do que *`frame_end`*.

Os valores permitidos *`frame_start`* e *`frame_end`* têm esses significados:

* `CURRENT ROW`: Para `ROWS`, o vinculado é a linha atual. Para `RANGE`, o vinculado é os pares da linha atual.

* `UNBOUNDED PRECEDING`: A linha de vinculação é a primeira linha da partição.

* `UNBOUNDED FOLLOWING`: O limite é a última linha da partição.

* `expr PRECEDING`: Para `ROWS`, o limite é *`expr`* linhas antes da linha atual. Para `RANGE`, o limite é as linhas com valores iguais ao valor da linha atual, menos *`expr`*; se o valor da linha atual for `NULL`, o limite é os pares da linha.

Para `expr PRECEDING` (e `expr FOLLOWING`), *`expr`* pode ser um marcador de parâmetro `?` (para uso em uma declaração preparada), um literal numérico não negativo ou um intervalo temporal na forma `INTERVAL val unit`. Para expressões de `INTERVAL`, *`val`* especifica um valor de intervalo não negativo, e *`unit`* é uma palavra-chave que indica as unidades nas quais o valor deve ser interpretado. (Para detalhes sobre os especificadores *`units`* permitidos, consulte a descrição da função `DATE_ADD()` na Seção 14.7, “Funções de Data e Hora”.)

`RANGE` em uma expressão numérica ou temporal *`expr`* requer `ORDER BY` em uma expressão numérica ou temporal, respectivamente.

Exemplos de indicadores válidos `expr PRECEDING` e `expr FOLLOWING`:

  ```
  10 PRECEDING
  INTERVAL 5 DAY PRECEDING
  5 FOLLOWING
  INTERVAL '2:30' MINUTE_SECOND FOLLOWING
  ```

* `expr FOLLOWING`: Para `ROWS`, o limite é *`expr`* linhas após a linha atual. Para `RANGE`, o limite é as linhas com valores iguais ao valor da linha atual mais *`expr`*; se o valor da linha atual é `NULL`, o limite é os pares da linha.

Para os valores permitidos de *`expr`*, consulte a descrição de `expr PRECEDING`.

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

Cada função utiliza as linhas do quadro atual, que, conforme a definição da janela mostrada, se estende da primeira linha de partição até a linha atual. Para as chamadas `NTH_VALUE()`, o quadro atual nem sempre inclui a linha solicitada; nesses casos, o valor de retorno é `NULL`.

Na ausência de uma cláusula de quadro, o quadro padrão depende de a cláusula `ORDER BY` estar presente:

* Com `ORDER BY`: O quadro padrão inclui linhas a partir do início da partição até a linha atual, incluindo todos os pares da linha atual (linhas iguais à linha atual de acordo com a cláusula `ORDER BY`). O padrão é equivalente a esta especificação do quadro:

  ```
  RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ```

* Sem `ORDER BY`: A estrutura padrão inclui todas as linhas de partição (porque, sem `ORDER BY`, todas as linhas de partição são iguais). A estrutura padrão é equivalente a esta especificação de frame:

  ```
  RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ```

Como o quadro padrão difere dependendo da presença ou ausência de `ORDER BY`, adicionar `ORDER BY` a uma consulta para obter resultados determinísticos pode alterar os resultados. (Por exemplo, os valores produzidos por `SUM()` podem mudar.) Para obter os mesmos resultados, mas ordenados por `ORDER BY`, forneça uma especificação de quadro explícita a ser usada, independentemente de `ORDER BY` estar presente.

O significado de uma especificação de quadro pode não ser óbvio quando o valor da linha atual é `NULL`. Supondo que esse seja o caso, esses exemplos ilustram como várias especificações de quadro se aplicam:

* `ORDER BY X ASC RANGE BETWEEN 10 FOLLOWING AND 15 FOLLOWING`

O quadro começa em `NULL` e termina em `NULL`, portanto, inclui apenas as linhas com o valor `NULL`.

* `ORDER BY X ASC RANGE BETWEEN 10 FOLLOWING AND UNBOUNDED FOLLOWING`

O quadro começa em `NULL` e termina no final da partição. Como um `ASC` de classificação coloca os valores de `NULL` primeiro, o quadro é toda a partição.

* `ORDER BY X DESC RANGE BETWEEN 10 FOLLOWING AND UNBOUNDED FOLLOWING`

O quadro começa em `NULL` e termina no final da partição. Como um `DESC` de classificação coloca os valores de `NULL` por último, o quadro é apenas os valores de `NULL`.

* `ORDER BY X ASC RANGE BETWEEN 10 PRECEDING AND UNBOUNDED FOLLOWING`

O quadro começa em `NULL` e termina no final da partição. Como um `ASC` de classificação coloca os valores de `NULL` primeiro, o quadro é toda a partição.

* `ORDER BY X ASC RANGE BETWEEN 10 PRECEDING AND 10 FOLLOWING`

O quadro começa em `NULL` e termina em `NULL`, portanto, inclui apenas as linhas com o valor `NULL`.

* `ORDER BY X ASC RANGE BETWEEN 10 PRECEDING AND 1 PRECEDING`

O quadro começa em `NULL` e termina em `NULL`, portanto, inclui apenas as linhas com o valor `NULL`.

* `ORDER BY X ASC RANGE BETWEEN UNBOUNDED PRECEDING AND 10 FOLLOWING`

O quadro começa no início da partição e para nas linhas com o valor `NULL`. Como uma classificação `ASC` coloca os valores `NULL` primeiro, o quadro é composto apenas pelos valores `NULL`.

### 14.20.4 Windows com nome próprio

As janelas podem ser definidas e receber nomes pelos quais podem ser referenciadas em cláusulas do `OVER`. Para fazer isso, use uma cláusula do `WINDOW`. Se estiver presente em uma consulta, a cláusula do `WINDOW` fica entre as posições das cláusulas do `HAVING` e `ORDER BY`, e tem a seguinte sintaxe:

```
WINDOW window_name AS (window_spec)
    [, window_name AS (window_spec)] ...
```

Para cada definição de janela, *`window_name`* é o nome da janela, e *`window_spec`* é o mesmo tipo de especificação de janela que é dado entre as chaves de uma cláusula `OVER`, conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe da Função de Janela”:

```
window_spec:
    [window_name] [partition_clause] [order_clause] [frame_clause]
```

Uma cláusula `WINDOW` é útil para consultas nas quais múltiplas cláusulas `OVER` definiriam, de outra forma, a mesma janela. Em vez disso, você pode definir a janela uma vez, dar-lhe um nome e referenciar o nome nas cláusulas `OVER`. Considere esta consulta, que define a mesma janela várias vezes:

```
SELECT
  val,
  ROW_NUMBER() OVER (ORDER BY val) AS 'row_number',
  RANK()       OVER (ORDER BY val) AS 'rank',
  DENSE_RANK() OVER (ORDER BY val) AS 'dense_rank'
FROM numbers;
```

A consulta pode ser escrita de forma mais simples usando `WINDOW` para definir a janela uma vez e referenciando a janela pelo nome nas cláusulas `OVER`:

```
SELECT
  val,
  ROW_NUMBER() OVER w AS 'row_number',
  RANK()       OVER w AS 'rank',
  DENSE_RANK() OVER w AS 'dense_rank'
FROM numbers
WINDOW w AS (ORDER BY val);
```

Uma janela nomeada também facilita a experimentação com a definição da janela para ver o efeito nos resultados da consulta. Você só precisa modificar a definição da janela na cláusula `WINDOW`, em vez de múltiplas definições de cláusulas `OVER`.

Se uma cláusula `OVER` usa `OVER (window_name ...)` em vez de `OVER window_name`, a janela nomeada pode ser modificada pela adição de outras cláusulas. Por exemplo, esta consulta define uma janela que inclui particionamento e usa `ORDER BY` nas cláusulas `OVER` para modificar a janela de diferentes maneiras:

```
SELECT
  DISTINCT year, country,
  FIRST_VALUE(year) OVER (w ORDER BY year ASC) AS first,
  FIRST_VALUE(year) OVER (w ORDER BY year DESC) AS last
FROM sales
WINDOW w AS (PARTITION BY country);
```

Uma cláusula `OVER` só pode adicionar propriedades a uma janela nomeada, não modificá-las. Se a definição da janela nomeada incluir uma propriedade de particionamento, ordenamento ou enquadramento, a cláusula `OVER` que se refere ao nome da janela não pode incluir também o mesmo tipo de propriedade ou ocorrerá um erro:

* Este construtor é permitido porque a definição da janela e a cláusula `OVER` que a referenciam não contêm o mesmo tipo de propriedades:

  ```
  OVER (w ORDER BY country)
  ... WINDOW w AS (PARTITION BY country)
  ```

* Este construtor não é permitido porque a cláusula `OVER` especifica `PARTITION BY` para uma janela nomeada que já tem `PARTITION BY`:

  ```
  OVER (w PARTITION BY year)
  ... WINDOW w AS (PARTITION BY country)
  ```

A definição de uma janela nomeada pode começar com *`window_name`* por si só. Nesses casos, referências para frente e para trás são permitidas, mas não ciclos:

* Isso é permitido; contém referências para frente e para trás, mas sem ciclos:

  ```
  WINDOW w1 AS (w2), w2 AS (), w3 AS (w1)
  ```

* Isso não é permitido porque contém um ciclo:

  ```
  WINDOW w1 AS (w2), w2 AS (w3), w3 AS (w1)
  ```

### 14.20.5 Restrições de função de janela

O padrão SQL impõe uma restrição de que as funções de janela não podem ser usadas em declarações `UPDATE` ou `DELETE` para atualizar linhas. É permitido usar tais funções em uma subconsulta dessas declarações (para selecionar linhas).

MySQL não suporta essas funcionalidades das funções de janela:

* Sintaxe `DISTINCT` para funções de janela agregadas.

* Funções de janela aninhadas. * Pontos finais dinâmicos de quadro que dependem do valor da linha atual.

O analisador reconhece essas construções de janela, que, no entanto, não são suportadas:

* O especificador de unidades de quadro `GROUPS` é analisado, mas produz um erro. Apenas `ROWS` e `RANGE` são suportados.

* A cláusula `EXCLUDE` para especificação de quadro é analisada, mas produz um erro.

* `IGNORE NULLS` é analisado, mas produz um erro. Apenas `RESPECT NULLS` é suportado.

* `FROM LAST` é analisado, mas produz um erro. Apenas `FROM FIRST` é suportado.

A partir do MySQL 8.0.28, é suportada um máximo de 127 janelas para um dado `SELECT`. Note que uma única consulta pode usar várias cláusulas `SELECT`, e cada uma dessas cláusulas suporta até 127 janelas. O número de janelas distintas é definido como a soma das janelas nomeadas e quaisquer janelas implícitas especificadas como parte de qualquer cláusula `OVER` de função de janela. Você também deve estar ciente de que consultas que utilizam um número muito grande de janelas podem exigir o aumento do tamanho da pilha de threads padrão (`thread_stack` variável do sistema).