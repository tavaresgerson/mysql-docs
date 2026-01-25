### 27.6.2 Restrições ao Usar o Servidor MySQL Embutido

O servidor embutido possui as seguintes limitações:

* Sem funções carregáveis (loadable functions).
* Sem rastreamento de pilha (stack trace) em caso de core dump.
* Não é possível configurá-lo como source ou replica (sem Replication).

* Conjuntos de resultados muito grandes podem se tornar inutilizáveis em sistemas com pouca memória.
* Não é possível conectar-se a um servidor embutido a partir de um processo externo utilizando sockets ou TCP/IP. No entanto, você pode conectar-se a uma aplicação intermediária, que por sua vez pode se conectar ao servidor embutido em nome de um cliente remoto ou processo externo.

* A `libmysqld` não oferece suporte a conexões criptografadas. Uma implicação é que se uma aplicação vinculada à `libmysqld` estabelecer uma conexão com um servidor remoto, essa conexão não poderá ser criptografada.

* O `InnoDB` não é reentrante no servidor embutido e não pode ser usado para múltiplas conexões, seja sucessivamente ou simultaneamente.

* O Event Scheduler não está disponível. Por causa disso, a variável de sistema [`event_scheduler`](server-system-variables.html#sysvar_event_scheduler) é desativada.

* O Performance Schema não está disponível.
* O servidor embutido não pode compartilhar o mesmo diretório [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) com outro servidor. A partir do MySQL 5.7.8, o valor padrão para este diretório pode ser definido durante o tempo de compilação com a opção **CMake** [`INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR`](source-configuration-options.html#option_cmake_install_secure_file_priv_embeddeddir).

Algumas dessas limitações podem ser alteradas editando o arquivo de inclusão `mysql_embed.h` e recompilando o MySQL.