### 8.5.7 Otimizando operações de DDL do InnoDB

- Muitas operações de DDL em tabelas e índices (`CREATE`, `ALTER` e `DROP` instruções) podem ser realizadas online. Consulte a Seção 14.13, “InnoDB e DDL Online”, para obter detalhes.

- O suporte online para DDL (Data Definition Language) para adicionar índices secundários significa que você pode, geralmente, acelerar o processo de criação e carregamento de uma tabela e índices associados, criando a tabela sem índices secundários e, em seguida, adicionando os índices secundários após o carregamento dos dados.

- Use `TRUNCATE TABLE` para esvaziar uma tabela, não `DELETE FROM tbl_name`. As restrições de chave estrangeira podem fazer com que uma instrução `TRUNCATE` funcione como uma instrução `DELETE` regular, nesse caso, uma sequência de comandos como `DROP TABLE` e `CREATE TABLE` pode ser a mais rápida.

- Como a chave primária é fundamental para o layout de armazenamento de cada tabela `InnoDB`, e alterar a definição da chave primária envolve a reorganização de toda a tabela, configure a chave primária sempre como parte da instrução `CREATE TABLE` e planeje com antecedência para evitar a necessidade de alterar ou excluir a chave primária posteriormente.
