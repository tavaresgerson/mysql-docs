### 10.5.7 Otimizando operações de DDL do InnoDB

* Muitas operações de DDL em tabelas e índices (`CREATE`, `ALTER` e `DROP` instruções) podem ser realizadas online. Consulte a Seção 17.12, “InnoDB e DDL online” para obter detalhes.

* O suporte a DDL online para adicionar índices secundários significa que você geralmente pode acelerar o processo de criação e carregamento de uma tabela e índices associados ao criar a tabela sem índices secundários e, em seguida, adicionar os índices secundários após o carregamento dos dados.

* Use `TRUNCATE TABLE` para esvaziar uma tabela, não `DELETE FROM tbl_name`. As restrições de chave estrangeira podem fazer com que a instrução `TRUNCATE` funcione como uma instrução `DELETE` regular, caso em que uma sequência de comandos como `DROP TABLE` e `CREATE TABLE` pode ser a mais rápida.

* Como a chave primária é fundamental para o layout de armazenamento de cada tabela `InnoDB`, e alterar a definição da chave primária envolve a reorganização de toda a tabela, sempre configure a chave primária como parte da instrução `CREATE TABLE` e planeje com antecedência para não precisar alterar ou excluir a chave primária posteriormente.