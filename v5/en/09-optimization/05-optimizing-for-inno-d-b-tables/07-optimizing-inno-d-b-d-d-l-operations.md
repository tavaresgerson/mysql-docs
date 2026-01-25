### 8.5.7 Otimizando Operações DDL do InnoDB

* Muitas operações DDL em Tables e Indexes (instruções `CREATE`, `ALTER` e `DROP`) podem ser executadas online. Consulte a Seção 14.13, “InnoDB e Online DDL” para detalhes.

* O suporte de Online DDL para adicionar Secondary Indexes significa que você pode geralmente acelerar o processo de criação e carregamento de uma Table e Indexes associados, criando a Table sem Secondary Indexes e, em seguida, adicionando os Secondary Indexes após o carregamento dos dados.

* Use `TRUNCATE TABLE` para esvaziar uma Table, e não `DELETE FROM tbl_name`. As restrições de Foreign Key podem fazer com que uma instrução `TRUNCATE` funcione como uma instrução `DELETE` regular, caso em que uma sequência de comandos como `DROP TABLE` e `CREATE TABLE` pode ser a mais rápida.

* Como a Primary Key é fundamental para o layout de armazenamento de cada Table `InnoDB`, e alterar a definição da Primary Key envolve reorganizar a Table inteira, sempre configure a Primary Key como parte da instrução `CREATE TABLE`, e planeje com antecedência para que você não precise fazer um `ALTER` ou `DROP` na Primary Key posteriormente.