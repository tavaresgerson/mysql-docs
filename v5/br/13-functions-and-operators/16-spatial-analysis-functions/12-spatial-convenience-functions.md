### 12.16.12 Funções de conveniência espacial

As funções nesta seção fornecem operações de conveniência em valores de geometria.

- `ST_Distance_Sphere(g1, g2 [, raio])`

  Retorna a distância esférica mínima entre dois pontos e/ou múltiplos pontos em uma esfera, em metros, ou `NULL` se algum argumento de geometria for `NULL` ou vazio.

  Os cálculos utilizam uma Terra esférica e um raio configurável. O argumento opcional *`radius`* deve ser fornecido em metros. Se omitido, o raio padrão é de 6.370.986 metros. Uma mensagem de erro *`ER_WRONG_ARGUMENTS`* ocorre se o argumento *`radius`* estiver presente, mas não for positivo.

  Os argumentos de geometria devem conter pontos que especificam os valores de coordenadas (longitude, latitude):

  - A longitude e a latitude são as primeiras e segundas coordenadas do ponto, respectivamente.

  - Ambas as coordenadas estão em graus.

  - Os valores de longitude devem estar na faixa (-180, 180]. Valores positivos estão a leste do meridiano principal.

  - Os valores de latitude devem estar na faixa \[-90, 90]. Valores positivos estão ao norte do equador.

  As combinações de argumentos suportadas são (`Ponto`, `Ponto`), (`Ponto`, `MultiPonto`) e (`MultiPonto`, `Ponto`). Uma mensagem de erro `ER_GIS_UNSUPPORTED_ARGUMENT` ocorre para outras combinações.

  Se qualquer argumento de geometria não for uma cadeia de bytes de geometria sintaticamente bem formada, ocorrerá um erro `ER_GIS_INVALID_DATA`.

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

- `ST_IsValid(g)`

  Retorna 1 se o argumento for sintaticamente bem formado e geometricamente válido, 0 se o argumento não for sintaticamente bem formado ou não for geometricamente válido. Se o argumento for `NULL`, o valor de retorno é `NULL`. A validade geométrica é definida pela especificação OGC.

  A única geometria vazia válida é representada na forma de um valor de coleção de geometria vazia. `ST_IsValid()` retorna 1 nesse caso.

  `ST_IsValid()` funciona apenas no sistema de coordenadas cartesianas e requer um argumento de geometria com um SRID de 0. Caso contrário, ocorre um erro `ER_WRONG_ARGUMENTS`.

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

- `ST_MakeEnvelope(pt1, pt2)`

  Retorna o retângulo que forma o envelope ao redor de dois pontos, como `Point`, `LineString` ou `Polygon`. Se qualquer argumento for `NULL`, o valor de retorno será `NULL`.

  Os cálculos são feitos usando o sistema de coordenadas cartesianas, e não em uma esfera, esferoide ou na Terra.

  Dado dois pontos *`pt1`* e *`pt2`*, o `ST_MakeEnvelope()` cria a geometria de resultado em um plano abstrato assim:

  - Se *`pt1`* e *`pt2`* forem iguais, o resultado é o ponto *`pt1`*.

  - Caso contrário, se `(pt1, pt2)` seja um segmento de linha vertical ou horizontal, o resultado será o segmento de linha `(pt1, pt2)`.

  - Caso contrário, o resultado é um polígono usando *`pt1`* e *`pt2`* como pontos diagonais.

  A geometria do resultado tem um SRID de 0.

  `ST_MakeEnvelope()` requer argumentos de geometria `Point` com um SRID de 0. Caso contrário, ocorre um erro `ER_WRONG_ARGUMENTS`.

  Se algum argumento não for uma cadeia de bytes de geometria sintaticamente bem formada, ou se qualquer valor de coordenada dos dois pontos for infinito ou `NaN`, ocorrerá um erro `ER_GIS_INVALID_DATA`.

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

- `ST_Simplificar(g, max_distance)`

  Simplifica uma geometria usando o algoritmo de Douglas-Peucker e retorna um valor simplificado do mesmo tipo. Se qualquer argumento for `NULL`, o valor de retorno será `NULL`.

  A geometria pode ser qualquer tipo de geometria, embora o algoritmo de Douglas-Peucker possa não processar todos os tipos. Uma coleção de geometrias é processada fornecendo seus componentes um por um ao algoritmo de simplificação, e as geometrias retornadas são colocadas em uma coleção de geometrias como resultado.

  O argumento `max_distance` é a distância (em unidades das coordenadas de entrada) de um vértice para outros segmentos a serem removidos. Os vértices dentro dessa distância das linhas simplificadas são removidos. Se o argumento `max_distance` não for positivo ou for `NaN`, ocorrerá um erro `ER_WRONG_ARGUMENTS`.

  De acordo com o Boost.Geometry, as geometrias podem se tornar inválidas como resultado do processo de simplificação, e o processo pode criar autointersecções. Para verificar a validade do resultado, passe-o para `ST_IsValid()`.

  Se o argumento de geometria não for uma cadeia de bytes de geometria sintaticamente bem formada, ocorrerá um erro `ER_GIS_INVALID_DATA`.

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

- `ST_Validate(g)`

  Valida uma geometria de acordo com a especificação OGC. Uma geometria pode ser sintaticamente bem formada (valor WKB mais SRID) mas geometricamente inválida. Por exemplo, este polígono é geometricamente inválido: `POLYGON((0 0, 0 0, 0 0, 0 0, 0 0))`

  `ST_Validate()` retorna a geometria se ela for sintaticamente bem formada e geométricamente válida, `NULL` se o argumento não for sintaticamente bem formado ou não for geométricamente válido ou for `NULL`.

  `ST_Validate()` pode ser usado para filtrar dados de geometria inválidos, embora isso tenha um custo. Para aplicações que exigem resultados mais precisos, não contaminados por dados inválidos, essa penalidade pode valer a pena.

  Se o argumento de geometria for válido, ele é retornado como está, exceto que, se um `Polygon` ou `MultiPolygon` de entrada tiver anéis no sentido horário, esses anéis são invertidos antes de verificar a validade. Se a geometria for válida, o valor com os anéis invertidos é retornado.

  A única geometria vazia válida é representada na forma de um valor de coleção de geometria vazia. Nesse caso, o `ST_Validate()` retorna diretamente sem mais verificações.

  `ST_Validate()` funciona apenas no sistema de coordenadas cartesianas e requer um argumento de geometria com um SRID de 0. Caso contrário, ocorre um erro `ER_WRONG_ARGUMENTS`.

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
