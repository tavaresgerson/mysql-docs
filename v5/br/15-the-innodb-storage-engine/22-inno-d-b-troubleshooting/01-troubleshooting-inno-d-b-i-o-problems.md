### 14.22.1 Solução de problemas com problemas de I/O do InnoDB

Os passos para solucionar problemas de E/S do `InnoDB` dependem de quando o problema ocorre: durante o início do servidor MySQL ou durante operações normais, quando uma instrução DML ou DDL falha devido a problemas no nível do sistema de arquivos.

#### Problemas de inicialização

Se algo der errado quando o `InnoDB` tenta inicializar seu espaço de tabelas ou seus arquivos de log, exclua todos os arquivos criados pelo `InnoDB`: todos os arquivos `ibdata` e todos os arquivos `ib_logfile`. Se você já criou algumas tabelas do `InnoDB`, também exclua os arquivos `.frm` correspondentes para essas tabelas e quaisquer arquivos `.ibd` se estiver usando vários espaços de tabelas, dos diretórios do banco de dados MySQL. Em seguida, tente criar o banco de dados do `InnoDB` novamente. Para facilitar a solução de problemas, inicie o servidor MySQL a partir de um prompt de comando para que você veja o que está acontecendo.

#### Problemas de execução

Se o `InnoDB` imprimir um erro do sistema operacional durante uma operação de arquivo, geralmente o problema tem uma das seguintes soluções:

- Certifique-se de que o diretório do arquivo de dados `InnoDB` e o diretório de log `InnoDB` existam.

- Certifique-se de que o **mysqld** tenha direitos de acesso para criar arquivos nesses diretórios.

- Certifique-se de que o **mysqld** possa ler o arquivo de opção adequado `my.cnf` ou `my.ini`, para que ele comece com as opções que você especificou.

- Certifique-se de que o disco não está cheio e que você não está ultrapassando qualquer quota de disco.

- Certifique-se de que os nomes que você especificar para subdiretórios e arquivos de dados não estejam em conflito.

- Verifique novamente a sintaxe dos valores `innodb_data_home_dir` e `innodb_data_file_path`. Em particular, qualquer valor `MAX` na opção `innodb_data_file_path` é um limite rígido, e exceder esse limite causa um erro fatal.
