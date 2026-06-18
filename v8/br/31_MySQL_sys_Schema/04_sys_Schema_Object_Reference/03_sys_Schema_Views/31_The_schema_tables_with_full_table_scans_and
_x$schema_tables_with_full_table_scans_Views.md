#### 30.4.3.31 As vistas schema\_tables\_with\_full\_table\_scans e x$schema\_tables\_with\_full\_table\_scans

Essas visualizações mostram quais tabelas estão sendo acessadas com varreduras completas da tabela. Por padrão, as linhas são ordenadas em ordem decrescente de varreduras.

As visualizações `schema_tables_with_full_table_scans` e `x$schema_tables_with_full_table_scans` possuem essas colunas:

- `object_schema`

  O nome do esquema.

- `object_name`

  O nome da tabela.

- `rows_full_scanned`

  O número total de linhas digitalizadas por varreduras completas da tabela.

- `latency`

  O tempo total de espera para varreduras completas da tabela.
