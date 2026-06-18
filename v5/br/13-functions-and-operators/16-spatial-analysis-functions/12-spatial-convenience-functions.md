### 12.16.12 Funções de Conveniência Espacial

As funções nesta seção fornecem operações de conveniência em valores geometry.

* `ST_Distance_Sphere(g1, g2 [, radius])`

  Retorna a distância esférica mínima entre dois Point e/ou MultiPoint em uma esfera, em metros, ou `NULL` se qualquer argumento geometry for `NULL` ou vazio.

  Os cálculos usam uma terra esférica e um radius configurável. O argumento opcional *`radius`* deve ser fornecido em metros. Se omitido, o radius padrão é 6.370.986 metros. Um erro `ER_WRONG_ARGUMENTS` ocorre se o argumento *`radius`* estiver presente, mas não for positivo.

  Os argumentos geometry devem consistir em Points que especificam valores de coordenadas (longitude, latitude):

  + Longitude e latitude são a primeira e a segunda coordenada do Point, respectivamente.

  + Ambas as coordenadas estão em graus.
  + Os valores de Longitude devem estar no intervalo (-180, 180]. Valores positivos estão a leste do meridiano principal.

  + Os valores de Latitude devem estar no intervalo [-90, 90]. Valores positivos estão ao norte do equador.

  As combinações de argumentos suportadas são (`Point`, `Point`), (`Point`, `MultiPoint`) e (`MultiPoint`, `Point`). Um erro `ER_GIS_UNSUPPORTED_ARGUMENT` ocorre para outras combinações.

  Se qualquer argumento geometry não for uma string de bytes geometry sintaticamente bem formada, ocorrerá um erro `ER_GIS_INVALID_DATA`.

  ```sql
  mysql> SET @pt1 = ST_GeomFromText('POINT(0 0)');
  mysql> SET @pt2 = ST_GeomFromText('POINT(180 0)');
  mysql> SELECT ST_Distance_Sphere(@pt1, @pt2);
  +--------------------------------+
  | ST_Distance_Sphere(@pt1, @pt2) |
  +--------------------------------+
  |             20015042.813723423 |
  +--------------------------------+
  ```

* `ST_IsValid(g)`

  Retorna 1 se o argumento estiver sintaticamente bem formado e for geometricamente válido, 0 se o argumento não estiver sintaticamente bem formado ou não for geometricamente válido. Se o argumento for `NULL`, o valor de retorno é `NULL`. A validade da Geometry é definida pela especificação OGC.

  A única Geometry vazia válida é representada na forma de um valor de Geometry collection vazio. `ST_IsValid()` retorna 1 neste caso.

  `ST_IsValid()` funciona apenas para o sistema de coordenadas Cartesiano e requer um argumento geometry com um SRID de 0. Caso contrário, ocorre um erro `ER_WRONG_ARGUMENTS`.

  ```sql
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

  Retorna o retângulo que forma o envelope em torno de dois Points, como um `Point`, `LineString` ou `Polygon`. Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

  Os cálculos são feitos usando o sistema de coordenadas Cartesiano em vez de em uma esfera, esferoide ou na Terra.

  Dados dois Points *`pt1`* e *`pt2`*, `ST_MakeEnvelope()` cria a Geometry resultante em um plano abstrato da seguinte forma:

  + Se *`pt1`* e *`pt2`* forem iguais, o resultado é o Point *`pt1`*.

  + Caso contrário, se `(pt1, pt2)` for um segmento de reta vertical ou horizontal, o resultado é o segmento de reta `(pt1, pt2)`.

  + Caso contrário, o resultado é um Polygon usando *`pt1`* e *`pt2`* como pontos diagonais.

  A Geometry resultante tem um SRID de 0.

  `ST_MakeEnvelope()` requer argumentos geometry do tipo `Point` com um SRID de 0. Caso contrário, ocorre um erro `ER_WRONG_ARGUMENTS`.

  Se qualquer argumento não for uma string de bytes geometry sintaticamente bem formada, ou se qualquer valor de coordenada dos dois Points for infinito ou `NaN`, ocorrerá um erro `ER_GIS_INVALID_DATA`.

  ```sql
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

  Simplifica uma Geometry usando o algoritmo Douglas-Peucker e retorna um valor simplificado do mesmo tipo. Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

  A Geometry pode ser de qualquer tipo geometry, embora o algoritmo Douglas-Peucker possa não processar todos os tipos. Uma Geometry collection é processada passando seus componentes um por um para o algoritmo de simplificação, e as Geometries retornadas são colocadas em uma Geometry collection como resultado.

  O argumento *`max_distance`* é a distância (em unidades das coordenadas de entrada) de um vertex para outros segmentos a serem removidos. Os vertices dentro dessa distância da linestring simplificada são removidos. Se o argumento *`max_distance`* não for positivo, ou for `NaN`, ocorre um erro `ER_WRONG_ARGUMENTS`.

  De acordo com Boost.Geometry, as geometries podem se tornar inválidas como resultado do processo de simplificação, e o processo pode criar autointerseções. Para verificar a validade do resultado, passe-o para `ST_IsValid()`.

  Se o argumento geometry não for uma string de bytes geometry sintaticamente bem formada, ocorrerá um erro `ER_GIS_INVALID_DATA`.

  ```sql
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

* `ST_Validate(g)`

  Valida uma Geometry de acordo com a especificação OGC. Uma Geometry pode ser sintaticamente bem formada (valor WKB mais SRID), mas geometricamente inválida. Por exemplo, este Polygon é geometricamente inválido: `POLYGON((0 0, 0 0, 0 0, 0 0, 0 0))`

  `ST_Validate()` retorna a Geometry se ela estiver sintaticamente bem formada e for geometricamente válida, `NULL` se o argumento não estiver sintaticamente bem formado ou não for geometricamente válido, ou se for `NULL`.

  `ST_Validate()` pode ser usado para filtrar dados geometry inválidos, embora a um custo. Para aplicações que exigem resultados mais precisos, não contaminados por dados inválidos, essa penalidade pode valer a pena.

  Se o argumento geometry for válido, ele é retornado como está, exceto que se um `Polygon` ou `MultiPolygon` de entrada tiver anéis no sentido horário (clockwise rings), esses anéis são invertidos antes da verificação de validade. Se a Geometry for válida, o valor com os anéis invertidos é retornado.

  A única Geometry vazia válida é representada na forma de um valor de Geometry collection vazio. `ST_Validate()` o retorna diretamente sem verificações adicionais neste caso.

  `ST_Validate()` funciona apenas para o sistema de coordenadas Cartesiano e requer um argumento geometry com um SRID de 0. Caso contrário, ocorre um erro `ER_WRONG_ARGUMENTS`.

  ```sql
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