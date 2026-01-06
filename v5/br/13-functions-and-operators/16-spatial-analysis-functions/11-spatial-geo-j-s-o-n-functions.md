### 12.16.11 Funções GeoJSON Espacial

Esta seção descreve funções para a conversão entre documentos GeoJSON e valores espaciais. O GeoJSON é um padrão aberto para codificação de recursos geométricos/geográficos. Para mais informações, consulte <http://geojson.org>. As funções discutidas aqui seguem a revisão da especificação GeoJSON 1.0.

O GeoJSON suporta os mesmos tipos de dados geométricos/geográficos que o MySQL suporta. Os objetos Feature e FeatureCollection não são suportados, exceto que os objetos de geometria são extraídos deles. O suporte ao CRS é limitado a valores que identificam um SRID.

O MySQL também suporta um tipo de dados nativo `JSON` e um conjunto de funções SQL para permitir operações em valores JSON. Para mais informações, consulte a Seção 11.5, “O Tipo de Dados JSON”, e a Seção 12.17, “Funções JSON”.

- [`ST_AsGeoJSON(g [, max_dec_digits [, opções]])`](https://docs.oracle.com/en/spatial/OracleSpatial/11/9/943555/ST_AsGeoJSON.htm#STASGEOJSON)

  Gera um objeto GeoJSON a partir da geometria *`g`*. A string do objeto tem o conjunto de caracteres de conexão e a collation.

  Se qualquer argumento for `NULL`, o valor de retorno será `NULL`. Se qualquer argumento que não for `NULL` for inválido, ocorrerá um erro.

  *`max_dec_digits`*, se especificado, limita o número de dígitos decimais para as coordenadas e faz o arredondamento do resultado. Se não for especificado, este argumento tem como valor padrão seu valor máximo de 232 −

  1. O mínimo é 0.

  *`options`*, se especificado, é uma máscara de bits. A tabela a seguir mostra os valores de sinalizador permitidos. Se o argumento de geometria tiver um SRID de 0, nenhum objeto de CRS é produzido, mesmo para esses valores de sinalizador que o solicitam.

  <table summary="Ferramentas de opção para a função ST_AsGeoJSON()."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Valor da bandeira</th> <th>Significado</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem opções. Isso é o padrão se<em class="replaceable">[[<code>options</code>]]</em>não é especificado.</td> </tr><tr> <td>1</td> <td>Adicione uma caixa de seleção à saída.</td> </tr><tr> <td>2</td> <td>Adicione um URN CRS de formato curto à saída. O formato padrão é um formato curto ([[<code class="literal">EPSG:<em class="replaceable"><code>srid</code>]]</em></code>).</td> </tr><tr> <td>4</td> <td>Adicione um URN de CRS de formato longo ([[<code class="literal">urn:ogc:def:crs:EPSG::<em class="replaceable"><code>srid</code>]]</em></code>). Essa bandeira substitui a bandeira 2. Por exemplo, os valores das opções 5 e 7 significam a mesma coisa (adicionar uma caixa de seleção e um URN de CRS de formato longo).</td> </tr></tbody></table>

  ```sql
  mysql> SELECT ST_AsGeoJSON(ST_GeomFromText('POINT(11.11111 12.22222)'),2);
  +-------------------------------------------------------------+
  | ST_AsGeoJSON(ST_GeomFromText('POINT(11.11111 12.22222)'),2) |
  +-------------------------------------------------------------+
  | {"type": "Point", "coordinates": [11.11, 12.22]}            |
  +-------------------------------------------------------------+
  ```

- [`ST_GeomFromGeoJSON(str [, opções [, srid]])`](https://docs.oracle.com/database/122/SPATIAL/SPATIAL-GEOMJSON-FUNCTIONS.HTML#function_st-geomfromgeojson)

  Analisa uma string *`str`* que representa um objeto GeoJSON e retorna uma geometria.

  Se qualquer argumento for `NULL`, o valor de retorno será `NULL`. Se qualquer argumento que não for `NULL` for inválido, ocorrerá um erro.

  *`options`*, se fornecido, descreve como lidar com documentos GeoJSON que contêm geometrias com dimensões de coordenadas superiores a 2. A tabela a seguir mostra os valores permitidos de *`options`*.

  <table summary="Ferramentas de opção para a função ST_GeomFromGeoJSON()."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Valor da Opção</th> <th>Significado</th> </tr></thead><tbody><tr> <td>1</td> <td>Rejeite o documento e produza um erro. Isso é o padrão se<em class="replaceable">[[<code>options</code>]]</em>não é especificado.</td> </tr><tr> <td>2, 3, 4</td> <td>Aceite o documento e elimine as coordenadas para obter dimensões de coordenadas mais altas.</td> </tr></tbody></table>

  Os valores de *`options`* 2, 3 e 4 atualmente produzem o mesmo efeito. Se as geometrias com dimensões de coordenadas superiores a 2 forem suportadas no futuro, espera-se que esses valores produzam efeitos diferentes.

  O argumento *`srid`*, se fornecido, deve ser um inteiro sem sinal de 32 bits. Se não for fornecido, o valor de retorno da geometria tem um SRID de 4326.

  Os objetos de geometria, recursos e coleções de recursos GeoJSON podem ter uma propriedade `crs`. A função de parsing analisa URNs de CRS nomeados nos namespaces `urn:ogc:def:crs:EPSG::srid` e `EPSG:srid`, mas não CRSs fornecidos como objetos de link. Além disso, `urn:ogc:def:crs:OGC:1.3:CRS84` é reconhecido como SRID 4326. Se um objeto tiver um CRS que não é compreendido, ocorre um erro, com exceção de que, se o argumento opcional *`srid`* for fornecido, qualquer CRS é ignorado, mesmo que seja inválido.

  Conforme especificado na especificação GeoJSON, a análise é sensível ao caso para o membro `type` do input GeoJSON (`Point`, `LineString`, e assim por diante). A especificação é silenciosa em relação à sensibilidade ao caso para outras análises, o que, no MySQL, não é sensível ao caso.

  Este exemplo mostra o resultado da análise de um objeto GeoJSON simples:

  ```sql
  mysql> SET @json = '{ "type": "Point", "coordinates": [102.0, 0.0]}';
  mysql> SELECT ST_AsText(ST_GeomFromGeoJSON(@json));
  +--------------------------------------+
  | ST_AsText(ST_GeomFromGeoJSON(@json)) |
  +--------------------------------------+
  | POINT(102 0)                         |
  +--------------------------------------+
  ```
