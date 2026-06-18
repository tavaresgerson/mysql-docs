### 24.3.11 As Tabelas GLOBAL_VARIABLES e SESSION_VARIABLES do INFORMATION_SCHEMA

Nota

O valor da variável de sistema `show_compatibility_56` afeta as informações disponíveis nas tabelas descritas aqui. Para detalhes, consulte a descrição dessa variável em Seção 5.1.7, “Variáveis de Sistema do Servidor”.

Nota

As informações disponíveis nas tabelas descritas aqui também estão disponíveis no Performance Schema. As tabelas `INFORMATION_SCHEMA` foram descontinuadas (deprecated) em preferência às tabelas do Performance Schema e serão removidas no MySQL 8.0. Para obter orientações sobre a migração das tabelas `INFORMATION_SCHEMA` para as tabelas do Performance Schema, consulte Seção 25.20, “Migrando para Tabelas de Variáveis de Sistema e Status do Performance Schema”.

As tabelas `GLOBAL_VARIABLES` e `SESSION_VARIABLES` fornecem informações sobre as variáveis de status do servidor. Seus conteúdos correspondem às informações produzidas pelas instruções `SHOW GLOBAL VARIABLES` e `SHOW SESSION VARIABLES` (consulte Seção 13.7.5.39, “SHOW VARIABLES Statement”).

#### Notas

* A coluna `VARIABLE_VALUE` para cada uma dessas tabelas é definida como `VARCHAR(1024)`. Para variáveis com valores muito longos que não são exibidos completamente, utilize `SELECT` como uma solução alternativa (workaround). Por exemplo:

  ```sql
  SELECT @@GLOBAL.innodb_data_file_path;
  ```