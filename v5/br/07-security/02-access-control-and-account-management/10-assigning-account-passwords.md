### 6.2.10 Atribuição de senhas de conta

As credenciais necessárias para clientes que se conectam ao servidor MySQL podem incluir uma senha. Esta seção descreve como atribuir senhas para contas MySQL.

O MySQL armazena as credenciais na tabela `user` no banco de dados do sistema `mysql`. As operações que atribuem ou modificam senhas são permitidas apenas para usuários com o privilégio `CREATE USER`, ou, como alternativa, privilégios para o banco de dados `mysql` (`INSERT` privilégio para criar novas contas, `UPDATE` privilégio para modificar contas existentes). Se a variável de sistema `read_only` estiver habilitada, o uso de declarações de modificação de contas, como `CREATE USER` ou `ALTER USER`, também requer o privilégio `SUPER`.

A discussão aqui resume a sintaxe apenas para as declarações de atribuição de senha mais comuns. Para detalhes completos sobre outras possibilidades, consulte Seção 13.7.1.2, “Declaração CREATE USER”, Seção 13.7.1.1, “Declaração ALTER USER”, Seção 13.7.1.4, “Declaração GRANT” e Seção 13.7.1.7, “Declaração SET PASSWORD”.

O MySQL utiliza plugins para realizar a autenticação do cliente; veja Seção 6.2.13, “Autenticação Personalizável”. Em declarações de atribuição de senha, o plugin de autenticação associado a uma conta realiza qualquer hash exigido de uma senha em texto claro especificada. Isso permite que o MySQL ofusque senhas antes de armazená-las na tabela do sistema `mysql.user`. Para as declarações descritas aqui, o MySQL hash automaticamente a senha especificada. Há também sintaxe para `CREATE USER` e `ALTER USER` que permitem que valores hash sejam especificados literalmente. Para detalhes, consulte as descrições dessas declarações.

Para atribuir uma senha ao criar uma nova conta, use `CREATE USER` e inclua uma cláusula `IDENTIFIED BY`:

```sql
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

`CREATE USER` também suporta sintaxe para especificar o plugin de autenticação da conta. Veja Seção 13.7.1.2, “Instrução CREATE USER”.

Para atribuir ou alterar uma senha para uma conta existente, use a instrução `ALTER USER` com uma cláusula `IDENTIFIED BY`:

```sql
ALTER USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

Se você não estiver conectado como um usuário anônimo, poderá alterar sua própria senha sem precisar nomear sua própria conta literalmente:

```sql
ALTER USER USER() IDENTIFIED BY 'password';
```

Para alterar a senha de uma conta a partir da linha de comando, use o comando **mysqladmin**:

```sql
mysqladmin -u user_name -h host_name password "password"
```

A conta para a qual este comando define a senha é aquela com uma linha na tabela de sistema `mysql.user` que corresponde a *`user_name`* na coluna `User` e ao host do cliente *de onde você se conecta* na coluna `Host`.

Aviso

Definir uma senha usando **mysqladmin** deve ser considerado *inseguro*. Em alguns sistemas, sua senha fica visível para programas de status do sistema, como o **ps**, que podem ser invocados por outros usuários para exibir linhas de comando. Os clientes MySQL geralmente sobrescrevem o argumento da senha de linha de comando com zeros durante sua sequência de inicialização. No entanto, ainda há um breve intervalo durante o qual o valor fica visível. Além disso, em alguns sistemas, essa estratégia de sobrescrita é ineficaz e a senha permanece visível para o **ps**. (Sistemas Unix SystemV e talvez outros estão sujeitos a esse problema.)

Se você estiver usando a replicação do MySQL, esteja ciente de que, atualmente, uma senha usada por uma replica como parte de uma declaração `CHANGE MASTER TO` é efetivamente limitada a 32 caracteres de comprimento; se a senha for mais longa, quaisquer caracteres excedentes serão truncados. Isso não é devido a qualquer limite imposto pelo próprio MySQL Server, mas sim a um problema específico da replicação do MySQL. (Para mais informações, consulte o Bug #43439.)
