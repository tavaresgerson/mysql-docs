### 14.16.7 Funções de Propriedade de Geometria

14.16.7.1 Funções de Propriedade Geométrica Geral

14.16.7.2 Funções de Propriedade de Pontos

14.16.7.3 Funções de Propriedade LineString e MultiLineString

14.16.7.4 Funções de Propriedade Polygon e MultiPolygon

14.16.7.5 Funções de Propriedade GeometryCollection

Cada função que pertence a este grupo recebe um valor de geometria como argumento e retorna uma propriedade quantitativa ou qualitativa da geometria. Algumas funções restringem o tipo de argumento. Essas funções retornam `NULL` se o argumento for de um tipo de geometria incorreto. Por exemplo, a função `ST_Area()` de polígono retorna `NULL` se o tipo de objeto não for nem `Polygon` nem `MultiPolygon`.
