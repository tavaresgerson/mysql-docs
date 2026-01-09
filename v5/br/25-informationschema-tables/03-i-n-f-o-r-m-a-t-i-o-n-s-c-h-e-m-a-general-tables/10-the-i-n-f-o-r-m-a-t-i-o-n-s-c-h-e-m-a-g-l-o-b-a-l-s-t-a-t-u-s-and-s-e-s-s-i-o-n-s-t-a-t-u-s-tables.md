### 24.3.10 Tabelas INFORMATION_SCHEMA GLOBAL_STATUS e SESSION_STATUS

Nota

O valor da variável de sistema `show_compatibility_56` afeta as informações disponíveis nas tabelas descritas aqui. Para obter detalhes, consulte a descrição dessa variável em Seção 5.1.7, "Variáveis de Sistema do Servidor".

Nota

As informações disponíveis nas tabelas descritas aqui também estão disponíveis no Gerenciamento de Desempenho. As tabelas `INFORMATION_SCHEMA` são desaconselhadas em favor das tabelas do Gerenciamento de Desempenho e serão removidas no MySQL 8.0. Para obter orientações sobre a migração das tabelas `INFORMATION_SCHEMA` para as tabelas do Gerenciamento de Desempenho, consulte Seção 25.20, “Migração para as tabelas do Gerenciamento de Desempenho e Variáveis de Status”.

As tabelas `GLOBAL_STATUS` e `SESSION_STATUS` fornecem informações sobre as variáveis de status do servidor. Seus conteúdos correspondem às informações produzidas pelas instruções `SHOW GLOBAL STATUS` e `SHOW SESSION STATUS` (veja Seção 13.7.5.35, “Instrução SHOW STATUS”).

#### Notas

- A coluna `VARIABLE_VALUE` para cada uma dessas tabelas é definida como `VARCHAR(1024)`.
