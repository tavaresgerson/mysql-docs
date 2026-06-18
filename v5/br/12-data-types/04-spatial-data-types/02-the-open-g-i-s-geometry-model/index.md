### 11.4.2 O Modelo Geometry do OpenGIS

11.4.2.1 A Hierarquia de Classes Geometry

11.4.2.2 Classe Geometry

11.4.2.3 Classe Point

11.4.2.4 Classe Curve

11.4.2.5 Classe LineString

11.4.2.6 Classe Surface

11.4.2.7 Classe Polygon

11.4.2.8 Classe GeometryCollection

11.4.2.9 Classe MultiPoint

11.4.2.10 Classe MultiCurve

11.4.2.11 Classe MultiLineString

11.4.2.12 Classe MultiSurface

11.4.2.13 Classe MultiPolygon

O conjunto de tipos geometry propostos pelo ambiente **SQL with Geometry Types** da OGC é baseado no **OpenGIS Geometry Model**. Neste modelo, cada objeto geométrico possui as seguintes propriedades gerais:

* Está associado a um sistema de referência espacial, que descreve o espaço de coordenadas no qual o objeto é definido.

* Pertence a alguma classe geometry.