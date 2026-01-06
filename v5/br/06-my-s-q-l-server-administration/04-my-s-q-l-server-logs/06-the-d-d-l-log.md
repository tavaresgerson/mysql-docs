### 5.4.6 O Log do DDL

O log DDL, ou log de metadados, registra as operações de metadados geradas por declarações de definição de dados que afetam a partição de tabelas, como `ALTER TABLE t3 DROP PARTITION p2`, onde devemos garantir que a partição seja completamente removida e que sua definição seja removida da lista de partições da tabela `t3`. O MySQL usa esse log para se recuperar de um travamento que ocorre durante uma operação de metadados de partição.

Um registro das operações de partição de metadados é escrito no arquivo `ddl_log.log`, no diretório de dados do MySQL. Esse é um arquivo binário; ele não é destinado a ser legível por humanos, e você não deve tentar modificar seu conteúdo de qualquer maneira.

O `ddl_log.log` só é criado quando ele realmente for necessário para registrar declarações de metadados, e é removido após o início bem-sucedido do **mysqld**. Assim, é possível que esse arquivo não esteja presente em um servidor MySQL que esteja funcionando de maneira completamente normal.

O arquivo `ddl_log.log` pode conter até 1048573 entradas, o que equivale a 4 GB de tamanho. Quando esse limite for ultrapassado, você deve renomear ou remover o arquivo antes que seja possível executar quaisquer instruções DDL adicionais. Esse é um problema conhecido (Bug #83708).

Não há opções ou variáveis de servidor configuráveis pelo usuário associadas a este arquivo.
