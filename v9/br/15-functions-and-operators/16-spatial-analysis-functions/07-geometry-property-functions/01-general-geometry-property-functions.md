#### 14.16.7.1 Funções de Propriedade de Geometria Geral

As funções listadas nesta seção não restringem seus argumentos e aceitam um valor de geometria de qualquer tipo.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

* Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

* Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial (SRS) indefinido, ocorre um erro `ER_SRS_NOT_FOUND`.

* Se qualquer argumento SRID não estiver dentro do intervalo de um inteiro sem sinal de 32 bits, ocorre um erro `ER_DATA_OUT_OF_RANGE`.

* Se qualquer argumento SRID se referir a um SRS indefinido, ocorre um erro `ER_SRS_NOT_FOUND`.

* Caso contrário, o valor de retorno não é `NULL`.

Estas funções estão disponíveis para obter propriedades de geometria:

* `ST_Dimension(g)`

  Retorna a dimensão inerente do valor de geometria *`g`*. A dimensão pode ser −1, 0, 1 ou 2. O significado desses valores é dado na Seção 13.4.2.2, “Classe de Geometria”.

  `ST_Dimension()` trata seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SELECT ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)'));
  +------------------------------------------------------+
  | ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)')) |
  +------------------------------------------------------+
  |                                                    1 |
  +------------------------------------------------------+
  ```

* `ST_Envelope(g)`

  Retorna o retângulo de contorno mínimo (MBR) para o valor de geometria *`g`*. O resultado é retornado como um valor `Polygon` definido pelos pontos dos cantos da caixa de contorno:

  ```
  POLYGON((MINX MINY, MAXX MINY, MAXX MAXY, MINX MAXY, MINX MINY))
  ```

  ```
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,2 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,2 2)'))) |
  +----------------------------------------------------------------+
  | POLYGON((1 1,2 1,2 2,1 2,1 1))                                 |
  +----------------------------------------------------------------+
  ```

  Se o argumento for um ponto ou um segmento de linha vertical ou horizontal, `ST_Envelope()` retorna o ponto ou o segmento de linha como seu MBR em vez de retornar um polígono inválido:

  ```
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)'))) |
  +----------------------------------------------------------------+
  | LINESTRING(1 1,1 2)                                            |
  +----------------------------------------------------------------+
  ```

  `ST_Envelope()` trata seus argumentos conforme descrito na introdução desta seção, com esta exceção:

+ Se a geometria tiver um valor SRID para um sistema de referência espacial geográfico (SRS), ocorrerá um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

* `ST_GeometryType(g)`

  Retorna uma string binária indicando o nome do tipo de geometria da qual a instância de geometria *`g`* é membro. O nome corresponde a uma das subclasses instanciáveis de `Geometry`.

  `ST_GeometryType()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SELECT ST_GeometryType(ST_GeomFromText('POINT(1 1)'));
  +------------------------------------------------+
  | ST_GeometryType(ST_GeomFromText('POINT(1 1)')) |
  +------------------------------------------------+
  | POINT                                          |
  +------------------------------------------------+
  ```

* `ST_IsEmpty(g)`

  Esta função é um marcador que retorna 1 para um valor de coleção de geometria vazio ou 0 caso contrário.

  O único valor de geometria vazio válido é representado na forma de um valor de coleção de geometria vazia. O MySQL não suporta valores `EMPTY` de SIG como `POINT EMPTY`.

  `ST_IsEmpty()` lida com seus argumentos conforme descrito na introdução desta seção.

* `ST_IsSimple(g)`

  Retorna 1 se o valor de geometria *`g`* for simples de acordo com o padrão *SQL/MM Parte 3: Espacial* da ISO. `ST_IsSimple()` retorna 0 se o argumento não for simples.

  As descrições das classes geométricas instanciáveis dadas na Seção 13.4.2, “O Modelo de Geometria OpenGIS”, incluem as condições específicas que fazem com que as instâncias da classe sejam classificadas como não simples.

  `ST_IsSimple()` lida com seus argumentos conforme descrito na introdução desta seção, com esta exceção:

  + Se a geometria tiver um SRS geográfico com uma longitude ou latitude fora do intervalo, ocorrerá um erro:

    - Se um valor de longitude não estiver no intervalo (−180, 180], ocorrerá um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE`.

    - Se um valor de latitude não estiver no intervalo [−90, 90], ocorrerá um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE`.

Os intervalos mostrados são em graus. Os limites exatos dos intervalos variam ligeiramente devido à aritmética de ponto flutuante.

* `ST_SRID(g [, srid])`

  Com um único argumento representando um objeto de geometria válido *`g`*, `ST_SRID()` retorna um inteiro indicando o ID do sistema de referência espacial (SRS) associado a *`g`*.

  Com o segundo argumento opcional representando um valor válido de SRID, `ST_SRID()` retorna um objeto com o mesmo tipo que seu primeiro argumento com um valor de SRID igual ao segundo argumento. Isso apenas define o valor de SRID do objeto; ele não realiza nenhuma transformação dos valores de coordenadas.

  `ST_SRID()` lida com seus argumentos conforme descrito na introdução desta seção, com esta exceção:

  + Para a sintaxe de um único argumento, `ST_SRID()` retorna o SRID de geometria mesmo se ele se referir a um SRS indefinido. Um erro `ER_SRS_NOT_FOUND` não ocorre.

  `ST_SRID(g, target_srid)` e `ST_Transform(g, target_srid)` diferem da seguinte forma:

  + `ST_SRID()` altera o valor do SRID de geometria sem transformar suas coordenadas.

  + `ST_Transform()` transforma as coordenadas da geometria além de alterar seu valor de SRID.

  ```
  mysql> SET @g = ST_GeomFromText('LineString(1 1,2 2)', 0);
  mysql> SELECT ST_SRID(@g);
  +-------------+
  | ST_SRID(@g) |
  +-------------+
  |           0 |
  +-------------+
  mysql> SET @g = ST_SRID(@g, 4326);
  mysql> SELECT ST_SRID(@g);
  +-------------+
  | ST_SRID(@g) |
  +-------------+
  |        4326 |
  +-------------+
  ```

  É possível criar uma geometria em um SRID específico passando a `ST_SRID()` o resultado de uma das funções específicas do MySQL para criar valores espaciais, juntamente com um valor de SRID. Por exemplo:

  ```
  SET @g1 = ST_SRID(Point(1, 1), 4326);
  ```

  No entanto, esse método cria a geometria no SRID 0, depois a converte para SRID 4326 (WGS 84). Uma alternativa preferível é criar a geometria com o sistema de referência espacial correto desde o início. Por exemplo:

  ```
  SET @g1 = ST_PointFromText('POINT(1 1)', 4326);
  SET @g1 = ST_GeomFromText('POINT(1 1)', 4326);
  ```

  A forma de dois argumentos de `ST_SRID()` é útil para tarefas como corrigir ou alterar o SRS de geometrias que têm um SRID incorreto.