#### 12.16.7.2 Funções de Propriedade de Point

Um `Point` consiste em coordenadas X e Y, que podem ser obtidas usando as seguintes funções:

* `ST_X(p)`

  Retorna o valor da coordenada X para o objeto `Point` *`p`* como um número de precisão dupla (`double-precision number`).

  ```sql
  mysql> SELECT ST_X(Point(56.7, 53.34));
  +--------------------------+
  | ST_X(Point(56.7, 53.34)) |
  +--------------------------+
  |                     56.7 |
  +--------------------------+
  ```

  `ST_X()` e `X()` são sinônimos.

* `ST_Y(p)`

  Retorna o valor da coordenada Y para o objeto `Point` *`p`* como um número de precisão dupla (`double-precision number`).

  ```sql
  mysql> SELECT ST_Y(Point(56.7, 53.34));
  +--------------------------+
  | ST_Y(Point(56.7, 53.34)) |
  +--------------------------+
  |                    53.34 |
  +--------------------------+
  ```

  `ST_Y()` e `Y()` são sinônimos.

* `X(p)`

  `ST_X()` e `X()` são sinônimos. Para mais informações, consulte a descrição de `ST_X()`.

  `X()` está obsoleto (`deprecated`); espere que seja removido em um futuro lançamento do MySQL. Use `ST_X()` em seu lugar.

* `Y(p)`

  `ST_Y()` e `Y()` são sinônimos. Para mais informações, consulte a descrição de `ST_Y()`.

  `Y()` está obsoleto (`deprecated`); espere que seja removido em um futuro lançamento do MySQL. Use `ST_Y()` em seu lugar.