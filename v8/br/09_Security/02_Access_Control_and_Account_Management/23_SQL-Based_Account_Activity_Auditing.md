### 8.2.23 Auditoria da Atividade da Conta Baseada em SQL

As aplicações podem usar as seguintes diretrizes para realizar auditoria baseada em SQL que vincule a atividade do banco de dados às contas do MySQL.

As contas do MySQL correspondem às linhas da tabela `mysql.user` do sistema. Quando um cliente se conecta com sucesso, o servidor autentica o cliente em uma linha específica dessa tabela. Os valores das colunas `User` e `Host` nessa linha identificam de forma única a conta e correspondem ao formato `'user_name'@'host_name'`, no qual os nomes das contas são escritos nas instruções SQL.

A conta usada para autenticar um cliente determina quais privilégios o cliente tem. Normalmente, a função `CURRENT_USER()` pode ser invocada para determinar qual é a conta para o usuário do cliente. Seu valor é construído a partir das colunas `User` e `Host` da linha da tabela `user` para a conta.

No entanto, existem circunstâncias em que o valor `CURRENT_USER()` não corresponde ao usuário do cliente, mas a uma conta diferente. Isso ocorre em contextos em que a verificação de privilégios não é baseada na conta do cliente:

- Rotinas armazenadas (procedimentos e funções) definidas com a característica `SQL SECURITY DEFINER`

- Visões definidas com a característica `SQL SECURITY DEFINER`

- Causas e eventos

Nesses contextos, o controle de privilégios é feito contra a conta `DEFINER` e `CURRENT_USER()` se refere àquela conta, não à conta do cliente que invocou a rotina ou visual armazenada ou que causou o disparo para ser ativado. Para determinar o usuário que está invocando, você pode chamar a função `USER()`, que retorna um valor que indica o nome real do usuário fornecido pelo cliente e o host a partir do qual o cliente se conectou. No entanto, esse valor não corresponde necessariamente diretamente a uma conta na tabela `user`, porque o valor `USER()` nunca contém caracteres curingas, enquanto os valores das contas (como retornados por `CURRENT_USER()`) podem conter caracteres curingas de nome de usuário e host.

Por exemplo, um nome de usuário em branco corresponde a qualquer usuário, então uma conta de `''@'localhost'` permite que os clientes se conectem como um usuário anônimo a partir do host local com qualquer nome de usuário. Neste caso, se um cliente se conectar como `user1` a partir do host local, `USER()` e `CURRENT_USER()` retornarão valores diferentes:

```
mysql> SELECT USER(), CURRENT_USER();
+-----------------+----------------+
| USER()          | CURRENT_USER() |
+-----------------+----------------+
| user1@localhost | @localhost     |
+-----------------+----------------+
```

A parte do nome do host de uma conta também pode conter caracteres de padrão de comodínios. Se o nome do host contiver um caractere de padrão `'%'` ou `'_'` ou usar a notação de máscara de rede, a conta pode ser usada para clientes que se conectam a partir de vários hosts e o valor `CURRENT_USER()` não indica qual deles. Por exemplo, a conta `'user2'@'%.example.com'` pode ser usada por `user2` para se conectar a partir de qualquer host no domínio `example.com`. Se `user2` se conectar a partir de `remote.example.com`, `USER()` e `CURRENT_USER()` retornam valores diferentes:

```
mysql> SELECT USER(), CURRENT_USER();
+--------------------------+---------------------+
| USER()                   | CURRENT_USER()      |
+--------------------------+---------------------+
| user2@remote.example.com | user2@%.example.com |
+--------------------------+---------------------+
```

Se um aplicativo precisar invocar `USER()` para auditoria de usuários (por exemplo, se ele estiver realizando auditoria dentro de gatilhos), mas também precisar associar o valor `USER()` a uma conta na tabela `user`, é necessário evitar contas que contenham caracteres especiais na coluna `User` ou `Host`. Especificamente, não permita que `User` esteja vazio (o que cria uma conta de usuário anônimo) e não permita caracteres de padrão ou notação de máscara de rede nos valores de `Host`. Todas as contas devem ter um valor não vazio de `User` e um valor literal de `Host`.

Em relação aos exemplos anteriores, as contas `''@'localhost'` e `'user2'@'%.example.com'` devem ser alteradas para não usar asteriscos:

```
RENAME USER ''@'localhost' TO 'user1'@'localhost';
RENAME USER 'user2'@'%.example.com' TO 'user2'@'remote.example.com';
```

Se o `user2` precisar se conectar a vários hosts no domínio `example.com`, deve haver uma conta separada para cada host.

Para extrair a parte do nome do usuário ou do nome do host de um valor `CURRENT_USER()` ou `USER()`, use a função `SUBSTRING_INDEX()`:

```
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
