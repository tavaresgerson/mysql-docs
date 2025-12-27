### 13.4.5 Suporte ao Sistema de Referência Espacial

Um sistema de referência espacial (SRS) para dados espaciais é um sistema baseado em coordenadas para localizações geográficas.

Existem diferentes tipos de sistemas de referência espacial:

* Um SRS projetado é uma projeção de um globo em uma superfície plana; ou seja, um mapa plano. Por exemplo, uma lâmpada dentro de um globo que brilha em um cilindro de papel que circunda o globo projeta um mapa no papel. O resultado é georreferenciado: Cada ponto mapeia para um lugar no globo. O sistema de coordenadas nesse plano é cartesiano, usando uma unidade de comprimento (metros, pés, etc.), em vez de graus de longitude e latitude.

  Os globos, neste caso, são elipsoides; ou seja, esferas achatadas. A Terra é um pouco mais curta em seu eixo Norte-Sul do que em seu eixo Leste-Oeste, então uma esfera ligeiramente achatada é mais correta, mas esferas perfeitas permitem cálculos mais rápidos.

* Um SRS geográfico é um SRS não projetado que representa coordenadas de longitude-latitude (ou latitude-longitude) em um elipsoide, em qualquer unidade angular.

* O SRS indicado no MySQL por SRID 0 representa um plano cartesiano plano infinito sem unidades atribuídas aos seus eixos. Ao contrário dos SRS projetados, ele não é georreferenciado e não representa necessariamente a Terra. É um plano abstrato que pode ser usado para qualquer coisa. SRID 0 é o SRID padrão para dados espaciais no MySQL.

O MySQL mantém informações sobre os sistemas de referência espacial disponíveis para dados espaciais na tabela do dicionário de dados `mysql.st_spatial_reference_systems`, que pode armazenar entradas para SRSs projetadas e geográficas. Esta tabela do dicionário de dados é invisível, mas o conteúdo das entradas de SRS está disponível através da tabela `INFORMATION_SCHEMA` `ST_SPATIAL_REFERENCE_SYSTEMS`, implementada como uma visão na `mysql.st_spatial_reference_systems` (veja a Seção 28.3.42, “A Tabela INFORMATION\_SCHEMA ST\_SPATIAL\_REFERENCE\_SYSTEMS”).

O seguinte exemplo mostra como uma entrada de SRS parece:

```
mysql> SELECT *
       FROM INFORMATION_SCHEMA.ST_SPATIAL_REFERENCE_SYSTEMS
       WHERE SRS_ID = 4326\G
*************************** 1. row ***************************
                SRS_NAME: WGS 84
                  SRS_ID: 4326
            ORGANIZATION: EPSG
ORGANIZATION_COORDSYS_ID: 4326
              DEFINITION: GEOGCS["WGS 84",DATUM["World Geodetic System 1984",
                          SPHEROID["WGS 84",6378137,298.257223563,
                          AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],
                          PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],
                          UNIT["degree",0.017453292519943278,
                          AUTHORITY["EPSG","9122"]],
                          AXIS["Lat",NORTH],AXIS["Long",EAST],
                          AUTHORITY["EPSG","4326"]]
             DESCRIPTION:
```

Esta entrada descreve o SRS usado para sistemas GPS. Ela tem o nome (`SRS_NAME`) WGS 84 e o ID (`SRS_ID`) 4326, que é o ID usado pelo European Petroleum Survey Group (EPSG).

As definições de SRS na coluna `DEFINITION` são valores WKT, representados conforme especificado no documento do Open Geospatial Consortium OGC 12-063r5.

Os valores de `SRS_ID` representam o mesmo tipo de valores que o SRID de valores de geometria ou passados como argumento SRID para funções espaciais. O SRID 0 (o plano cartesiano unitário) é especial. É sempre um ID de sistema de referência espacial legal e pode ser usado em quaisquer cálculos em dados espaciais que dependem de valores SRID.

Para cálculos em múltiplos valores de geometria, todos os valores devem ter o mesmo SRID ou ocorrerá um erro.

A análise de definições de SRS ocorre sob demanda quando as definições são necessárias por funções GIS. As definições analisadas são armazenadas na cache do dicionário de dados para permitir a reutilização e evitar o overhead de análise para cada declaração que precisa de informações de SRS.

Para habilitar a manipulação de entradas de SRS armazenadas no dicionário de dados, o MySQL fornece estas instruções SQL:

* `CREATE SPATIAL REFERENCE SYSTEM`: Consulte a Seção 15.1.23, “Instrução CREATE SPATIAL REFERENCE SYSTEM”. A descrição desta instrução inclui informações adicionais sobre os componentes do SRS.

* `DROP SPATIAL REFERENCE SYSTEM`: Consulte a Seção 15.1.36, “Instrução DROP SPATIAL REFERENCE SYSTEM”. As duas instruções referenciadas acima exigem o privilégio `CREATE_SPATIAL_REFERENCE_SYSTEM` (preferível) ou o privilégio `SUPER` (desatualizado para este propósito).