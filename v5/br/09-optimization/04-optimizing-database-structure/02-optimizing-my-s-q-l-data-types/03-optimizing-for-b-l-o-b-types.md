#### 8.4.2.3 Otimização para tipos de BLOB

- Ao armazenar um grande blob contendo dados textuais, considere comprimí-lo primeiro. Não use essa técnica quando toda a tabela estiver comprimida por `InnoDB` ou `MyISAM`.

- Para uma tabela com várias colunas, para reduzir os requisitos de memória para consultas que não utilizam a coluna BLOB, considere dividir a coluna BLOB em uma tabela separada e referenciá-la com uma consulta de junção quando necessário.

- Como os requisitos de desempenho para recuperar e exibir um valor BLOB podem ser muito diferentes dos de outros tipos de dados, você pode colocar a tabela específica para BLOB em um dispositivo de armazenamento diferente ou até mesmo em uma instância de banco de dados separada. Por exemplo, para recuperar um BLOB, pode ser necessário um grande leque sequencial de disco, que é mais adequado para um disco rígido tradicional do que para um dispositivo SSD.

- Consulte a Seção 8.4.2.2, “Otimização para Tipos de Caracteres e Strings”, para entender as razões pelas quais uma coluna `VARCHAR` binária é, por vezes, preferível a uma coluna BLOB equivalente.

- Em vez de testar a igualdade contra uma string de texto muito longa, você pode armazenar um hash do valor da coluna em uma coluna separada, indexar essa coluna e testar o valor hash nas consultas. (Use a função `MD5()` ou `CRC32()` para produzir o valor do hash.) Como as funções hash podem produzir resultados duplicados para diferentes entradas, você ainda inclui uma cláusula `AND blob_column = long_string_value` na consulta para evitar partidas falsas; o benefício de desempenho vem do índice menor e mais facilmente escaneado para os valores hash.
