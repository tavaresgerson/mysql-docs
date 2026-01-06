#### 14.6.2.1 Indekses agrupados e secundários

Cada tabela `InnoDB` possui um índice especial chamado índice agrupado que armazena os dados das linhas. Tipicamente, o índice agrupado é sinônimo da chave primária. Para obter o melhor desempenho em consultas, inserções e outras operações do banco de dados, é importante entender como o `InnoDB` utiliza o índice agrupado para otimizar as operações de busca comum e DML.

- Quando você define uma `PRIMARY KEY` em uma tabela, o `InnoDB` usa-a como índice agrupado. Uma chave primária deve ser definida para cada tabela. Se não houver uma coluna única lógica e não nula ou um conjunto de colunas para usar como chave primária, adicione uma coluna de autoincremento. Os valores das colunas de autoincremento são únicos e são adicionados automaticamente à medida que novas linhas são inseridas.

- Se você não definir uma `PRIMARY KEY` para uma tabela, o `InnoDB` usa o primeiro índice `UNIQUE` com todas as colunas da chave definidas como `NOT NULL` como o índice agrupado.

- Se uma tabela não tiver um `PRIMARY KEY` ou um índice `UNIQUE` adequado, o `InnoDB` gera um índice agrupado oculto chamado `GEN_CLUST_INDEX` em uma coluna sintética que contém valores de ID de linha. As linhas são ordenadas pelo ID de linha que o `InnoDB` atribui. O ID de linha é um campo de 6 bytes que aumenta de forma monótona à medida que novas linhas são inseridas. Assim, as linhas ordenadas pelo ID de linha estão fisicamente em ordem de inserção.

##### Como o Índice Agrupado Acelera as Consultas

Aceder a uma linha através do índice agrupado é rápido porque a pesquisa no índice leva diretamente à página que contém os dados da linha. Se uma tabela for grande, a arquitetura do índice agrupado muitas vezes economiza uma operação de E/S de disco em comparação com organizações de armazenamento que armazenam os dados da linha usando uma página diferente do registro do índice.

##### Como os índices secundários se relacionam com o índice agrupado

Os índices que não são o índice agrupado são conhecidos como índices secundários. No `InnoDB`, cada registro em um índice secundário contém as colunas da chave primária da linha, além das colunas especificadas para o índice secundário. O `InnoDB` usa esse valor da chave primária para procurar a linha no índice agrupado.

Se a chave primária for longa, os índices secundários ocuparão mais espaço, portanto, é vantajoso ter uma chave primária curta.

Para obter orientações sobre como aproveitar os índices agrupados e secundários do InnoDB, consulte a Seção 8.3, “Otimização e índices”.
