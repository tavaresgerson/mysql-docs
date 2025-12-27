### 14.16.7 Funções de Propriedade de Geometria

14.16.7.1 Funções de Propriedade Geral de Geometria

14.16.7.2 Funções de Propriedade de Ponto

14.16.7.3 Funções de Propriedade de LineString e MultiLineString

14.16.7.4 Funções de Propriedade de Polygon e MultiPolygon

14.16.7.5 Funções de Propriedade de GeometryCollection

Cada função que pertence a este grupo recebe um valor de geometria como argumento e retorna alguma propriedade quantitativa ou qualitativa da geometria. Algumas funções restringem o tipo de argumento. Essas funções retornam `NULL` se o argumento for de um tipo de geometria incorreto. Por exemplo, a função `ST_Area()` de polígonos retorna `NULL` se o tipo de objeto não for `Polygon` nem `MultiPolygon`.