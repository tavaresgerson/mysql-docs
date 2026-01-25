### 6.2.8 Contas Reservadas

Uma parte do processo de instalação do MySQL é a inicialização do diretório de dados (*data directory initialization*) (veja [Section 2.9.1, “Initializing the Data Directory”](data-directory-initialization.html "2.9.1 Initializing the Data Directory")). Durante a inicialização do *data directory*, o MySQL cria *user accounts* que devem ser consideradas reservadas:

* `'root'@'localhost`: Usada para fins administrativos. Esta conta possui todos os *privileges* e pode executar qualquer operação.

  Estritamente falando, o nome desta conta não é reservado, no sentido de que algumas instalações renomeiam a conta `root` para outro nome, a fim de evitar expor uma conta altamente privilegiada com um nome bem conhecido.

* `'mysql.sys'@'localhost'`: Usada como o `DEFINER` para objetos do *schema* [`sys`](sys-schema.html "Chapter 26 MySQL sys Schema"). O uso da conta `mysql.sys` evita problemas que ocorreriam caso um DBA renomeie ou remova a conta `root`. Esta conta é bloqueada (*locked*) para que não possa ser usada para *client connections*.

* `'mysql.session'@'localhost'`: Usada internamente por *plugins* para acessar o servidor. Esta conta é bloqueada (*locked*) para que não possa ser usada para *client connections*.