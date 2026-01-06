### 24.3.11 Tabelas INFORMATION\_SCHEMA GLOBAL\_VARIABLES e SESSION\_VARIABLES

Nota

O valor da variável de sistema `show_compatibility_56` afeta as informações disponíveis nas tabelas descritas aqui. Para obter detalhes, consulte a descrição dessa variável em Seção 5.1.7, "Variáveis de Sistema do Servidor".

Nota

As informações disponíveis nas tabelas descritas aqui também estão disponíveis no Gerenciamento de Desempenho. As tabelas `INFORMATION_SCHEMA` são desaconselhadas em favor das tabelas do Gerenciamento de Desempenho e serão removidas no MySQL 8.0. Para obter orientações sobre a migração das tabelas `INFORMATION_SCHEMA` para as tabelas do Gerenciamento de Desempenho, consulte Seção 25.20, “Migração para as tabelas do Gerenciamento de Desempenho e Variáveis de Status”.

As tabelas `GLOBAL_VARIABLES` e `SESSION_VARIABLES` fornecem informações sobre as variáveis de status do servidor. Seus conteúdos correspondem às informações produzidas pelas instruções `SHOW GLOBAL VARIABLES` e `SHOW SESSION VARIABLES` (veja Seção 13.7.5.39, “Instrução SHOW VARIABLES”).

#### Notas

- A coluna `VARIABLE_VALUE` para cada uma dessas tabelas é definida como `VARCHAR(1024)`. Para variáveis com valores muito longos que não são completamente exibidos, use `SELECT` como uma solução alternativa. Por exemplo:

  ```sql
  SELECT @@GLOBAL.innodb_data_file_path;
  ```
