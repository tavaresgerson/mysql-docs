### 12.16.7 Funções de Propriedade de Geometria

12.16.7.1 Funções de Propriedade de Geometria Gerais

12.16.7.2 Funções de Propriedade de Ponto

12.16.7.3 Funções de Propriedade de LineString e MultiLineString

12.16.7.4 Funções de Propriedade de Polygon e MultiPolygon

12.16.7.5 Funções de Propriedade de GeometryCollection

Cada função pertencente a este grupo recebe um valor de geometria como argumento e retorna alguma propriedade quantitativa ou qualitativa da geometria. Algumas funções restringem o tipo de seu argumento. Tais funções retornam `NULL` se o argumento for de um tipo de geometria incorreto. Por exemplo, a função de Polygon `ST_Area()` retorna `NULL` se o tipo de objeto não for nem `Polygon` nem `MultiPolygon`.