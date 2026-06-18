### 13.4.5 Suporte ao Sistema de Referência Espacial

Um sistema de referência espacial (SRS) para dados espaciais é um sistema baseado em coordenadas para localização geográfica.

Existem diferentes tipos de sistemas de referência espacial:

- Um SRS projetado é uma projeção de um globo em uma superfície plana; ou seja, um mapa plano. Por exemplo, uma lâmpada dentro de um globo que brilha em um cilindro de papel ao redor do globo projeta um mapa no papel. O resultado é georreferenciado: cada ponto corresponde a um lugar no globo. O sistema de coordenadas nesse plano é cartesiano, usando uma unidade de comprimento (metros, pés, etc.), em vez de graus de longitude e latitude.

  Os globos neste caso são elipsóides; ou seja, esferas achatadas. A Terra é um pouco mais curta em seu eixo norte-sul do que em seu eixo leste-oeste, então uma esfera ligeiramente achatada é mais correta, mas esferas perfeitas permitem cálculos mais rápidos.

- Um SRS geográfico é um SRS não projetado que representa as coordenadas de longitude e latitude (ou latitude e longitude) em um elipsoide, em qualquer unidade angular.

- O SRS indicado no MySQL como SRID 0 representa um plano cartesiano plano infinito sem unidades atribuídas aos seus eixos. Ao contrário dos SRS projetados, ele não é georreferenciado e nem sempre representa a Terra. É um plano abstrato que pode ser usado para qualquer coisa. O SRID 0 é o SRID padrão para dados espaciais no MySQL.

O MySQL mantém informações sobre os sistemas de referência espacial disponíveis para dados espaciais na tabela do dicionário de dados `mysql.st_spatial_reference_systems` que pode armazenar entradas para SRSs projetadas e geográficas. Esta tabela do dicionário de dados é invisível, mas o conteúdo das entradas do SRS está disponível através da tabela `INFORMATION_SCHEMA` `ST_SPATIAL_REFERENCE_SYSTEMS`, implementada como uma visualização em `mysql.st_spatial_reference_systems` (ver Seção 28.3.36, “A tabela INFORMATION\_SCHEMA ST\_SPATIAL\_REFERENCE\_SYSTEMS”).

O exemplo a seguir mostra como uma entrada do SRS parece:

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

Esta entrada descreve o SRS utilizado nos sistemas GPS. Tem o nome (`SRS_NAME`) WGS 84 e o ID (`SRS_ID`) 4326, que é o ID utilizado pelo Grupo Europeu de Pesquisas Petrolíferas (EPSG).

As definições de SRS na coluna `DEFINITION` são valores WKT, representados conforme especificado no documento do Open Geospatial Consortium OGC 12-063r5.

Os valores `SRS_ID` representam o mesmo tipo de valores que o SRID dos valores de geometria ou passados como argumento SRID para funções espaciais. O SRID 0 (o plano cartesiano sem unidade) é especial. É sempre um ID legal de sistema de referência espacial e pode ser usado em quaisquer cálculos em dados espaciais que dependem dos valores SRID.

Para cálculos com múltiplos valores de geometria, todos os valores devem ter o mesmo SRID ou ocorrerá um erro.

A análise de definição de SRS ocorre sob demanda quando as definições são necessárias pelas funções do SIG. As definições analisadas são armazenadas no cache do dicionário de dados para permitir a reutilização e evitar o custo de análise de cada declaração que precisa de informações do SRS.

Para permitir a manipulação das entradas do SRS armazenadas no dicionário de dados, o MySQL fornece essas instruções SQL:

- `CREATE SPATIAL REFERENCE SYSTEM`: Consulte a Seção 15.1.19, “Declaração CREATE SPATIAL REFERENCE SYSTEM”. A descrição desta declaração inclui informações adicionais sobre os componentes do SRS.

- `DROP SPATIAL REFERENCE SYSTEM`: Veja a Seção 15.1.31, “Declaração DROP SPATIAL REFERENCE SYSTEM”.
