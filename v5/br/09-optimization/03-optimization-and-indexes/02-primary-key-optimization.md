### 8.3.2 Otimização da Chave Primária

A chave primária de uma tabela representa a coluna ou conjunto de colunas que você usa em suas consultas mais importantes. Ela possui um índice associado, para melhorar o desempenho das consultas. O desempenho das consultas se beneficia da otimização `NOT NULL`, porque não pode incluir quaisquer valores `NULL`. Com o mecanismo de armazenamento `InnoDB`, os dados da tabela são organizados fisicamente para realizar buscas e ordenamentos ultra-rápidos com base na coluna ou colunas da chave primária.

Se a sua tabela for grande e importante, mas não tiver uma coluna ou conjunto de colunas óbvias para usar como chave primária, você pode criar uma coluna separada com valores de autoincremento para usar como chave primária. Esses IDs únicos podem servir como ponteiros para as linhas correspondentes em outras tabelas quando você realizar uma junção de tabelas usando chaves estrangeiras.
