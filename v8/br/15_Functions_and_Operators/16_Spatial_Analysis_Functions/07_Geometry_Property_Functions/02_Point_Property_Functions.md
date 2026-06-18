#### 14.16.7.2 Funções de Propriedade de Pontos

Um `Point` consiste em coordenadas X e Y, que podem ser obtidas usando as funções `ST_X()` e `ST_Y()`, respectivamente. Essas funções também permitem um segundo argumento opcional que especifica um valor de coordenada X ou Y, caso em que o resultado da função é o objeto `Point` do primeiro argumento com a coordenada apropriada modificada para ser igual ao segundo argumento.

Para objetos `Point` que possuem um sistema de referência espacial geográfica (SRS), a longitude e a latitude podem ser obtidas usando as funções `ST_Longitude()` e `ST_Latitude()`, respectivamente. Essas funções também permitem um argumento opcional adicional que especifica um valor de longitude ou latitude, caso em que o resultado da função é o objeto `Point` do primeiro argumento com a longitude ou latitude modificadas para serem iguais ao segundo argumento.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

- Se qualquer argumento for `NULL`, o valor de retorno será `NULL`.

- Se qualquer argumento de geometria for uma geometria válida, mas não um objeto `Point`, ocorrerá um erro `ER_UNEXPECTED_GEOMETRY_TYPE`.

- Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorrerá um erro `ER_GIS_INVALID_DATA`.

- Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorrerá um erro `ER_SRS_NOT_FOUND`.

- Se um argumento de coordenadas X ou Y for fornecido e o valor for `-inf`, `+inf` ou `NaN`, ocorrerá um erro `ER_DATA_OUT_OF_RANGE`.

- Se um valor de longitude ou latitude estiver fora do intervalo, ocorrerá um erro:

  - Se um valor de longitude não estiver no intervalo (−180, 180], ocorrerá um erro `ER_LONGITUDE_OUT_OF_RANGE`.

  - Se um valor de latitude não estiver no intervalo \[−90, 90], ocorrerá um erro `ER_LATITUDE_OUT_OF_RANGE`.

  As faixas mostradas são em graus. Os limites exatos das faixas variam ligeiramente devido à aritmética de ponto flutuante.

- Caso contrário, o valor de retorno não é `NULL`.

Essas funções estão disponíveis para obter propriedades de pontos:

- `ST_Latitude(p [, new_latitude_val])`

  Com um único argumento que representa um objeto válido `Point` `p` que possui um sistema de referência espacial geográfica (SRS), `ST_Latitude()` retorna o valor de latitude de `p` como um número de precisão dupla.

  Com o segundo argumento opcional representando um valor de latitude válido, `ST_Latitude()` retorna um objeto `Point` semelhante ao primeiro argumento, com sua latitude igual ao segundo argumento.

  `ST_Latitude()` lida com seus argumentos conforme descrito na introdução desta seção, com a adição de que, se o objeto `Point` for válido, mas não tiver um SRS geográfico, ocorrerá um erro `ER_SRS_NOT_GEOGRAPHIC`.

  ```
  mysql> SET @pt = ST_GeomFromText('POINT(45 90)', 4326);
  mysql> SELECT ST_Latitude(@pt);
  +------------------+
  | ST_Latitude(@pt) |
  +------------------+
  |               45 |
  +------------------+
  mysql> SELECT ST_AsText(ST_Latitude(@pt, 10));
  +---------------------------------+
  | ST_AsText(ST_Latitude(@pt, 10)) |
  +---------------------------------+
  | POINT(10 90)                    |
  +---------------------------------+
  ```

  Essa função foi adicionada no MySQL 8.0.12.

- `ST_Longitude(p [, new_longitude_val])`

  Com um único argumento que representa um objeto válido `Point` `p` que possui um sistema de referência espacial geográfica (SRS), `ST_Longitude()` retorna o valor da longitude de `p` como um número de precisão dupla.

  Com o segundo argumento opcional representando um valor de longitude válido, `ST_Longitude()` retorna um objeto `Point` semelhante ao primeiro argumento, com sua longitude igual ao segundo argumento.

  `ST_Longitude()` lida com seus argumentos conforme descrito na introdução desta seção, com a adição de que, se o objeto `Point` for válido, mas não tiver um SRS geográfico, ocorrerá um erro `ER_SRS_NOT_GEOGRAPHIC`.

  ```
  mysql> SET @pt = ST_GeomFromText('POINT(45 90)', 4326);
  mysql> SELECT ST_Longitude(@pt);
  +-------------------+
  | ST_Longitude(@pt) |
  +-------------------+
  |                90 |
  +-------------------+
  mysql> SELECT ST_AsText(ST_Longitude(@pt, 10));
  +----------------------------------+
  | ST_AsText(ST_Longitude(@pt, 10)) |
  +----------------------------------+
  | POINT(45 10)                     |
  +----------------------------------+
  ```

  Essa função foi adicionada no MySQL 8.0.12.

- `ST_X(p [, new_x_val])`

  Com um único argumento que representa um objeto válido `Point` `p`, `ST_X()` retorna o valor da coordenada X de `p` como um número de precisão dupla. A partir do MySQL 8.0.12, a coordenada X é considerada como referência ao eixo que aparece primeiro na definição do sistema de referência espacial `Point` (SRS).

  Com o segundo argumento opcional, `ST_X()` retorna um objeto `Point` semelhante ao primeiro argumento, com sua coordenada X igual ao segundo argumento. A partir do MySQL 8.0.12, se o objeto `Point` tiver um SRS geográfico, o segundo argumento deve estar dentro do intervalo adequado para valores de longitude ou latitude.

  `ST_X()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SELECT ST_X(Point(56.7, 53.34));
  +--------------------------+
  | ST_X(Point(56.7, 53.34)) |
  +--------------------------+
  |                     56.7 |
  +--------------------------+
  mysql> SELECT ST_AsText(ST_X(Point(56.7, 53.34), 10.5));
  +-------------------------------------------+
  | ST_AsText(ST_X(Point(56.7, 53.34), 10.5)) |
  +-------------------------------------------+
  | POINT(10.5 53.34)                         |
  +-------------------------------------------+
  ```

- `ST_Y(p [, new_y_val])`

  Com um único argumento que representa um objeto válido `Point` `p`, `ST_Y()` retorna o valor da coordenada Y de `p` como um número de precisão dupla. A partir do MySQL 8.0.12, a coordenada Y é considerada como referência ao eixo que aparece em segundo lugar na definição do sistema de referência espacial `Point` (SRS).

  Com o segundo argumento opcional, `ST_Y()` retorna um objeto `Point` semelhante ao primeiro argumento, com sua coordenada Y igual ao segundo argumento. A partir do MySQL 8.0.12, se o objeto `Point` tiver um SRS geográfico, o segundo argumento deve estar dentro do intervalo adequado para valores de longitude ou latitude.

  `ST_Y()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SELECT ST_Y(Point(56.7, 53.34));
  +--------------------------+
  | ST_Y(Point(56.7, 53.34)) |
  +--------------------------+
  |                    53.34 |
  +--------------------------+
  mysql> SELECT ST_AsText(ST_Y(Point(56.7, 53.34), 10.5));
  +-------------------------------------------+
  | ST_AsText(ST_Y(Point(56.7, 53.34), 10.5)) |
  +-------------------------------------------+
  | POINT(56.7 10.5)                          |
  +-------------------------------------------+
  ```
