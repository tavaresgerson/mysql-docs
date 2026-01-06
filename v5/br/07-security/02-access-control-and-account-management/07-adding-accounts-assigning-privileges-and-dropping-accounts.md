### 6.2.7 Adicionar contas, atribuir privilégios e excluir contas

Para gerenciar contas do MySQL, use as instruções SQL destinadas a esse propósito:

- `CREATE USER` e `DROP USER` criam e removem contas.

- `GRANT` e `REVOKE` atribuem privilégios e revogam privilégios de contas.

- `SHOW GRANTS` exibe as atribuições de privilégios da conta.

As declarações de gerenciamento de contas fazem com que o servidor faça as modificações apropriadas nas tabelas de concessão subjacentes, que são discutidas em Seção 6.2.3, "Tabelas de Concessão".

Nota

A modificação direta das tabelas de concessão usando instruções como `INSERT`, `UPDATE` ou `DELETE` é desencorajada e feita por sua própria conta e risco. O servidor tem a liberdade de ignorar linhas que se tornam malformadas como resultado dessas modificações.

A partir do MySQL 5.7.18, para qualquer operação que modifique uma tabela de concessão, o servidor verifica se a tabela tem a estrutura esperada e produz um erro se não for o caso. **mysql\_upgrade** deve ser executado para atualizar as tabelas para a estrutura esperada.

Outra opção para criar contas é usar a ferramenta de interface gráfica MySQL Workbench. Além disso, vários programas de terceiros oferecem funcionalidades para a administração de contas do MySQL. O `phpMyAdmin` é um desses programas.

Esta seção discute os seguintes tópicos:

- Criar Contas e Atribuir Privilegios
- Privilegios e propriedades da conta corrente
- Revocando privilégios da conta
- Excluir Contas

Para obter informações adicionais sobre as declarações discutidas aqui, consulte Seção 13.7.1, “Declarações de Gerenciamento de Conta”.

#### Criar Contas e Atribuir Privilegios

Os exemplos a seguir mostram como usar o programa cliente **mysql** para configurar novas contas. Esses exemplos assumem que a conta `root` do MySQL tem o privilégio `CREATE USER` e todos os privilégios que ela concede a outras contas.

Na linha de comando, conecte-se ao servidor como o usuário `root` do MySQL, fornecendo a senha apropriada no prompt de senha:

```sql
$> mysql -u root -p
Enter password: (enter root password here)
```

Após se conectar ao servidor, você pode adicionar novas contas. O exemplo a seguir usa as instruções `CREATE USER` (create-user.html) e `GRANT` (grant.html) para configurar quatro contas (onde você vê `'password'`, substitua uma senha apropriada):

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

As contas criadas por essas declarações têm as seguintes propriedades:

- Dois contatos têm o nome de usuário `finley`. Ambos são contas de superusuário com privilégios globais completos para fazer qualquer coisa. A conta `'finley'@'localhost'` só pode ser usada ao se conectar a partir do host local. A conta `'finley'@'%.example.com'` usa o caractere curinga `'%'` na parte do host, então ela pode ser usada para se conectar a partir de qualquer host no domínio `example.com`.

  A conta `'finley'@'localhost'` é necessária se houver uma conta de usuário anônimo para `localhost`. Sem a conta `'finley'@'localhost'`, essa conta de usuário anônimo terá precedência quando o `finley` se conectar a partir do host local e o `finley` será tratado como um usuário anônimo. A razão para isso é que a conta de usuário anônimo tem um valor mais específico na coluna `Host` do que a conta `'finley'@'%'` e, portanto, vem antes na ordem de classificação da tabela `user`. (Para informações sobre a classificação da tabela `user`, consulte Seção 6.2.5, “Controle de Acesso, Etapa 1: Verificação de Conexão”.)

- A conta `'admin'@'localhost'` só pode ser usada pelo `admin` para se conectar a partir do host local. Ela possui os privilégios administrativos globais `RELOAD` e `PROCESS` (privilegios-fornecidos.html#priv\_reload e privileges-fornecidos.html#priv\_process). Esses privilégios permitem que o usuário `admin` execute os comandos **mysqladmin reload**, **mysqladmin refresh** e **mysqladmin flush-*`xxx`***, além do **mysqladmin processlist**. Nenhum privilégio é concedido para acessar quaisquer bancos de dados. Você pode adicionar esses privilégios usando declarações `GRANT` (grant.html).

- A conta `'dummy'@'localhost'` não tem senha (o que é inseguro e não é recomendado). Essa conta só pode ser usada para se conectar a partir do host local. Nenhum privilégio é concedido. Assume-se que você conceda privilégios específicos à conta usando as instruções `GRANT`.

O exemplo anterior concede privilégios a nível global. O próximo exemplo cria três contas e concede-lhes acesso a níveis mais baixos, ou seja, a bancos de dados específicos ou objetos dentro dos bancos de dados. Cada conta tem um nome de usuário de `custom`, mas as partes do nome do host diferem:

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

- A conta `'custom'@'localhost'` tem todos os privilégios de nível de banco de dados para acessar o banco de dados `bankaccount`. A conta pode ser usada para se conectar ao servidor apenas a partir do host local.

- A conta `'custom'@'host47.example.com'` tem privilégios específicos em nível de banco de dados para acessar o banco de dados `expenses`. A conta pode ser usada para se conectar ao servidor apenas a partir do host `host47.example.com`.

- A conta `'custom'@'%.example.com'` tem privilégios específicos em nível de tabela para acessar a tabela `addresses` no banco de dados `customer`, a partir de qualquer host no domínio `example.com`. A conta pode ser usada para se conectar ao servidor a partir de todas as máquinas do domínio devido ao uso do caractere `%` como caractere curinga na parte do host do nome da conta.

#### Privilegios e propriedades da conta de verificação

Para ver os privilégios de uma conta, use `SHOW GRANTS`:

```sql
mysql> SHOW GRANTS FOR 'admin'@'localhost';
+-----------------------------------------------------+
| Grants for admin@localhost                          |
+-----------------------------------------------------+
| GRANT RELOAD, PROCESS ON *.* TO 'admin'@'localhost' |
+-----------------------------------------------------+
```

Para ver as propriedades não privilegiadas de uma conta, use `SHOW CREATE USER`:

```sql
mysql> SHOW CREATE USER 'admin'@'localhost'\G
*************************** 1. row ***************************
CREATE USER for admin@localhost: CREATE USER 'admin'@'localhost'
IDENTIFIED WITH 'mysql_native_password'
AS '*67ACDEBDAB923990001F0FFB017EB8ED41861105'
REQUIRE NONE PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK
```

#### Revocar privilégios da conta

Para revogar os privilégios da conta, use a declaração `REVOKE`. Os privilégios podem ser revogados em diferentes níveis, assim como podem ser concedidos em diferentes níveis.

Revocar privilégios globais:

```sql
REVOKE ALL
  ON *.*
  FROM 'finley'@'%.example.com';

REVOKE RELOAD
  ON *.*
  FROM 'admin'@'localhost';
```

Revocar privilégios de nível de banco de dados:

```sql
REVOKE CREATE,DROP
  ON expenses.*
  FROM 'custom'@'host47.example.com';
```

Revocar privilégios de nível de tabela:

```sql
REVOKE INSERT,UPDATE,DELETE
  ON customer.addresses
  FROM 'custom'@'%.example.com';
```

Para verificar o efeito da revogação de privilégios, use `SHOW GRANTS`:

```sql
mysql> SHOW GRANTS FOR 'admin'@'localhost';
+---------------------------------------------+
| Grants for admin@localhost                  |
+---------------------------------------------+
| GRANT PROCESS ON *.* TO 'admin'@'localhost' |
+---------------------------------------------+
```

#### Excluir contas

Para remover uma conta, use a instrução `DROP USER`. Por exemplo, para descartar algumas das contas criadas anteriormente:

```sql
DROP USER 'finley'@'localhost';
DROP USER 'finley'@'%.example.com';
DROP USER 'admin'@'localhost';
DROP USER 'dummy'@'localhost';
```
