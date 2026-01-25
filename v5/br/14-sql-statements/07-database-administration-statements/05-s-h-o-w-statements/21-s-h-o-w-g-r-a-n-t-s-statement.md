#### 13.7.5.21 Instrução SHOW GRANTS

```sql
SHOW GRANTS [FOR user]
```

Esta instrução exibe os privilégios que estão atribuídos a uma conta de usuário MySQL, na forma de instruções [`GRANT`](grant.html "13.7.1.4 GRANT Statement") que devem ser executadas para duplicar as atribuições de privilégios.

Nota

Para exibir informações que não são de privilégio para contas MySQL, utilize a instrução [`SHOW CREATE USER`](show-create-user.html "13.7.5.12 SHOW CREATE USER Statement"). Consulte [Section 13.7.5.12, “SHOW CREATE USER Statement”](show-create-user.html "13.7.5.12 SHOW CREATE USER Statement").

[`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement") requer o privilégio [`SELECT`](privileges-provided.html#priv_select) para o Database de sistema `mysql`, exceto para exibir privilégios do usuário atual.

Para nomear a conta para [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement"), use o mesmo formato que para a instrução [`GRANT`](grant.html "13.7.1.4 GRANT Statement") (por exemplo, `'jeffrey'@'localhost'`):

```sql
mysql> SHOW GRANTS FOR 'jeffrey'@'localhost';
+------------------------------------------------------------------+
| Grants for jeffrey@localhost                                     |
+------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `jeffrey`@`localhost`                      |
| GRANT SELECT, INSERT, UPDATE ON `db1`.* TO `jeffrey`@`localhost` |
+------------------------------------------------------------------+
```

A parte do host, se omitida, assume o padrão `'%'`. Para informações adicionais sobre como especificar nomes de conta, consulte [Section 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names").

Para exibir os privilégios concedidos ao usuário atual (a conta que você está usando para se conectar ao servidor), você pode usar qualquer uma das seguintes instruções:

```sql
SHOW GRANTS;
SHOW GRANTS FOR CURRENT_USER;
SHOW GRANTS FOR CURRENT_USER();
```

Se `SHOW GRANTS FOR CURRENT_USER` (ou qualquer sintaxe equivalente) for utilizada em contexto de definer, como dentro de uma stored procedure que é executada com privilégios de definer em vez de invoker, os grants exibidos são os do definer e não os do invoker.

[`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement") não exibe privilégios que estão disponíveis para a conta nomeada, mas que são concedidos a uma conta diferente. Por exemplo, se uma conta anônima existir, a conta nomeada pode ser capaz de usar seus privilégios, mas [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement") não os exibe.

A saída de `SHOW GRANTS` não inclui cláusulas `IDENTIFIED BY PASSWORD`. Em vez disso, utilize a instrução [`SHOW CREATE USER`](show-create-user.html "13.7.5.12 SHOW CREATE USER Statement"). Consulte [Section 13.7.5.12, “SHOW CREATE USER Statement”](show-create-user.html "13.7.5.12 SHOW CREATE USER Statement").