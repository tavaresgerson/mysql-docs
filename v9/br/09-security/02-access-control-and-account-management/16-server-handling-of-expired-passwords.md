### 8.2.16 Gerenciamento de Senhas Expirantes pelo Servidor

O MySQL oferece a capacidade de expirar senhas, permitindo que os administradores de banco de dados exijam que os usuários redefinam suas senhas. As senhas podem ser expiradas manualmente e com base em uma política de expiração automática (consulte a Seção 8.2.15, “Gestão de Senhas”).

A instrução `ALTER USER` permite a expiração da senha da conta. Por exemplo:

```
ALTER USER 'myuser'@'localhost' PASSWORD EXPIRE;
```

Para cada conexão que utiliza uma conta com senha expirada, o servidor desliga o cliente ou restringe o cliente ao modo “sandbox”, no qual o servidor permite que o cliente realize apenas as operações necessárias para redefinir a senha expirada. A ação tomada pelo servidor depende das configurações do cliente e do servidor, conforme discutido mais adiante.

Se o servidor desliga o cliente, ele retorna um erro `ER_MUST_CHANGE_PASSWORD_LOGIN`:

```
$> mysql -u myuser -p
Password: ******
ERROR 1862 (HY000): Your password has expired. To log in you must
change it using a client that supports expired passwords.
```

Se o servidor restringir o cliente ao modo sandbox, essas operações são permitidas dentro da sessão do cliente:

* O cliente pode redefinir a senha da conta com `ALTER USER` ou `SET PASSWORD`. Após isso, o servidor restaura o acesso normal para a sessão, bem como para conexões subsequentes que utilizam a conta.

**Observação**

Embora seja possível “redefinir” uma senha expirada, definindo-a para seu valor atual, é preferível, por questão de boas práticas, escolher uma senha diferente. Os DBA podem impor a não reutilização estabelecendo uma política apropriada de reutilização de senhas. Consulte a Política de Reutilização de Senhas.

Para qualquer operação não permitida dentro da sessão, o servidor retorna um erro `ER_MUST_CHANGE_PASSWORD`:

```
mysql> USE performance_schema;
ERROR 1820 (HY000): You must reset your password using ALTER USER
statement before executing this statement.

mysql> SELECT 1;
ERROR 1820 (HY000): You must reset your password using ALTER USER
statement before executing this statement.
```

Isso é o que normalmente acontece com invocatórias interativas do cliente **mysql**, pois, por padrão, essas invocatórias são colocadas no modo sandbox. Para retomar o funcionamento normal, selecione uma nova senha.

Para invocatórias não interativas do cliente **mysql** (por exemplo, em modo batch), o servidor normalmente desconecta o cliente se a senha expirar. Para permitir que as invocatórias **mysql** não interativas permaneçam conectadas para que a senha possa ser alterada (usando as instruções permitidas no modo sandbox), adicione a opção `--connect-expired-password` ao comando **mysql**.

Como mencionado anteriormente, se o servidor desconecta um cliente com senha expirada ou o restringe ao modo sandbox, isso depende de uma combinação de configurações do cliente e do servidor. A discussão a seguir descreve as configurações relevantes e como elas interagem.

Nota

Esta discussão aplica-se apenas para contas com senhas expiradas. Se um cliente se conectar usando uma senha não expirada, o servidor lida com o cliente normalmente.

Do lado do cliente, um determinado cliente indica se pode lidar com o modo sandbox para senhas expiradas. Para clientes que usam a biblioteca de cliente C, há duas maneiras de fazer isso:

* Passe a bandeira `MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS` para `mysql_options()` antes de se conectar:

  ```
  bool arg = 1;
  mysql_options(mysql,
                MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS,
                &arg);
  ```

  Essa é a técnica usada dentro do cliente **mysql**, que habilita `MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS` se invocado interativamente ou com a opção `--connect-expired-password`.

* Passe a bandeira `CLIENT_CAN_HANDLE_EXPIRED_PASSWORDS` para `mysql_real_connect()` no momento da conexão:

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

Outros Conectores MySQL têm suas próprias convenções para indicar prontidão para lidar com o modo sandbox. Consulte a documentação do Conector em que você está interessado.

No lado do servidor, se um cliente indicar que pode lidar com senhas expiradas, o servidor coloca-o no modo sandbox.

Se um cliente não indicar que pode lidar com senhas expiradas (ou usa uma versão mais antiga da biblioteca do cliente que não pode indicar isso), a ação do servidor depende do valor da variável de sistema `disconnect_on_expired_password`:

* Se `disconnect_on_expired_password` estiver habilitado (o padrão), o servidor desconecta o cliente com um erro `ER_MUST_CHANGE_PASSWORD_LOGIN`.

* Se `disconnect_on_expired_password` estiver desativado, o servidor coloca o cliente no modo sandbox.