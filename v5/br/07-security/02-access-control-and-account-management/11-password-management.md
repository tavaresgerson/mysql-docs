### 6.2.11 Gerenciamento de Senhas

O MySQL permite que os administradores de banco de dados expiram manualmente as senhas das contas e estabeleçam uma política para a expiração automática das senhas. A política de expiração pode ser estabelecida globalmente, e as contas individuais podem ser configuradas para adiar a aplicação da política global ou ignorar a política global com comportamentos específicos por conta.

- Armazenamento de credenciais internas versus externas \[password-management.html#internal-versus-external-credentials]
- Política de Expiração da Senha

#### Armazenamento de credenciais internas versus externas

Alguns plugins de autenticação armazenam as credenciais da conta internamente no MySQL, na tabela de sistema `mysql.user`:

- `mysql_native_password`
- `sha256_password`

A discussão nesta seção se aplica a esses plugins de autenticação, pois as capacidades de gerenciamento de senhas descritas aqui são baseadas no armazenamento de credenciais internas gerenciado pelo próprio MySQL.

Outros plugins de autenticação armazenam as credenciais da conta externamente no MySQL. Para contas que utilizam plugins que realizam autenticação contra um sistema de credenciais externo, a gestão de senhas também deve ser feita externamente contra esse sistema.

Para obter informações sobre plugins de autenticação individual, consulte Seção 6.4.1, “Plugins de Autenticação”.

#### Política de Expiração da Senha

Para expirar uma senha de conta manualmente, use a instrução `ALTER USER`:

```sql
ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
```

Esta operação marca a senha expirada na linha correspondente da tabela de sistema `mysql.user`.

A expiração da senha de acordo com a política é automática e baseia-se na idade da senha, que, para uma conta específica, é avaliada a partir da data e hora da última alteração da senha. A tabela `mysql.user` do sistema indica para cada conta quando sua senha foi alterada pela última vez, e o servidor trata automaticamente a senha como expirada no momento da conexão do cliente se sua idade for maior que sua vida útil permitida. Isso funciona sem expiração explícita manual da senha.

Para estabelecer uma política de expiração automática de senha globalmente, use a variável de sistema `default_password_lifetime`. Seu valor padrão é 0, o que desativa a expiração automática de senha. Se o valor de `default_password_lifetime` for um inteiro positivo *`N`*, ele indica o tempo de vida permitido da senha, de modo que as senhas devem ser alteradas a cada *`N`* dias.

Nota

Antes da versão 5.7.11, o valor padrão da variável `default_password_lifetime` é 360 (as senhas devem ser alteradas aproximadamente uma vez por ano). Para essas versões, esteja ciente de que, se você não fizer alterações na variável `default_password_lifetime` ou nas contas individuais dos usuários, cada senha do usuário expira após 360 dias e a conta começa a funcionar no modo restrito. Os clientes que se conectam ao servidor usando a conta recebem então um erro indicando que a senha deve ser alterada: `ERROR 1820 (HY000): Você deve redefinir sua senha usando o comando ALTER USER antes de executar este comando.`

No entanto, isso pode ser facilmente ignorado por clientes que se conectam automaticamente ao servidor, como as conexões feitas a partir de scripts. Para evitar que esses clientes parem de funcionar de repente devido à expiração da senha, certifique-se de alterar as configurações de expiração da senha para esses clientes, da seguinte forma:

```sql
ALTER USER 'script'@'localhost' PASSWORD EXPIRE NEVER
```

Alternativamente, defina a variável `default_password_lifetime` para `0`, desativando assim a expiração automática da senha para todos os usuários.

Exemplos:

- Para estabelecer uma política global de que as senhas tenham uma duração de aproximadamente seis meses, inicie o servidor com essas linhas em um arquivo `my.cnf` do servidor:

  ```sql
  [mysqld]
  default_password_lifetime=180
  ```

- Para estabelecer uma política global de modo que as senhas nunca expirem, defina `default_password_lifetime` para 0:

  ```sql
  [mysqld]
  default_password_lifetime=0
  ```

- `default_password_lifetime` também pode ser alterado em tempo de execução:

  ```sql
  SET GLOBAL default_password_lifetime = 180;
  SET GLOBAL default_password_lifetime = 0;
  ```

A política global de expiração de senhas aplica-se a todas as contas que não tenham sido configuradas para ignorá-la. Para definir a política para contas individuais, use as opções `PASSWORD EXPIRE` das instruções `[CREATE USER]` e `[ALTER USER]` (\[create-user.html] e \[alter-user.html], respectivamente). Consulte Seção 13.7.1.2, “Instrução CREATE USER” e Seção 13.7.1.1, “Instrução ALTER USER”.

Exemplos de declarações específicas para contas:

- Exigir que a senha seja alterada a cada 90 dias:

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY;
  ```

  Essa opção de expiração substitui a política global para todas as contas nomeadas pelo extrato.

- Desativar a expiração da senha:

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ```

  Essa opção de expiração substitui a política global para todas as contas nomeadas pelo extrato.

- Aplique a política de expiração global para todas as contas nomeadas na declaração:

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ```

Quando um cliente se conecta com sucesso, o servidor determina se a senha da conta expirou:

- O servidor verifica se a senha expirou manualmente.

- Caso contrário, o servidor verifica se a idade da senha é maior que sua vida útil permitida de acordo com a política automática de expiração da senha. Se for o caso, o servidor considera que a senha expirou.

Se a senha expirar (seja manualmente ou automaticamente), o servidor desconecta o cliente ou restringe as operações permitidas a ele (consulte Seção 6.2.12, “Tratamento do servidor de senhas expiradas”). As operações realizadas por um cliente restrito resultam em um erro até que o usuário estabeleça uma nova senha da conta:

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

Este modo de operação restrito permite as instruções `SET`, o que é útil antes do MySQL 5.7.6, se a instrução `SET PASSWORD` precisar ser usada em vez de `ALTER USER` e a senha da conta tiver um formato de hash que exija que `old_passwords` seja definido com um valor diferente do padrão.

Depois que o cliente redefini a senha, o servidor restaura o acesso normal para a sessão, bem como para as conexões subsequentes que utilizam a conta. Também é possível que um usuário administrativo redefina a senha da conta, mas quaisquer sessões restritas existentes para essa conta permanecem restritas. Um cliente que utiliza a conta deve se desconectar e se reconectar antes que as declarações possam ser executadas com sucesso.

Nota

Embora seja possível "redefinir" uma senha expirada, definindo-a para seu valor atual, é preferível, por questão de boa política, escolher uma senha diferente.
