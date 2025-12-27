### 14.16.6 Funções de Conversão de Formato de Geometria

O MySQL suporta as funções listadas nesta seção para converter valores de geometria do formato de geometria interna para o formato WKT ou WKB, ou para trocar a ordem das coordenadas X e Y.

Existem também funções para converter uma string do formato WKT ou WKB para o formato de geometria interna. Veja a Seção 14.16.3, “Funções que criam valores de geometria a partir de valores WKT”, e a Seção 14.16.4, “Funções que criam valores de geometria a partir de valores WKB”.

Funções como  `ST_GeomFromText()` que aceitam argumentos de coleção de geometria WKT entendem tanto a sintaxe padrão do OpenGIS `'GEOMETRYCOLLECTION EMPTY'` quanto a sintaxe não padrão do MySQL `'GEOMETRYCOLLECTION()'`. Outra maneira de produzir uma coleção de geometria vazia é chamando `GeometryCollection()` sem argumentos. Funções como `ST_AsWKT()` que produzem valores WKT produzem a sintaxe padrão `'GEOMETRYCOLLECTION EMPTY'`:

```
mysql> SET @s1 = ST_GeomFromText('GEOMETRYCOLLECTION()');
mysql> SET @s2 = ST_GeomFromText('GEOMETRYCOLLECTION EMPTY');
mysql> SELECT ST_AsWKT(@s1), ST_AsWKT(@s2);
+--------------------------+--------------------------+
| ST_AsWKT(@s1)            | ST_AsWKT(@s2)            |
+--------------------------+--------------------------+
| GEOMETRYCOLLECTION EMPTY | GEOMETRYCOLLECTION EMPTY |
+--------------------------+--------------------------+
mysql> SELECT ST_AsWKT(GeomCollection());
+----------------------------+
| ST_AsWKT(GeomCollection()) |
+----------------------------+
| GEOMETRYCOLLECTION EMPTY   |
+----------------------------+
```

A menos que especificado de outra forma, as funções nesta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.
* Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.
* Se qualquer argumento de geometria estiver em um sistema de referência espacial indefinido, os eixos são exibidos na ordem em que aparecem na geometria e ocorre uma aviso `ER_WARN_SRS_NOT_FOUND_AXIS_ORDER`.
* Por padrão, as coordenadas geográficas (latitude, longitude) são interpretadas na ordem especificada pelo sistema de referência espacial dos argumentos de geometria. Um argumento opcional *`options`* pode ser fornecido para sobrescrever a ordem padrão dos eixos. `options` consiste em uma lista de argumentos `chave=valor` separados por vírgula. O único valor permitido de *`chave`* é `axis-order`, com valores permitidos de `lat-long`, `long-lat` e `srid-defined` (o padrão).

Se o argumento `*``options`* for `NULL`, o valor de retorno será `NULL`. Se o argumento `*``options`* for inválido, ocorrerá um erro para indicar o motivo.
* Caso contrário, o valor de retorno não será `NULL`.

Essas funções estão disponíveis para conversões de formato ou troca de coordenadas:

* `ST_AsBinary(g [, options])`, `ST_AsWKB(g [, options])`

  Converte um valor no formato de geometria interna para sua representação WKB e retorna o resultado binário.

  O valor de retorno da função tem coordenadas geográficas (latitude, longitude) na ordem especificada pelo sistema de referência espacial que se aplica ao argumento de geometria. Um argumento opcional `*``options`* pode ser fornecido para sobrescrever a ordem padrão dos eixos.

   `ST_AsBinary()` e `ST_AsWKB()` lidam com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @g = ST_LineFromText('LINESTRING(0 5,5 10,10 15)', 4326);
  mysql> SELECT ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g)));
  +-----------------------------------------+
  | ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g))) |
  +-----------------------------------------+
  | LINESTRING(5 0,10 5,15 10)              |
  +-----------------------------------------+
  mysql> SELECT ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g, 'axis-order=long-lat')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g, 'axis-order=long-lat'))) |
  +----------------------------------------------------------------+
  | LINESTRING(0 5,5 10,10 15)                                     |
  +----------------------------------------------------------------+
  mysql> SELECT ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g, 'axis-order=lat-long')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g, 'axis-order=lat-long'))) |
  +----------------------------------------------------------------+
  | LINESTRING(5 0,10 5,15 10)                                     |
  +----------------------------------------------------------------+
  ```
* `ST_AsText(g [, options])`, `ST_AsWKT(g [, options])`

  Converte um valor no formato de geometria interna para sua representação WKT e retorna o resultado em string.

  O valor de retorno da função tem coordenadas geográficas (latitude, longitude) na ordem especificada pelo sistema de referência espacial que se aplica ao argumento de geometria. Um argumento opcional `*``options`* pode ser fornecido para sobrescrever a ordem padrão dos eixos.

   `ST_AsText()` e `ST_AsWKT()` lidam com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @g = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_GeomFromText(@g));
  +--------------------------------+
  | ST_AsText(ST_GeomFromText(@g)) |
  +--------------------------------+
  | LINESTRING(1 1,2 2,3 3)        |
  +--------------------------------+
  ```

  A saída para valores de `MultiPoint` inclui parênteses ao redor de cada ponto. Por exemplo:

  ```
  mysql> SELECT ST_AsText(ST_GeomFromText(@mp));
  +---------------------------------+
  | ST_AsText(ST_GeomFromText(@mp)) |
  +---------------------------------+
  | MULTIPOINT((1 1),(2 2),(3 3))   |
  +---------------------------------+
  ```
* `ST_SwapXY(g)`

  Aceita um argumento no formato de geometria interna, troca os valores X e Y de cada par de coordenadas dentro da geometria e retorna o resultado.

   `ST_SwapXY()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @g = ST_LineFromText('LINESTRING(0 5,5 10,10 15)');
  mysql> SELECT ST_AsText(@g);
  +----------------------------+
  | ST_AsText(@g)              |
  +----------------------------+
  | LINESTRING(0 5,5 10,10 15) |
  +----------------------------+
  mysql> SELECT ST_AsText(ST_SwapXY(@g));
  +----------------------------+
  | ST_AsText(ST_SwapXY(@g))   |
  +----------------------------+
  | LINESTRING(5 0,10 5,15 10) |
  +----------------------------+
  ```