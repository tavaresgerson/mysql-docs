### 14.16.13 Funções de Conveniência Espacial

As funções nesta seção fornecem operações de conveniência em valores de geometria.

A menos que especificado de outra forma, as funções nesta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.
* Se qualquer argumento de geometria não for um argumento de geometria sintaticamente bem formado, ocorre um erro `ER_GIS_INVALID_DATA`.
* Se qualquer argumento de geometria for um argumento de geometria sintaticamente bem formado em um sistema de referência espacial (SRS) indefinido, ocorre um erro `ER_SRS_NOT_FOUND`.
* Para funções que aceitam múltiplos argumentos de geometria, se esses argumentos não estiverem no mesmo SRS, ocorre um erro `ER_GIS_DIFFERENT_SRIDS`.
* Caso contrário, o valor de retorno não é `NULL`.

Estas funções de conveniência estão disponíveis:

* `ST_Distance_Sphere(g1, g2 [, radius])`

  Retorna a distância esférica mínima entre os argumentos `Point` ou `MultiPoint` em uma esfera, em metros. (Para cálculos de distância de propósito geral, consulte a função `ST_Distance()`. O argumento opcional *`radius`* deve ser fornecido em metros.)

  Se ambos os parâmetros de geometria forem valores válidos de `Point` ou `MultiPoint` cartesianos em SRID 0, o valor de retorno é a menor distância entre as duas geometrias em uma esfera com o raio fornecido. Se omitido, o raio padrão é de 6.370.986 metros, as coordenadas X e Y do ponto são interpretadas como longitude e latitude, respectivamente, em graus.

  Se ambos os parâmetros de geometria forem valores válidos de `Point` ou `MultiPoint` em um sistema de referência espacial geográfico (SRS), o valor de retorno é a menor distância entre as duas geometrias em uma esfera com o raio fornecido. Se omitido, o raio padrão é igual ao raio médio, definido como (2a+b)/3, onde a é o eixo semi-maior e b é o eixo semi-menor do SRS.

   `ST_Distance_Sphere()` trata seus argumentos conforme descrito na introdução desta seção, com estas exceções:

+ As combinações de argumentos de geometria suportadas são `Ponto` e `Ponto` ou `Ponto` e `MultiPonto` (em qualquer ordem de argumento). Se pelo menos uma das geometrias não for `Ponto` nem `MultiPonto` e seu SRID for 0, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_CARTESIAN_SRS`. Se pelo menos uma das geometrias não for `Ponto` nem `MultiPonto` e seu SRID se refere a um SRS geográfico, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`. Se alguma geometria se referir a um SRS projetado, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_PROJECTED_SRS`.
  + Se algum argumento tiver uma longitude ou latitude fora do intervalo, ocorre um erro:

    - Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE`.
    - Se um valor de latitude não estiver no intervalo [−90, 90], ocorre um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE`.

    Os intervalos mostrados são em graus. Se um SRS usa outra unidade, o intervalo usa os valores correspondentes em sua unidade. Os limites exatos do intervalo diferem ligeiramente devido à aritmética de ponto flutuante.
  + Se o argumento *`radius`* estiver presente, mas não positivo, ocorre um erro `ER_NONPOSITIVE_RADIUS`.
  + Se a distância exceder o intervalo de um número de ponto flutuante, ocorre um erro `ER_STD_OVERFLOW_ERROR`.

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
*  `ST_IsValid(g)`

  Retorna 1 se o argumento for geometricamente válido, 0 se o argumento não for geometricamente válido. A validade da geometria é definida pela especificação OGC.

  O único valor de geometria vazio válido é representado na forma de um valor de coleção de geometria vazia. O `ST_IsValid()` retorna 1 nesse caso. O MySQL não suporta valores `EMPTY` de SIG como `POINT EMPTY`.

   O `ST_IsValid()` trata seus argumentos conforme descrito na introdução desta seção, com esta exceção:

  + Se a geometria tiver um SRS geográfico com uma longitude ou latitude fora do intervalo, ocorre um erro:

- Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE`.
- Se um valor de latitude não estiver no intervalo [−90, 90], ocorre um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE`.

Os intervalos mostrados são em graus. Se um SRS usar outra unidade, o intervalo usa os valores correspondentes em sua unidade. Os limites exatos do intervalo diferem ligeiramente devido à aritmética de ponto flutuante.

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
* `ST_MakeEnvelope(pt1, pt2)`

Retorna o retângulo que forma o envelope ao redor de dois pontos, como `Point`, `LineString` ou `Polygon`.

Os cálculos são feitos usando o sistema de coordenadas cartesianas em vez de em uma esfera, esferoide ou na Terra.

Dados dois pontos *`pt1`* e *`pt2`*, `ST_MakeEnvelope()` cria a geometria de resultado em um plano abstrato assim:

+ Se *`pt1`* e *`pt2`* são iguais, o resultado é o ponto *`pt1`*.
+ Caso contrário, se `(pt1, pt2)` é um segmento de linha vertical ou horizontal, o resultado é o segmento de linha `(pt1, pt2)`.
+ Caso contrário, o resultado é um polígono usando *`pt1`* e *`pt2`* como pontos diagonais.

A geometria de resultado tem um SRID de 0.

`ST_MakeEnvelope()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

+ Se os argumentos não forem valores de `Point`, ocorre um erro `ER_WRONG_ARGUMENTS`.
+ Um erro `ER_GIS_INVALID_DATA` ocorre para a condição adicional de que qualquer valor de coordenadas dos dois pontos é infinito ou `NaN`.
+ Se qualquer geometria tiver um valor de SRID para um sistema de referência espacial geográfico (SRS), ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

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
* `ST_Simplify(g, max_distance)`

Simplifica uma geometria usando o algoritmo de Douglas-Peucker e retorna um valor simplificado do mesmo tipo.

A geometria pode ser qualquer tipo de geometria, embora o algoritmo de Douglas-Peucker possa não processar todos os tipos. Uma coleção de geometrias é processada fornecendo seus componentes um por um ao algoritmo de simplificação, e as geometrias retornadas são colocadas em uma coleção de geometrias como resultado.

O argumento *`max_distance`* é a distância (em unidades das coordenadas de entrada) de um vértice a outros segmentos a serem removidos. Os vértices dentro dessa distância das linhas simplificadas são removidos.

De acordo com o Boost.Geometry, as geometrias podem se tornar inválidas como resultado do processo de simplificação, e o processo pode criar autointersecções. Para verificar a validade do resultado, passe-o para `ST_IsValid()`.

`ST_Simplify()` lida com seus argumentos conforme descrito na introdução desta seção, com esta exceção:

+ Se o argumento *`max_distance`* não for positivo ou for `NaN`, ocorre um erro `ER_WRONG_ARGUMENTS`.

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
  ```PN1y2m1K8K```