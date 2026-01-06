#### 12.16.7.1 Funções de Propriedade Geométrica Geral

As funções listadas nesta seção não restringem seu argumento e aceitam um valor de geometria de qualquer tipo.

- `Dimensão (g)`

  `ST_Dimension()` e `Dimension()` são sinônimos. Para mais informações, consulte a descrição de `ST_Dimension()`.

  `Dimension()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_Dimension()` em vez disso.

- `Envelope(g)`

  `ST_Envelope()` e `Envelope()` são sinônimos. Para mais informações, consulte a descrição de `ST_Envelope()`.

  `Envelope()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_Envelope()` em vez disso.

- `GeometryType(g)`

  `ST_GeometryType()` e `GeometryType()` são sinônimos. Para mais informações, consulte a descrição de `ST_GeometryType()`.

  `GeometryType()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_GeometryType()` em vez disso.

- `IsEmpty(g)`

  `ST_IsEmpty()` e `IsEmpty()` são sinônimos. Para mais informações, consulte a descrição de `ST_IsEmpty()`.

  `IsEmpty()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_IsEmpty()` em vez disso.

- `IsSimple(g)`

  `ST_IsSimple()` e `IsSimple()` são sinônimos. Para mais informações, consulte a descrição de `ST_IsSimple()`.

  `IsSimple()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_IsSimple()` em vez disso.

- `SRID(g)`

  `ST_SRID()` e `SRID()` são sinônimos. Para mais informações, consulte a descrição de `ST_SRID()`.

  `SRID()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_SRID()` em vez disso.

- `ST_Dimension(g)`

  Retorna a dimensão inerente do valor de geometria *`g`*, ou `NULL` se o argumento for `NULL`. A dimensão pode ser -1, 0, 1 ou 2. O significado desses valores está descrito na Seção 11.4.2.2, “Classe de Geometria”.

  ```sql
  mysql> SELECT ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)'));
  +------------------------------------------------------+
  | ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)')) |
  +------------------------------------------------------+
  |                                                    1 |
  +------------------------------------------------------+
  ```

  `ST_Dimension()` e `Dimension()` são sinônimos.

- `ST_Envelope(g)`

  Retorna o retângulo de contorno mínimo (MBR) para o valor de geometria *`g`*, ou `NULL` se o argumento for `NULL`. O resultado é retornado como um valor `Polygon` definido pelos pontos de canto da caixa de contorno:

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

  Se o argumento for um ponto ou um segmento de linha vertical ou horizontal, o `ST_Envelope()` retorna o ponto ou o segmento de linha como seu MBR, em vez de retornar um polígono inválido:

  ```sql
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)'))) |
  +----------------------------------------------------------------+
  | LINESTRING(1 1,1 2)                                            |
  +----------------------------------------------------------------+
  ```

  `ST_Envelope()` e `Envelope()` são sinônimos.

- `ST_GeometryType(g)`

  Retorna uma string binária que indica o nome do tipo de geometria do qual a instância de geometria *`g`* é membro, ou `NULL` se o argumento for `NULL`. O nome corresponde a uma das subclasses instanciáveis de `Geometry`.

  ```sql
  mysql> SELECT ST_GeometryType(ST_GeomFromText('POINT(1 1)'));
  +------------------------------------------------+
  | ST_GeometryType(ST_GeomFromText('POINT(1 1)')) |
  +------------------------------------------------+
  | POINT                                          |
  +------------------------------------------------+
  ```

  `ST_GeometryType()` e `GeometryType()` são sinônimos.

- `ST_IsEmpty(g)`

  Essa função é um marcador que retorna 0 para qualquer valor de geometria válido, 1 para qualquer valor de geometria inválido ou `NULL` se o argumento for `NULL`.

  O MySQL não suporta valores `EMPTY` do SIG, como `POINT EMPTY`.

  `ST_IsEmpty()` e `IsEmpty()` são sinônimos.

- `ST_IsSimple(g)`

  Retorna 1 se o valor de geometria *`g`* não tiver pontos geométricos anômalos, como autointersecção ou autotangência. `ST_IsSimple()` retorna 0 se o argumento não for simples e `NULL` se o argumento for `NULL`.

  As descrições das classes geométricas instanciáveis fornecidas na Seção 11.4.2, “O Modelo de Geometria OpenGIS”, incluem as condições específicas que fazem com que as instâncias da classe sejam classificadas como não simples.

  `ST_IsSimple()` e `IsSimple()` são sinônimos.

- `ST_SRID(g)`

  Retorna um inteiro que indica o ID do sistema de referência espacial associado ao valor de geometria *`g`*, ou `NULL` se o argumento for `NULL`.

  ```sql
  mysql> SELECT ST_SRID(ST_GeomFromText('LineString(1 1,2 2)',101));
  +-----------------------------------------------------+
  | ST_SRID(ST_GeomFromText('LineString(1 1,2 2)',101)) |
  +-----------------------------------------------------+
  |                                                 101 |
  +-----------------------------------------------------+
  ```

  `ST_SRID()` e `SRID()` são sinônimos.
