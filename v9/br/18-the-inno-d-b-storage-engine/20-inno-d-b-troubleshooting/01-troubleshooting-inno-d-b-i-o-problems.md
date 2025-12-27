### 17.20.1 Solução de Problemas de E/S do InnoDB

Os passos para solucionar problemas de E/S do `InnoDB` dependem de quando o problema ocorre: durante o inicialização do servidor MySQL ou durante operações normais, quando uma instrução DML ou DDL falha devido a problemas no nível do sistema de arquivos.

#### Problemas de Inicialização

Se algo der errado quando o `InnoDB` tenta inicializar seu espaço de tabelas ou seus arquivos de log, exclua todos os arquivos criados pelo `InnoDB`: todos os arquivos `ibdata` e todos os arquivos de log de refazer (`#ib_redoN` arquivos). Se você criou alguma tabela `InnoDB`, também exclua todos os arquivos `.ibd` dos diretórios do banco de dados MySQL. Em seguida, tente inicializar o `InnoDB` novamente. Para uma solução mais fácil, inicie o servidor MySQL a partir de um prompt de comando para que você veja o que está acontecendo.

#### Problemas de Execução

Se o `InnoDB` imprimir um erro do sistema operacional durante uma operação de arquivo, geralmente o problema tem uma das seguintes soluções:

* Certifique-se de que o diretório de arquivo de dados do `InnoDB` e o diretório de log do `InnoDB` existam.

* Certifique-se de que o **mysqld** tenha direitos de acesso para criar arquivos nesses diretórios.

* Certifique-se de que o **mysqld** possa ler o arquivo de opção apropriado `my.cnf` ou `my.ini`, para que ele comece com as opções que você especificou.

* Certifique-se de que o disco não esteja cheio e você não esteja excedendo qualquer quota de disco.

* Certifique-se de que os nomes que você especifica para subdiretórios e arquivos de dados não estejam em conflito.

* Verifique novamente a sintaxe dos valores `innodb_data_home_dir` e `innodb_data_file_path`. Em particular, qualquer valor `MAX` na opção `innodb_data_file_path` é um limite rígido, e exceder esse limite causa um erro fatal.