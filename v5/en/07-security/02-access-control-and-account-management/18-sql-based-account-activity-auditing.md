### 6.2.18 Auditoria de Atividade de Conta Baseada em SQL

Aplicações podem usar as seguintes diretrizes para realizar auditoria baseada em SQL que vincula a atividade do Database a Accounts MySQL.

Accounts MySQL correspondem a linhas na tabela de sistema `mysql.user`. Quando um cliente se conecta com sucesso, o servidor autentica o cliente a uma linha específica nesta tabela. Os valores das colunas `User` e `Host` nesta linha identificam unicamente o Account e correspondem ao formato `'user_name'@'host_name'` no qual os nomes de Accounts são escritos em instruções SQL.

O Account usado para autenticar um cliente determina quais privileges o cliente possui. Normalmente, a função [`CURRENT_USER()`](information-functions.html#function_current-user) pode ser invocada para determinar qual Account é este para o usuário cliente. Seu valor é construído a partir das colunas `User` e `Host` da linha da tabela `user` para o Account.

No entanto, há circunstâncias sob as quais o valor de [`CURRENT_USER()`](information-functions.html#function_current-user) corresponde não ao usuário cliente, mas a um Account diferente. Isso ocorre em contextos onde a verificação de privileges não é baseada no Account do cliente:

* Stored routines (procedures e functions) definidas com a característica `SQL SECURITY DEFINER`

* Views definidas com a característica `SQL SECURITY DEFINER`

* Triggers e events

Nesses contextos, a verificação de privileges é feita contra o Account `DEFINER`, e [`CURRENT_USER()`](information-functions.html#function_current-user) refere-se a esse Account, não ao Account do cliente que invocou a stored routine ou view ou que causou a ativação do Trigger. Para determinar o usuário que invocou, você pode chamar a função [`USER()`](information-functions.html#function_user), que retorna um valor indicando o nome de usuário real fornecido pelo cliente e o Host do qual o cliente se conectou. No entanto, este valor não corresponde necessariamente a um Account na tabela `user`, porque o valor de [`USER()`](information-functions.html#function_user) nunca contém *wildcards*, enquanto os valores de Account (retornados por [`CURRENT_USER()`](information-functions.html#function_current-user)) podem conter *wildcards* no nome de usuário e no nome do Host.

Por exemplo, um nome de usuário em branco corresponde a qualquer usuário, então um Account de `''@'localhost'` permite que clientes se conectem como um usuário anônimo a partir do Host local com qualquer nome de usuário. Neste caso, se um cliente se conecta como `user1` a partir do Host local, [`USER()`](information-functions.html#function_user) e [`CURRENT_USER()`](information-functions.html#function_current-user) retornam valores diferentes:

```sql
mysql> SELECT USER(), CURRENT_USER();
+-----------------+----------------+
| USER()          | CURRENT_USER() |
+-----------------+----------------+
| user1@localhost | @localhost     |
+-----------------+----------------+
```

A parte do nome do Host de um Account também pode conter *wildcards*. Se o nome do Host contém um caractere de padrão `'%'` ou `'_'` ou usa notação de *netmask*, o Account pode ser usado para clientes que se conectam a partir de múltiplos Hosts e o valor de [`CURRENT_USER()`](information-functions.html#function_current-user) não indica qual deles. Por exemplo, o Account `'user2'@'%.example.com'` pode ser usado por `user2` para se conectar de qualquer Host no domínio `example.com`. Se `user2` se conecta a partir de `remote.example.com`, [`USER()`](information-functions.html#function_user) e [`CURRENT_USER()`](information-functions.html#function_current-user) retornam valores diferentes:

```sql
mysql> SELECT USER(), CURRENT_USER();
+--------------------------+---------------------+
| USER()                   | CURRENT_USER()      |
+--------------------------+---------------------+
| user2@remote.example.com | user2@%.example.com |
+--------------------------+---------------------+
```

Se uma aplicação precisa invocar [`USER()`](information-functions.html#function_user) para auditoria de usuário (por exemplo, se ela realiza auditoria de dentro de *triggers*) mas também precisa ser capaz de associar o valor de [`USER()`](information-functions.html#function_user) a um Account na tabela `user`, é necessário evitar Accounts que contenham *wildcards* nas colunas `User` ou `Host`. Especificamente, não permita que `User` seja vazio (o que cria um Account de usuário anônimo) e não permita caracteres de padrão ou notação de *netmask* nos valores de `Host`. Todos os Accounts devem ter um valor `User` não vazio e um valor `Host` literal.

Com relação aos exemplos anteriores, os Accounts `''@'localhost'` e `'user2'@'%.example.com'` devem ser alterados para não usar *wildcards*:

```sql
RENAME USER ''@'localhost' TO 'user1'@'localhost';
RENAME USER 'user2'@'%.example.com' TO 'user2'@'remote.example.com';
```

Se `user2` deve ser capaz de se conectar de vários Hosts no domínio `example.com`, deve haver um Account separado para cada Host.

Para extrair o nome de usuário ou a parte do nome do Host de um valor [`CURRENT_USER()`](information-functions.html#function_current-user) ou [`USER()`](information-functions.html#function_user), use a função [`SUBSTRING_INDEX()`](string-functions.html#function_substring-index):

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