### 6.2.9 Quando as Alterações de Privilégios Entram em Vigor

Se o servidor [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") for iniciado sem a opção [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables), ele lê todo o conteúdo das *grant tables* para a memória durante sua sequência de inicialização. As tabelas em memória tornam-se efetivas para o controle de acesso nesse momento.

Se você modificar as *grant tables* indiretamente usando uma instrução de gerenciamento de contas, o servidor nota essas alterações e carrega as *grant tables* novamente na memória imediatamente. As instruções de gerenciamento de contas são descritas em [Seção 13.7.1, “Instruções de Gerenciamento de Contas”](account-management-statements.html "13.7.1 Account Management Statements"). Exemplos incluem [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"), [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") e [`RENAME USER`](rename-user.html "13.7.1.5 RENAME USER Statement").

Se você modificar as *grant tables* diretamente usando instruções como [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement") ou [`DELETE`](delete.html "13.2.2 DELETE Statement") (o que não é recomendado), as alterações não têm efeito na checagem de privilégios até que você instrua o servidor a recarregar as tabelas ou o reinicie. Assim, se você alterar as *grant tables* diretamente, mas esquecer de recarregá-las, as alterações *não terão efeito* até que você reinicie o servidor. Isso pode fazer você se perguntar por que suas alterações parecem não fazer diferença!

Para instruir o servidor a recarregar as *grant tables*, execute uma operação de *flush-privileges*. Isso pode ser feito emitindo uma instrução [`FLUSH PRIVILEGES`](flush.html#flush-privileges) ou executando um comando [**mysqladmin flush-privileges**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") ou [**mysqladmin reload**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program").

Uma recarga das *grant tables* afeta os privilégios para cada sessão de cliente existente da seguinte forma:

*   Alterações de privilégios de Tabela e Coluna entram em vigor na próxima requisição do cliente.

*   Alterações de privilégios de Database entram em vigor na próxima vez que o cliente executar uma instrução `USE db_name`.

  Note

  Aplicações cliente podem fazer cache do nome do Database; portanto, esse efeito pode não ser visível para elas sem que haja uma mudança real para um Database diferente.

*   Privilégios globais e senhas não são afetados para um cliente conectado. Essas alterações só entram em vigor em sessões para conexões subsequentes.

Se o servidor for iniciado com a opção [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables), ele não lê as *grant tables* nem implementa qualquer controle de acesso. Qualquer usuário pode se conectar e realizar qualquer operação, *o que é inseguro.* Para fazer com que um servidor iniciado dessa forma leia as tabelas e ative a checagem de acesso, execute o *flush* dos privilégios.