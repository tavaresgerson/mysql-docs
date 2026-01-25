### 6.2.11 Gerenciamento de Senhas

O MySQL permite que administradores de Database expirem senhas de contas manualmente e estabeleçam uma política para expiração automática de senhas. A política de expiração pode ser estabelecida globalmente, e contas individuais podem ser configuradas para seguir a política global ou para substituí-la (override) com um comportamento específico por conta.

* [Armazenamento Interno Versus Externo de Credenciais](password-management.html#internal-versus-external-credentials "Armazenamento Interno Versus Externo de Credenciais")
* [Política de Expiração de Senha](password-management.html#password-expiration-policy "Política de Expiração de Senha")

#### Armazenamento Interno Versus Externo de Credenciais

Alguns plugins de autenticação armazenam credenciais de conta internamente no MySQL, na tabela de sistema `mysql.user`:

* `mysql_native_password`
* `sha256_password`

A discussão nesta seção aplica-se a esses plugins de autenticação porque os recursos de gerenciamento de senhas descritos aqui são baseados no armazenamento interno de credenciais gerenciado pelo próprio MySQL.

Outros plugins de autenticação armazenam credenciais de conta externamente ao MySQL. Para contas que usam plugins que realizam autenticação contra um sistema de credenciais externo, o gerenciamento de senhas também deve ser tratado externamente contra esse sistema.

Para informações sobre plugins de autenticação individuais, veja [Seção 6.4.1, “Authentication Plugins”](authentication-plugins.html "6.4.1 Authentication Plugins").

#### Política de Expiração de Senha

Para expirar uma senha de conta manualmente, use a instrução [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"):

```sql
ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
```

Essa operação marca a senha como expirada na linha correspondente da tabela de sistema `mysql.user`.

A expiração de senha de acordo com a política é automática e baseada na idade da senha, que para uma determinada conta é avaliada a partir da data e hora de sua alteração de senha mais recente. A tabela de sistema `mysql.user` indica para cada conta quando sua senha foi alterada pela última vez, e o servidor trata automaticamente a senha como expirada no momento da conexão do cliente se sua idade for maior do que seu tempo de vida permitido (permitted lifetime). Isso funciona sem expiração manual explícita de senha.

Para estabelecer a política de expiração automática de senhas globalmente, use a variável de sistema [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime). Seu valor padrão é 0, o que desabilita a expiração automática de senhas. Se o valor de [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) for um inteiro positivo *`N`*, ele indica o tempo de vida de senha permitido, de modo que as senhas devem ser alteradas a cada *`N`* dias.

Note

Antes da versão 5.7.11, o valor padrão de [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) era 360 (as senhas devem ser alteradas aproximadamente uma vez por ano). Para essas versões, esteja ciente de que, se você não fizer alterações na variável [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) ou nas contas de usuário individuais, a senha de cada usuário expirará após 360 dias e a conta começará a ser executada em modo restrito. Os Clientes que se conectam ao servidor usando a conta receberão um erro indicando que a senha deve ser alterada: `ERROR 1820 (HY000): You must reset your password using ALTER USER statement before executing this statement.`

No entanto, isso é fácil de ignorar para clientes que se conectam automaticamente ao servidor, como conexões feitas a partir de scripts. Para evitar que esses clientes parem de funcionar repentinamente devido à expiração de uma senha, certifique-se de alterar as configurações de expiração de senha para esses clientes, assim:

```sql
ALTER USER 'script'@'localhost' PASSWORD EXPIRE NEVER
```

Alternativamente, defina a variável [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) como `0`, desabilitando assim a expiração automática de senha para todos os usuários.

Exemplos:

* Para estabelecer uma política global em que as senhas tenham um tempo de vida de aproximadamente seis meses, inicie o servidor com estas linhas em um arquivo `my.cnf` do servidor:

  ```sql
  [mysqld]
  default_password_lifetime=180
  ```

* Para estabelecer uma política global em que as senhas nunca expirem, defina [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) como 0:

  ```sql
  [mysqld]
  default_password_lifetime=0
  ```

* O [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) também pode ser alterado em tempo de execução (runtime):

  ```sql
  SET GLOBAL default_password_lifetime = 180;
  SET GLOBAL default_password_lifetime = 0;
  ```

A política global de expiração de senha se aplica a todas as contas que não foram configuradas para substituí-la (override). Para estabelecer a política para contas individuais, use as opções `PASSWORD EXPIRE` das instruções [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") e [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"). Veja [Seção 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement"), e [Seção 13.7.1.1, “ALTER USER Statement”](alter-user.html "13.7.1.1 ALTER USER Statement").

Exemplos de instruções específicas da conta:

* Exigir que a senha seja alterada a cada 90 dias:

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY;
  ```

  Esta opção de expiração substitui a política global para todas as contas nomeadas pela instrução.

* Desabilitar a expiração de senha:

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ```

  Esta opção de expiração substitui a política global para todas as contas nomeadas pela instrução.

* Seguir (defer) a política de expiração global para todas as contas nomeadas pela instrução:

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ```

Quando um cliente se conecta com sucesso, o servidor determina se a senha da conta expirou:

* O servidor verifica se a senha foi expirada manualmente.

* Caso contrário, o servidor verifica se a idade da senha é maior do que seu tempo de vida permitido (permitted lifetime) de acordo com a política automática de expiração de senha. Se for, o servidor considera a senha expirada.

Se a senha estiver expirada (manual ou automaticamente), o servidor desconecta o cliente ou restringe as operações permitidas a ele (veja [Seção 6.2.12, “Server Handling of Expired Passwords”](expired-password-handling.html "6.2.12 Server Handling of Expired Passwords")). As operações realizadas por um cliente restrito resultam em um erro até que o usuário estabeleça uma nova senha de conta:

```sql
mysql> SELECT 1;
ERROR 1820 (HY000): You must reset your password using ALTER USER
statement before executing this statement.

mysql> ALTER USER USER() IDENTIFIED BY 'password';
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT 1;
+---+
| 1 |
+---+
| 1 |
+---+
1 row in set (0.00 sec)
```

Este modo de operação restrito permite instruções [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"), o que é útil antes do MySQL 5.7.6 se [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") precisar ser usado em vez de [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") e a senha da conta tiver um formato de hashing que exija que [`old_passwords`](server-system-variables.html#sysvar_old_passwords) seja definido para um valor diferente do seu padrão.

Depois que o cliente redefine a senha, o servidor restaura o acesso normal para a sessão, bem como para as conexões subsequentes que usam a conta. Também é possível que um usuário administrativo redefina a senha da conta, mas quaisquer sessões restritas existentes para essa conta permanecem restritas. Um cliente usando a conta deve desconectar e reconectar antes que as instruções possam ser executadas com sucesso.

Note

Embora seja possível “resetar” uma senha expirada definindo-a com seu valor atual, é preferível, como uma questão de boa política, escolher uma senha diferente.
