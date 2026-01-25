### 12.16.11 Funções Espaciais GeoJSON

Esta seção descreve funções para conversão entre documentos GeoJSON e valores espaciais. GeoJSON é um padrão aberto para codificação de recursos geométricos/geográficos (features). Para mais informações, consulte <http://geojson.org>. As funções discutidas aqui seguem a revisão 1.0 da especificação GeoJSON.

O GeoJSON suporta os mesmos tipos de dados geométricos/geográficos suportados pelo MySQL. Objetos Feature e FeatureCollection não são suportados, exceto pelo fato de que objetos geometry são extraídos deles. O suporte a CRS (Coordinate Reference System) é limitado a valores que identificam um SRID.

O MySQL também suporta um tipo de dado nativo `JSON` e um conjunto de funções SQL para habilitar operações em valores JSON. Para mais informações, consulte a Seção 11.5, “O Tipo de Dado JSON”, e a Seção 12.17, “Funções JSON”.

* [`ST_AsGeoJSON(g [, max_dec_digits [, options)`](spatial-geojson-functions.html#function_st-asgeojson)

  Gera um objeto GeoJSON a partir da geometry *`g`*. A string do objeto utiliza o character set e collation da conexão.

  Se qualquer argumento for `NULL`, o valor de retorno é `NULL`. Se qualquer argumento não-`NULL` for inválido, ocorre um erro.

  *`max_dec_digits`*, se especificado, limita o número de dígitos decimais para coordenadas e causa o arredondamento da saída. Se não especificado, este argumento assume como padrão seu valor máximo de 232 − 1. O mínimo é 0.

  *`options`*, se especificado, é uma bitmask. A tabela a seguir mostra os valores de flag permitidos. Se o argumento geometry tiver um SRID de 0, nenhum objeto CRS é produzido, mesmo para os valores de flag que o solicitam.

  <table summary="Opções de flags para a função ST_AsGeoJSON()."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Valor do Flag</th> <th>Significado</th> </tr></thead><tbody><tr> <td>0</td> <td>Nenhuma opção. Este é o padrão se <em><code>options</code></em> não for especificado.</td> </tr><tr> <td>1</td> <td>Adiciona um bounding box à saída.</td> </tr><tr> <td>2</td> <td>Adiciona um URN CRS em formato curto à saída. O formato padrão é um formato curto (<code>EPSG:<em><code>srid</code></em></code>).</td> </tr><tr> <td>4</td> <td>Adiciona um URN CRS em formato longo (<code>urn:ogc:def:crs:EPSG::<em><code>srid</code></em></code>). Este flag sobrescreve o flag 2. Por exemplo, valores de opção 5 e 7 significam o mesmo (adicionar um bounding box e um URN CRS em formato longo).</td> </tr> </tbody></table>

  ```sql
  mysql> SELECT ST_AsGeoJSON(ST_GeomFromText('POINT(11.11111 12.22222)'),2);
  +-------------------------------------------------------------+
  | ST_AsGeoJSON(ST_GeomFromText('POINT(11.11111 12.22222)'),2) |
  +-------------------------------------------------------------+
  | {"type": "Point", "coordinates": [11.11, 12.22]}            |
  +-------------------------------------------------------------+
  ```

* [`ST_GeomFromGeoJSON(str [, options [, srid)`](spatial-geojson-functions.html#function_st-geomfromgeojson)

  Faz o parsing (análise) de uma string *`str`* que representa um objeto GeoJSON e retorna uma geometry.

  Se qualquer argumento for `NULL`, o valor de retorno é `NULL`. Se qualquer argumento não-`NULL` for inválido, ocorre um erro.

  *`options`*, se fornecido, descreve como lidar com documentos GeoJSON que contêm geometries com dimensões de coordenada superiores a 2. A tabela a seguir mostra os valores de *`options`* permitidos.

  <table summary="Opções de flags para a função ST_GeomFromGeoJSON()."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Valor da Opção</th> <th>Significado</th> </tr></thead><tbody><tr> <td>1</td> <td>Rejeita o documento e gera um erro. Este é o padrão se <em><code>options</code></em> não for especificado.</td> </tr><tr> <td>2, 3, 4</td> <td>Aceita o documento e remove as coordenadas para dimensões de coordenada superiores.</td> </tr></tbody></table>

  Valores de *`options`* 2, 3 e 4 atualmente produzem o mesmo efeito. Se geometries com dimensões de coordenada superiores a 2 forem suportadas no futuro, pode-se esperar que esses valores produzam efeitos diferentes.

  O argumento *`srid`*, se fornecido, deve ser um inteiro sem sinal de 32 bits. Se não fornecido, o valor de retorno geometry tem um SRID de 4326.

  Objetos GeoJSON geometry, feature e feature collection podem ter uma propriedade `crs`. A função de parsing analisa URNs CRS nomeados nos namespaces `urn:ogc:def:crs:EPSG::srid` e `EPSG:srid`, mas não CRSs fornecidos como link objects. Além disso, `urn:ogc:def:crs:OGC:1.3:CRS84` é reconhecido como SRID 4326. Se um objeto tiver um CRS que não é compreendido, ocorre um erro, com a exceção de que, se o argumento opcional *`srid`* for fornecido, qualquer CRS é ignorado, mesmo que seja inválido.

  Conforme especificado na documentação GeoJSON, o parsing diferencia maiúsculas e minúsculas para o membro `type` da entrada GeoJSON (`Point`, `LineString`, e assim por diante). A especificação não menciona a sensibilidade a maiúsculas e minúsculas para outros parsing, que no MySQL não diferencia maiúsculas e minúsculas.

  Este exemplo mostra o resultado do parsing para um objeto GeoJSON simples:

  ```sql
  mysql> SET @json = '{ "type": "Point", "coordinates": [102.0, 0.0]}';
  mysql> SELECT ST_AsText(ST_GeomFromGeoJSON(@json));
  +--------------------------------------+
  | ST_AsText(ST_GeomFromGeoJSON(@json)) |
  +--------------------------------------+
  | POINT(102 0)                         |
  +--------------------------------------+
  ```
