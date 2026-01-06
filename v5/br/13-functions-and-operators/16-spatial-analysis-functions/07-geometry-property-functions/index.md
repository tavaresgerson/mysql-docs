### 12.16.7 Funções de Propriedade de Geometria

12.16.7.1 Funções de Propriedade Geométrica Geral

12.16.7.2 Funções de Propriedade de Pontos

12.16.7.3 Funções de Propriedade LineString e MultiLineString

12.16.7.4 Funções de Propriedade Polygon e MultiPolygon

12.16.7.5 Funções de Propriedade GeometryCollection

Cada função que pertence a esse grupo recebe um valor de geometria como argumento e retorna uma propriedade quantitativa ou qualitativa da geometria. Algumas funções restringem o tipo de argumento. Essas funções retornam `NULL` se o argumento for de um tipo de geometria incorreto. Por exemplo, a função `ST_Area()` de polígonos retorna `NULL` se o tipo de objeto não for `Polygon` nem `MultiPolygon`.
