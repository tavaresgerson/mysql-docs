### 8.2.8 Adicionando Contas, Atribuindo Privilegios e Removendo Contas

Para gerenciar contas MySQL, use as instruções SQL destinadas a esse propósito:

* `CREATE USER` e `DROP USER` criam e removem contas.
* `GRANT` e `REVOKE` atribuem e revogam privilégios de contas.
* `SHOW GRANTS` exibe as atribuições de privilégios de conta.

As instruções de gerenciamento de contas fazem com que o servidor faça as modificações apropriadas nas tabelas de concessão subjacentes, que são discutidas na Seção 8.2.3, “Tabelas de Concessão”.

::: info Nota

A modificação direta das tabelas de concessão usando instruções como `INSERT`, `UPDATE` ou `DELETE` é desencorajada e feita por sua conta e risco. O servidor é livre para ignorar linhas que se tornam malformadas como resultado de tais modificações.

Para qualquer operação que modifique uma tabela de concessão, o servidor verifica se a tabela tem a estrutura esperada e produz um erro se não for o caso. Para atualizar as tabelas para a estrutura esperada, realize o procedimento de atualização do MySQL. Veja o Capítulo 3, *Atualizando o MySQL*.

:::

Outra opção para criar contas é usar a ferramenta gráfica MySQL Workbench. Além disso, vários programas de terceiros oferecem capacidades para administração de contas MySQL. `phpMyAdmin` é um desses programas.

Esta seção discute os seguintes tópicos:

* Criando Contas e Atribuindo Privilegios
* Verificando Privilegios e Propriedades de Contas
* Revogando Privilegios de Conta
* Removendo Contas

Para obter informações adicionais sobre as instruções discutidas aqui, consulte a Seção 15.7.1, “Instruções de Gerenciamento de Contas”.

#### Criando Contas e Atribuindo Privilegios

Os seguintes exemplos mostram como usar o programa cliente `mysql` para configurar novas contas. Esses exemplos assumem que a conta `root` do MySQL tem o privilégio `CREATE USER` e todos os privilégios que ela concede a outras contas.

Na linha de comando, conecte-se ao servidor como o usuário `root` do MySQL, fornecendo a senha apropriada no prompt de senha:

```
$> mysql -u root -p
Enter password: (enter root password here)
```

Após se conectar ao servidor, você pode adicionar novas contas. O exemplo a seguir usa as instruções `CREATE USER` e `GRANT` para configurar quatro contas (onde você vê `'password'`, substitua uma senha apropriada):

```
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

As contas criadas por essas instruções têm as seguintes propriedades:

* Duas contas têm um nome de usuário de `finley`. Ambas são contas de superusuário com privilégios globais completos para fazer qualquer coisa. A conta `'finley'@'localhost'` pode ser usada apenas ao se conectar do host local. A conta `'finley'@'%.example.com'` usa o caractere `'%'` como caractere curinga na parte do host, então ela pode ser usada para se conectar de qualquer host no domínio `example.com`.

  A conta `'finley'@'localhost'` é necessária se houver uma conta de usuário anônimo para `localhost`. Sem a conta `'finley'@'localhost'`, essa conta de usuário anônimo tem precedência quando o `finley` se conecta do host local e o `finley` é tratado como um usuário anônimo. A razão para isso é que a conta de usuário anônimo tem um valor de coluna `Host` mais específico do que a conta `'finley'@'%'` e, portanto, vem antes no `user` table sort order. (Para informações sobre a classificação da tabela `user`, consulte  Seção 8.2.6, “Controle de Acesso, Etapa 1: Verificação de Conexão”.)
* A conta `'admin'@'localhost'` só pode ser usada pelo `admin` para se conectar do host local. Ela é concedida os privilégios administrativos globais `RELOAD` e `PROCESS`. Esses privilégios permitem que o usuário `admin` execute os comandos `mysqladmin reload`, `mysqladmin refresh`, `mysqladmin flush-xxx` e `mysqladmin processlist`. Nenhum privilégio é concedido para acessar quaisquer bancos de dados. Você poderia adicionar tais privilégios usando instruções `GRANT`.
* A conta `'dummy'@'localhost'` não tem senha (o que é inseguro e não recomendado). Esta conta só pode ser usada para se conectar do host local. Nenhum privilégio é concedido. Assume-se que você concede privilégios específicos à conta usando instruções `GRANT`.

O exemplo anterior concede privilégios a nível global. O próximo exemplo cria três contas e concede-lhes acesso em níveis mais baixos; ou seja, a bancos de dados específicos ou objetos dentro de bancos de dados. Cada conta tem um nome de usuário de `custom`, mas as partes do nome de host diferem:

```
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

* A conta `'custom'@'localhost'` tem todos os privilégios de nível de banco de dados para acessar o banco de dados `bankaccount`. A conta pode ser usada para se conectar ao servidor apenas a partir do host local.
* A conta `'custom'@'host47.example.com'` tem privilégios específicos de nível de banco de dados para acessar o banco de dados `expenses`. A conta pode ser usada para se conectar ao servidor apenas a partir do host `host47.example.com`.
* A conta `'custom'@'%'.example.com'` tem privilégios específicos de nível de tabela para acessar a tabela `addresses` no banco de dados `customer`, a partir de qualquer host no domínio `example.com`. A conta pode ser usada para se conectar ao servidor a partir de todas as máquinas no domínio devido ao uso do caractere `%` como caractere curinga na parte do host do nome da conta.

#### Verificando Privilegios e Propriedades da Conta

Para ver os privilégios de uma conta, use `SHOW GRANTS`:

```
mysql> SHOW GRANTS FOR 'admin'@'localhost';
+-----------------------------------------------------+
| Grants for admin@localhost                          |
+-----------------------------------------------------+
| GRANT RELOAD, PROCESS ON *.* TO `admin`@`localhost` |
+-----------------------------------------------------+
```

Para ver as propriedades não de privilégio de uma conta, use `SHOW CREATE USER`:

```
mysql> SET print_identified_with_as_hex = ON;
mysql> SHOW CREATE USER 'admin'@'localhost'\G
*************************** 1. row ***************************
CREATE USER for admin@localhost: CREATE USER `admin`@`localhost`
IDENTIFIED WITH 'caching_sha2_password'
AS 0x24412430303524301D0E17054E2241362B1419313C3E44326F294133734B30792F436E77764270373039612E32445250786D43594F45354532324B6169794F47457852796E32
REQUIRE NONE PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK
PASSWORD HISTORY DEFAULT
PASSWORD REUSE INTERVAL DEFAULT
PASSWORD REQUIRE CURRENT DEFAULT
```

Ativação da variável de sistema `print_identified_with_as_hex` faz com que `SHOW CREATE USER` exiba valores de hash que contêm caracteres não imprimíveis como strings hexadecimais em vez de como literais de string regulares.

#### Revocando Privilegios da Conta

Para revogar os privilégios da conta, use a instrução `REVOKE`. Os privilégios podem ser revogados em diferentes níveis, assim como podem ser concedidos em diferentes níveis.

Revocar privilégios globais:

```
REVOKE ALL
  ON *.*
  FROM 'finley'@'%.example.com';

REVOKE RELOAD
  ON *.*
  FROM 'admin'@'localhost';
```

Revocar privilégios de nível de banco de dados:

```
REVOKE CREATE,DROP
  ON expenses.*
  FROM 'custom'@'host47.example.com';
```

Revocar privilégios de nível de tabela:

```
REVOKE INSERT,UPDATE,DELETE
  ON customer.addresses
  FROM 'custom'@'%.example.com';
```

Para verificar o efeito da revogação de privilégios, use `SHOW GRANTS`:

```
mysql> SHOW GRANTS FOR 'admin'@'localhost';
+---------------------------------------------+
| Grants for admin@localhost                  |
+---------------------------------------------+
| GRANT PROCESS ON *.* TO `admin`@`localhost` |
+---------------------------------------------+
```

#### Deixando de Usar Contas

Para remover uma conta, use a instrução `DROP USER`. Por exemplo, para remover algumas das contas criadas anteriormente:

```
DROP USER 'finley'@'localhost';
DROP USER 'finley'@'%.example.com';
DROP USER 'admin'@'localhost';
DROP USER 'dummy'@'localhost';
```