#### 12.16.7.2 Funções de Propriedade de Pontos

Um ponto é composto por coordenadas X e Y, que podem ser obtidas usando as seguintes funções:

- `ST_X(p)`

  Retorna o valor da coordenada X do objeto `Ponto` *`p`* como um número de precisão dupla.

  ```sql
  mysql> SELECT ST_X(Point(56.7, 53.34));
  +--------------------------+
  | ST_X(Point(56.7, 53.34)) |
  +--------------------------+
  |                     56.7 |
  +--------------------------+
  ```

  `ST_X()` e `X()` são sinônimos.

- `ST_Y(p)`

  Retorna o valor da coordenada Y do objeto `Ponto` *`p`* como um número de precisão dupla.

  ```sql
  mysql> SELECT ST_Y(Point(56.7, 53.34));
  +--------------------------+
  | ST_Y(Point(56.7, 53.34)) |
  +--------------------------+
  |                    53.34 |
  +--------------------------+
  ```

  `ST_Y()` e `Y()` são sinônimos.

- `X(p)`

  `ST_X()` e `X()` são sinônimos. Para mais informações, consulte a descrição de `ST_X()`.

  `X()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_X()`.

- `Y(p)`

  `ST_Y()` e `Y()` são sinônimos. Para mais informações, consulte a descrição de `ST_Y()`.

  `Y()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_Y()` em vez disso.
