### 12.16.9 Funções Que Testam Relações Espaciais Entre Objetos Geometry

12.16.9.1 Funções de Relação Espacial Que Usam Formas de Objeto

12.16.9.2 Funções de Relação Espacial Que Usam Retângulos Delimitadores Mínimos

As funções descritas nesta seção recebem duas geometries como argumentos e retornam uma relação qualitativa ou quantitativa entre elas.

O MySQL implementa dois conjuntos de funções usando nomes de função definidos pela especificação OpenGIS. Um conjunto testa a relação entre dois valores geometry usando formas de objeto precisas, o outro conjunto usa minimum bounding rectangles (MBRs) de objetos.

Existe também um conjunto de funções específicas do MySQL baseadas em MBR disponíveis para testar a relação entre dois valores geometry.