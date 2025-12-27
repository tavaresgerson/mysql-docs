### 28.3.41 A Tabela `INFORMATION_SCHEMA ST_GEOMETRY_COLUMNS`

A tabela `ST_GEOMETRY_COLUMNS` fornece informações sobre as colunas da tabela que armazenam dados espaciais. Esta tabela é baseada no padrão SQL/MM (ISO/IEC 13249-3), com as extensões indicadas. O MySQL implementa `ST_GEOMETRY_COLUMNS` como uma visão na tabela `COLUMNS` da `INFORMATION_SCHEMA`.

A tabela `ST_GEOMETRY_COLUMNS` tem as seguintes colunas:

* `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela que contém a coluna pertence. Este valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela que contém a coluna pertence.

* `TABLE_NAME`

  O nome da tabela que contém a coluna.

* `COLUMN_NAME`

  O nome da coluna.

* `SRS_NAME`

  O nome do sistema de referência espacial (SRS).

* `SRS_ID`

  O ID do sistema de referência espacial (SRID).

* `GEOMETRY_TYPE_NAME`

  O tipo de dado da coluna. Os valores permitidos são: `geometry`, `point`, `linestring`, `polygon`, `multipoint`, `multilinestring`, `multipolygon`, `geometrycollection`. Esta coluna é uma extensão do padrão do MySQL.