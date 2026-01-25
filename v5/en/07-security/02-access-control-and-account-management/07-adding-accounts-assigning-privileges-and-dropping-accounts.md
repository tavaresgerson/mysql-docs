### 6.2.7 Adicionando Contas, Atribuindo Privilégios e Removendo Contas

Para gerenciar contas MySQL, utilize as instruções SQL destinadas a essa finalidade:

* [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") e [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement") criam e removem contas.

* [`GRANT`](grant.html "13.7.1.4 GRANT Statement") e [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") atribuem privilégios a contas e revogam privilégios de contas.

* [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement") exibe as atribuições de privilégios de conta.

Instruções de gerenciamento de contas fazem com que o servidor realize modificações apropriadas nas *grant tables* subjacentes, que são discutidas na [Seção 6.2.3, “Grant Tables”](grant-tables.html "6.2.3 Grant Tables").

Nota

A modificação direta das *grant tables* utilizando instruções como [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement") ou [`DELETE`](delete.html "13.2.2 DELETE Statement") é desaconselhada e feita por sua conta e risco. O servidor está livre para ignorar linhas que se tornem malformadas como resultado de tais modificações.

A partir do MySQL 5.7.18, para qualquer operação que modifique uma *grant table*, o servidor verifica se a tabela possui a estrutura esperada e gera um erro, caso contrário. O [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") deve ser executado para atualizar as tabelas para a estrutura esperada.

Outra opção para criar contas é usar a ferramenta GUI (Graphical User Interface) MySQL Workbench. Além disso, vários programas de terceiros oferecem recursos para a administração de contas MySQL. O `phpMyAdmin` é um desses programas.

Esta seção discute os seguintes tópicos:

* [Criação de Contas e Concessão de Privilégios](creating-accounts.html#creating-accounts-granting-privileges "Creating Accounts and Granting Privileges")
* [Verificação de Privilégios e Propriedades de Contas](creating-accounts.html#checking-account-privileges "Checking Account Privileges and Properties")
* [Revogação de Privilégios de Contas](creating-accounts.html#revoking-account-privileges "Revoking Account Privileges")
* [Remoção de Contas](creating-accounts.html#dropping-accounts "Dropping Accounts")

Para informações adicionais sobre as instruções discutidas aqui, consulte a [Seção 13.7.1, “Account Management Statements”](account-management-statements.html "13.7.1 Account Management Statements").

#### Criação de Contas e Concessão de Privilégios

Os exemplos a seguir mostram como usar o programa cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para configurar novas contas. Esses exemplos pressupõem que a conta `root` do MySQL tem o privilégio [`CREATE USER`](privileges-provided.html#priv_create-user) e todos os privilégios que ela concede a outras contas.

Na linha de comando, conecte-se ao servidor como o usuário `root` do MySQL, fornecendo a senha apropriada no prompt de senha:

```sql
$> mysql -u root -p
Enter password: (enter root password here)
```

Após conectar-se ao servidor, você pode adicionar novas contas. O exemplo a seguir utiliza as instruções [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") e [`GRANT`](grant.html "13.7.1.4 GRANT Statement") para configurar quatro contas (onde você vir `'password'`, substitua por uma senha apropriada):

```sql
CREATE USER 'finley'@'localhost'
  IDENTIFIED BY 'password';
GRANT ALL
  ON *.*
  TO 'finley'@'localhost'
  WITH GRANT OPTION;

CREATE USER 'finley'@'%.example.com'
  IDENTIFIED BY 'password';
GRANT ALL
  ON *.*
  TO 'finley'@'%.example.com'
  WITH GRANT OPTION;

CREATE USER 'admin'@'localhost'
  IDENTIFIED BY 'password';
GRANT RELOAD,PROCESS
  ON *.*
  TO 'admin'@'localhost';

CREATE USER 'dummy'@'localhost';
```

As contas criadas por essas instruções possuem as seguintes propriedades:

* Duas contas têm o nome de usuário `finley`. Ambas são contas de *superuser* com privilégios globais completos para realizar qualquer ação. A conta `'finley'@'localhost'` pode ser usada apenas ao conectar-se a partir do *local host* (máquina local). A conta `'finley'@'%.example.com'` utiliza o *wildcard* `'%'` na parte do host, portanto, pode ser usada para conectar-se a partir de qualquer host no domínio `example.com`.

  A conta `'finley'@'localhost'` é necessária se houver uma conta de usuário anônimo para `localhost`. Sem a conta `'finley'@'localhost'`, essa conta de usuário anônimo tem precedência quando `finley` se conecta a partir do *local host*, e `finley` é tratado como um usuário anônimo. O motivo para isso é que a conta de usuário anônimo tem um valor de coluna `Host` mais específico do que a conta `'finley'@'%'` e, portanto, aparece mais cedo na ordem de classificação da tabela `user`. (Para obter informações sobre a classificação da tabela `user`, consulte a [Seção 6.2.5, “Access Control, Stage 1: Connection Verification”](connection-access.html "6.2.5 Access Control, Stage 1: Connection Verification").)

* A conta `'admin'@'localhost'` pode ser usada apenas pelo `admin` para conectar-se a partir do *local host*. Ela recebe os privilégios administrativos globais [`RELOAD`](privileges-provided.html#priv_reload) e [`PROCESS`](privileges-provided.html#priv_process). Esses privilégios permitem que o usuário `admin` execute os comandos [**mysqladmin reload**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"), [**mysqladmin refresh**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") e [**mysqladmin flush-*`xxx`***](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"), bem como [**mysqladmin processlist**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"). Nenhum privilégio é concedido para acessar quaisquer Databases. Você pode adicionar tais privilégios usando instruções [`GRANT`](grant.html "13.7.1.4 GRANT Statement").

* A conta `'dummy'@'localhost'` não tem senha (o que é inseguro e não recomendado). Esta conta pode ser usada apenas para conectar-se a partir do *local host*. Nenhum privilégio é concedido. Presume-se que você concederá privilégios específicos à conta usando instruções [`GRANT`](grant.html "13.7.1.4 GRANT Statement").

O exemplo anterior concede privilégios no nível global. O próximo exemplo cria três contas e concede acesso a elas em níveis inferiores; ou seja, a Databases específicas ou objetos dentro de Databases. Cada conta tem um nome de usuário `custom`, mas as partes do nome do host são diferentes:

```sql
CREATE USER 'custom'@'localhost'
  IDENTIFIED BY 'password';
GRANT ALL
  ON bankaccount.*
  TO 'custom'@'localhost';

CREATE USER 'custom'@'host47.example.com'
  IDENTIFIED BY 'password';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP
  ON expenses.*
  TO 'custom'@'host47.example.com';

CREATE USER 'custom'@'%.example.com'
  IDENTIFIED BY 'password';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP
  ON customer.addresses
  TO 'custom'@'%.example.com';
```

As três contas podem ser usadas da seguinte forma:

* A conta `'custom'@'localhost'` tem todos os privilégios de nível de Database para acessar o Database `bankaccount`. A conta pode ser usada para conectar-se ao servidor apenas a partir do *local host*.

* A conta `'custom'@'host47.example.com'` tem privilégios de nível de Database específicos para acessar o Database `expenses`. A conta pode ser usada para conectar-se ao servidor apenas a partir do host `host47.example.com`.

* A conta `'custom'@'%.example.com'` tem privilégios específicos de nível de Table para acessar a Table `addresses` no Database `customer`, a partir de qualquer host no domínio `example.com`. A conta pode ser usada para conectar-se ao servidor a partir de todas as máquinas no domínio devido ao uso do caractere *wildcard* `%` na parte do host do nome da conta.

#### Verificação de Privilégios e Propriedades de Contas

Para ver os privilégios de uma conta, utilize [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement"):

```sql
mysql> SHOW GRANTS FOR 'admin'@'localhost';
+-----------------------------------------------------+
| Grants for admin@localhost                          |
+-----------------------------------------------------+
| GRANT RELOAD, PROCESS ON *.* TO 'admin'@'localhost' |
+-----------------------------------------------------+
```

Para ver as propriedades de não-privilégio de uma conta, utilize [`SHOW CREATE USER`](show-create-user.html "13.7.5.12 SHOW CREATE USER Statement"):

```sql
mysql> SHOW CREATE USER 'admin'@'localhost'\G
*************************** 1. row ***************************
CREATE USER for admin@localhost: CREATE USER 'admin'@'localhost'
IDENTIFIED WITH 'mysql_native_password'
AS '*67ACDEBDAB923990001F0FFB017EB8ED41861105'
REQUIRE NONE PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK
```

#### Revogação de Privilégios de Contas

Para revogar privilégios de conta, utilize a instrução [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"). Os privilégios podem ser revogados em diferentes níveis, assim como podem ser concedidos em diferentes níveis.

Revogue privilégios globais:

```sql
REVOKE ALL
  ON *.*
  FROM 'finley'@'%.example.com';

REVOKE RELOAD
  ON *.*
  FROM 'admin'@'localhost';
```

Revogue privilégios de nível de Database:

```sql
REVOKE CREATE,DROP
  ON expenses.*
  FROM 'custom'@'host47.example.com';
```

Revogue privilégios de nível de Table:

```sql
REVOKE INSERT,UPDATE,DELETE
  ON customer.addresses
  FROM 'custom'@'%.example.com';
```

Para verificar o efeito da revogação de privilégios, utilize [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement"):

```sql
mysql> SHOW GRANTS FOR 'admin'@'localhost';
+---------------------------------------------+
| Grants for admin@localhost                  |
+---------------------------------------------+
| GRANT PROCESS ON *.* TO 'admin'@'localhost' |
+---------------------------------------------+
```

#### Remoção de Contas

Para remover uma conta, utilize a instrução [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement"). Por exemplo, para remover algumas das contas criadas anteriormente:

```sql
DROP USER 'finley'@'localhost';
DROP USER 'finley'@'%.example.com';
DROP USER 'admin'@'localhost';
DROP USER 'dummy'@'localhost';
```
