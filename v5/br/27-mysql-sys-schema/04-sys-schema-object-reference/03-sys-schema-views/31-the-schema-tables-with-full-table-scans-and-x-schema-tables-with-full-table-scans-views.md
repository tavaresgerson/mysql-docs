#### 26.4.3.31 As Views schema_tables_with_full_table_scans e x$schema_tables_with_full_table_scans

Essas views exibem quais tabelas estão sendo acessadas através de *full table scans* (varreduras completas da tabela). Por padrão, as linhas (*rows*) são ordenadas de forma decrescente pelo número de *rows scanned*.

As views `schema_tables_with_full_table_scans` e `x$schema_tables_with_full_table_scans` possuem estas colunas:

* `object_schema`

  O nome do *schema*.

* `object_name`

  O nome da tabela.

* `rows_full_scanned`

  O número total de linhas (*rows*) escaneadas por *full scans* da tabela.

* `latency`

  O tempo total de espera (*wait time*) dos *full scans* da tabela. (A latência).