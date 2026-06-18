### 8.2.16 Gerenciamento de Senhas Expirantes pelo Servidor

O MySQL oferece a capacidade de expiração de senhas, que permite que os administradores de banco de dados exijam que os usuários redefram suas senhas. As senhas podem expirar manualmente e com base em uma política de expiração automática (consulte a Seção 8.2.15, “Gestão de Senhas”).

A declaração `ALTER USER` habilita a expiração da senha da conta. Por exemplo:

```
ALTER USER 'myuser'@'localhost' PASSWORD EXPIRE;
```

Para cada conexão que utiliza uma conta com uma senha expirada, o servidor desliga o cliente ou restringe o cliente ao "modo sandbox", no qual o servidor permite que o cliente realize apenas as operações necessárias para redefinir a senha expirada. A ação tomada pelo servidor depende das configurações do cliente e do servidor, conforme discutido mais adiante.

Se o servidor desconectar o cliente, ele retorna um erro `ER_MUST_CHANGE_PASSWORD_LOGIN`:

```
$> mysql -u myuser -p
Password: ******
ERROR 1862 (HY000): Your password has expired. To log in you must
change it using a client that supports expired passwords.
```

Se o servidor restringir o cliente ao modo sandbox, essas operações serão permitidas dentro da sessão do cliente:

- O cliente pode redefinir a senha da conta com `ALTER USER` ou `SET PASSWORD`. Após isso, o servidor restaura o acesso normal para a sessão, bem como para as conexões subsequentes que utilizam a conta.

  Nota

  Embora seja possível "redefinir" uma senha expirada, definindo-a para seu valor atual, é preferível, por questão de boa prática, escolher uma senha diferente. Os administradores de banco de dados podem impor a não reutilização estabelecendo uma política apropriada de reutilização de senhas. Veja a Política de Reutilização de Senhas.

- Antes do MySQL 8.0.27, o cliente podia usar a instrução `SET`. A partir do MySQL 8.0.27, isso não é mais permitido.

Para qualquer operação não permitida durante a sessão, o servidor retorna um erro `ER_MUST_CHANGE_PASSWORD`:

```
mysql> USE performance_schema;
ERROR 1820 (HY000): You must reset your password using ALTER USER
statement before executing this statement.

mysql> SELECT 1;
ERROR 1820 (HY000): You must reset your password using ALTER USER
statement before executing this statement.
```

Isso é o que normalmente acontece com invocações interativas do cliente **mysql**, pois, por padrão, essas invocações são colocadas em modo sandbox. Para retomar o funcionamento normal, selecione uma nova senha.

Para chamadas não interativas do cliente **mysql** (por exemplo, em modo batch), o servidor normalmente desconecta o cliente se a senha expirar. Para permitir que as chamadas não interativas do **mysql** permaneçam conectadas para que a senha possa ser alterada (usando as instruções permitidas no modo sandbox), adicione a opção `--connect-expired-password` ao comando **mysql**.

Como mencionado anteriormente, se o servidor desconecta um cliente com senha expirada ou o restringe ao modo sandbox, depende de uma combinação de configurações do cliente e do servidor. A discussão a seguir descreve as configurações relevantes e como elas interagem.

Nota

Esta discussão se aplica apenas para contas com senhas expiradas. Se um cliente se conectar usando uma senha não expirada, o servidor trata o cliente normalmente.

Do lado do cliente, um cliente específico indica se ele pode lidar com o modo sandbox para senhas expiradas. Para clientes que usam a biblioteca de cliente C, há duas maneiras de fazer isso:

- Passe a bandeira `MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS` para `mysql_options()` antes de se conectar:

  ```
  bool arg = 1;
  mysql_options(mysql,
                MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS,
                &arg);
  ```

  Essa é a técnica usada dentro do cliente **mysql**, que permite `MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS` se invocado interativamente ou com a opção `--connect-expired-password`.

- Passe a bandeira `CLIENT_CAN_HANDLE_EXPIRED_PASSWORDS` para `mysql_real_connect()` no momento da conexão:

  ```
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

- Se `disconnect_on_expired_password` estiver ativado (o padrão), o servidor desconecta o cliente com um erro `ER_MUST_CHANGE_PASSWORD_LOGIN`.

- Se `disconnect_on_expired_password` estiver desativado, o servidor coloca o cliente no modo sandbox.
