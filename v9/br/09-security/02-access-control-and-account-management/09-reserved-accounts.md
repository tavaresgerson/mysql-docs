### 8.2.9 Contas Reservadas

Uma parte do processo de instalação do MySQL é a inicialização do diretório de dados (veja a Seção 2.9.1, “Inicialização do Diretório de Dados”). Durante a inicialização do diretório de dados, o MySQL cria contas de usuário que devem ser consideradas reservadas:

* `'root'@'localhost'`: Usado para fins administrativos. Esta conta tem todos os privilégios, é uma conta de sistema e pode realizar qualquer operação.

* **Strictly speaking**, este nome de conta não é reservado, no sentido de que algumas instalações renomeiam a conta `root` para algo mais, para evitar expor uma conta altamente privilegiada com um nome conhecido.

* `'mysql.sys'@'localhost'`: Usado como o `DEFINER` para objetos do esquema `sys`. O uso da conta `mysql.sys` evita problemas que ocorrem se um DBA renomear ou remover a conta `root`. Esta conta está bloqueada para que não possa ser usada para conexões de clientes.

* `'mysql.session'@'localhost'`: Usado internamente por plugins para acessar o servidor. Esta conta está bloqueada para que não possa ser usada para conexões de clientes. A conta é uma conta de sistema.

* `'mysql.infoschema'@'localhost'`: Usado como o `DEFINER` para visualizações do `INFORMATION_SCHEMA`. O uso da conta `mysql.infoschema` evita problemas que ocorrem se um DBA renomear ou remover a conta `root`. Esta conta está bloqueada para que não possa ser usada para conexões de clientes.