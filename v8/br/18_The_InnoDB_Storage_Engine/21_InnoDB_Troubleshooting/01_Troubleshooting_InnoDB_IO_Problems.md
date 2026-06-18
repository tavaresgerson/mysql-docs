### 17.21.1 Solução de problemas com problemas de E/S do InnoDB

Os passos para solucionar problemas de entrada/saída `InnoDB` dependem de quando o problema ocorre: durante o início do servidor MySQL ou durante operações normais, quando uma instrução DML ou DDL falha devido a problemas no nível do sistema de arquivos.

#### Problemas de inicialização

Se algo der errado quando o `InnoDB` tenta inicializar seu espaço de tabelas ou seus arquivos de log, exclua todos os arquivos criados pelo `InnoDB`: todos os arquivos `ibdata` e todos os arquivos de log de reversão (arquivos `#ib_redoN` no MySQL 8.0.30 e versões posteriores ou arquivos `ib_logfile` em versões anteriores). Se você criou quaisquer tabelas `InnoDB`, também exclua quaisquer arquivos `.ibd` dos diretórios do banco de dados MySQL. Em seguida, tente inicializar novamente o `InnoDB`. Para facilitar a solução de problemas, inicie o servidor MySQL a partir de um prompt de comando para que você veja o que está acontecendo.

#### Problemas de execução

Se `InnoDB` imprimir um erro do sistema operacional durante uma operação de arquivo, geralmente o problema tem uma das seguintes soluções:

- Certifique-se de que o diretório do arquivo de dados `InnoDB` e o diretório de registro `InnoDB` existam.

- Certifique-se de que o **mysqld** tenha direitos de acesso para criar arquivos nesses diretórios.

- Certifique-se de que o **mysqld** possa ler o arquivo de opção adequado `my.cnf` ou `my.ini` para que ele comece com as opções que você especificou.

- Certifique-se de que o disco não está cheio e que você não está ultrapassando qualquer quota de disco.

- Certifique-se de que os nomes que você especificar para subdiretórios e arquivos de dados não estejam em conflito.

- Verifique novamente a sintaxe dos valores `innodb_data_home_dir` e `innodb_data_file_path`. Em particular, qualquer valor `MAX` na opção `innodb_data_file_path` é um limite rígido, e exceder esse limite causa um erro fatal.
