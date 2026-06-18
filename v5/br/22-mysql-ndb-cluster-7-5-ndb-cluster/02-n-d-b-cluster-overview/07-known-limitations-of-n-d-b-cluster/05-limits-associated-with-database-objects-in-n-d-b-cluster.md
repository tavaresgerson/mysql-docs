#### 21.2.7.5 Limites Associados a Objetos de Database no NDB Cluster

Alguns objetos de database, como tables e indexes, possuem limitações diferentes ao utilizar o storage engine `NDBCLUSTER`:

* **Nomes de Database e Table.** Ao usar o storage engine `NDB`, o comprimento máximo permitido tanto para nomes de database quanto para nomes de table é de 63 caracteres. Uma statement que use um nome de database ou table mais longo do que este limite falha com um erro apropriado.

* **Número de objetos de Database.** O número máximo de *todos* os objetos de database `NDB` em um único NDB Cluster — incluindo databases, tables e indexes — é limitado a 20320.

* **Atributos por Table.** O número máximo de atributos (isto é, colunas e indexes) que podem pertencer a uma determinada table é 512.

* **Atributos por Key.** O número máximo de atributos por key é 32.

* **Tamanho da Row.** O tamanho máximo permitido para qualquer row é de 14000 bytes.

  Cada coluna `BLOB` ou `TEXT` contribui com 256 + 8 = 264 bytes para este total; isto inclui colunas `JSON`. Consulte String Type Storage Requirements, bem como JSON Storage Requirements, para mais informações relacionadas a esses tipos.

  Além disso, o offset máximo para uma coluna de largura fixa de uma table `NDB` é de 8188 bytes; tentar criar uma table que viole esta limitação falha com o erro NDB 851 Maximum offset for fixed-size columns exceeded. Para colunas baseadas em memória, você pode contornar esta limitação usando um tipo de coluna de largura variável como `VARCHAR` ou definindo a coluna como `COLUMN_FORMAT=DYNAMIC`; isto não funciona com colunas armazenadas em disco. Para colunas baseadas em disco, você pode ser capaz de contornar a limitação reordenando uma ou mais colunas baseadas em disco da table, de modo que a largura combinada de todas, exceto a coluna baseada em disco definida por último na statement `CREATE TABLE` usada para criar a table, não exceda 8188 bytes, menos qualquer possível arredondamento realizado para alguns data types como `CHAR` ou `VARCHAR`; caso contrário, é necessário usar storage baseado em memória para uma ou mais colunas problemáticas.

* **Storage de coluna BIT por table.** A largura combinada máxima para todas as colunas `BIT` usadas em uma determinada table `NDB` é de 4096.

* **Storage de coluna FIXED.** NDB Cluster 7.5 e posterior suporta um máximo de 128 TB por fragmento de dados em colunas `FIXED`. (Anteriormente, este limite era de 16 GB.)