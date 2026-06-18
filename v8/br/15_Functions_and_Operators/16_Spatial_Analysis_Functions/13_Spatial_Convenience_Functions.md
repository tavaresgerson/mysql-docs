### 14.16.13 Funções de conveniência espacial

As funções nesta seção fornecem operações de conveniência em valores de geometria.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

- Se qualquer argumento for `NULL`, o valor de retorno será `NULL`.

- Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorrerá um erro `ER_GIS_INVALID_DATA`.

- Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorrerá um erro `ER_SRS_NOT_FOUND`.

- Para funções que aceitam múltiplos argumentos de geometria, se esses argumentos não estiverem no mesmo SRS, ocorre um erro `ER_GIS_DIFFERENT_SRIDS`.

- Caso contrário, o valor de retorno não é `NULL`.

Essas funções de conveniência estão disponíveis:

- `ST_Distance_Sphere(g1, g2 [, radius])`

  Retorna a distância esférica mínima entre os argumentos `Point` ou `MultiPoint` em uma esfera, em metros. (Para cálculos de distância de uso geral, consulte a função `ST_Distance()`. O argumento opcional `radius` deve ser fornecido em metros.

  Se ambos os parâmetros de geometria forem valores válidos de Cartesian `Point` ou `MultiPoint` no SRID 0, o valor de retorno será a menor distância entre as duas geometrias em uma esfera com o raio fornecido. Se omitido, o raio padrão é de 6.370.986 metros. As coordenadas dos pontos X e Y são interpretadas como longitude e latitude, respectivamente, em graus.

  Se ambos os parâmetros de geometria forem valores válidos `Point` ou `MultiPoint` em um sistema de referência espacial geográfico (SRS), o valor de retorno será a menor distância entre as duas geometrias em uma esfera com o raio fornecido. Se omitido, o raio padrão será igual ao raio médio, definido como (2a + b)/3, onde a é o eixo semi-maior e b é o eixo semi-menor do SRS.

  `ST_Distance_Sphere()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

  - As combinações de argumentos de geometria suportadas são `Point` e `Point`, ou `Point` e `MultiPoint` (em qualquer ordem de argumento). Se pelo menos uma das geometrias não for `Point` ou `MultiPoint`, e sua SRID for 0, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_CARTESIAN_SRS`. Se pelo menos uma das geometrias não for `Point` ou `MultiPoint`, e sua SRID se refere a um SRS geográfico, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`. Se alguma geometria se referir a um SRS projetado, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_PROJECTED_SRS`.

  - Se qualquer argumento tiver uma longitude ou latitude fora do intervalo, ocorrerá um erro:

    - Se um valor de longitude não estiver no intervalo (−180, 180], ocorrerá um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` (`ER_LONGITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

    - Se um valor de latitude não estiver no intervalo \[−90, 90], ocorrerá um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` (`ER_LATITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

    As faixas mostradas são em graus. Se um SRS usar outra unidade, a faixa usa os valores correspondentes em sua unidade. Os limites exatos da faixa variam ligeiramente devido à aritmética de ponto flutuante.

  - Se o argumento `radius` estiver presente, mas não for positivo, ocorrerá um erro `ER_NONPOSITIVE_RADIUS`.

  - Se a distância exceder o alcance de um número de ponto flutuante duplo, ocorrerá um erro `ER_STD_OVERFLOW_ERROR`.

  ```
  mysql> SET @pt1 = ST_GeomFromText('POINT(0 0)');
  mysql> SET @pt2 = ST_GeomFromText('POINT(180 0)');
  mysql> SELECT ST_Distance_Sphere(@pt1, @pt2);
  +--------------------------------+
  | ST_Distance_Sphere(@pt1, @pt2) |
  +--------------------------------+
  |             20015042.813723423 |
  +--------------------------------+
  ```

- `ST_IsValid(g)`

  Retorna 1 se o argumento for geometricamente válido, 0 se o argumento não for geometricamente válido. A validade geométrica é definida pela especificação OGC.

  A única geometria vazia válida é representada na forma de um valor de coleção de geometria vazia. `ST_IsValid()` retorna 1 nesse caso. O MySQL não suporta valores de SIG `EMPTY` como `POINT EMPTY`.

  `ST_IsValid()` lida com seus argumentos conforme descrito na introdução desta seção, com esta exceção:

  - Se a geometria tiver um SRS geográfico com uma longitude ou latitude fora do intervalo, ocorrerá um erro:

    - Se um valor de longitude não estiver no intervalo (−180, 180], ocorrerá um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` (`ER_LONGITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

    - Se um valor de latitude não estiver no intervalo \[−90, 90], ocorrerá um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` (`ER_LATITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

    As faixas mostradas são em graus. Se um SRS usar outra unidade, a faixa usa os valores correspondentes em sua unidade. Os limites exatos da faixa variam ligeiramente devido à aritmética de ponto flutuante.

  ```
  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,-0.00 0,0.0 0)');
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 0, 1 1)');
  mysql> SELECT ST_IsValid(@ls1);
  +------------------+
  | ST_IsValid(@ls1) |
  +------------------+
  |                0 |
  +------------------+
  mysql> SELECT ST_IsValid(@ls2);
  +------------------+
  | ST_IsValid(@ls2) |
  +------------------+
  |                1 |
  +------------------+
  ```

- `ST_MakeEnvelope(pt1, pt2)`

  Retorna o retângulo que forma o envelope ao redor de dois pontos, como um `Point`, `LineString` ou `Polygon`.

  Os cálculos são feitos usando o sistema de coordenadas cartesianas, e não em uma esfera, esferoide ou na Terra.

  Dado dois pontos `pt1` e `pt2`, o `ST_MakeEnvelope()` cria a geometria de resultado em um plano abstrato assim:

  - Se `pt1` e `pt2` forem iguais, o resultado é o ponto `pt1`.

  - Caso contrário, se `(pt1, pt2)` for um segmento de linha vertical ou horizontal, o resultado será o segmento de linha `(pt1, pt2)`.

  - Caso contrário, o resultado é um polígono usando `pt1` e `pt2` como pontos diagonais.

  A geometria do resultado tem um SRID de 0.

  `ST_MakeEnvelope()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

  - Se os argumentos não forem valores de `Point`, ocorrerá um erro `ER_WRONG_ARGUMENTS`.

  - Uma `ER_GIS_INVALID_DATA` ocorre para a condição adicional de que qualquer valor de coordenada dos dois pontos é infinito ou `NaN`.

  - Se qualquer geometria tiver um valor SRID para um sistema de referência espacial geográfica (SRS), ocorrerá um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

  ```
  mysql> SET @pt1 = ST_GeomFromText('POINT(0 0)');
  mysql> SET @pt2 = ST_GeomFromText('POINT(1 1)');
  mysql> SELECT ST_AsText(ST_MakeEnvelope(@pt1, @pt2));
  +----------------------------------------+
  | ST_AsText(ST_MakeEnvelope(@pt1, @pt2)) |
  +----------------------------------------+
  | POLYGON((0 0,1 0,1 1,0 1,0 0))         |
  +----------------------------------------+
  ```

- `ST_Simplify(g, max_distance)`

  Simplifica uma geometria usando o algoritmo de Douglas-Peucker e retorna um valor simplificado do mesmo tipo.

  A geometria pode ser qualquer tipo de geometria, embora o algoritmo de Douglas-Peucker possa não processar todos os tipos. Uma coleção de geometrias é processada fornecendo seus componentes um por um ao algoritmo de simplificação, e as geometrias retornadas são colocadas em uma coleção de geometrias como resultado.

  O argumento `max_distance` é a distância (em unidades das coordenadas de entrada) de um vértice para outros segmentos a serem removidos. Os vértices dentro dessa distância das linhas simplificadas são removidos.

  De acordo com o Boost.Geometry, as geometrias podem se tornar inválidas como resultado do processo de simplificação, e o processo pode criar autointersecções. Para verificar a validade do resultado, passe-o para `ST_IsValid()`.

  `ST_Simplify()` lida com seus argumentos conforme descrito na introdução desta seção, com esta exceção:

  - Se o argumento `max_distance` não for positivo ou for `NaN`, ocorrerá um erro `ER_WRONG_ARGUMENTS`.

  ```
  mysql> SET @g = ST_GeomFromText('LINESTRING(0 0,0 1,1 1,1 2,2 2,2 3,3 3)');
  mysql> SELECT ST_AsText(ST_Simplify(@g, 0.5));
  +---------------------------------+
  | ST_AsText(ST_Simplify(@g, 0.5)) |
  +---------------------------------+
  | LINESTRING(0 0,0 1,1 1,2 3,3 3) |
  +---------------------------------+
  mysql> SELECT ST_AsText(ST_Simplify(@g, 1.0));
  +---------------------------------+
  | ST_AsText(ST_Simplify(@g, 1.0)) |
  +---------------------------------+
  | LINESTRING(0 0,3 3)             |
  +---------------------------------+
  ```

- `ST_Validate(g)`

  Valida uma geometria de acordo com a especificação OGC. Uma geometria pode ser sintaticamente bem formada (valor WKB mais SRID) mas geometricamente inválida. Por exemplo, este polígono é geometricamente inválido: `POLYGON((0 0, 0 0, 0 0, 0 0, 0 0))`

  `ST_Validate()` retorna a geometria se for sintaticamente bem formada e geométricamente válida, `NULL` se o argumento não for sintaticamente bem formado ou não for geométricamente válido ou for `NULL`.

  `ST_Validate()` pode ser usado para filtrar dados de geometria inválidos, embora isso tenha um custo. Para aplicações que exigem resultados mais precisos, não afetados por dados inválidos, essa penalidade pode valer a pena.

  Se o argumento de geometria for válido, ele é retornado como está, exceto que, se um entrada `Polygon` ou `MultiPolygon` tiver anéis no sentido horário, esses anéis são invertidos antes de verificar a validade. Se a geometria for válida, o valor com os anéis invertidos é retornado.

  A única geometria vazia válida é representada na forma de um valor de coleção de geometria vazia. `ST_Validate()` retorna diretamente, sem mais verificações, neste caso.

  A partir do MySQL 8.0.13, `ST_Validate()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

  - Se a geometria tiver um SRS geográfico com uma longitude ou latitude fora do intervalo, ocorrerá um erro:

    - Se um valor de longitude não estiver no intervalo (−180, 180], ocorrerá um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` (`ER_LONGITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

    - Se um valor de latitude não estiver no intervalo \[−90, 90], ocorrerá um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` (`ER_LATITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

    As faixas mostradas são em graus. Os limites exatos das faixas variam ligeiramente devido à aritmética de ponto flutuante.

  Antes do MySQL 8.0.13, `ST_Validate()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

  - Se a geometria não for sintaticamente bem formada, o valor de retorno será `NULL`. Não ocorrerá um erro `ER_GIS_INVALID_DATA`.

  - Se a geometria tiver um valor SRID para um sistema de referência espacial geográfica (SRS), ocorrerá um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

  ```
  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0)');
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 0, 1 1)');
  mysql> SELECT ST_AsText(ST_Validate(@ls1));
  +------------------------------+
  | ST_AsText(ST_Validate(@ls1)) |
  +------------------------------+
  | NULL                         |
  +------------------------------+
  mysql> SELECT ST_AsText(ST_Validate(@ls2));
  +------------------------------+
  | ST_AsText(ST_Validate(@ls2)) |
  +------------------------------+
  | LINESTRING(0 0,1 1)          |
  +------------------------------+
  ```
