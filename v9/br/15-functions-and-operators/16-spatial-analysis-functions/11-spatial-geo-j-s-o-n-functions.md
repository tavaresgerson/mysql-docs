### 14.16.11 Funções GeoJSON Espacial

Esta seção descreve funções para a conversão entre documentos GeoJSON e valores espaciais. O GeoJSON é um padrão aberto para codificação de recursos geométricos/geográficos. Para mais informações, consulte <http://geojson.org>. As funções discutidas aqui seguem a revisão 1.0 da especificação GeoJSON.

O GeoJSON suporta os mesmos tipos de dados geométricos/geográficos que o MySQL suporta. Os objetos Feature e FeatureCollection não são suportados, exceto que os objetos geometry são extraídos deles. O suporte ao CRS é limitado a valores que identificam um SRID.

O MySQL também suporta um tipo de dados nativo `JSON` e um conjunto de funções SQL para permitir operações em valores JSON. Para mais informações, consulte a Seção 13.5, “O Tipo de Dados JSON”, e a Seção 14.17, “Funções JSON”.

[`ST_AsGeoJSON(g [, max_dec_digits [, options]])`](https://docs.oracle.com/cd/E15807-01/806-2551/98542.htm#SQL.funcSTASGEOJSON)

  Gera um objeto GeoJSON a partir do geometry *`g`*. O objeto string tem o conjunto de caracteres de conexão e a collation.

  Se qualquer argumento for `NULL`, o valor de retorno é `NULL`. Se qualquer argumento não `NULL` for inválido, ocorre um erro.

  *`max_dec_digits`*, se especificado, limita o número de dígitos decimais para as coordenadas e causa arredondamento da saída. Se não especificado, este argumento tem o valor máximo de 232 −

  1. O mínimo é 0.

  *`options`*, se especificado, é uma máscara de bits. A tabela a seguir mostra os valores de sinalizador permitidos. Se o argumento geometry tiver um SRID de 0, nenhum objeto CRS é produzido mesmo para aqueles valores de sinalizador que solicitam um.

<table summary="Ferramentas de opção para a função ST_AsGeoJSON()."""><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Valor da opção</th> <th>Significado</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem opções. Este é o padrão se <em class="replaceable"><code>options</code></em> não for especificado.</td> </tr><tr> <td>1</td> <td>Adicionar uma caixa de delimitação à saída.</td> </tr><tr> <td>2</td> <td>Adicionar uma URN de CRS em formato curto à saída. O formato padrão é um formato curto (<code>EPSG:<em class="replaceable"><code>srid</code></em></code>). Se o SRID for 0, a URN de CRS é <code>MySQL:0</code>.</td> </tr><tr> <td>4</td> <td>Adicionar uma URN de CRS em formato longo (<code>urn:ogc:def:crs:EPSG::<em class="replaceable"><code>srid</code></em></code>). Esta opção substitui a opção 2. Por exemplo, os valores das opções 5 e 7 significam a mesma coisa (adicionar uma caixa de delimitação e uma URN de CRS em formato longo). Se o SRID for 0, a URN de CRS é <code>urn:ogc:def:crs:MySQL::0</code>.</td> </tr></tbody></table>```
  mysql> SELECT ST_AsGeoJSON(ST_GeomFromText('POINT(11.11111 12.22222)'),2);
  +-------------------------------------------------------------+
  | ST_AsGeoJSON(ST_GeomFromText('POINT(11.11111 12.22222)'),2) |
  +-------------------------------------------------------------+
  | {"type": "Point", "coordinates": [11.11, 12.22]}            |
  +-------------------------------------------------------------+
  ```cI0OXEEl5Q

`ST_GeomFromGeoJSON(str [, options [, srid]])` (functions-spatial-geojson.html#function_st-geomfromgeojson)

  Analisa uma string *`str`* que representa um objeto GeoJSON e retorna uma geometria.

  Se qualquer argumento for `NULL`, o valor de retorno é `NULL`. Se qualquer argumento não `NULL` for inválido, ocorre um erro.

  *`options`*, se fornecido, descreve como lidar com documentos GeoJSON que contêm geometrias com dimensões de coordenadas maiores que 2. A tabela a seguir mostra os valores de *`options`* permitidos.

<table summary="Ferramentas de opção para a função ST_GeomFromGeoJSON()."""><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Opção</th> <th>Significado</th> </tr></thead><tbody><tr> <td>1</td> <td>Rejeitar o documento e produzir um erro. Este é o padrão se as <em class="substituível"><code>opções</code></em> não forem especificadas.</td> </tr><tr> <td>2, 3, 4</td> <td>Aceitar o documento e remover as coordenadas para dimensões de coordenadas mais altas.</td> </tr></tbody></table>

*Os valores de *`options`* de 2, 3 e 4 atualmente produzem o mesmo efeito. Se as geometrias com dimensões de coordenadas mais altas que 2 forem suportadas no futuro, você pode esperar que esses valores produzam efeitos diferentes.

O argumento *`srid`*, se fornecido, deve ser um inteiro sem sinal de 32 bits. Se não for fornecido, o valor de retorno da geometria tem um SRID de 4326.

Se *`srid`* se referir a um sistema de referência espacial (SRS) indefinido, ocorre um erro `ER_SRS_NOT_FOUND`.

Para argumentos de geometria de SRS geográficas, se qualquer argumento tiver uma longitude ou latitude fora do intervalo, ocorre um erro:

+ Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_LONGITUDE_OUT_OF_RANGE`.

+ Se um valor de latitude não estiver no intervalo [−90, 90], ocorre um erro `ER_LATITUDE_OUT_OF_RANGE`.

Os intervalos mostrados são em graus. Se um SRS usar outra unidade, o intervalo usa os valores correspondentes em sua unidade. Os limites exatos do intervalo diferem ligeiramente devido à aritmética de ponto flutuante.

Os objetos de geometria, características e coleções de características GeoJSON podem ter uma propriedade `crs`. A função de análise analisa URNs de CRS nomeados nos namespaces `urn:ogc:def:crs:EPSG::srid` e `EPSG:srid`, mas não CRSs fornecidos como objetos de link. Além disso, `urn:ogc:def:crs:OGC:1.3:CRS84` é reconhecido como SRID 4326. Se um objeto tiver um CRS que não é compreendido, ocorre um erro, com exceção de que, se o argumento opcional *`srid`* for fornecido, qualquer CRS é ignorado, mesmo que seja inválido.

Se um membro `crs` que especifica um SRID diferente do SRID do objeto de nível superior for encontrado em um nível mais baixo do documento GeoJSON, ocorre um erro `ER_INVALID_GEOJSON_CRS_NOT_TOP_LEVEL`.

Conforme especificado na especificação GeoJSON, a análise é case-sensitive para o membro `type` do GeoJSON de entrada (`Point`, `LineString`, e assim por diante). A especificação é silenciosa em relação à sensibilidade de caso para outras análises, o que, no MySQL, não é case-sensitive.

Este exemplo mostra o resultado da análise para um objeto GeoJSON simples. Observe que a ordem das coordenadas depende do SRID usado.

```
  mysql> SET @json = '{ "type": "Point", "coordinates": [102.0, 0.0]}';
  mysql> SELECT ST_AsText(ST_GeomFromGeoJSON(@json));
  +--------------------------------------+
  | ST_AsText(ST_GeomFromGeoJSON(@json)) |
  +--------------------------------------+
  | POINT(0 102)                         |
  +--------------------------------------+
  mysql> SELECT ST_SRID(ST_GeomFromGeoJSON(@json));
  +------------------------------------+
  | ST_SRID(ST_GeomFromGeoJSON(@json)) |
  +------------------------------------+
  |                               4326 |
  +------------------------------------+
  mysql> SELECT ST_AsText(ST_SRID(ST_GeomFromGeoJSON(@json),0));
  +-------------------------------------------------+
  | ST_AsText(ST_SRID(ST_GeomFromGeoJSON(@json),0)) |
  +-------------------------------------------------+
  | POINT(102 0)                                    |
  +-------------------------------------------------+
  ```