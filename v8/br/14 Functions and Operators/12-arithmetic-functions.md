### 14.6.1 Operadores Aritméticos

**Tabela 14.9 Operadores Aritméticos**

<table><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>%</code>, <code>MOD</code></td> <td> Operador de módulo </td> </tr><tr><td><code>*</code></td> <td> Operador de multiplicação </td> </tr><tr><td><code>+</code></td> <td> Operador de adição </td> </tr><tr><td><code>-</code></td> <td> Operador de subtração </td> </tr><tr><td><code>-</code></td> <td> Altera o sinal do argumento </td> </tr><tr><td><code>/</code></td> <td> Operador de divisão </td> </tr><tr><td><code>DIV</code></td> <td> Divisão inteira </td> </tbody></table>

Os operadores aritméticos usuais estão disponíveis. O resultado é determinado de acordo com as seguintes regras:

* No caso de `-`, `+` e `*`, o resultado é calculado com precisão `BIGINT` - `INTEGER`, `INT`, `SMALLINT`, `TINYINT`, `MEDIUMINT`, `BIGINT") (64 bits) se ambos os operandos forem inteiros.
* Se ambos os operandos forem inteiros e algum deles for não-unificado, o resultado é um inteiro não-unificado. Para a subtração, se o modo `NO_UNSIGNED_SUBTRACTION` (SQL) estiver habilitado, o resultado é assinado mesmo que algum operando seja não-unificado.
* Se algum dos operandos de um `+`, `-`, `/`, `*`, `%` for um valor real ou de string, a precisão do resultado é a precisão do operando com a precisão máxima.
* Na divisão realizada com `/`, a escala do resultado ao usar operandos com valores exatos é a escala do primeiro operando mais o valor da variável de sistema `div_precision_increment` (que é 4 por padrão). Por exemplo, o resultado da expressão `5.05 / 0.014` tem uma escala de seis casas decimais (`360.714286`).

Essas regras são aplicadas para cada operação, de modo que cálculos aninhados implicam na precisão de cada componente. Portanto, `(14620 / 9432456) / (24250 / 9432456)`, resolve primeiro para `(0.0014) / (0.0026)`, com o resultado final tendo 8 casas decimais (`0.60288653`).

Devido a essas regras e à maneira como são aplicadas, é importante garantir que os componentes e subcomponentes de um cálculo utilizem o nível apropriado de precisão. Consulte a Seção 14.10, “Funções e Operadores de Cast”.

Para informações sobre o tratamento de excesso em avaliação de expressões numéricas, consulte a Seção 13.1.7, “Tratamento de Saída de Alcance e Excesso”.

Os operadores aritméticos são aplicados a números. Para outros tipos de valores, operações alternativas podem estar disponíveis. Por exemplo, para adicionar valores de data, use `DATE_ADD()`; consulte a Seção 14.7, “Funções de Data e Hora”.

*  `+`

  Adição:

  ```
  mysql> SELECT 3+5;
          -> 8
  ```
*  `-`

  Subtração:

  ```
  mysql> SELECT 3-5;
          -> -2
  ```
*  `-`

  Menos unário. Este operador altera o sinal do operando.

  ```
  mysql> SELECT - 2;
          -> -2
  ```

  ::: info Nota

  Se este operador for usado com um `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), o valor de retorno também é um `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Isso significa que você deve evitar usar `-` em inteiros que podem ter o valor de −263.


  :::
*  `*`

  Multiplicação:

  ```
  mysql> SELECT 3*5;
          -> 15
  mysql> SELECT 18014398509481984*18014398509481984.0;
          -> 324518553658426726783156020576256.0
  mysql> SELECT 18014398509481984*18014398509481984;
          -> out-of-range error
  ```

  A última expressão produz um erro porque o resultado da multiplicação inteira excede o intervalo de 64 bits de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") cálculos. (Consulte a Seção 13.1, “Tipos de Dados Numéricos”.)
*  `/`

  Divisão:

  ```
  mysql> SELECT 3/5;
          -> 0.60
  ```

  A divisão por zero produz um resultado `NULL`:

  ```
  mysql> SELECT 102/(1-1);
          -> NULL
  ```

  Uma divisão é calculada com aritmética `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") apenas se realizada em um contexto onde seu resultado é convertido para um inteiro.
*  `DIV`

  Divisão inteira. Descarta qualquer parte fracionária à direita do ponto decimal do resultado da divisão.

Se qualquer dos operandos tiver um tipo que não seja inteiro, os operandos são convertidos para `DECIMAL` - DECIMAL, NUMERIC") e divididos usando aritmética `DECIMAL` - DECIMAL, NUMERIC") antes de converter o resultado para `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Se o resultado exceder o intervalo de `BIGINT`, ocorre um erro.

```xrMO3FmIXc
* `N % M`, `N MOD M`

  Operação de módulo. Retorna o resto da divisão de *`N`* por *`M`*. Para mais informações, consulte a descrição da função `MOD()` na Seção 14.6.2, “Funções Matemáticas”.