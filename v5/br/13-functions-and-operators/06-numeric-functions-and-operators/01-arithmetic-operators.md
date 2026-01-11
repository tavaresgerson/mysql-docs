### 12.6.1 Operadores aritméticos

**Tabela 12.9 Operadores Aritméticos**

<table frame="box" rules="all" summary="Uma referência que lista operadores aritméticos."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>%</code>, <code>MOD</code></td> <td>Operador módulo</td> </tr><tr><td><code>*</code></td> <td>Operador de multiplicação</td> </tr><tr><td><code>+</code></td> <td>Operador de adição</td> </tr><tr><td><code>-</code></td> <td>Operador de menos</td> </tr><tr><td><code>-</code></td> <td>Troque o sinal do argumento</td> </tr><tr><td><code>/</code></td> <td>Operador de divisão</td> </tr><tr><td><code>DIV</code></td> <td>Divisão inteira</td> </tr></tbody></table>

Os operadores aritméticos usuais estão disponíveis. O resultado é determinado de acordo com as seguintes regras:

- No caso de `-`, `+` e `*`, o resultado é calculado com precisão `BIGINT` - `INTEGER`, `INT`, `SMALLINT`, `TINYINT`, `MEDIUMINT`, `BIGINT` (64 bits) se ambos os operandos forem inteiros.

- Se ambos os operandos forem inteiros e algum deles for não assinado, o resultado será um inteiro não assinado. Para a subtração, se o modo SQL `NO_UNSIGNED_SUBTRACTION` estiver habilitado, o resultado será assinado, mesmo que algum dos operandos seja não assinado.

- Se qualquer dos operandos de um `+`, `-`, `/`, `*`, `%` for um valor real ou de string, a precisão do resultado será a precisão do operando com a precisão máxima.

- Na divisão realizada com `/`, a escala do resultado ao usar dois operadores de valor exato é a escala do primeiro operador mais o valor da variável de sistema `div_precision_increment` (que é 4 por padrão). Por exemplo, o resultado da expressão `5,05 / 0,014` tem uma escala de seis casas decimais (`360,714286`).

Essas regras são aplicadas para cada operação, de modo que cálculos aninhados implicam na precisão de cada componente. Portanto, `(14620 / 9432456) / (24250 / 9432456)`, resolve primeiro para `(0,0014) / (0,0026)`, com o resultado final tendo 8 casas decimais (`0,60288653`).

Devido a essas regras e à maneira como elas são aplicadas, é importante ter cuidado para garantir que os componentes e subcomponentes de um cálculo utilizem o nível de precisão apropriado. Consulte a Seção 12.10, “Funções e Operadores de Casting”.

Para obter informações sobre o tratamento de excesso em avaliação de expressões numéricas, consulte a Seção 11.1.7, “Tratamento de Saída de Alcance e Excesso”.

Os operadores aritméticos são aplicados a números. Para outros tipos de valores, podem estar disponíveis operações alternativas. Por exemplo, para adicionar valores de data, use `DATE_ADD()`; veja a Seção 12.7, “Funções de Data e Hora”.

- `+`

  Acessório:

  ```sql
  mysql> SELECT 3+5;
          -> 8
  ```

- `-`

  Subtração:

  ```sql
  mysql> SELECT 3-5;
          -> -2
  ```

- `-`

  Mínus unário. Esse operador altera o sinal do operando.

  ```sql
  mysql> SELECT - 2;
          -> -2
  ```

  Nota

  Se este operador for usado com um `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), o valor de retorno também será um `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Isso significa que você deve evitar usar `-` em inteiros que possam ter o valor de −263.

- `*`

  Multiplicação:

  ```sql
  mysql> SELECT 3*5;
          -> 15
  mysql> SELECT 18014398509481984*18014398509481984.0;
          -> 324518553658426726783156020576256.0
  mysql> SELECT 18014398509481984*18014398509481984;
          -> out-of-range error
  ```

  A última expressão produz um erro porque o resultado da multiplicação inteira excede o intervalo de 64 bits de cálculos `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). (Veja a Seção 11.1, "Tipos de Dados Numéricos").

- `/`

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

- `DIV`

  Divisão inteira. O resultado da divisão descarta qualquer parte fracionária à direita do ponto decimal.

  Se qualquer dos operandos tiver um tipo que não seja inteiro, os operandos são convertidos para `DECIMAL` - DECIMAL, NUMERIC") e divididos usando aritmética `DECIMAL` - DECIMAL, NUMERIC") antes de converter o resultado para `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Se o resultado exceder o intervalo de `BIGINT`, ocorre um erro.

  ```sql
  mysql> SELECT 5 DIV 2, -5 DIV 2, 5 DIV -2, -5 DIV -2;
          -> 2, -2, -2, 2
  ```

- `N % M`, `N MOD M`

  Operação do módulo. Retorna o resto de *`N`* dividido por *`M`*. Para mais informações, consulte a descrição da função `MOD()` na Seção 12.6.2, “Funções Matemáticas”.
