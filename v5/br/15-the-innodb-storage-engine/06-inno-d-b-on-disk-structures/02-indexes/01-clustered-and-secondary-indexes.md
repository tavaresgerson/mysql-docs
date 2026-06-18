#### 14.6.2.1 Índices Clustered e Secundários

Cada tabela `InnoDB` possui um index especial chamado clustered index que armazena os dados da linha (row data). Tipicamente, o clustered index é sinônimo da Primary Key. Para obter o melhor desempenho em Queries, inserts e outras operações de Database, é importante entender como o `InnoDB` utiliza o clustered index para otimizar as operações comuns de busca (lookup) e DML.

* Quando você define uma `PRIMARY KEY` em uma tabela, o `InnoDB` a utiliza como o clustered index. Uma Primary Key deve ser definida para cada tabela. Se não houver uma coluna ou conjunto de colunas lógico, exclusivo e non-null para ser usado como Primary Key, adicione uma coluna de auto-incremento. Os valores da coluna de auto-incremento são únicos e são adicionados automaticamente à medida que novas linhas são inseridas.

* Se você não definir uma `PRIMARY KEY` para uma tabela, o `InnoDB` utiliza o primeiro index `UNIQUE` com todas as colunas de chave definidas como `NOT NULL` como o clustered index.

* Se uma tabela não tiver uma `PRIMARY KEY` ou um index `UNIQUE` adequado, o `InnoDB` gera um clustered index oculto chamado `GEN_CLUST_INDEX` em uma coluna sintética que contém valores de ID de linha (row ID). As linhas são ordenadas pelo ID de linha que o `InnoDB` atribui. O ID de linha é um campo de 6 bytes que aumenta monotonicamente à medida que novas linhas são inseridas. Assim, as linhas ordenadas pelo ID de linha estão fisicamente na ordem de inserção.

##### Como o Clustered Index Acelera as Queries

Acessar uma linha através do clustered index é rápido porque a busca no index leva diretamente à página que contém os dados da linha (row data). Se uma tabela for grande, a arquitetura do clustered index frequentemente economiza uma operação de I/O em disco em comparação com organizações de armazenamento que guardam os dados da linha usando uma página diferente do registro do index.

##### Como os Índices Secundários se Relacionam com o Clustered Index

Indexes diferentes do clustered index são conhecidos como secondary indexes (índices secundários). No `InnoDB`, cada registro em um secondary index contém as colunas da Primary Key para a linha, bem como as colunas especificadas para o secondary index. O `InnoDB` utiliza esse valor da Primary Key para buscar a linha no clustered index.

Se a Primary Key for longa, os secondary indexes utilizam mais espaço, portanto, é vantajoso ter uma Primary Key curta.

Para diretrizes sobre como tirar proveito dos índices clustered e secondary indexes do `InnoDB`, consulte a Seção 8.3, “Optimization and Indexes”.