#### 14.16.7.3 Funções de Propriedade de LineString e MultiLineString

Um `LineString` é composto por valores `Point`. Você pode extrair pontos específicos de um `LineString`, contar o número de pontos que ele contém ou obter seu comprimento.

Algumas funções nesta seção também funcionam para valores de `MultiLineString`.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

- Se qualquer argumento for `NULL` ou se qualquer argumento de geometria for uma geometria vazia, o valor de retorno será `NULL`.

- Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorrerá um erro `ER_GIS_INVALID_DATA`.

- Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorrerá um erro `ER_SRS_NOT_FOUND`.

- Caso contrário, o valor de retorno não é `NULL`.

Essas funções estão disponíveis para obter propriedades de linhas:

- `ST_EndPoint(ls)`

  Retorna o `Point` que é o ponto final do valor `LineString` `ls`.

  `ST_EndPoint()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_EndPoint(ST_GeomFromText(@ls)));
  +----------------------------------------------+
  | ST_AsText(ST_EndPoint(ST_GeomFromText(@ls))) |
  +----------------------------------------------+
  | POINT(3 3)                                   |
  +----------------------------------------------+
  ```

- `ST_IsClosed(ls)`

  Para um valor de `LineString` `ls`, `ST_IsClosed()` retorna 1 se `ls` estiver fechado (ou seja, seus valores de `ST_StartPoint()` e `ST_EndPoint()` forem os mesmos).

  Para um valor de `MultiLineString` `ls`, `ST_IsClosed()` retorna 1 se `ls` estiver fechado (ou seja, os valores de `ST_StartPoint()` e `ST_EndPoint()` forem os mesmos para cada `LineString` em `ls`).

  `ST_IsClosed()` retorna 0 se `ls` não estiver fechado e `NULL` se `ls` estiver `NULL`.

  `ST_IsClosed()` lida com seus argumentos conforme descrito na introdução desta seção, com esta exceção:

  - Se a geometria tiver um valor SRID para um sistema de referência espacial geográfica (SRS), ocorrerá um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

  ```
  mysql> SET @ls1 = 'LineString(1 1,2 2,3 3,2 2)';
  mysql> SET @ls2 = 'LineString(1 1,2 2,3 3,1 1)';

  mysql> SELECT ST_IsClosed(ST_GeomFromText(@ls1));
  +------------------------------------+
  | ST_IsClosed(ST_GeomFromText(@ls1)) |
  +------------------------------------+
  |                                  0 |
  +------------------------------------+

  mysql> SELECT ST_IsClosed(ST_GeomFromText(@ls2));
  +------------------------------------+
  | ST_IsClosed(ST_GeomFromText(@ls2)) |
  +------------------------------------+
  |                                  1 |
  +------------------------------------+

  mysql> SET @ls3 = 'MultiLineString((1 1,2 2,3 3),(4 4,5 5))';

  mysql> SELECT ST_IsClosed(ST_GeomFromText(@ls3));
  +------------------------------------+
  | ST_IsClosed(ST_GeomFromText(@ls3)) |
  +------------------------------------+
  |                                  0 |
  +------------------------------------+
  ```

- `ST_Length(ls [, unit])`

  Retorna um número de ponto flutuante duplo que indica a extensão do valor `LineString` ou `MultiLineString` `ls` em seu sistema de referência espacial associado. A extensão de um valor `MultiLineString` é igual à soma das extensões de seus elementos.

  `ST_Length()` calcula um resultado da seguinte forma:

  - Se a geometria for um `LineString` válido em um SRS cartesiano, o valor de retorno será o comprimento cartesiano da geometria.

  - Se a geometria for um `MultiLineString` válido em um SRS cartesiano, o valor de retorno será a soma das distâncias cartesianas de seus elementos.

  - Se a geometria for um `LineString` válido em um SRS geográfico, o valor de retorno será o comprimento geodésico da geometria nesse SRS, em metros.

  - Se a geometria for um `MultiLineString` válido em um SRS geográfico, o valor de retorno será a soma das distâncias geodésicas de seus elementos nesse SRS, em metros.

  `ST_Length()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

  - Se a geometria não for um `LineString` ou `MultiLineString`, o valor de retorno é `NULL`.

  - Se a geometria for geometricamente inválida, o resultado será uma medida indefinida (ou seja, pode ser qualquer número) ou ocorrerá um erro.

  - Se o resultado da computação do comprimento for `+inf`, ocorrerá um erro `ER_DATA_OUT_OF_RANGE`.

  - Se a geometria tiver um SRS geográfico com uma longitude ou latitude fora do intervalo, ocorrerá um erro:

    - Se um valor de longitude não estiver no intervalo (−180, 180], ocorrerá um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` (`ER_LONGITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

    - Se um valor de latitude não estiver no intervalo \[−90, 90], ocorrerá um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` (`ER_LATITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

    As faixas mostradas são em graus. Os limites exatos das faixas variam ligeiramente devido à aritmética de ponto flutuante.

  A partir do MySQL 8.0.16, `ST_Length()` permite um argumento opcional `unit` que especifica a unidade linear para o valor de comprimento retornado. Essas regras se aplicam:

  - Se uma unidade for especificada, mas não suportada pelo MySQL, ocorrerá um erro `ER_UNIT_NOT_FOUND`.

  - Se uma unidade linear suportada for especificada e o SRID for 0, ocorrerá um erro `ER_GEOMETRY_IN_UNKNOWN_LENGTH_UNIT`.

  - Se uma unidade linear suportada for especificada e o SRID não for 0, o resultado será nessa unidade.

  - Se não for especificado uma unidade, o resultado será na unidade do SRS das geometrias, seja cartesiana ou geográfica. Atualmente, todos os SRSs do MySQL são expressos em metros.

  Uma unidade é suportada se ela for encontrada na tabela `INFORMATION_SCHEMA` `ST_UNITS_OF_MEASURE`. Veja a Seção 28.3.37, “A tabela INFORMATION\_SCHEMA ST\_UNITS\_OF\_MEASURE”.

  ```
  mysql> SET @ls = ST_GeomFromText('LineString(1 1,2 2,3 3)');
  mysql> SELECT ST_Length(@ls);
  +--------------------+
  | ST_Length(@ls)     |
  +--------------------+
  | 2.8284271247461903 |
  +--------------------+

  mysql> SET @mls = ST_GeomFromText('MultiLineString((1 1,2 2,3 3),(4 4,5 5))');
  mysql> SELECT ST_Length(@mls);
  +-------------------+
  | ST_Length(@mls)   |
  +-------------------+
  | 4.242640687119286 |
  +-------------------+

  mysql> SET @ls = ST_GeomFromText('LineString(1 1,2 2,3 3)', 4326);
  mysql> SELECT ST_Length(@ls);
  +-------------------+
  | ST_Length(@ls)    |
  +-------------------+
  | 313701.9623204328 |
  +-------------------+
  mysql> SELECT ST_Length(@ls, 'metre');
  +-------------------------+
  | ST_Length(@ls, 'metre') |
  +-------------------------+
  |       313701.9623204328 |
  +-------------------------+
  mysql> SELECT ST_Length(@ls, 'foot');
  +------------------------+
  | ST_Length(@ls, 'foot') |
  +------------------------+
  |     1029205.9131247795 |
  +------------------------+
  ```

- `ST_NumPoints(ls)`

  Retorna o número de objetos `Point` no valor `LineString` `ls`.

  `ST_NumPoints()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_NumPoints(ST_GeomFromText(@ls));
  +------------------------------------+
  | ST_NumPoints(ST_GeomFromText(@ls)) |
  +------------------------------------+
  |                                  3 |
  +------------------------------------+
  ```

- `ST_PointN(ls, N)`

  Retorna o `N`-ésimo `Point` no valor `Linestring` `ls`. Os pontos são numerados a partir do 1.

  `ST_PointN()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_PointN(ST_GeomFromText(@ls),2));
  +----------------------------------------------+
  | ST_AsText(ST_PointN(ST_GeomFromText(@ls),2)) |
  +----------------------------------------------+
  | POINT(2 2)                                   |
  +----------------------------------------------+
  ```

- `ST_StartPoint(ls)`

  Retorna o `Point` que é o ponto de início do valor `LineString` `ls`.

  `ST_StartPoint()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_StartPoint(ST_GeomFromText(@ls)));
  +------------------------------------------------+
  | ST_AsText(ST_StartPoint(ST_GeomFromText(@ls))) |
  +------------------------------------------------+
  | POINT(1 1)                                     |
  +------------------------------------------------+
  ```
