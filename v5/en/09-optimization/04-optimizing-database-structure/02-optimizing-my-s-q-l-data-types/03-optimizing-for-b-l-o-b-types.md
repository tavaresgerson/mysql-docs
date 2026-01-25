#### 8.4.2.3 Otimizando para Tipos BLOB

* Ao armazenar um BLOB grande contendo dados textuais, considere compactá-lo primeiro. Não use esta técnica quando a tabela inteira já estiver compactada por `InnoDB` ou `MyISAM`.

* Para uma tabela com várias colunas, a fim de reduzir os requisitos de memória para Querys que não utilizam a coluna BLOB, considere dividir a coluna BLOB em uma tabela separada e referenciá-la com uma Query de JOIN quando necessário.

* Visto que os requisitos de performance para recuperar e exibir um valor BLOB podem ser muito diferentes dos de outros tipos de dados, você pode colocar a tabela específica de BLOB em um dispositivo de armazenamento diferente ou até mesmo em uma instância de Database separada. Por exemplo, recuperar um BLOB pode exigir uma grande leitura sequencial de disco, o que é mais adequado para um disco rígido tradicional do que para um dispositivo SSD.

* Consulte a Seção 8.4.2.2, “Otimizando para Tipos de Caractere e String”, para saber as razões pelas quais uma coluna binária `VARCHAR` é, às vezes, preferível a uma coluna BLOB equivalente.

* Em vez de testar a igualdade contra uma string de texto muito longa, você pode armazenar um hash do valor da coluna em uma coluna separada, criar um Index nessa coluna e testar o valor hashed em Querys. (Use a função `MD5()` ou `CRC32()` para produzir o valor hash.) Como as funções hash podem produzir resultados duplicados para entradas diferentes, você ainda deve incluir uma cláusula `AND blob_column = long_string_value` na Query para evitar falsas correspondências; o benefício de performance vem do Index menor e facilmente escaneável para os valores hashed.