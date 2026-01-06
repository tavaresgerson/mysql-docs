### 6.2.8 Contas Reservadas

Uma parte do processo de instalação do MySQL é a inicialização do diretório de dados (consulte Seção 2.9.1, “Inicialização do Diretório de Dados”). Durante a inicialização do diretório de dados, o MySQL cria contas de usuário que devem ser consideradas reservadas:

- `'root'@'localhost`: Usado para fins administrativos. Esta conta tem todos os privilégios e pode realizar qualquer operação.

  Estritamente falando, esse nome de conta não está reservado, no sentido de que algumas instalações renomeiam a conta `root` para algo mais, para evitar expor uma conta altamente privilegiada com um nome bem conhecido.

- `'@'localhost'`: Usado como `DEFINER` para objetos de esquema `sys`. O uso da conta `mysql.sys` evita problemas que ocorrem se um DBA renomear ou remover a conta `root`. Essa conta está bloqueada para que não possa ser usada para conexões de clientes.

- `'@'localhost'`: Usado internamente por plugins para acessar o servidor. Essa conta está bloqueada para que não possa ser usada para conexões de clientes.
