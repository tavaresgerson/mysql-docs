### 8.2.14 Atribuição de Senhas de Conta

As credenciais necessárias para clientes que se conectam ao servidor MySQL podem incluir uma senha. Esta seção descreve como atribuir senhas para contas MySQL.

O MySQL armazena as credenciais na tabela `user` no banco de dados do sistema `mysql`. As operações de atribuição ou modificação de senhas são permitidas apenas para usuários com o privilégio `CREATE USER`, ou, como alternativa, privilégios para o banco de dados `mysql` (prerrogativa `INSERT` para criar novas contas, prerrogativa `UPDATE` para modificar contas existentes). Se a variável de sistema `read_only` estiver habilitada, o uso de declarações de modificação de conta, como `CREATE USER` ou `ALTER USER`, também requer o privilégio `CONNECTION_ADMIN` (ou o desatualizado privilégio `SUPER`).

A discussão aqui resume a sintaxe apenas para as declarações de atribuição de senha mais comuns. Para detalhes completos sobre outras possibilidades, consulte a Seção 15.7.1.3, “Declaração CREATE USER”, a Seção 15.7.1.1, “Declaração ALTER USER” e a Seção 15.7.1.10, “Declaração SET PASSWORD”.

O MySQL usa plugins para realizar a autenticação do cliente; veja a Seção 8.2.17, “Autenticação Extensível”. Nas declarações de atribuição de senha, o plugin de autenticação associado a uma conta realiza qualquer hash exigido por uma senha em texto claro especificada. Isso permite que o MySQL ofusque senhas antes de armazená-las na tabela do sistema `mysql.user`. Para as declarações descritas aqui, o MySQL hash automaticamente a senha especificada. Há também sintaxe para `CREATE USER` e `ALTER USER` que permite que valores hash sejam especificados literalmente. Para detalhes, consulte as descrições dessas declarações.

Para atribuir uma senha ao criar uma nova conta, use `CREATE USER` e inclua uma cláusula `IDENTIFIED BY`:

```
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

`CREATE USER` também suporta sintaxe para especificar o plugin de autenticação de autenticação da conta. Veja a Seção 15.7.1.3, “Declaração CREATE USER”.

Para atribuir ou alterar uma senha para uma conta existente, use a instrução `ALTER USER` com uma cláusula `IDENTIFIED BY`:

```
ALTER USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

Se você não estiver conectado como um usuário anônimo, pode alterar sua própria senha sem nomear sua própria conta literalmente:

```
ALTER USER USER() IDENTIFIED BY 'password';
```

Para alterar a senha de uma conta a partir da linha de comando, use o comando `mysqladmin`:

```
mysqladmin -u user_name -h host_name password "password"
```

A conta para a qual este comando define a senha é aquela com uma linha na tabela de sistema `mysql.user` que corresponde a *`user_name`* na coluna `User` e o host do cliente *de onde você se conecta* na coluna `Host`.

Aviso

Definir uma senha usando `mysqladmin` deve ser considerado *inseguro*. Em alguns sistemas, sua senha torna-se visível para programas de status do sistema, como `ps`, que podem ser invocados por outros usuários para exibir linhas de comando. Os clientes MySQL geralmente sobrescrevem o argumento de senha da linha de comando com zeros durante sua sequência de inicialização. No entanto, ainda há um breve intervalo durante o qual o valor é visível. Além disso, em alguns sistemas, essa estratégia de sobrescrita é ineficaz e a senha permanece visível para `ps`. (Sistemas Unix System V e talvez outros estão sujeitos a este problema.)

Se você estiver usando a Replicação MySQL, esteja ciente de que uma senha usada por uma replica como parte de `CHANGE REPLICATION SOURCE TO` é efetivamente limitada a 32 caracteres de comprimento; se a senha for mais longa, quaisquer caracteres em excesso são truncados. Isso não é devido a qualquer limite imposto pelo MySQL Server em geral, mas sim é um problema específico da Replicação MySQL.