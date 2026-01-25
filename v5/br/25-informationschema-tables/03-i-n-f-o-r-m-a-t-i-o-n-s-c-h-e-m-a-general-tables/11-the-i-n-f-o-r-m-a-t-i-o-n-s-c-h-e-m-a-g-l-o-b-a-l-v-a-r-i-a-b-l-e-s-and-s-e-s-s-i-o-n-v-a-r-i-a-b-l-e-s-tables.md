### 24.3.11 As Tabelas GLOBAL_VARIABLES e SESSION_VARIABLES do INFORMATION_SCHEMA

Nota

O valor da variável de sistema [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) afeta as informações disponíveis nas tabelas descritas aqui. Para detalhes, consulte a descrição dessa variável em [Seção 5.1.7, “Variáveis de Sistema do Servidor”](server-system-variables.html "5.1.7 Server System Variables").

Nota

As informações disponíveis nas tabelas descritas aqui também estão disponíveis no Performance Schema. As tabelas `INFORMATION_SCHEMA` foram descontinuadas (deprecated) em preferência às tabelas do Performance Schema e serão removidas no MySQL 8.0. Para obter orientações sobre a migração das tabelas `INFORMATION_SCHEMA` para as tabelas do Performance Schema, consulte [Seção 25.20, “Migrando para Tabelas de Variáveis de Sistema e Status do Performance Schema”](performance-schema-variable-table-migration.html "25.20 Migrating to Performance Schema System and Status Variable Tables").

As tabelas [`GLOBAL_VARIABLES`](information-schema-variables-table.html "24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables") e [`SESSION_VARIABLES`](information-schema-variables-table.html "24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables") fornecem informações sobre as variáveis de status do servidor. Seus conteúdos correspondem às informações produzidas pelas instruções [`SHOW GLOBAL VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") e [`SHOW SESSION VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") (consulte [Seção 13.7.5.39, “SHOW VARIABLES Statement”](show-variables.html "13.7.5.39 SHOW VARIABLES Statement")).

#### Notas

* A coluna `VARIABLE_VALUE` para cada uma dessas tabelas é definida como `VARCHAR(1024)`. Para variáveis com valores muito longos que não são exibidos completamente, utilize [`SELECT`](select.html "13.2.9 SELECT Statement") como uma solução alternativa (workaround). Por exemplo:

  ```sql
  SELECT @@GLOBAL.innodb_data_file_path;
  ```