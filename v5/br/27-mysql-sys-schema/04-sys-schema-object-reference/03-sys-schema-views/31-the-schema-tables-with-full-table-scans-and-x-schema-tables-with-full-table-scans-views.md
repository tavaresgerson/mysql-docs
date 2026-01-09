#### 26.4.3.31 As vistas schema_tables_with_full_table_scans e x$schema_tables_with_full_table_scans

Essas visualizações mostram quais tabelas estão sendo acessadas com varreduras completas da tabela. Por padrão, as linhas são ordenadas em ordem decrescente de varreduras.

As views `schema_tables_with_full_table_scans` e `x$schema_tables_with_full_table_scans` possuem as seguintes colunas:

- `objeto_esquema`

  O nome do esquema.

- `nome_objeto`

  O nome da tabela.

- `rows_full_scanned`

  O número total de linhas digitalizadas por varreduras completas da tabela.

- latência

  O tempo total de espera para varreduras completas da tabela.
