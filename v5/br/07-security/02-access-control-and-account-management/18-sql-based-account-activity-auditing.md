### 6.2.18 Auditoria da Atividade da Conta Baseada em SQL

As aplicações podem usar as seguintes diretrizes para realizar auditoria baseada em SQL que vincule a atividade do banco de dados às contas do MySQL.

As contas do MySQL correspondem às linhas da tabela `mysql.user` do sistema. Quando um cliente se conecta com sucesso, o servidor autentica o cliente em uma linha específica dessa tabela. Os valores das colunas `User` e `Host` nessa linha identificam de forma única a conta e correspondem ao formato `'user_name'@'host_name'`, no qual os nomes das contas são escritos em declarações SQL.

A conta usada para autenticar um cliente determina quais privilégios o cliente tem. Normalmente, a função `CURRENT_USER()` pode ser invocada para determinar qual é a conta para o usuário do cliente. Seu valor é construído a partir das colunas `User` e `Host` da linha da tabela `user` para a conta.

No entanto, existem circunstâncias em que o valor de `CURRENT_USER()` não corresponde ao usuário do cliente, mas a uma conta diferente. Isso ocorre em contextos em que a verificação de privilégios não é baseada na conta do cliente:

- Rotinas armazenadas (procedimentos e funções) definidas com a característica `SQL SECURITY DEFINER`

- Visões definidas com a característica `SQL SECURITY DEFINER`

- Causas e eventos

Nesses contextos, o controle de privilégios é feito contra a conta `DEFINER` e `CURRENT_USER()` refere-se àquela conta, e não à conta do cliente que invocou a rotina ou visualização armazenada ou que causou o disparo para ser ativado. Para determinar o usuário que está invocando, você pode chamar a função `USER()`, que retorna um valor que indica o nome real do usuário fornecido pelo cliente e o host a partir do qual o cliente se conectou. No entanto, esse valor não corresponde necessariamente diretamente a uma conta na tabela `user`, porque o valor de `USER()` nunca contém asteriscos, enquanto os valores das contas (como retornados por `CURRENT_USER()`) podem conter asteriscos de nome de usuário e nome de host.

Por exemplo, um nome de usuário em branco corresponde a qualquer usuário, então uma conta de `''@'localhost'` permite que os clientes se conectem como um usuário anônimo do host local com qualquer nome de usuário. Nesse caso, se um cliente se conectar como `user1` do host local, `[USER()]` (informações-funções.html#função\_user) e `[CURRENT_USER()]` (informações-funções.html#função\_current-user) retornam valores diferentes:

```sql
mysql> SELECT USER(), CURRENT_USER();
+-----------------+----------------+
| USER()          | CURRENT_USER() |
+-----------------+----------------+
| user1@localhost | @localhost     |
+-----------------+----------------+
```

A parte do nome do host de uma conta também pode conter caracteres de padrão de comodínios. Se o nome do host contiver um caractere de padrão `'%'` ou `'_'` ou usar a notação de máscara de rede, a conta pode ser usada para clientes que se conectam a partir de vários hosts e o valor de `CURRENT_USER()` não indica qual deles. Por exemplo, a conta `'user2'@'%.example.com'` pode ser usada por `user2` para se conectar a partir de qualquer host no domínio `example.com`. Se `user2` se conectar a partir de `remote.example.com`, `USER()` e `CURRENT_USER()` retornam valores diferentes:

```sql
mysql> SELECT USER(), CURRENT_USER();
+--------------------------+---------------------+
| USER()                   | CURRENT_USER()      |
+--------------------------+---------------------+
| user2@remote.example.com | user2@%.example.com |
+--------------------------+---------------------+
```

Se um aplicativo precisar invocar `USER()` para auditoria de usuários (por exemplo, se estiver realizando auditoria a partir de triggers), mas também precisar associar o valor de `USER()` a uma conta na tabela `user`, é necessário evitar contas que contenham caracteres especiais na coluna `User` ou `Host`. Especificamente, não permita que `User` esteja vazio (o que cria uma conta de usuário anônimo) e não permita caracteres de padrão ou notação de máscara de rede nos valores de `Host`. Todas as contas devem ter um valor de `User` não vazio e um valor literal de `Host`.

Em relação aos exemplos anteriores, as contas `'@localhost'` e `'@%example.com'` devem ser alteradas para não usar caracteres especiais:

```sql
RENAME USER ''@'localhost' TO 'user1'@'localhost';
RENAME USER 'user2'@'%.example.com' TO 'user2'@'remote.example.com';
```

Se o `user2` precisar se conectar a partir de vários hosts no domínio `example.com`, deve haver uma conta separada para cada host.

Para extrair a parte do nome do usuário ou do nome do host de um valor de `CURRENT_USER()` ou `USER()`, use a função `SUBSTRING_INDEX()`:

```sql
mysql> SELECT SUBSTRING_INDEX(CURRENT_USER(),'@',1);
+---------------------------------------+
| SUBSTRING_INDEX(CURRENT_USER(),'@',1) |
+---------------------------------------+
| user1                                 |
+---------------------------------------+

mysql> SELECT SUBSTRING_INDEX(CURRENT_USER(),'@',-1);
+----------------------------------------+
| SUBSTRING_INDEX(CURRENT_USER(),'@',-1) |
+----------------------------------------+
| localhost                              |
+----------------------------------------+
```
