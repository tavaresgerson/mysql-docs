#### 21.2.7.5 Limites associados a objetos de banco de dados no NDB Cluster

Alguns objetos de banco de dados, como tabelas e índices, têm limitações diferentes ao usar o mecanismo de armazenamento `NDBCLUSTER`:

- **Nomes de banco de dados e tabelas.** Ao usar o mecanismo de armazenamento `NDB`, o comprimento máximo permitido tanto para nomes de banco de dados quanto para nomes de tabelas é de 63 caracteres. Uma declaração que utilize um nome de banco de dados ou de tabela com mais de esse limite falhará com um erro apropriado.

- **Número de objetos de banco de dados.** O número máximo de *todos os* objetos de banco de dados do NDB Cluster — incluindo bancos de dados, tabelas e índices — é limitado a 20.320.

- **Atributos por tabela.** O número máximo de atributos (ou seja, colunas e índices) que podem pertencer a uma determinada tabela é de 512.

- **Atributos por chave.** O número máximo de atributos por chave é de 32.

- **Tamanho da linha.** O tamanho máximo permitido para qualquer uma das linhas é de 14000 bytes.

  Cada coluna `BLOB` ou `TEXT` contribui com 256 + 8 = 264 bytes para esse total; isso inclui colunas `JSON`. Consulte Requisitos de Armazenamento do Tipo String, bem como Requisitos de Armazenamento do JSON, para obter mais informações sobre esses tipos.

  Além disso, o deslocamento máximo para uma coluna de largura fixa de uma tabela `NDB` é de 8188 bytes; tentar criar uma tabela que viole essa limitação falha com o erro NDB 851 "O limite máximo de deslocamento para colunas de tamanho fixo foi excedido". Para colunas baseadas em memória, você pode contornar essa limitação usando um tipo de coluna de largura variável, como `VARCHAR` ou definindo a coluna como `COLUMN_FORMAT=DYNAMIC`; isso não funciona com colunas armazenadas em disco. Para colunas baseadas em disco, você pode fazer isso reordenando uma ou mais das colunas baseadas em disco da tabela de modo que a largura combinada de todas, exceto a coluna baseada em disco definida na última instrução `CREATE TABLE` usada para criar a tabela, não exceda 8188 bytes, menos qualquer arredondamento possível realizado para alguns tipos de dados, como `CHAR` ou `VARCHAR`; caso contrário, é necessário usar armazenamento baseado em memória para uma ou mais das colunas ou colunas oficiais em vez disso.

- **Armazenamento em coluna BIT por tabela.** A largura combinada máxima para todas as colunas de tipo `BIT` usadas em uma determinada tabela `NDB` é de 4096.

- **Armazenamento de coluna FIXO.** O NDB Cluster 7.5 e versões posteriores suportam um máximo de 128 TB por fragmento de dados em colunas FIXO. (Anteriormente, isso era de 16 GB.)
