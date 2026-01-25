#### 12.16.7.1 Funções de Propriedades Gerais de Geometry

As funções listadas nesta seção não restringem seus argumentos e aceitam um valor de Geometry de qualquer tipo.

* `Dimension(g)`

  `ST_Dimension()` e `Dimension()` são sinônimos. Para mais informações, consulte a descrição de `ST_Dimension()`.

  `Dimension()` está descontinuada (deprecated); espera-se que seja removida em uma futura versão do MySQL. Use `ST_Dimension()` em vez disso.

* `Envelope(g)`

  `ST_Envelope()` e `Envelope()` são sinônimos. Para mais informações, consulte a descrição de `ST_Envelope()`.

  `Envelope()` está descontinuada (deprecated); espera-se que seja removida em uma futura versão do MySQL. Use `ST_Envelope()` em vez disso.

* `GeometryType(g)`

  `ST_GeometryType()` e `GeometryType()` são sinônimos. Para mais informações, consulte a descrição de `ST_GeometryType()`.

  `GeometryType()` está descontinuada (deprecated); espera-se que seja removida em uma futura versão do MySQL. Use `ST_GeometryType()` em vez disso.

* `IsEmpty(g)`

  `ST_IsEmpty()` e `IsEmpty()` são sinônimos. Para mais informações, consulte a descrição de `ST_IsEmpty()`.

  `IsEmpty()` está descontinuada (deprecated); espera-se que seja removida em uma futura versão do MySQL. Use `ST_IsEmpty()` em vez disso.

* `IsSimple(g)`

  `ST_IsSimple()` e `IsSimple()` são sinônimos. Para mais informações, consulte a descrição de `ST_IsSimple()`.

  `IsSimple()` está descontinuada (deprecated); espera-se que seja removida em uma futura versão do MySQL. Use `ST_IsSimple()` em vez disso.

* `SRID(g)`

  `ST_SRID()` e `SRID()` são sinônimos. Para mais informações, consulte a descrição de `ST_SRID()`.

  `SRID()` está descontinuada (deprecated); espera-se que seja removida em uma futura versão do MySQL. Use `ST_SRID()` em vez disso.

* `ST_Dimension(g)`

  Retorna a dimensão inerente do valor de Geometry *`g`*, ou `NULL` se o argumento for `NULL`. A dimensão pode ser −1, 0, 1 ou 2. O significado desses valores é fornecido na Seção 11.4.2.2, “Geometry Class”.

  ```sql
  mysql> SELECT ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)'));
  +------------------------------------------------------+
  | ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)')) |
  +------------------------------------------------------+
  |                                                    1 |
  +------------------------------------------------------+
  ```

  `ST_Dimension()` e `Dimension()` são sinônimos.

* `ST_Envelope(g)`

  Retorna o retângulo delimitador mínimo (MBR - Minimum Bounding Rectangle) para o valor de Geometry *`g`*, ou `NULL` se o argumento for `NULL`. O resultado é retornado como um valor `Polygon` que é definido pelos pontos de canto da caixa delimitadora (bounding box):

  ```sql
  POLYGON((MINX MINY, MAXX MINY, MAXX MAXY, MINX MAXY, MINX MINY))
  ```

  ```sql
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,2 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,2 2)'))) |
  +----------------------------------------------------------------+
  | POLYGON((1 1,2 1,2 2,1 2,1 1))                                 |
  +----------------------------------------------------------------+
  ```

  Se o argumento for um ponto ou um segmento de linha vertical ou horizontal, `ST_Envelope()` retorna o ponto ou o segmento de linha como seu MBR, em vez de retornar um Polygon inválido:

  ```sql
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)'))) |
  +----------------------------------------------------------------+
  | LINESTRING(1 1,1 2)                                            |
  +----------------------------------------------------------------+
  ```

  `ST_Envelope()` e `Envelope()` são sinônimos.

* `ST_GeometryType(g)`

  Retorna uma string binária indicando o nome do tipo de Geometry do qual a instância de Geometry *`g`* é um membro, ou `NULL` se o argumento for `NULL`. O nome corresponde a uma das subclasses instanciáveis de `Geometry`.

  ```sql
  mysql> SELECT ST_GeometryType(ST_GeomFromText('POINT(1 1)'));
  +------------------------------------------------+
  | ST_GeometryType(ST_GeomFromText('POINT(1 1)')) |
  +------------------------------------------------+
  | POINT                                          |
  +------------------------------------------------+
  ```

  `ST_GeometryType()` e `GeometryType()` são sinônimos.

* `ST_IsEmpty(g)`

  Esta função é um placeholder que retorna 0 para qualquer valor de Geometry válido, 1 para qualquer valor de Geometry inválido, ou `NULL` se o argumento for `NULL`.

  O MySQL não suporta valores GIS `EMPTY` como `POINT EMPTY`.

  `ST_IsEmpty()` e `IsEmpty()` são sinônimos.

* `ST_IsSimple(g)`

  Retorna 1 se o valor de Geometry *`g`* não tiver pontos geométricos anômalos, como autointerseção ou autotangência. `ST_IsSimple()` retorna 0 se o argumento não for simples e `NULL` se o argumento for `NULL`.

  As descrições das classes geométricas instanciáveis fornecidas na Seção 11.4.2, “The OpenGIS Geometry Model”, incluem as condições específicas que fazem com que as instâncias de classe sejam classificadas como não simples.

  `ST_IsSimple()` e `IsSimple()` são sinônimos.

* `ST_SRID(g)`

  Retorna um inteiro indicando o ID do sistema de referência espacial (SRID) associado ao valor de Geometry *`g`*, ou `NULL` se o argumento for `NULL`.

  ```sql
  mysql> SELECT ST_SRID(ST_GeomFromText('LineString(1 1,2 2)',101));
  +-----------------------------------------------------+
  | ST_SRID(ST_GeomFromText('LineString(1 1,2 2)',101)) |
  +-----------------------------------------------------+
  |                                                 101 |
  +-----------------------------------------------------+
  ```

  `ST_SRID()` e `SRID()` são sinônimos.