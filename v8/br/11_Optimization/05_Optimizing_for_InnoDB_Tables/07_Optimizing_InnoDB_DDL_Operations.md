### 10.5.7 Otimizando operações de DDL do InnoDB

- Muitas operações de DDL em tabelas e índices (as instruções `CREATE`, `ALTER` e `DROP`) podem ser realizadas online. Consulte a Seção 17.12, “InnoDB e DDL Online”, para obter detalhes.

- O suporte online para DDL (Data Definition Language) para adicionar índices secundários significa que você pode, geralmente, acelerar o processo de criação e carregamento de uma tabela e índices associados, criando a tabela sem índices secundários e, em seguida, adicionando os índices secundários após o carregamento dos dados.

- Use `TRUNCATE TABLE` para esvaziar uma tabela, não `DELETE FROM tbl_name`. As restrições de chave estrangeira podem fazer uma declaração `TRUNCATE` funcionar como uma declaração regular `DELETE`, nesse caso, uma sequência de comandos como `DROP TABLE` e `CREATE TABLE` pode ser a mais rápida.

- Como a chave primária é fundamental para o layout de armazenamento de cada tabela `InnoDB`, e alterar a definição da chave primária envolve a reorganização de toda a tabela, configure a chave primária como parte da declaração `CREATE TABLE` e planeje com antecedência para evitar que você precise de `ALTER` ou `DROP` a chave primária posteriormente.
