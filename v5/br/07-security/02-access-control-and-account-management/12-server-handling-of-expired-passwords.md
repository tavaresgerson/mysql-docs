### 6.2.12 Tratamento de senhas expiradas pelo servidor

O MySQL oferece a capacidade de expiração de senhas, que permite que os administradores de banco de dados exijam que os usuários redefram suas senhas. As senhas podem expirar manualmente e com base em uma política de expiração automática (consulte Seção 6.2.11, “Gestão de Senhas”).

A instrução `ALTER USER` permite a expiração da senha da conta. Por exemplo:

```sql
ALTER USER 'myuser'@'localhost' PASSWORD EXPIRE;
```

Para cada conexão que utiliza uma conta com uma senha expirada, o servidor desliga o cliente ou restringe o cliente ao "modo sandbox", no qual o servidor permite que o cliente realize apenas as operações necessárias para redefinir a senha expirada. A ação tomada pelo servidor depende das configurações do cliente e do servidor, conforme discutido mais adiante.

Se o servidor desconectar o cliente, ele retorna um erro `ER_MUST_CHANGE_PASSWORD_LOGIN`:

```sh
$> mysql -u myuser -p
Password: ******
ERROR 1862 (HY000): Your password has expired. To log in you must
change it using a client that supports expired passwords.
```

Se o servidor restringir o cliente ao modo sandbox, essas operações serão permitidas dentro da sessão do cliente:

- O cliente pode redefinir a senha da conta com `ALTER USER` ou `SET PASSWORD`. Após isso, o servidor restaura o acesso normal para a sessão, bem como para as conexões subsequentes que utilizam a conta.

  ::: info Nota
  Embora seja possível "redefinir" uma senha expirada, definindo-a para seu valor atual, é preferível, por questão de boa política, escolher uma senha diferente.
  :::
- O cliente pode usar a instrução `SET`, que é útil antes do MySQL 5.7.6 se a instrução `SET PASSWORD` precisar ser usada em vez da instrução `ALTER USER` e a conta usar um plugin de autenticação para o qual a variável de sistema `old_passwords` deve ser configurada primeiro com um valor não padrão para realizar a criptografia da senha de uma maneira específica.

Para qualquer operação não permitida durante a sessão, o servidor retorna um erro `ER_MUST_CHANGE_PASSWORD`:

```sql
mysql> USE performance_schema;
ERROR 1820 (HY000): You must reset your password using ALTER USER
statement before executing this statement.

mysql> SELECT 1;
ERROR 1820 (HY000): You must reset your password using ALTER USER
statement before executing this statement.
```

Isso é o que normalmente acontece com invocações interativas do cliente **mysql**, pois, por padrão, essas invocações são colocadas em modo sandbox. Para retomar o funcionamento normal, selecione uma nova senha.

Para chamadas não interativas do cliente **mysql** (por exemplo, em modo batch), o servidor normalmente desconecta o cliente se a senha expirar. Para permitir que chamadas não interativas do **mysql** permaneçam conectadas para que a senha possa ser alterada (usando as instruções permitidas no modo sandbox), adicione a opção `--connect-expired-password` ao comando **mysql**.

Como mencionado anteriormente, se o servidor desconecta um cliente com senha expirada ou o restringe ao modo sandbox, depende de uma combinação de configurações do cliente e do servidor. A discussão a seguir descreve as configurações relevantes e como elas interagem.

::: info Nota
Esta discussão se aplica apenas para contas com senhas expiradas. Se um cliente se conectar usando uma senha não expirada, o servidor trata o cliente normalmente.
:::

Do lado do cliente, um cliente específico indica se ele pode lidar com o modo sandbox para senhas expiradas. Para clientes que usam a biblioteca de cliente C, há duas maneiras de fazer isso:

- Passe a bandeira `MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS` para `mysql_options()` antes de se conectar:

  ```sql
  my_bool arg = 1;
  mysql_options(mysql,
                MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS,
                &arg);
  ```

  Essa é a técnica usada no cliente **mysql**, que habilita `MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS` se invocada interativamente ou com a opção `--connect-expired-password` (mysql-command-options.html#option_mysql_connect-expired-password).

- Passe a bandeira `CLIENT_CAN_HANDLE_EXPIRED_PASSWORDS` para `mysql_real_connect()` no momento da conexão:

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

Outros Conectores MySQL têm suas próprias convenções para indicar a prontidão para lidar com o modo sandbox. Consulte a documentação do Conector em que você está interessado.

No lado do servidor, se um cliente indicar que pode lidar com senhas expiradas, o servidor coloca-o no modo sandbox.

Se um cliente não indicar que pode lidar com senhas expiradas (ou usar uma versão mais antiga da biblioteca do cliente que não possa indicar isso), a ação do servidor depende do valor da variável de sistema `disconnect_on_expired_password`:

- Se `disconnect_on_expired_password` estiver habilitado (o padrão), o servidor desconecta o cliente com um erro `ER_MUST_CHANGE_PASSWORD_LOGIN`.
- Se `disconnect_on_expired_password` estiver desativado, o servidor coloca o cliente no modo sandbox.
