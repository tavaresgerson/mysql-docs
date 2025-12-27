#### 30.4.3.31 As vistas schema\_tables\_with\_full\_table\_scans e x$schema\_tables\_with\_full\_table\_scans

Essas vistas mostram quais tabelas estão sendo acessadas com varreduras de tabela completas. Por padrão, as linhas são ordenadas em ordem decrescente de varreduras de linhas completas.

As vistas `schema_tables_with_full_table_scans` e `x$schema_tables_with_full_table_scans` têm as seguintes colunas:

* `object_schema`

  O nome do esquema.

* `object_name`

  O nome da tabela.

* `rows_full_scanned`

  O número total de linhas varridas por varreduras de tabela completas.

* `latency`

  O tempo total de espera de varreduras de tabela completas.