#### 25.2.7.5 Limites associados a objetos de banco de dados no NDB Cluster

Alguns objetos de banco de dados, como tabelas e índices, têm limitações diferentes ao usar o mecanismo de armazenamento `NDBCLUSTER`:

- **Número de objetos de banco de dados.** O número máximo de *todos os* objetos de banco de dados `NDB` em um único NDB Cluster — incluindo bancos de dados, tabelas e índices — é limitado a 20.320.

- **Atributos por tabela.** O número máximo de atributos (ou seja, colunas e índices) que podem pertencer a uma determinada tabela é de 512.

- **Atributos por chave.** O número máximo de atributos por chave é de 32.

- **Tamanho da linha.** No NDB 8.0, o tamanho máximo permitido para qualquer linha é de 30000 bytes (aumentado de 14000 bytes nas versões anteriores).

  Cada coluna `BLOB` ou `TEXT` contribui com 256 + 8 = 264 bytes para esse total; isso inclui as colunas `JSON`. Consulte os Requisitos de Armazenamento de Tipo de String, bem como os Requisitos de Armazenamento de JSON, para obter mais informações sobre esses tipos.

  Além disso, o deslocamento máximo para uma coluna de largura fixa de uma tabela `NDB` é de 8188 bytes; tentar criar uma tabela que viole essa limitação falha com o erro NDB 851 "Deslocamento máximo para colunas de tamanho fixo excedido". Para colunas baseadas em memória, você pode contornar essa limitação usando um tipo de coluna de largura variável, como `VARCHAR` ou definindo a coluna como `COLUMN_FORMAT=DYNAMIC`; isso não funciona com colunas armazenadas em disco. Para colunas baseadas em disco, você pode fazer isso reordenando uma ou mais das colunas baseadas em disco da tabela de modo que a largura combinada de todas, exceto a coluna baseada em disco definida na última declaração `CREATE TABLE` usada para criar a tabela, não exceda 8188 bytes, menos qualquer arredondamento possível realizado para alguns tipos de dados, como `CHAR` ou `VARCHAR`; caso contrário, é necessário usar armazenamento baseado em memória para uma ou mais das colunas ou colunas oficiais em vez disso.

- **Armazenamento em coluna BIT por tabela.** A largura combinada máxima para todas as colunas `BIT` usadas em uma determinada tabela `NDB` é de 4096.

- **Armazenamento de coluna FIXADO.** O NDB Cluster 8.0 suporta um máximo de 128 TB por fragmento de dados nas colunas `FIXED`.
