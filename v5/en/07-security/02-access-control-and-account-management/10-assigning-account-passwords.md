### 6.2.10 Atribuindo Senhas de Contas

As credenciais necessárias para os clientes que se conectam ao servidor MySQL podem incluir uma password. Esta seção descreve como atribuir passwords para contas MySQL.

O MySQL armazena credenciais na tabela `user` no system database `mysql`. Operações que atribuem ou modificam passwords são permitidas apenas a usuários com o privilege [`CREATE USER`](privileges-provided.html#priv_create-user), ou, alternativamente, privileges para o database `mysql` (privilege [`INSERT`](privileges-provided.html#priv_insert) para criar novas contas, privilege [`UPDATE`](privileges-provided.html#priv_update) para modificar contas existentes). Se a system variable [`read_only`](server-system-variables.html#sysvar_read_only) estiver habilitada, o uso de statements de modificação de conta, como [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") ou [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"), requer adicionalmente o privilege [`SUPER`](privileges-provided.html#priv_super).

A discussão aqui resume a sintaxe apenas para os statements de atribuição de password mais comuns. Para detalhes completos sobre outras possibilidades, consulte [Seção 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement"), [Seção 13.7.1.1, “ALTER USER Statement”](alter-user.html "13.7.1.1 ALTER USER Statement"), [Seção 13.7.1.4, “GRANT Statement”](grant.html "13.7.1.4 GRANT Statement") e [Seção 13.7.1.7, “SET PASSWORD Statement”](set-password.html "13.7.1.7 SET PASSWORD Statement").

O MySQL usa plugins para realizar a client authentication; consulte [Seção 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication"). Em statements de atribuição de password, o authentication plugin associado a uma conta executa qualquer hashing necessário de uma cleartext password especificada. Isso permite que o MySQL ofusque as passwords antes de armazená-las na system table `mysql.user`. Para os statements descritos aqui, o MySQL aplica hashing automaticamente à password especificada. Há também sintaxes para [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") e [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") que permitem que valores com hashing sejam especificados literalmente. Para detalhes, consulte as descrições desses statements.

Para atribuir uma password ao criar uma nova conta, use [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") e inclua uma cláusula `IDENTIFIED BY`:

```sql
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

[`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") também suporta sintaxe para especificar o account authentication plugin. Consulte [Seção 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement").

Para atribuir ou alterar uma password para uma conta existente, use o statement [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") com uma cláusula `IDENTIFIED BY`:

```sql
ALTER USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

Se você não estiver conectado como um anonymous user, você pode mudar sua própria password sem nomear sua própria conta literalmente:

```sql
ALTER USER USER() IDENTIFIED BY 'password';
```

Para alterar uma account password a partir da linha de comando, use o comando [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"):

```sql
mysqladmin -u user_name -h host_name password "password"
```

A conta para a qual este comando define a password é aquela com uma linha na system table `mysql.user` que corresponde a *`user_name`* na coluna `User` e ao client host *a partir do qual você se conecta* na coluna `Host`.

Aviso

Definir uma password usando [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") deve ser considerado *inseguro*. Em alguns sistemas, sua password se torna visível para programas de status do sistema, como o **ps**, que podem ser invocados por outros usuários para exibir linhas de comando. Clientes MySQL tipicamente sobrescrevem o argumento da password da linha de comando com zeros durante sua sequência de inicialização. No entanto, ainda existe um breve intervalo durante o qual o valor é visível. Além disso, em alguns sistemas, esta estratégia de sobrescrita é ineficaz e a password permanece visível para o **ps**. (Sistemas SystemV Unix e talvez outros estão sujeitos a este problema.)

Se você estiver usando MySQL Replication, esteja ciente de que, atualmente, uma password utilizada por uma replica como parte de um statement [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") é efetivamente limitada a 32 caracteres de comprimento; se a password for mais longa, quaisquer caracteres excedentes são truncados. Isso não se deve a qualquer limite imposto pelo MySQL Server em geral, mas sim a uma questão específica do MySQL Replication. (Para mais informações, consulte Bug #43439.)