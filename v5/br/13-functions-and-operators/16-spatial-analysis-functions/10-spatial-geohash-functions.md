### 12.16.10 Funções Geohash Espaciais

Geohash é um sistema para codificar coordenadas de latitude e longitude de precisão arbitrária em uma string de texto. Valores Geohash são strings que contêm apenas caracteres escolhidos de `"0123456789bcdefghjkmnpqrstuvwxyz"`.

As funções nesta seção permitem a manipulação de valores geohash, o que fornece aos aplicativos as capacidades de importação e exportação de dados geohash, bem como de Indexing e pesquisa de valores geohash.

* `ST_GeoHash(longitude, latitude, max_length)`, `ST_GeoHash(point, max_length)`

  Retorna uma string geohash no conjunto de caracteres e collation da conexão.

  Se qualquer argumento for `NULL`, o valor de retorno é `NULL`. Se qualquer argumento for inválido, ocorre um erro.

  Para a primeira sintaxe, o *`longitude`* deve ser um número no intervalo [−180, 180], e o *`latitude`* deve ser um número no intervalo [−90, 90]. Para a segunda sintaxe, é exigido um valor `POINT`, onde as coordenadas X e Y estão nos intervalos válidos para longitude e latitude, respectivamente.

  A string resultante não é maior que *`max_length`* caracteres, que tem um limite superior de 100. A string pode ser menor que *`max_length`* caracteres porque o algoritmo que cria o valor geohash continua até que tenha criado uma string que seja uma representação exata da localização ou *`max_length`* caracteres, o que ocorrer primeiro.

  ```sql
  mysql> SELECT ST_GeoHash(180,0,10), ST_GeoHash(-180,-90,15);
  +----------------------+-------------------------+
  | ST_GeoHash(180,0,10) | ST_GeoHash(-180,-90,15) |
  +----------------------+-------------------------+
  | xbpbpbpbpb           | 000000000000000         |
  +----------------------+-------------------------+
  ```

* `ST_LatFromGeoHash(geohash_str)`

  Retorna a latitude de um valor string geohash, como um valor `DOUBLE` (FLOAT, DOUBLE) no intervalo [−90, 90].

  Se o argumento for `NULL`, o valor de retorno é `NULL`. Se o argumento for inválido, ocorre um erro.

  A função de decodificação `ST_LatFromGeoHash()` lê no máximo 433 caracteres do argumento *`geohash_str`*. Isso representa o limite superior de informação na representação interna dos valores de coordenada. Caracteres após o 433º são ignorados, mesmo que sejam ilegais e produzam um erro.

  ```sql
  mysql> SELECT ST_LatFromGeoHash(ST_GeoHash(45,-20,10));
  +------------------------------------------+
  | ST_LatFromGeoHash(ST_GeoHash(45,-20,10)) |
  +------------------------------------------+
  |                                      -20 |
  +------------------------------------------+
  ```

* `ST_LongFromGeoHash(geohash_str)`

  Retorna a longitude de um valor string geohash, como um valor `DOUBLE` (FLOAT, DOUBLE) no intervalo [−180, 180].

  Se o argumento for `NULL`, o valor de retorno é `NULL`. Se o argumento for inválido, ocorre um erro.

  As observações na descrição de `ST_LatFromGeoHash()` relativas ao número máximo de caracteres processados a partir do argumento *`geohash_str`* também se aplicam a `ST_LongFromGeoHash()`.

  ```sql
  mysql> SELECT ST_LongFromGeoHash(ST_GeoHash(45,-20,10));
  +-------------------------------------------+
  | ST_LongFromGeoHash(ST_GeoHash(45,-20,10)) |
  +-------------------------------------------+
  |                                        45 |
  +-------------------------------------------+
  ```

* `ST_PointFromGeoHash(geohash_str, srid)`

  Retorna um valor `POINT` contendo o valor geohash decodificado, dado um valor string geohash.

  As coordenadas X e Y do Point são a longitude no intervalo [−180, 180] e a latitude no intervalo [−90, 90], respectivamente.

  Se qualquer argumento for `NULL`, o valor de retorno é `NULL`. Se qualquer argumento for inválido, ocorre um erro.

  O argumento *`srid`* é um inteiro não assinado de 32 bits.

  As observações na descrição de `ST_LatFromGeoHash()` relativas ao número máximo de caracteres processados a partir do argumento *`geohash_str`* também se aplicam a `ST_PointFromGeoHash()`.

  ```sql
  mysql> SET @gh = ST_GeoHash(45,-20,10);
  mysql> SELECT ST_AsText(ST_PointFromGeoHash(@gh,0));
  +---------------------------------------+
  | ST_AsText(ST_PointFromGeoHash(@gh,0)) |
  +---------------------------------------+
  | POINT(45 -20)                         |
  +---------------------------------------+
  ```
