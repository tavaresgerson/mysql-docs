### 6.2.12 Tratamento pelo Servidor de Senhas Expiradas

MySQL fornece a capacidade de expiração de senha, que permite aos administradores de Database exigir que os usuários redefinam suas senhas. As senhas podem ser expiradas manualmente, e com base em uma política de expiração automática (consulte [Seção 6.2.11, “Gerenciamento de Senhas”](password-management.html "6.2.11 Gerenciamento de Senhas")).

A instrução [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") permite a expiração da senha da conta. Por exemplo:

```sql
ALTER USER 'myuser'@'localhost' PASSWORD EXPIRE;
```

Para cada conexão que usa uma conta com uma senha expirada, o servidor ou desconecta o cliente ou o restringe ao “sandbox mode” (modo de isolamento), no qual o servidor permite que o cliente execute apenas as operações necessárias para redefinir a senha expirada. Qual ação o servidor toma depende tanto das configurações do cliente quanto do servidor, conforme discutido adiante.

Se o servidor desconectar o cliente, ele retorna um erro [`ER_MUST_CHANGE_PASSWORD_LOGIN`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_must_change_password_login):

```sql
$> mysql -u myuser -p
Password: ******
ERROR 1862 (HY000): Your password has expired. To log in you must
change it using a client that supports expired passwords.
```

Se o servidor restringir o cliente ao sandbox mode, estas operações são permitidas dentro da sessão do cliente:

* O cliente pode redefinir a senha da conta com [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") ou [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement"). Depois que isso for feito, o servidor restaura o acesso normal para a sessão, bem como para conexões subsequentes que usam a conta.

  Nota

  Embora seja possível "redefinir" uma senha expirada definindo-a com seu valor atual, é preferível, como uma boa política, escolher uma senha diferente.

* O cliente pode usar a instrução [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"), o que é útil antes do MySQL 5.7.6 se [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") tiver que ser usado em vez de [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") e a conta usar um plugin de autenticação para o qual a variável de sistema [`old_passwords`](server-system-variables.html#sysvar_old_passwords) deve primeiro ser definida para um valor não padrão para realizar o hashing da senha de uma forma específica.

Para qualquer operação não permitida dentro da sessão, o servidor retorna um erro [`ER_MUST_CHANGE_PASSWORD`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_must_change_password):

```sql
mysql> USE performance_schema;
ERROR 1820 (HY000): You must reset your password using ALTER USER
statement before executing this statement.

mysql> SELECT 1;
ERROR 1820 (HY000): You must reset your password using ALTER USER
statement before executing this statement.
```

Isso é o que normalmente acontece para invocações interativas do cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") porque, por padrão, tais invocações são colocadas em sandbox mode. Para retomar o funcionamento normal, selecione uma nova senha.

Para invocações não interativas do cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") (por exemplo, em modo batch), o servidor normalmente desconecta o cliente se a senha estiver expirada. Para permitir que invocações não interativas do [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") permaneçam conectadas para que a senha possa ser alterada (usando as instruções permitidas em sandbox mode), adicione a opção [`--connect-expired-password`](mysql-command-options.html#option_mysql_connect-expired-password) ao comando [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

Conforme mencionado anteriormente, se o servidor desconecta um cliente com senha expirada ou o restringe ao sandbox mode depende de uma combinação de configurações do cliente e do servidor. A discussão a seguir descreve as configurações relevantes e como elas interagem.

Nota

Esta discussão se aplica apenas a contas com senhas expiradas. Se um cliente se conectar usando uma senha não expirada, o servidor lida com o cliente normalmente.

No lado do cliente, um determinado cliente indica se pode lidar com o sandbox mode para senhas expiradas. Para clientes que usam a biblioteca cliente C, há duas maneiras de fazer isso:

* Passe o flag `MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS` para [`mysql_options()`](/doc/c-api/5.7/en/mysql-options.html) antes de conectar:

  ```sql
  my_bool arg = 1;
  mysql_options(mysql,
                MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS,
                &arg);
  ```

  Esta é a técnica usada dentro do cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), que habilita `MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS` se invocado interativamente ou com a opção [`--connect-expired-password`](mysql-command-options.html#option_mysql_connect-expired-password).

* Passe o flag `CLIENT_CAN_HANDLE_EXPIRED_PASSWORDS` para [`mysql_real_connect()`](/doc/c-api/5.7/en/mysql-real-connect.html) no momento da conexão:

  ```sql
  MYSQL mysql;
  mysql_init(&mysql);
  if (!mysql_real_connect(&mysql,
                          host, user, password, db,
                          port, unix_socket,
                          CLIENT_CAN_HANDLE_EXPIRED_PASSWORDS))
  {
    ... handle error ...
  }
  ```

Outros MySQL Connectors têm suas próprias convenções para indicar prontidão para lidar com o sandbox mode. Consulte a documentação do Connector de seu interesse.

No lado do servidor, se um cliente indicar que pode lidar com senhas expiradas, o servidor o coloca em sandbox mode.

Se um cliente não indicar que pode lidar com senhas expiradas (ou usar uma versão mais antiga da biblioteca cliente que não pode indicar isso), a ação do servidor depende do valor da variável de sistema [`disconnect_on_expired_password`](server-system-variables.html#sysvar_disconnect_on_expired_password):

* Se [`disconnect_on_expired_password`](server-system-variables.html#sysvar_disconnect_on_expired_password) estiver habilitada (o padrão), o servidor desconecta o cliente com um erro [`ER_MUST_CHANGE_PASSWORD_LOGIN`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_must_change_password_login).

* Se [`disconnect_on_expired_password`](server-system-variables.html#sysvar_disconnect_on_expired_password) estiver desabilitada, o servidor coloca o cliente em sandbox mode.