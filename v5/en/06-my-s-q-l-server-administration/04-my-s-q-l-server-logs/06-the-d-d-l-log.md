### 5.4.6 O DDL Log

O DDL log, ou log de metadata, registra operações de metadata geradas por comandos de definição de dados que afetam o Partitioning de tabelas, como [`ALTER TABLE t3 DROP PARTITION p2`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations"), onde devemos garantir que o Partition seja completamente removido e que sua definição seja retirada da lista de Partitions para a tabela `t3`. O MySQL usa este log para se recuperar de um crash que ocorra no meio de uma operação de metadata de Partitioning.

Um registro das operações de metadata de Partitioning é escrito no arquivo `ddl_log.log`, no Data Directory do MySQL. Este é um arquivo binário; ele não é destinado à leitura humana, e você não deve tentar modificar seu conteúdo de forma alguma.

O `ddl_log.log` não é criado até que seja realmente necessário para registrar comandos de metadata, e é removido após um início bem-sucedido do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Assim, é possível que este arquivo não esteja presente em um servidor MySQL que esteja funcionando de maneira completamente normal.

O `ddl_log.log` pode armazenar até 1048573 entradas, o que equivale a 4 GB em tamanho. Assim que este limite for excedido, você deve renomear ou remover o arquivo antes que seja possível executar quaisquer comandos DDL adicionais. Esta é uma issue conhecida (Bug #83708).

Não há opções de servidor ou variáveis configuráveis pelo usuário associadas a este arquivo.