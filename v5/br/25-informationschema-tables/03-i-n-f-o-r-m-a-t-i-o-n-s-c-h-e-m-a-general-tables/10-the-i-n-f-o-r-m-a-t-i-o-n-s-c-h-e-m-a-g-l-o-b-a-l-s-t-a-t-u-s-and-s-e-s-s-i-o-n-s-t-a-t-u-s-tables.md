### 24.3.10 As Tabelas INFORMATION_SCHEMA GLOBAL_STATUS e SESSION_STATUS

Nota

O valor da System Variable [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) afeta as informações disponíveis nas tabelas aqui descritas. Para detalhes, consulte a descrição dessa variável na [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

Nota

As informações disponíveis nas tabelas aqui descritas também estão disponíveis no Performance Schema. As tabelas `INFORMATION_SCHEMA` estão em desuso (deprecated) em preferência às tabelas Performance Schema e serão removidas no MySQL 8.0. Para obter orientações sobre como migrar das tabelas `INFORMATION_SCHEMA` para as tabelas Performance Schema, consulte a [Seção 25.20, “Migrating to Performance Schema System and Status Variable Tables”](performance-schema-variable-table-migration.html "25.20 Migrating to Performance Schema System and Status Variable Tables").

As tabelas [`GLOBAL_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") e [`SESSION_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") fornecem informações sobre as Status Variables do servidor. Seus conteúdos correspondem às informações produzidas pelas instruções [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") e [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") (consulte a [Seção 13.7.5.35, “SHOW STATUS Statement”](show-status.html "13.7.5.35 SHOW STATUS Statement")).

#### Notas

* A coluna `VARIABLE_VALUE` para cada uma dessas tabelas é definida como `VARCHAR(1024)`.