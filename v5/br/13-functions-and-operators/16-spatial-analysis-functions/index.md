## 12.16 Funções de Análise Espacial

12.16.1 Referência de Funções Espaciais

12.16.2 Tratamento de Argumentos por Funções Espaciais

12.16.3 Funções que Criam Valores de Geometry a Partir de Valores WKT

12.16.4 Funções que Criam Valores de Geometry a Partir de Valores WKB

12.16.5 Funções Específicas do MySQL que Criam Valores de Geometry

12.16.6 Funções de Conversão de Formato de Geometry

12.16.7 Funções de Propriedade de Geometry

12.16.8 Funções de Operadores Espaciais

12.16.9 Funções que Testam Relações Espaciais Entre Objetos Geometry

12.16.10 Funções Geohash Espaciais

12.16.11 Funções GeoJSON Espaciais

12.16.12 Funções de Conveniência Espacial

O MySQL fornece funções para realizar diversas operações em dados espaciais. Essas funções podem ser agrupadas em várias categorias principais, de acordo com o tipo de operação que executam:

* Funções que criam geometrias em vários formatos (WKT, WKB, interno)

* Funções que convertem geometrias entre formatos
* Funções que acessam propriedades qualitativas ou quantitativas de uma geometria

* Funções que descrevem relações entre duas geometrias
* Funções que criam novas geometrias a partir de geometrias existentes

Para um contexto geral sobre o suporte do MySQL para o uso de dados espaciais, consulte a Seção 11.4, “Tipos de Dados Espaciais”.