### 17.12.3 Requisitos de Espaço em Disco para Operações DDL Online

Os requisitos de espaço em disco para operações DDL online são descritos abaixo. Os requisitos não se aplicam a operações realizadas instantaneamente.

* Arquivos de log temporários:

  Um arquivo de log temporário registra operações DML concorrentes quando uma operação DDL online cria um índice ou altera uma tabela. O arquivo de log temporário é ampliado conforme necessário pelo valor de `innodb_sort_buffer_size` até um máximo especificado por `innodb_online_alter_log_max_size`. Se a operação demorar muito tempo e a DML concorrente modificar a tabela tanto que o tamanho do arquivo de log temporário exceda o valor de `innodb_online_alter_log_max_size`, a operação DDL online falha com um erro `DB_ONLINE_LOG_TOO_BIG`, e as operações DML concorrentes não confirmadas são revertidas. Um grande valor de `innodb_online_alter_log_max_size` permite mais DML durante uma operação DDL online, mas também estende o período de tempo no final da operação DDL quando a tabela é bloqueada para aplicar a DML registrada.

  A variável `innodb_sort_buffer_size` também define o tamanho do buffer de leitura e do buffer de escrita do arquivo de log temporário.

* Arquivos de classificação temporários:

As operações de DDL online que reconstroem a tabela escrevem arquivos temporários de ordenação no diretório temporário do MySQL (`$TMPDIR` no Unix, `%TEMP%` no Windows ou o diretório especificado por `--tmpdir`) durante a criação do índice. Arquivos temporários de ordenação não são criados no diretório que contém a tabela original. Cada arquivo temporário de ordenação é grande o suficiente para conter uma coluna de dados, e cada arquivo de ordenação é removido quando seus dados são mesclados na tabela ou índice final. As operações que envolvem arquivos temporários de ordenação podem exigir espaço temporário igual à quantidade de dados na tabela mais os índices. Um erro é relatado se a operação de DDL online usar todo o espaço disponível no sistema de arquivos onde o diretório de dados reside.

  Se o diretório temporário do MySQL não for grande o suficiente para conter os arquivos de ordenação, defina `tmpdir` para um diretório diferente. Alternativamente, defina um diretório temporário separado para operações de DDL online usando `innodb_tmpdir`. Esta opção foi introduzida para ajudar a evitar overflows de diretórios temporários que poderiam ocorrer como resultado de grandes arquivos temporários de ordenação.

* Arquivos de tabela intermediários:

  Algumas operações de DDL online que reconstroem a tabela criam um arquivo temporário de tabela intermediária no mesmo diretório da tabela original. Um arquivo de tabela intermediária pode exigir espaço igual ao tamanho da tabela original. Os nomes dos arquivos de tabela intermediários começam com o prefixo `#sql-ib` e aparecem brevemente durante a operação de DDL online.

  A opção `innodb_tmpdir` não é aplicável aos arquivos de tabela intermediários.