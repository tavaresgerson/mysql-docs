#### 25.2.7.5 Limitações Associadas aos Objetos de Banco de Dados no NDB Cluster

Alguns objetos de banco de dados, como tabelas e índices, têm diferentes limitações ao usar o mecanismo de armazenamento `NDBCLUSTER`:

* **Número de objetos de banco de dados.** O número máximo de *todos os* objetos de banco de dados `NDB` em um único NDB Cluster—incluindo bancos de dados, tabelas e índices—está limitado a 20320.

* **Atributos por tabela.** O número máximo de atributos (ou seja, colunas e índices) que podem pertencer a uma determinada tabela é de 512.

* **Atributos por chave.** O número máximo de atributos por chave é de 32.

* **Tamanho da linha.** O tamanho máximo permitido de qualquer uma linha é de 30000 bytes.

Cada coluna `BLOB` ou `TEXT` contribui com 256 + 8 = 264 bytes para esse total; isso inclui colunas `JSON`. Consulte os Requisitos de Armazenamento do Tipo de String, bem como os Requisitos de Armazenamento JSON, para mais informações relacionadas a esses tipos.

Além disso, o limite máximo de deslocamento para uma coluna de largura fixa de uma tabela `NDB` é de 8188 bytes; tentar criar uma tabela que viole essa limitação falha com o erro NDB 851 O limite máximo de deslocamento para colunas de tamanho fixo foi excedido. Para colunas baseadas em memória, você pode contornar essa limitação usando um tipo de coluna de largura variável, como `VARCHAR` ou definindo a coluna como `COLUMN_FORMAT=DYNAMIC`; isso não funciona com colunas armazenadas em disco. Para colunas baseadas em disco, você pode fazer isso reordenando uma ou mais das colunas baseadas em disco da tabela de modo que a largura combinada de todas, exceto a coluna baseada em disco definida na última posição na declaração `CREATE TABLE` usada para criar a tabela, não exceda 8188 bytes, menos qualquer arredondamento possível realizado para alguns tipos de dados, como `CHAR` ou `VARCHAR`; caso contrário, é necessário usar armazenamento baseado em memória para uma ou mais das colunas ou colunas oficiais em vez disso.

* **Armazenamento de coluna BIT por tabela.** A largura combinada máxima para todas as colunas `BIT` usadas em uma determinada tabela `NDB` é de 4096.

* **Armazenamento de coluna FIXED.** O NDB Cluster suporta um máximo de 128 TB por fragmento de dados em colunas `FIXED`.