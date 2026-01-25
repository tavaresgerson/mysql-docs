### 12.6.1 Operadores Aritméticos

**Tabela 12.9 Operadores Aritméticos**

<table frame="box" rules="all" summary="Uma referência que lista operadores aritméticos."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>%</code>, <code>MOD</code></td> <td> Operador de módulo </td> </tr><tr><td><code>*</code></td> <td> Operador de multiplicação </td> </tr><tr><td><code>+</code></td> <td> Operador de adição </td> </tr><tr><td><code>-</code></td> <td> Operador de subtração </td> </tr><tr><td><code>-</code></td> <td> Muda o sinal do argumento </td> </tr><tr><td><code>/</code></td> <td> Operador de divisão </td> </tr><tr><td><code>DIV</code></td> <td> Divisão inteira </td> </tr> </tbody></table>

Os operadores aritméticos usuais estão disponíveis. O resultado é determinado de acordo com as seguintes regras:

* No caso de `-`, `+` e `*`, o resultado é calculado com precisão `BIGINT` (64-bit) se ambos os operandos forem integers.

* Se ambos os operandos forem integers e qualquer um deles for unsigned, o resultado é um integer unsigned. Para a subtração, se o modo SQL `NO_UNSIGNED_SUBTRACTION` estiver habilitado, o resultado é signed mesmo que qualquer operando seja unsigned.

* Se qualquer um dos operandos de `+`, `-`, `/`, `*`, `%` for um valor real ou string, a precisão do resultado é a precisão do operando com a precisão máxima.

* Na divisão realizada com `/`, a scale do resultado ao usar dois operandos de valor exato é a scale do primeiro operando mais o valor da variável de sistema `div_precision_increment` (que é 4 por padrão). Por exemplo, o resultado da expressão `5.05 / 0.014` tem uma scale de seis casas decimais (`360.714286`).

Essas regras são aplicadas para cada operação, de modo que cálculos aninhados implicam a precisão de cada componente. Assim, `(14620 / 9432456) / (24250 / 9432456)` se resolve primeiro para `(0.0014) / (0.0026)`, com o resultado final tendo 8 casas decimais (`0.60288653`).

Devido a essas regras e à maneira como são aplicadas, deve-se ter cuidado para garantir que os componentes e subcomponentes de um cálculo usem o nível de precisão apropriado. Consulte a Seção 12.10, “Funções e Operadores Cast”.

Para obter informações sobre o tratamento de overflow na avaliação de expressões numéricas, consulte a Seção 11.1.7, “Tratamento de Valores Fora do Range e Overflow”.

Os operadores aritméticos se aplicam a números. Para outros tipos de valores, operações alternativas podem estar disponíveis. Por exemplo, para adicionar valores de date, use `DATE_ADD()`; consulte a Seção 12.7, “Funções de Data e Hora”.

* `+`

  Adição:

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

  Menos unário. Este operador muda o sinal do operando.

  ```sql
  mysql> SELECT - 2;
          -> -2
  ```

  Nota

  Se este operador for usado com um `BIGINT`, o valor de retorno também é um `BIGINT`. Isso significa que você deve evitar usar `-` em integers que possam ter o valor de −263.

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

  A última expressão produz um erro porque o resultado da multiplicação de integers excede o range de 64 bits de cálculos `BIGINT`. (Consulte a Seção 11.1, “Tipos de Dados Numéricos”.)

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

  Uma divisão é calculada com aritmética `BIGINT` apenas se for realizada em um contexto onde seu resultado é convertido para um integer.

* `DIV`

  Divisão inteira. Descarta do resultado da divisão qualquer parte fracionária à direita do ponto decimal.

  Se qualquer operando tiver um tipo não integer, os operandos são convertidos para `DECIMAL` e divididos usando aritmética `DECIMAL` antes de converter o resultado para `BIGINT`. Se o resultado exceder o range `BIGINT`, ocorre um erro.

  ```sql
  mysql> SELECT 5 DIV 2, -5 DIV 2, 5 DIV -2, -5 DIV -2;
          -> 2, -2, -2, 2
  ```

* `N % M`, `N MOD M`

  Operação de módulo. Retorna o resto de *`N`* dividido por *`M`*. Para obter mais informações, consulte a descrição da função `MOD()` na Seção 12.6.2, “Funções Matemáticas”.