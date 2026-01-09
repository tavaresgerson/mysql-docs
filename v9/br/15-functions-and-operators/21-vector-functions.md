## 14.21 Funções Vetoriais

O MySQL 9.5 suporta funções SQL para trabalhar com valores `VECTOR`. Essas funções são descritas nesta seção.

**Tabela 14.31 Funções Vetoriais**

<table frame="box" rules="all" summary="Uma referência que lista funções vetoriais."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="vector-functions.html#function_distance"><code>DISTANCE()</code></a></td> <td> Calcula a distância entre dois vetores conforme o método especificado </td> </tr><tr><td><a class="link" href="vector-functions.html#function_string-to-vector"><code>STRING_TO_VECTOR()</code></a></td> <td> Obtém o valor binário da coluna `VECTOR` representada por uma string compatível </td> </tr><tr><td><a class="link" href="vector-functions.html#function_vector-dim"><code>VECTOR_DIM()</code></a></td> <td> Obtém o comprimento de um vetor (ou seja, o número de entradas que ele contém) </td> </tr><tr><td><a class="link" href="vector-functions.html#function_vector-to-string"><code>VECTOR_TO_STRING()</code></a></td> <td> Obtém a representação em string de uma coluna `VECTOR`, dado seu valor como uma string binária </td> </tr></tbody></table>

* `DISTANCE(vetor, vetor, string)`

  Calcula a distância entre dois vetores conforme o método de cálculo especificado. Aceita os seguintes argumentos:

  + Uma coluna de tipo `VECTOR`.
  + Uma consulta de entrada de tipo `VECTOR`.
  + Uma string que especifica a métrica de distância. Os valores suportados são `COSINE`, `DOT` e `EUCLIDEAN`. Como o argumento é uma string, ele deve ser citado.

  `VECTOR_DISTANCE` é um sinônimo desta função.

  Exemplos:

  ```
  mysql> SELECT DISTANCE(STRING_TO_VECTOR("[1.01231, 2.0123123, 3.0123123, 4.01231231]"), STRING_TO_VECTOR("[1, 2, 3, 4]"), "COSINE");
  +-----------------------------------------------------------------------------------------------------------------------+
  | DISTANCE(STRING_TO_VECTOR("[1.01231, 2.0123123, 3.0123123, 4.01231231]"), STRING_TO_VECTOR("[1, 2, 3, 4]"), "COSINE") |
  +-----------------------------------------------------------------------------------------------------------------------+
  |                                                                                              0.0000016689300537109375 |
  +-----------------------------------------------------------------------------------------------------------------------+
  ```

  Nota

`DISTÂNCIA()` está disponível apenas para usuários do MySQL HeatWave em OCI e MySQL AI; não está incluído nas distribuições comerciais ou comunitárias do MySQL.

* `STRING_TO_VECTOR(string)`

  Converte uma representação de string de um vetor para uma binária. O formato esperado da string consiste em uma lista de um ou mais valores de ponto flutuante separados por vírgula, entre colchetes (`[` `]`). Os valores podem ser expressos usando notação decimal ou científica. Como o argumento é uma string, ele deve ser citado.

  `TO_VECTOR()` é um sinônimo para esta função.

  Exemplos:

  ```
  mysql> SELECT STRING_TO_VECTOR("[1.05, -17.8, 32]");
  +---------------------------------------+
  | STRING_TO_VECTOR("[1.05, -17.8, 32]") |
  +---------------------------------------+
  | 0x6666863F66668EC100000042            |
  +---------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT TO_VECTOR("[1.05, -17.8, 32, 123.456]");
  +-----------------------------------------+
  | TO_VECTOR("[1.05, -17.8, 32, 123.456]") |
  +-----------------------------------------+
  | 0x6666863F66668EC10000004279E9F642      |
  +-----------------------------------------+
  1 row in set (0.00 sec)
  ```

  `VECTOR_TO_STRING()` é o inverso desta função:

  ```
  mysql> SELECT VECTOR_TO_STRING(STRING_TO_VECTOR("[1.05, -17.8, 32]"));
  +---------------------------------------------------------+
  | VECTOR_TO_STRING(STRING_TO_VECTOR("[1.05, -17.8, 32]")) |
  +---------------------------------------------------------+
  | [1.05000e+00,-1.78000e+01,3.20000e+01]                  |
  +---------------------------------------------------------+
  1 row in set (0.00 sec)
  ```

  Todos os caracteres de espaço em branco nos valores desse tipo—seguidos por números, precedendo ou seguindo colchetes ou qualquer combinação desses—são limpos antes de serem usados.

* `VECTOR_DIM(vector)`

  Dado um valor da coluna `VECTOR`, esta função retorna o número de entradas que o vetor contém.

  Exemplo:

  ```
  mysql> SELECT VECTOR_DIM(0x0040004000800080);
  +--------------------------------+
  | VECTOR_DIM(0x0040004000800080) |
  +--------------------------------+
  |                              2 |
  +--------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT VECTOR_DIM(TO_VECTOR('[2, 3, 5]') );
  +-------------------------------------+
  | VECTOR_DIM(TO_VECTOR('[2, 3, 5]') ) |
  +-------------------------------------+
  |                                   3 |
  +-------------------------------------+
  1 row in set (0.00 sec)
  ```

  Um argumento para esta função que não pode ser analisado como um valor de vetor levanta um erro.

* `VECTOR_TO_STRING(vector)`

  Dado a representação binária de um valor de coluna `VECTOR`, esta função retorna sua representação de string, que está no mesmo formato descrito para o argumento da função `STRING_TO_VECTOR()`.

  `FROM_VECTOR()` é aceito como um sinônimo para esta função.

  Exemplos:

  ```
  mysql> SELECT VECTOR_TO_STRING(0x00000040000040400000A0400000E040);
  +------------------------------------------------------+
  | VECTOR_TO_STRING(0x00000040000040400000A0400000E040) |
  +------------------------------------------------------+
  | [2.00000e+00,3.00000e+00,5.00000e+00,7.00000e+00]    |
  +------------------------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT FROM_VECTOR(0x00000040000040400000A040);
  +-----------------------------------------+
  | FROM_VECTOR(0x00000040000040400000A040) |
  +-----------------------------------------+
  | [2.00000e+00,3.00000e+00,5.00000e+00]   |
  +-----------------------------------------+
  1 row in set (0.00 sec)
  ```

  Um argumento para esta função que não pode ser analisado como um valor de vetor levanta um erro.

  O tamanho máximo da saída desta função é de 262128 (16 \* 16383) bytes.