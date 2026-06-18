### 8.2.14 Atribuição de senhas de conta

As credenciais necessárias para clientes que se conectam ao servidor MySQL podem incluir uma senha. Esta seção descreve como atribuir senhas para contas MySQL.

O MySQL armazena as credenciais na tabela `user` no banco de dados do sistema `mysql`. As operações que atribuem ou modificam senhas são permitidas apenas para usuários com o privilégio `CREATE USER`, ou, como alternativa, privilégios para o banco de dados `mysql` (prisco `INSERT` para criar novas contas, privilégio `UPDATE` para modificar contas existentes). Se a variável de sistema `read_only` estiver habilitada, o uso de declarações de modificação de contas, como `CREATE USER` ou `ALTER USER`, requer adicionalmente o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`).

A discussão aqui resume a sintaxe apenas para as declarações de atribuição de senha mais comuns. Para obter detalhes completos sobre outras possibilidades, consulte a Seção 15.7.1.3, “Declaração CREATE USER”, a Seção 15.7.1.1, “Declaração ALTER USER” e a Seção 15.7.1.10, “Declaração SET PASSWORD”.

O MySQL utiliza plugins para realizar a autenticação do cliente; veja a Seção 8.2.17, “Autenticação Personalizável”. Nas instruções de atribuição de senhas, o plugin de autenticação associado a uma conta realiza qualquer hashing necessário de uma senha em texto claro especificada. Isso permite que o MySQL ofusque as senhas antes de armazená-las na tabela do sistema `mysql.user`. Para as instruções descritas aqui, o MySQL hash automaticamente a senha especificada. Há também sintaxe para `CREATE USER` e `ALTER USER` que permite que valores hash sejam especificados literalmente. Para detalhes, consulte as descrições dessas instruções.

Para atribuir uma senha ao criar uma nova conta, use `CREATE USER` e inclua uma cláusula `IDENTIFIED BY`:

```
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

O `CREATE USER` também suporta sintaxe para especificar o plugin de autenticação da conta. Veja a Seção 15.7.1.3, “Instrução CREATE USER”.

Para atribuir ou alterar uma senha para uma conta existente, use a instrução `ALTER USER` com uma cláusula `IDENTIFIED BY`:

```
ALTER USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

Se você não estiver conectado como um usuário anônimo, poderá alterar sua própria senha sem precisar nomear sua própria conta literalmente:

```
ALTER USER USER() IDENTIFIED BY 'password';
```

Para alterar a senha de uma conta a partir da linha de comando, use o comando **mysqladmin**:

```
mysqladmin -u user_name -h host_name password "password"
```

A conta para a qual este comando define a senha é aquela com uma linha na tabela do sistema `mysql.user` que corresponde a `user_name` na coluna `User` e o host do cliente *de onde você se conecta* na coluna `Host`.

Aviso

Definir uma senha usando **mysqladmin** deve ser considerado *inseguro*. Em alguns sistemas, sua senha fica visível para programas de status do sistema, como o **ps**, que podem ser invocados por outros usuários para exibir linhas de comando. Os clientes MySQL geralmente sobrescrevem o argumento da senha de linha de comando com zeros durante sua sequência de inicialização. No entanto, ainda há um breve intervalo durante o qual o valor fica visível. Além disso, em alguns sistemas, essa estratégia de sobrescrita é ineficaz e a senha permanece visível para o **ps**. (Sistemas Unix SystemV e talvez outros estão sujeitos a esse problema.)

Se você estiver usando a replicação do MySQL, esteja ciente de que, atualmente, uma senha usada por uma replica como parte de uma declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) é efetivamente limitada a 32 caracteres de comprimento; se a senha for mais longa, quaisquer caracteres excedentes serão truncados. Isso não é devido a qualquer limite imposto pelo MySQL Server de forma geral, mas sim é um problema específico da replicação do MySQL.
