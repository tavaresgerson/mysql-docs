### 14.22.1 Solução de Problemas de I/O do InnoDB

As etapas de solução de problemas de I/O do `InnoDB` dependem de quando o problema ocorre: durante a inicialização do MySQL server, ou durante operações normais quando uma instrução DML ou DDL falha devido a problemas no nível do file system.

#### Problemas de Inicialização

Se algo der errado quando o `InnoDB` tentar inicializar seu tablespace ou seus log files, exclua todos os arquivos criados pelo `InnoDB`: todos os arquivos `ibdata` e todos os arquivos `ib_logfile`. Se você já criou algumas tables `InnoDB`, exclua também os arquivos `.frm` correspondentes a essas tables, e quaisquer arquivos `.ibd` se você estiver usando múltiplos tablespaces, dos diretórios do MySQL database. Em seguida, tente a criação do `InnoDB` database novamente. Para facilitar a solução de problemas, inicie o MySQL server a partir de um prompt de comando para que você possa ver o que está acontecendo.

#### Problemas de Runtime

Se o `InnoDB` imprimir um erro do sistema operacional durante uma file operation (operação de arquivo), geralmente o problema tem uma das seguintes soluções:

*   Certifique-se de que o diretório do data file do `InnoDB` e o diretório de log do `InnoDB` existam.

*   Certifique-se de que o **mysqld** tenha direitos de acesso para criar arquivos nesses diretórios.

*   Certifique-se de que o **mysqld** possa ler o arquivo de opções `my.cnf` ou `my.ini` apropriado, para que ele inicie com as opções que você especificou.

*   Certifique-se de que o disco não esteja cheio e que você não esteja excedendo nenhuma quota de disco (disk quota).

*   Certifique-se de que os nomes especificados para subdiretórios e data files não entrem em conflito.

*   Verifique novamente a sintaxe dos valores `innodb_data_home_dir` e `innodb_data_file_path`. Em particular, qualquer valor `MAX` na opção `innodb_data_file_path` é um limite rígido (hard limit), e exceder esse limite causa um erro fatal.