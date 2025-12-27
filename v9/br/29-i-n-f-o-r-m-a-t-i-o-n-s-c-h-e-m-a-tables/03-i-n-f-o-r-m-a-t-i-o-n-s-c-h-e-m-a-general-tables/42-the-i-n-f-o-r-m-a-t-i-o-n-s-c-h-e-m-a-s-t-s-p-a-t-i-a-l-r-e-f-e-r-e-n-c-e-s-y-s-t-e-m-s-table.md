### 28.3.42 A Tabela INFORMATION_SCHEMA ST_SPATIAL_REFERENCE_SYSTEMS

A tabela `ST_SPATIAL_REFERENCE_SYSTEMS` fornece informações sobre os sistemas de referência espacial (SRS) disponíveis para dados espaciais. Esta tabela é baseada no padrão SQL/MM (ISO/IEC 13249-3).

As entradas na tabela `ST_SPATIAL_REFERENCE_SYSTEMS` são baseadas no conjunto de dados do European Petroleum Survey Group (EPSG), exceto pelo SRID 0, que corresponde a um SRS especial usado no MySQL que representa um plano cartesiano plano infinito sem unidades atribuídas aos seus eixos. Para obter informações adicionais sobre SRSs, consulte a Seção 13.4.5, “Suporte ao Sistema de Referência Espacial”.

A tabela `ST_SPATIAL_REFERENCE_SYSTEMS` tem as seguintes colunas:

* `SRS_NAME`

  O nome do sistema de referência espacial. Este valor é único.

* `SRS_ID`

  O ID numérico do sistema de referência espacial. Este valor é único.

  Os valores de `SRS_ID` representam o mesmo tipo de valores que o SRID dos valores de geometria ou passados como argumento SRID para funções espaciais. O SRID 0 (o plano cartesiano sem unidades) é especial. É sempre um ID legítimo de sistema de referência espacial e pode ser usado em quaisquer cálculos sobre dados espaciais que dependem de valores SRID.

* `ORGANIZATION`

  O nome da organização que definiu o sistema de coordenadas em que o sistema de referência espacial é baseado.

* `ORGANIZATION_COORDSYS_ID`

  O ID numérico dado ao sistema de referência espacial pela organização que o definiu.

* `DEFINITION`

  A definição do sistema de referência espacial. Os valores `DEFINITION` são valores WKT, representados conforme especificado no documento do Open Geospatial Consortium OGC 12-063r5.

A análise de definição de sistemas de referência espacial ocorre sob demanda quando as definições são necessárias pelas funções de SIG. As definições analisadas são armazenadas no cache do dicionário de dados para permitir a reutilização e evitar o overhead de análise para cada declaração que precisa de informações do SRS.

* `DESCRIÇÃO`

  A descrição do sistema de referência espacial.

#### Notas

* As colunas `SRS_NAME`, `ORGANIZATION`, `ORGANIZATION_COORDSYS_ID` e `DESCRIPTION` contêm informações que podem ser de interesse para os usuários, mas não são usadas pelo MySQL.

#### Exemplo

```
mysql> SELECT * FROM ST_SPATIAL_REFERENCE_SYSTEMS
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

Esta entrada descreve o SRS usado para sistemas GPS. Tem um nome (`SRS_NAME`) de WGS 84 e um ID (`SRS_ID`) de 4326, que é o ID usado pelo European Petroleum Survey Group (EPSG).

Os valores `DEFINITION` para SRS projetados e geográficos começam com `PROJCS` e `GEOGCS`, respectivamente. A definição para SRID 0 é especial e tem um valor `DEFINITION` vazio. A seguinte consulta determina quantos registros na tabela `ST_SPATIAL_REFERENCE_SYSTEMS` correspondem a SRS projetados, geográficos e outros SRSs, com base nos valores `DEFINITION`:

```
mysql> SELECT
         COUNT(*),
         CASE LEFT(DEFINITION, 6)
           WHEN 'PROJCS' THEN 'Projected'
           WHEN 'GEOGCS' THEN 'Geographic'
           ELSE 'Other'
         END AS SRS_TYPE
       FROM INFORMATION_SCHEMA.ST_SPATIAL_REFERENCE_SYSTEMS
       GROUP BY SRS_TYPE;
+----------+------------+
| COUNT(*) | SRS_TYPE   |
+----------+------------+
|        1 | Other      |
|     4668 | Projected  |
|      483 | Geographic |
+----------+------------+
```

Para permitir a manipulação de entradas de SRS armazenadas no dicionário de dados, o MySQL fornece essas instruções SQL:

* `CREATE SPATIAL REFERENCE SYSTEM`: Veja a Seção 15.1.23, “Instrução CREATE SPATIAL REFERENCE SYSTEM”. A descrição desta instrução inclui informações adicionais sobre os componentes do SRS.

* `DROP SPATIAL REFERENCE SYSTEM`: Veja a Seção 15.1.36, “Instrução DROP SPATIAL REFERENCE SYSTEM”.