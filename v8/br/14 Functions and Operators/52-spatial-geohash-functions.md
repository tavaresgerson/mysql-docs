### 14.16.10 Funções Geohash Espaciais

Geohash é um sistema para codificar coordenadas de latitude e longitude de precisão arbitrária em uma string de texto. Os valores geohash são strings que contêm apenas caracteres escolhidos de `"0123456789bcdefghjkmnpqrstuvwxyz"`.

As funções nesta seção permitem a manipulação de valores geohash, o que fornece às aplicações as capacidades de importar e exportar dados geohash e de indexar e pesquisar valores geohash.

A menos que especificado de outra forma, as funções nesta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.
* Se qualquer argumento for inválido, ocorre um erro.
* Se qualquer argumento tiver uma longitude ou latitude fora do intervalo, ocorre um erro:

  + Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE`.
  + Se um valor de latitude não estiver no intervalo [−90, 90], ocorre um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE`.

Os intervalos mostrados são em graus. Os limites exatos do intervalo diferem ligeiramente devido à aritmética de ponto flutuante.
* Se qualquer argumento de ponto não tiver SRID 0 ou 4326, ocorre um erro `ER_SRS_NOT_FOUND`. A validade do argumento *`point`* SRID não é verificada.
* Se qualquer argumento SRID se referir a um sistema de referência espacial (SRS) indefinido, ocorre um erro `ER_SRS_NOT_FOUND`.
* Se qualquer argumento SRID não estiver dentro do intervalo de um inteiro unsigned de 32 bits, ocorre um erro `ER_DATA_OUT_OF_RANGE`.
* Caso contrário, o valor de retorno não é `NULL`.

Estas funções geohash estão disponíveis:

* `ST_GeoHash(longitude, latitude, max_length)`, `ST_GeoHash(point, max_length)`

  Retorna uma string geohash no conjunto de caracteres de conexão e collation.

  Para a primeira sintaxe, o *`longitude`* deve ser um número no intervalo [−180, 180], e o *`latitude`* deve ser um número no intervalo [−90, 90]. Para a segunda sintaxe, é necessário um valor `POINT`, onde as coordenadas X e Y estão nos intervalos válidos para longitude e latitude, respectivamente.

A cadeia resultante não tem mais de *`max_length`* caracteres, que tem um limite superior de 100. A cadeia pode ser mais curta que *`max_length`* caracteres porque o algoritmo que cria o valor geohash continua até criar uma cadeia que seja uma representação exata da localização ou *`max_length`* caracteres, o que ocorrer primeiro.

`ST_GeoHash()` lida com seus argumentos conforme descrito na introdução desta seção.

```
  mysql> SELECT ST_GeoHash(180,0,10), ST_GeoHash(-180,-90,15);
  +----------------------+-------------------------+
  | ST_GeoHash(180,0,10) | ST_GeoHash(-180,-90,15) |
  +----------------------+-------------------------+
  | xbpbpbpbpb           | 000000000000000         |
  +----------------------+-------------------------+
  ```
*  `ST_LatFromGeoHash(geohash_str)`

Retorna a latitude de um valor de cadeia geohash, como um número de precisão dupla no intervalo [−90, 90].

A função de decodificação `ST_LatFromGeoHash()` lê no máximo 433 caracteres do argumento *`geohash_str`*. Isso representa o limite superior de informações na representação interna dos valores de coordenadas. Caracteres além do 433º são ignorados, mesmo que sejam ilegais e produzam um erro.

`ST_LatFromGeoHash()` lida com seus argumentos conforme descrito na introdução desta seção.

```
  mysql> SELECT ST_LatFromGeoHash(ST_GeoHash(45,-20,10));
  +------------------------------------------+
  | ST_LatFromGeoHash(ST_GeoHash(45,-20,10)) |
  +------------------------------------------+
  |                                      -20 |
  +------------------------------------------+
  ```
*  `ST_LongFromGeoHash(geohash_str)`

Retorna a longitude de um valor de cadeia geohash, como um número de precisão dupla no intervalo [−180, 180].

As observações na descrição de `ST_LatFromGeoHash()` sobre o número máximo de caracteres processados a partir do argumento *`geohash_str`* também se aplicam a `ST_LongFromGeoHash()`.

`ST_LongFromGeoHash()` lida com seus argumentos conforme descrito na introdução desta seção.

```
  mysql> SELECT ST_LongFromGeoHash(ST_GeoHash(45,-20,10));
  +-------------------------------------------+
  | ST_LongFromGeoHash(ST_GeoHash(45,-20,10)) |
  +-------------------------------------------+
  |                                        45 |
  +-------------------------------------------+
  ```
* `ST_PointFromGeoHash(geohash_str, srid)`

Retorna um valor `POINT` contendo o valor geohash decodificado, dado um valor de cadeia geohash.

As coordenadas X e Y do ponto são a longitude no intervalo [−180, 180] e a latitude no intervalo [−90, 90], respectivamente.

O argumento *`srid`* é um inteiro sem sinal de 32 bits.

As observações na descrição de `ST_LatFromGeoHash()` sobre o número máximo de caracteres processados a partir do argumento *`geohash_str`* também se aplicam a `ST_PointFromGeoHash()`.

`ST_PointFromGeoHash()` lida com seus argumentos conforme descrito na introdução desta seção.

```
  mysql> SET @gh = ST_GeoHash(45,-20,10);
  mysql> SELECT ST_AsText(ST_PointFromGeoHash(@gh,0));
  +---------------------------------------+
  | ST_AsText(ST_PointFromGeoHash(@gh,0)) |
  +---------------------------------------+
  | POINT(45 -20)                         |
  +---------------------------------------+
  ```