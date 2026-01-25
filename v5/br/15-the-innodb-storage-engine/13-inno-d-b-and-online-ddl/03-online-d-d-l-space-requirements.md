### 14.13.3 Requisitos de Espaço para DDL Online

As operações de DDL Online têm os seguintes requisitos de espaço:

*   Arquivos de log temporários:

    Um arquivo de log temporário registra DML concorrente quando uma operação de DDL Online cria um Index ou altera uma table. O arquivo de log temporário é estendido conforme necessário pelo valor de `innodb_sort_buffer_size` até um máximo especificado por `innodb_online_alter_log_max_size`. Se a operação levar muito tempo e o DML concorrente modificar a table de tal forma que o tamanho do arquivo de log temporário exceda o valor de `innodb_online_alter_log_max_size`, a operação de DDL Online falha com um erro `DB_ONLINE_LOG_TOO_BIG` e as operações de DML concorrente não confirmadas são submetidas a rollback. Uma configuração grande para `innodb_online_alter_log_max_size` permite mais DML durante uma operação de DDL Online, mas também prolonga o período de tempo, ao final da operação DDL, em que a table fica em Lock para aplicar o DML registrado no log.

    A variável `innodb_sort_buffer_size` também define o tamanho do read buffer e do write buffer do arquivo de log temporário.

*   Arquivos de ordenação temporários (Temporary sort files):

    As operações de DDL Online que reconstroem a table gravam arquivos de ordenação temporários no diretório temporário do MySQL (`$TMPDIR` no Unix, `%TEMP%` no Windows, ou o diretório especificado por `--tmpdir`) durante a criação do Index. Os arquivos de ordenação temporários não são criados no diretório que contém a table original. Cada arquivo de ordenação temporário é grande o suficiente para armazenar uma column de dados, e cada arquivo de ordenação é removido quando seus dados são mesclados na table ou Index final. Operações que envolvem arquivos de ordenação temporários podem exigir espaço temporário igual à quantidade de dados na table mais os Indexes. Um erro é relatado se a operação de DDL Online usar todo o espaço em disco disponível no file system onde reside o data directory.

    Se o diretório temporário do MySQL não for grande o suficiente para armazenar os arquivos de ordenação, defina `tmpdir` para um diretório diferente. Alternativamente, defina um diretório temporário separado para operações de DDL Online usando `innodb_tmpdir`. Esta opção foi introduzida no MySQL 5.7.11 para ajudar a evitar overflows (transbordamentos) de diretório temporário que poderiam ocorrer como resultado de grandes arquivos de ordenação temporários.

*   Arquivos de table intermediários:

    Algumas operações de DDL Online que reconstroem a table criam um arquivo de table intermediário temporário no mesmo diretório da table original. Um arquivo de table intermediário pode exigir espaço igual ao tamanho da table original. Os nomes de arquivo de table intermediários começam com o prefixo `#sql-ib` e aparecem apenas brevemente durante a operação de DDL Online.

    A opção `innodb_tmpdir` não é aplicável a arquivos de table intermediários.