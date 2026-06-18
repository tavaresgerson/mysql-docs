### 24.3.10 As Tabelas INFORMATION_SCHEMA GLOBAL_STATUS e SESSION_STATUS

Nota

O valor da System Variable `show_compatibility_56` afeta as informações disponíveis nas tabelas aqui descritas. Para detalhes, consulte a descrição dessa variável na Seção 5.1.7, “Server System Variables”.

Nota

As informações disponíveis nas tabelas aqui descritas também estão disponíveis no Performance Schema. As tabelas `INFORMATION_SCHEMA` estão em desuso (deprecated) em preferência às tabelas Performance Schema e serão removidas no MySQL 8.0. Para obter orientações sobre como migrar das tabelas `INFORMATION_SCHEMA` para as tabelas Performance Schema, consulte a Seção 25.20, “Migrating to Performance Schema System and Status Variable Tables”.

As tabelas `GLOBAL_STATUS` e `SESSION_STATUS` fornecem informações sobre as Status Variables do servidor. Seus conteúdos correspondem às informações produzidas pelas instruções `SHOW GLOBAL STATUS` e `SHOW SESSION STATUS` (consulte a Seção 13.7.5.35, “SHOW STATUS Statement”).

#### Notas

* A coluna `VARIABLE_VALUE` para cada uma dessas tabelas é definida como `VARCHAR(1024)`.